<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

import OrdersTable from './OrdersTable.vue'
import AddEditOrder from './AddEditOrder.vue'

const store = useStore()

await store.dispatch('fetchProducts')

let isAddEditOrderVisible = ref(false)

function onAddOrderClick() {
  isAddEditOrderVisible.value = true
}

function onAddEditOrderClose() {
  isAddEditOrderVisible.value = false
}

function onEditOrder() {
  isAddEditOrderVisible.value = true
}
</script>

<template>
  <section class="page_orders">
    <orders-table
      @edit="onEditOrder"
    />
    <add-edit-order
      :is-visible="isAddEditOrderVisible"
      @close="onAddEditOrderClose"
    />
    <el-button
      class="add-order"
      type="success"
      icon="el-icon-plus"
      circle
      @click="onAddOrderClick"
    />
  </section>
</template>

<style>
.page_orders {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.add-order {
  margin: auto 0 0 auto;
}

.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}
</style>