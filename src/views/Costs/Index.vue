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
  <section class="page_costs">
    <div class="costs__header">
      <h1 class="header__title">Costs</h1>
      <el-button
        type="success"
        size="small"
        @click="onAddCostClick"
      >
        <i class="el-icon-plus el-icon-left"></i>
        <span class="button-text">Add cost</span>
      </el-button>
    </div>
    <costs-table
      @edit="onEditCost"
    />
  </section>
  <add-edit-cost
    :is-visible="isAddEditCostVisible"
    @close="onAddEditCostClose"
  />
</template>

<style lang="scss">
.page_costs {
  display: flex;
  flex-direction: column;
  height: 100%;

  .costs {
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .header {
        &__title {
          margin-right: auto;
        }
      }

      .button-text {
        @media screen and (max-width: 960px) {
          display: none;
        }
      }
    }
  }
}
</style>