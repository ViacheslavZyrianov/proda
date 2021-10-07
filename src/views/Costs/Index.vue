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
  <costs-table
    @edit="onEditCost"
  />
  <add-edit-cost
    :is-visible="isAddEditCostVisible"
    @close="onAddEditCostClose"
  />
</template>