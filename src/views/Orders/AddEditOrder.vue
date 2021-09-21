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
orderInfoList.push({
  product: products[0].product_name,
  amount: 1,
  price: products[0].price,
  discount: 0
})

const isSubmitButtonLoading = ref(false)

const totalDiscount = ref(0)

const refForm = ref(null)
const form = reactive({})
resetForm()

watch(() => store.state.orders.editingOrder, newEditingOrder => {
  if (Object.keys(newEditingOrder).length) {
    form.first_name = newEditingOrder.first_name
    form.last_name = newEditingOrder.last_name
    form.phone = newEditingOrder.phone
    form.city = newEditingOrder.city
    form.post = newEditingOrder.nova_post
    form.ttn = newEditingOrder.ttn
    form.status = newEditingOrder.status

    const orderInfo = JSON.parse(newEditingOrder.order_info)
    Object.keys(orderInfo).forEach(productName => {
      const { amount, discount } = orderInfo[productName]

      orderInfoList.push({
        product: productName,
        amount,
        price: productPriceByProductName(productName),
        discount
      })
    })

    Object.assign(form.info, JSON.parse(newEditingOrder.order_info))
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

  calculateOrderInfoList()

  const formDataForAPI = {
    first_name: form.first_name,
    last_name: form.last_name,
    phone: Number(form.phone),
    city: form.city,
    nova_post: Number(form.post),
    order_info: form.info,
    price: Number(form.price),
    discount: Number(totalDiscount.value),
    ttn: Number(form.ttn),
    status: form.status
  }

  let data = null
  if (mode.value === 'add') data = await store.dispatch('postOrder', formDataForAPI)
  if (mode.value === 'edit') {
    const { order_id: id, status } = store.state.orders.editingOrder
    data = await store.dispatch('putOrder', {
      payload: formDataForAPI,
      id,
      status
    })
  }

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    if (mode.value === 'add') {
      const { length } = store.state.orders.orders
      store.state.orders.orders[length] = data.data
    }
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
    status: null,
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

function calculateOrderInfoList() {
  orderInfoList.forEach(({ product, amount, discount }) => {
    form.info[product] = {
      amount: Number(amount),
      discount: Number(discount)
    }
  })
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
  orderInfoList.push({
    product: products[0].product_name,
    amount: 1,
    price: products[0].price,
    discount: 0
  })
  store.commit('set_editing_order', {})
  refForm.value?.resetFields()
  resetForm()
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    :title="drawerTitle"
    size="500px"
    @close="onAddEditOrderClose"
    @closed="onAddEditOrderClosed"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="refForm"
      label-width="100px"
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
        <el-input
          v-model="form.phone"
          placeholder="991234567"
          type="tel"
          maxlength="9"
        >
          <template #prepend>
            +380
          </template>
        </el-input>
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
          placeholder="000"
          maxlength="3"
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
        v-if="mode === 'edit'"
        prop="status"
        label="Status"
      >
        <el-select
          v-model="form.status"
          type="primary"
        >
          <el-option
            v-for="({ text, value }) in statusList"
            :key="value"
            :value="value"
            :label="text"
          />
        </el-select>
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
          <el-row
            :gutter="10"
          >
            <el-col
              :span="4"
            >
              Product
            </el-col>
            <el-col
              :span="15"
            >
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
            <el-col
              :span="5"
              style="text-align: right"
            >
              {{ orderInfo.price }} UAH
            </el-col>
          </el-row>
          <el-row
            :gutter="10"
          >
            <el-col
              :span="4"
            >
              Amount
            </el-col>
            <el-col
              :span="4"
            >
              <el-input
                v-model="orderInfo.amount"
                type="number"
              />
            </el-col>
            <el-col
              :span="4"
            >
              Discount
            </el-col>
            <el-col
              :span="4"
            >
              <el-input
                v-model="orderInfo.discount"
                placeholder="%"
                type="number"
              />
            </el-col>
            <el-col
              :span="8"
              style="text-align: right"
            >
              Total {{ orderInfoPriceCalculated(orderInfo) }} UAH
            </el-col>
          </el-row>
          <el-button
            v-if="orderInfoList.length > 1"
            type="danger"
            size="mini"
            @click="onRemoveOrderInfoProduct(orderInfo.product)"
          >
            Remove
          </el-button>
          <el-divider />
        </el-space>
        <el-button
          :disabled="isAddProductDisabled"
          size="mini"
          type="success"
          @click="onAddNewProductToProductInfo"
        >
          Add product
        </el-button>
      </el-form-item>
      <el-form-item
        prop="total"
        label="Total"
      >
        <el-row
          :gutter="10"
        >
          <el-col
            :span="12"
          >
            {{ form.price }} UAH
          </el-col>
          <el-col
            :span="6"
          >
            Discount
          </el-col>
          <el-col
            :span="6"
          >
            <el-input
              v-model="totalDiscount"
              type="tel"
              placeholder="%"
            />
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
          type="primary"
          @click="onSubmit"
        >
          Edit
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
</style>