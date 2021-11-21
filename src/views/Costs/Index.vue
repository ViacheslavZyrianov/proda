<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import CostsTable from './CostsTable.vue'
import AddEditCost from './AddEditCost.vue'

const store = useStore()

const isAddEditCostVisible = ref(false)

await store.dispatch('fetchCosts')

function onAddCostClick() {
  isAddEditCostVisible.value = true
}

function onAddEditCostClose() {
  isAddEditCostVisible.value = false
}

function onEditCost() {
  isAddEditCostVisible.value = true
}
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
    <div class="page-header__content">
      <el-button
        type="success"
        size="small"
        @click="onAddCostClick"
      >
        <el-icon><plus /></el-icon>
        <span class="button-text">Add cost</span>
      </el-button>
    </div>
  </header>
  <costs-table
    @edit="onEditCost"
  />
  <add-edit-cost
    :is-visible="isAddEditCostVisible"
    @close="onAddEditCostClose"
  />
</template>
