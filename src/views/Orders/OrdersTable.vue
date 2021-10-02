<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
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

function parseOrderInfo(orderInfo) {
  const parsedOrderInfo = JSON.parse(orderInfo)
  const orderList = Object.keys(parsedOrderInfo)

  return orderList.map(orderKey => {
    const { amount, discount } = parsedOrderInfo[orderKey]
    const { title } = products.find(({ product_name }) => product_name === orderKey)
    return amount !== 0 ? `${amount} ${title} ${discount}%\n` : null
  }).join('')
}

const parsedOrders = computed(() => store.state.orders.orders.map(order => ({
  ...order,
  order_info: parseOrderInfo(order.order_info)
})))

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
  if (status === 'sent') return 'primary'
  if (status === 'delivered') return 'info'
}

async function onPaginationChange(page) {
  currentPage.value = Number(page)
  modifyRouteQuery({ page })
}

function isDeleteButtonLoadingCalculated(productIndex) {
  return currentProductDeletingIndex.value === null ? false : currentProductDeletingIndex.value === productIndex
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
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
      >
        <el-col :span="11">
          <b>{{ label }}</b>
        </el-col>
        <el-col
          :span="11"
          :offset="2"
          class="card-row__value"
        >
          {{ product[prop] }}
        </el-col>
      </el-row>
      <el-row justify="end">
        <el-button
          size="mini"
          @click="onEditOrder(product.order_id)"
        >
          Edit
        </el-button>
        <el-button
          :loading="isDeleteButtonLoadingCalculated(productIndex)"
          size="mini"
          type="danger"
          @click="onDeleteOrder(product.order_id, productIndex)"
        >
          Delete
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
      :width="tableColumn.width"
      :min-width="tableColumn.minWidth"
      :align="tableColumn.align"
      :sortable="tableColumn.sortable"
      :filters="tableColumn.filters"
    />
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

<style>
.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.el-button__filter-search {
  margin-left: 4px;
}

.el-popover__search-button {
  float: right;
}
</style>