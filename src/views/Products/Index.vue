<script setup>
import { ref } from 'vue'
import ProductsTable from './ProductsTable.vue'
import AddEditProduct from './AddEditProduct.vue'

const isAddEditProductVisible = ref(false)

function onEditProduct() {
  isAddEditProductVisible.value = true
}

function onAddEditProductClose() {
  isAddEditProductVisible.value = false
}

function onAddProductClick() {
  isAddEditProductVisible.value = true
}
</script>

<template>
  <div class="products__header">
    <h1 class="header__title">Products</h1>
    <el-button
      type="success"
      size="small"
      class="add-button"
      @click="onAddProductClick"
    >
      <i class="el-icon-plus el-icon-left"></i>
      <span class="button-text">Add product</span>
    </el-button>
  </div>
  <products-table
    @edit="onEditProduct"
  />
  <add-edit-product
    :is-visible="isAddEditProductVisible"
    @close="onAddEditProductClose"
  />
</template>

<style lang="scss" scoped>
.products {
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

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

    .add-button {
      @media screen and (max-width: 960px) {
        margin-left: auto;
      }
    }
  }
}
</style>