<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import ProductsTable from './ProductsTable.vue'
import AddEditProduct from './AddEditProduct.vue'
import CookedProduct from './CookedProduct.vue'

const store = useStore()

await store.dispatch('fetchProducts')

const isAddEditProductVisible = ref(false)
const isCookedProductVisible = ref(false)

function onEditProduct() {
  isAddEditProductVisible.value = true
}

function onAddEditProductClose() {
  isAddEditProductVisible.value = false
}

function onAddProductClick() {
  isAddEditProductVisible.value = true
}

function onCookedProductClick() {
  isCookedProductVisible.value = true
}

function onCookedProductClose() {
  isCookedProductVisible.value = false
}
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
    <div class="page-header__content">
      <el-button
        type="primary"
        size="small"
        class="cooked-button"
        @click="onCookedProductClick"
      >
        <i class="el-icon-fork-spoon el-icon-left"></i>
        <span class="button-text">Cooked</span>
      </el-button>
      <el-button
        type="success"
        size="small"
        class="add-button"
        @click="onCookedProductClick"
      >
        <i class="el-icon-plus el-icon-left"></i>
        <span class="button-text">Add product</span>
      </el-button>
    </div>
  </header>
  <products-table
    @edit="onEditProduct"
  />
  <add-edit-product
    :is-visible="isAddEditProductVisible"
    @close="onAddEditProductClose"
  />
  <cooked-product
    :is-visible="isCookedProductVisible"
    @close="onCookedProductClose"
  />
</template>