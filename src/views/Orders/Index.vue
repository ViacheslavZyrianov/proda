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

function onEditOrder() {
  isAddEditOrderVisible.value = true
}
</script>

<template>
  <section class="page_orders">
    <div class="orders__header">
      <h1 class="header__title">Orders</h1>
      <el-button
        type="primary"
        size="small"
        @click="onFilterOrderClick"
      >
        <i class="el-icon-s-operation el-icon-left"></i>
        Filter
      </el-button>
      <el-button
        type="success"
        size="small"
        @click="onAddOrderClick"
      >
        <i class="el-icon-plus el-icon-left"></i>
        Add order
      </el-button>
    </div>
    <orders-table
      @edit="onEditOrder"
    />
    <add-edit-order
      :is-visible="isAddEditOrderVisible"
      @close="onAddEditOrderClose"
    />
    <filter-orders
      :is-visible="isFilterOrdersVisible"
      @close="onFilterOrdersClose"
    />
  </section>
</template>

<style lang="scss">
.page_orders {
  display: flex;
  flex-direction: column;
  height: 100%;

  .orders {
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .header {
        &__title {
          margin-right: auto;
        }
      }
    }
  }
}

.add-order {
  margin: auto 0 0 auto;
}

.el-table .cell {
  word-break: normal;
  white-space: pre-wrap;
}
</style>