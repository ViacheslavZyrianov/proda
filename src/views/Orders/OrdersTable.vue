<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import tableColumns from './tableColumns'
import { ElMessage } from 'element-plus'

const store = useStore()
const { products } = store.state.products

const emit = defineEmits(['edit'])

defineProps({
  isVisible: Boolean
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

await store.dispatch('fetchOrders')

const parsedOrders = computed(() => store.state.orders.orders.map(order => ({
  ...order,
  fullname: `${order.first_name} ${order.last_name}`,
  order_info: parseOrderInfo(order.order_info)
})))

function onEditOrder(id) {
  store.commit('set_editing_order', store.state.orders.orders.find(({ order_id }) => order_id === id))
  emit('edit')
}

const isDeleteButtonLoading = ref(false)

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
</script>

<template>
  <el-table
    :data="parsedOrders"
    border
  >
    <el-table-column
      v-for="tableColumn in tableColumns"
      :key="tableColumn.prop"
      :prop="tableColumn.prop"
      :label="tableColumn.label"
      :width="tableColumn.width"
      :align="tableColumn.align"
    />
    <el-table-column
      align="center"
      prop="status"
      label="Status"
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
</template>

<style>
.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}
</style>