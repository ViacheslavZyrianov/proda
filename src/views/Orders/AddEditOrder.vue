<script setup>
import { useStore } from 'vuex'
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import rules from './rules'
import statusList from './statusList'

const props = defineProps({
  isVisible: Boolean,
})
 
const emit = defineEmits(['close', 'closed'])

const store = useStore()

const cities = await store.dispatch('fetchCities')

const { products } = store.state.products

const isAddProductDisabled = false

const orderInfoList = reactive([])

const isSubmitButtonLoading = ref(false)

const isSetStatusButtonLoading = ref(false)

const totalDiscount = ref(0)

const refForm = ref(null)
const form = reactive({})
resetForm()

watch(() => store.state.orders.editingOrder, _ => {
  const { editingOrder } = store.state.orders

  if (Object.keys(editingOrder).length) {
    form.first_name = editingOrder.first_name
    form.last_name = editingOrder.last_name
    form.phone = editingOrder.phone
    form.city = editingOrder.city
    form.post = editingOrder.nova_post
    form.ttn = editingOrder.ttn
    form.comment = editingOrder.comment
    form.isPaid = editingOrder.paid === 'TRUE' ? true : false
    form.status = editingOrder.status

    const orderInfo = JSON.parse(editingOrder.order_info)
    Object.keys(orderInfo).forEach(productName => {
      const { amount, discount } = orderInfo[productName]

      orderInfoList.push({
        product: productName,
        amount,
        price: productPriceByProductName(productName),
        discount
      })
    })

    Object.assign(form.info, JSON.parse(editingOrder.order_info))
    form.price = calculateTotalPrice(orderInfoList)
  }
}, { deep: true })

watch([orderInfoList, totalDiscount], ([newOrderInfoList]) => {
  const totalSum = calculateTotalPrice(newOrderInfoList)
  form.price = calculateDiscountValueWithDiscount(totalSum, totalDiscount.value)
}, { deep: true, immediate: true })

const novaPostCities = ref(cities.map(city => ({ value: city, label: city })))
let novaPostCitiesForTemplate = ref([])

const mode = computed(() => Object.keys(store.state.orders.editingOrder).length ? 'edit' : 'add')

const drawerTitle = computed(() => mode.value === 'add' ? 'Add order' : 'Edit order')

const calculatedOrderInfo = computed(() => {
  return orderInfoList.reduce((acc, { product, amount, discount }) => {
    acc[product] = {
      amount: Number(amount),
      discount: Number(discount)
    }
    return acc
  }, {})
})

const activeStatusIndex = computed(_ => statusList.findIndex(({ value }) => value === form.status))

const isSetNextStatusButtonVisible = computed(_ => activeStatusIndex.value < statusList.length - 1)

function remoteCityListMethod(query) {
  if (query !== '') {
    novaPostCitiesForTemplate.value = novaPostCities.value.filter((item) => {
      return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
    })
  } else novaPostCitiesForTemplate = []
}

async function onSubmit() {
  let isFormValid = false

  refForm.value.validateField(Object.keys(form), (errorMessage) => {
    isFormValid = !errorMessage
  })

  if (!isFormValid) return
  
  isSubmitButtonLoading.value = true

  const formDataForAPI = {
    first_name: form.first_name,
    last_name: form.last_name,
    phone: Number(form.phone),
    city: form.city,
    nova_post: Number(form.post),
    order_info: calculatedOrderInfo.value,
    price: Number(form.price),
    discount: Number(totalDiscount.value),
    ttn: Number(form.ttn),
    comment: form.comment,
    status: form.status,
    paid: form.isPaid
  }

  let data = null
  if (mode.value === 'add') data = await store.dispatch('postOrder', formDataForAPI)
  if (mode.value === 'edit') {
    const { order_id: id } = store.state.orders.editingOrder
    data = await store.dispatch('putOrder', {
      payload: formDataForAPI,
      id
    })
  }

  await store.dispatch('fetchOrders')

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    ElMessage({ message: data.status, type: 'success' })
    emit('close')
  }

  isSubmitButtonLoading.value = false
}

function resetForm() {
  Object.assign(form, {
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    post: null,
    ttn: null,
    comment: '',
    status: null,
    isPaid: false,
    info: {},
    price: 0
  })
}

function calculateDiscountValueWithDiscount(value, discount) {
  return Number(value - (value * (discount / 100)).toFixed())
}

function calculateTotalPrice(orderList) {
  return orderList.reduce((acc, val) => acc + orderInfoPriceCalculated(val), 0)
}

function onAddNewProductToProductInfo() {
  orderInfoList.push({
    product: null,
    amount: 1,
    price: null,
    discount: 0
  })
}

function productPriceByProductName(product) {
  return products.find(order => order.product_name === product)?.price || 0
}

function onProductInfoChange(product) {
  const productInOrderInfo = orderInfoList.find(order => order.product === product)
  productInOrderInfo.price = productPriceByProductName(product)
}

function orderInfoPriceCalculated({ amount, price, discount }) {
  return calculateDiscountValueWithDiscount((amount * price), discount)
}

function onRemoveOrderInfoProduct(product) {
  const index = orderInfoList.findIndex(order => order.product === product)
  orderInfoList.splice(index, 1)
}

function onAddEditOrderClose() {
  emit('close')
}

function onAddEditOrderClosed() {
  orderInfoList.length = 0
  store.commit('set_editing_order', {})
  refForm.value?.resetFields()
  resetForm()
}

async function onSetNextStatus() {
  isSetStatusButtonLoading.value = true
  
  const { order_id: id } = store.state.orders.editingOrder
  let data = await store.dispatch('patchOrderStatus', {
    status: statusList[activeStatusIndex.value + 1].value,
    id
  })

  isSetStatusButtonLoading.value = false

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    if (mode.value === 'add') {
      const { length } = store.state.orders.orders
      store.state.orders.orders[length] = data.data
    }
    ElMessage({ message: data.status, type: 'success' })
  }
}

async function onPastePhone() {
  const data = await navigator.clipboard.readText()
  const formattedData = data.replace(/\s/g, '').slice(-9)
  form.phone = formattedData
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    :title="drawerTitle"
    size="500px"
    @closed="onAddEditOrderClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      label-width="90px"
    >
      <el-form-item
        prop="first_name"
        label="First name"
      >
        <el-input
          v-model="form.first_name"
          placeholder="John"
        />
      </el-form-item>
      <el-form-item
        prop="last_name"
        label="Last name"
      >
        <el-input
          v-model="form.last_name"
          placeholder="Doe"
        />
      </el-form-item>
      <el-form-item
        prop="phone"
        label="Phone"
      >
        <el-row
          :gutter="6"
        >
          <el-col>
            <el-input
              v-model="form.phone"
              placeholder="991234567"
              type="tel"
              maxlength="9"
              @paste="onPastePhone"
            >
              <template #prepend>
                +380
              </template>
            </el-input>
          </el-col>
          <!-- <el-col>
            <el-button
              class="paste-phone"
              circle
              @click="onPastePhone"
            >
              <el-icon><document-copy /></el-icon>
            </el-button>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item
        prop="city"
        label="City"
      >
        <el-select-v2
          v-model="form.city"
          placeholder="Kyiv"
          filterable
          remote
          :options="novaPostCitiesForTemplate"
          :remote-method="remoteCityListMethod"
        />
      </el-form-item>
      <el-form-item
        prop="post"
        label="Post"
      >
        <el-input
          v-model="form.post"
          type="tel"
          maxlength="5"
        />
      </el-form-item>
      <el-form-item
        prop="ttn"
        label="TTN"
      >
        <el-input
          v-model="form.ttn"
          type="tel"
          placeholder="12345678912345"
          maxlength="14"
        />
      </el-form-item>
      <el-form-item
        prop="comment"
        label="Comment"
      >
        <el-input
          v-model="form.comment"
          type="textarea"
          placeholder="Comment"
          autosize
          class="comment"
        />
      </el-form-item>
      <el-form-item
        prop="paid"
        label="Is paid"
      >
        <el-switch
          v-model="form.isPaid"
          style="display: block; padding: 9px 0;"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Paid"
          inactive-text="Unpaid"
        />
      </el-form-item>
      <el-form-item
        v-if="mode === 'edit'"
        prop="status"
        label="Status"
        class="hidden-sm-and-down"
      >
        <el-steps
          :active="activeStatusIndex"
          align-center
          finish-status="wait"
        >
          <el-step
            v-for="({ text, value, icon }) in statusList"
            :key="value"
            :title="text"
          >
            <template #icon>
              <el-icon><component :is="icon" /></el-icon>
            </template>
          </el-step>
        </el-steps>
        <el-row v-if="isSetNextStatusButtonVisible">
          <el-col
            :span="8"
            :offset="16"
          >
            <el-button
              size="mini"
              :loading="isSetStatusButtonLoading"
              @click="onSetNextStatus"
            >
              Set next status
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        prop="orderInfo"
        label="Order info"
      >
        <el-divider />
        <el-space
          v-for="orderInfo in orderInfoList"
          :key="orderInfo.product_name"
          direction="vertical"
          alignment="stretch"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-select
                v-model="orderInfo.product"
                @change="onProductInfoChange"
              >
                <el-option
                  v-for="product in products"
                  :key="product.product_name"
                  :value="product.product_name"
                  :label="product.title"
                />
              </el-select>
            </el-col>
          </el-row>
          <el-row
            :gutter="10"
            justify="end"
          >
            <el-col
              :xs="10"
              :sm="8"
              :md="4"
            >
              <el-input
                v-model="orderInfo.amount"
              />
            </el-col>
            <el-col
              :xs="14"
              :sm="8"
            >
              <el-input
                v-model="orderInfo.discount"
                type="number"
                maxlength="3"
                max="100"
              >
                <template #append>
                  %
                </template>
              </el-input>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="4"
              style="text-align: right"
            >
              {{ orderInfoPriceCalculated(orderInfo) }} ₴
            </el-col>
          </el-row>
          <el-row
            justify="end"
          >
            <el-button
              v-if="orderInfoList.length > 1"
              type="danger"
              size="mini"
              @click="onRemoveOrderInfoProduct(orderInfo.product)"
            >
              Remove
            </el-button>
          </el-row>
          <el-divider />
        </el-space>
        <el-row
          justify="end"
        >
          <el-button
            :disabled="isAddProductDisabled"
            size="mini"
            type="success"
            @click="onAddNewProductToProductInfo"
          >
            Add product
          </el-button>
        </el-row>
      </el-form-item>
      <el-form-item
        prop="total"
        label="Total"
      >
        <el-row
          :gutter="10"
          justify="end"
        >
          <el-col
            :xs="10"
            :sm="6"
            style="text-align: right"
          >
            {{ form.price }} ₴
          </el-col>
          <el-col
            :xs="14"
            :sm="4"
            :md="8"
          >
            <el-input
              v-model="totalDiscount"
              type="tel"
            >
              <template #append>
                %
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="el-drawer__footer">
        <el-button
          @click="onAddEditOrderClose"
        >
          Cancel
        </el-button>
        <el-button
          v-if="mode === 'add'"
          :loading="isSubmitButtonLoading"
          type="success"
          @click="onSubmit"
        >
          Add
        </el-button>
        <el-button
          v-if="mode === 'edit'"
          :loading="isSubmitButtonLoading"
          type="success"
          @click="onSubmit"
        >
          Save
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<style lang="scss">
.el-drawer {
  &__body {
    padding: var(--el-drawer-padding-primary);
    padding-top: 0;
    overflow: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    padding-bottom: 20px;
  }

  .el-form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .el-divider--horizontal {
    margin: 18px 0;
  }
}

.comment {
  textarea {
    max-height: 100px;
  }
}

.el-step__icon-inner {
  font-size: 20px !important;
}

.el-step.is-horizontal .el-step__line {
  top: 16px;
}

.paste-phone {
  width: 100%;
}
</style>