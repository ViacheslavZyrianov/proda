<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useStore } from 'vuex'
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

const currentPage = ref(router.currentRoute.value.query.page)

const defaultSort = {
  prop: router.currentRoute.value.query.sort_by,
  order: router.currentRoute.value.query.sort_way + 'ending'
}

const formattedFilters = reactive({})
Object.assign(formattedFilters, router.currentRoute.value.query)

const isDeleteButtonLoading = ref(false)

watch(() => router, async () => {
  isTableDataLoading.value = true
  await store.dispatch('fetchOrders', router.currentRoute.value.query)
  isTableDataLoading.value = false
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

async function onDeleteOrder(id) {
  isDeleteButtonLoading.value = true
  const data = await store.dispatch('deleteOrder', id)
  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const indexOrderToDelete = parsedOrders.findIndex(({ order_id }) => order_id === id)
    parsedOrders.splice(indexOrderToDelete, 1)
    ElMessage({ message: data.status, type: 'success' })
  }
  isDeleteButtonLoading.value = false
}

function tagType(status) {
  if (status === 'new') return 'success'
  if (status === 'cooked') return 'warning'
  if (status === 'sent') return 'primary'
  if (status === 'delivered') return 'info'
}

async function onPaginationChange(page) {
  currentPage.value = page
  modifyRouteQuery({ page })
}

function onSortChange({ prop, order }) {
  if (prop && order) modifyRouteQuery({ sort_by: prop, sort_way: order.replace('ending', '') })
  else modifyRouteQuery({ sort_by: null, sort_way: null })
}

function onFilterChange(filters) {
  Object.keys(filters).forEach(filterKey => {
    formattedFilters[filterKey] = filters[filterKey].join(',')
  })
  modifyRouteQuery({ ...formattedFilters })
}

function onFilterSearch() {
  modifyRouteQuery({ ...formattedFilters })
}

function defaultFilterValues(prop) {
  const foo = router.currentRoute.value.query[prop]
  return []
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <el-table
    v-loading="isTableDataLoading"
    :data="parsedOrders"
    :default-sort="defaultSort"
    border
    fit
    @sort-change="onSortChange"
    @filter-change="onFilterChange"
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
    >
      <template #header>
        {{ tableColumn.label }}
        <el-popover
          v-if="tableColumn.searchable"
          placement="bottom"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <el-button
              icon="el-icon-search"
              size="mini"
              circle
              class="el-button__filter-search"
            />
          </template>
          <template #default>
            <el-input
              v-model="formattedFilters[tableColumn.prop]"
              size="mini"
            />
            <el-button
              size="mini"
              type="text"
              class="el-popover__search-button"
              @click="onFilterSearch"
            >
              Search
            </el-button>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="status"
      label="Status"
      column-key="status"
      :width="120"
      :filtered-value="defaultFilterValues('status')"
      :filters="statusList"
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
          :loading="isDeleteButtonLoading"
          size="mini"
          type="danger"
          @click="onDeleteOrder(scope.row.order_id)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :disabled="isTableDataLoading"
    :total="store.state.orders.ordersTotal"
    :current-page="Number(currentPage)"
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
  margin: 16px 0;
}

.el-button__filter-search {
  margin-left: 4px;
}

.el-popover__search-button {
  float: right;
}
</style>