<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

import OrdersTable from './OrdersTable.vue'
import AddEditOrder from './AddEditOrder.vue'
import FilterOrders from './FilterOrders.vue'

const store = useStore()

await store.dispatch('fetchProducts')

const isAddEditOrderVisible = ref(false)
const isFilterOrdersVisible = ref(false)

function onAddOrderClick() {
  isAddEditOrderVisible.value = true
}

function onFilterOrderClick() {
  isFilterOrdersVisible.value = true
}

function onFilterOrdersClose() {
  isFilterOrdersVisible.value = false
}

function onAddEditOrderClose() {
  isAddEditOrderVisible.value = false
}

function onAddEditOrderOpen() {
  isAddEditOrderVisible.value = true
}
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
    <div class="page-header__content">
      <el-button
        size="small"
        @click="onFilterOrderClick"
      >
        <el-icon><operation /></el-icon>
        <span class="button-text">Filter</span>
      </el-button>
      <el-button
        type="success"
        size="small"
        @click="onAddOrderClick"
      >
        <el-icon><plus /></el-icon>
        <span class="button-text">Add order</span>
      </el-button>
    </div>
  </header>
  <orders-table
    @edit="onAddEditOrderOpen"
  />
  <add-edit-order
    :is-visible="isAddEditOrderVisible"
    @close="onAddEditOrderClose"
  />
  <filter-orders
    :is-visible="isFilterOrdersVisible"
    @close="onFilterOrdersClose"
  />
</template>

<style lang="scss">
.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}
</style>