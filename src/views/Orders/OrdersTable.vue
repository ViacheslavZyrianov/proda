<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElRadioButton, ElRadioGroup } from 'element-plus'
import router from '../../router'
import modifyRouteQuery from '../../utils/modifyRouteQuery'
import tableColumns from './tableColumns'
import statusList from './statusList'

const store = useStore()
const { products } = store.state.products

const emit = defineEmits(['edit'])

defineProps({
  isVisible: Boolean
})

const isTableDataLoading = ref(false)

const currentPage = ref(Number(router.currentRoute.value.query.page))

const currentStatus = ref(router.currentRoute.value.query.status || 'New')

const isSetStatusButtonLoading = ref(false)

const defaultSort = {
  prop: router.currentRoute.value.query.sort_by,
  order: router.currentRoute.value.query.sort_way + 'ending'
}

const formattedFilters = reactive({})
Object.assign(formattedFilters, router.currentRoute.value.query)

const isMobile = window.innerWidth < 961

const currentProductDeletingIndex = ref(null)

watch(() => router, async () => {
  if (router.currentRoute.value.name === 'orders' && Object.keys(router.currentRoute.value.query).length) {
    isTableDataLoading.value = true
    await store.dispatch('fetchOrders', router.currentRoute.value.query)
    currentPage.value = Number(router.currentRoute.value.query.page)
    isTableDataLoading.value = false
  }
}, { deep: true, immediate: true })

watch(() => currentStatus.value, () => {
  modifyRouteQuery({ status: currentStatus.value === 'All' ? null : currentStatus.value })
})

function parseOrderInfo(orderInfo) {
  const parsedOrderInfo = JSON.parse(orderInfo)
  const orderList = Object.keys(parsedOrderInfo)

  return orderList.map(orderKey => {
    const { amount, discount } = parsedOrderInfo[orderKey]
    const { title } = products.find(({ product_name }) => product_name === orderKey)
    return amount !== 0 ? `${amount} ${title} ${discount}%\n` : null
  }).join('')
}

const parsedOrders = computed(_ => store.state.orders.orders.map(order => ({
  ...order,
  order_info: parseOrderInfo(order.order_info)
})))

function moneyIconColor(isPaid) {
  return isPaid ? '#68C23A' : '#F56C6C'
}

function onEditOrder(id) {
  store.commit('set_editing_order', store.state.orders.orders.find(({ order_id }) => order_id === id))
  emit('edit')
}

async function onDeleteOrder(id, index) {
  currentProductDeletingIndex.value = index
  const data = await store.dispatch('deleteOrder', id)
  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const indexOrderToDelete = parsedOrders.value.findIndex(({ order_id }) => order_id === id)
    parsedOrders.value.splice(indexOrderToDelete, 1)
    ElMessage({ message: data.status, type: 'success' })
  }
  currentProductDeletingIndex.value = null
}

function tagType(status) {
  if (status === 'new') return 'success'
  if (status === 'cooked') return 'warning'
  if (status === 'sent') return ''
  if (status === 'delivered') return 'info'
}

async function onPaginationChange(page) {
  currentPage.value = Number(page)
  modifyRouteQuery({ page })
}

function isDeleteButtonLoadingCalculated(productIndex) {
  return currentProductDeletingIndex.value === null ? false : currentProductDeletingIndex.value === productIndex
}

function currentStatusData(statusValue) {
  const currentStatusIndex = statusList.findIndex(({ value }) => value === statusValue)
  return statusList[currentStatusIndex + 1]
}

function isButtonSetStatusVisible(status) {
  return statusList[statusList.length - 1].value !== status
}

async function onSetStatus(id, status) {
  let data = await store.dispatch('patchOrderStatus', {
    status: currentStatusData(status).value,
    id
  })

  isSetStatusButtonLoading.value = false

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const { length } = store.state.orders.orders
    store.state.orders.orders[length] = data.data
    ElMessage({ message: data.status, type: 'success' })
  }
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <div class="quick-filters">
    <el-radio-group
      v-model="currentStatus"
      size="small"
    >
      <el-radio-button
        key="all"
        label="All"
      />
      <el-radio-button
        v-for="({ text }) in statusList"
        :key="text"
        :label="text"
      />
    </el-radio-group>
  </div>
  <el-space
    v-if="isMobile"
    direction="vertical"
    size="large"
    fill
  >
    <el-card
      v-for="(product, productIndex) in parsedOrders"
      :key="product.product_name"
    >
      <el-row
        v-for="({ label, prop }) in tableColumns"
        :key="prop"
        class="card-row"
        align="middle"
      >
        <el-col :span="8">
          <b>{{ label }}</b>
        </el-col>
        <el-col
          :span="14"
          :offset="2"
          class="card-row__value"
        >
          <el-link
            v-if="prop === 'phone'"
            :href="`tel:+380${product[prop]}`"
          >
            +380{{ product[prop] }}
          </el-link>
          <div
            v-else-if="prop === 'price'"
            class="price"
          >
            {{ product[prop] }}₴
            <el-icon>
              <money
                :color="moneyIconColor(product.paid)"
              />
            </el-icon>
          </div>
          <template v-else>
            {{ product[prop] }}
          </template>
        </el-col>
      </el-row>
      <el-row
        justify="end"
        align="center"
      >
        <el-button
          v-if="isButtonSetStatusVisible(product.status)"
          :loading="isSetStatusButtonLoading"
          size="mini"
          style="margin-right: auto"
          @click="onSetStatus(product.order_id, product.status)"
        >
          Set <b>{{ currentStatusData(product.status).text }}</b>
        </el-button>
        <el-tag
          v-else
          type="info"
          style="margin-right: auto"
        >
          Delivered
        </el-tag>
        <el-button
          size="mini"
          circle
          type="primary"
          style="margin-left: 0;"
          @click="onEditOrder(product.order_id)"
        >
          <el-icon><edit /></el-icon>
        </el-button>
        <el-button
          :loading="isDeleteButtonLoadingCalculated(productIndex)"
          size="mini"
          circle
          type="danger"
          style="margin-left: 4px;"
          @click="onDeleteOrder(product.order_id, productIndex)"
        >
          <el-icon><delete /></el-icon>
        </el-button>
      </el-row>
    </el-card>
  </el-space>
  <el-table
    v-else
    v-loading="isTableDataLoading"
    :data="parsedOrders"
    :default-sort="defaultSort"
    border
    fit
  >
    <el-table-column
      v-for="tableColumn in tableColumns"
      :key="tableColumn.prop"
      :prop="tableColumn.prop"
      :label="tableColumn.label"
      :column-key="tableColumn.prop"
      :align="tableColumn.align"
      :width="tableColumn.width"
      :minWidth="tableColumn.minWidth"
    >
      <template #default="scope">
        <template v-if="tableColumn.prop === 'phone'">
          +380{{ scope.row[tableColumn.prop] }}
        </template>
        <template v-else>
          {{ scope.row[tableColumn.prop] }}
        </template>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="status"
      label="Status"
      column-key="status"
      :width="120"
    >
      <template #default="scope">
        <el-tag
          :type="tagType(scope.row.status)"
        >
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="Operations"
      align="center"
      fixed="right"
      :width="200"
    >
      <template #default="scope">
        <el-button
          size="mini"
          @click="onEditOrder(scope.row.order_id)"
        >
          Edit
        </el-button>
        <el-button
          :loading="isDeleteButtonLoadingCalculated(scope.$index)"
          size="mini"
          type="danger"
          @click="onDeleteOrder(scope.row.order_id, scope.$index)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :disabled="isTableDataLoading"
    :total="store.state.orders.ordersTotal"
    :current-page="currentPage"
    layout="prev, pager, next"
    mini
    background
    hide-on-single-page
    @current-change="onPaginationChange"
  />
</template>

<style lang="scss" scoped>
.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}

.el-button__filter-search {
  margin-left: 4px;
}

.el-popover__search-button {
  float: right;
}

.price {
  display: flex;
  align-items: center;

  .el-icon {
    margin-left: 4px;
  }
}

.quick-filters {
  margin-bottom: 16px;
}
</style>