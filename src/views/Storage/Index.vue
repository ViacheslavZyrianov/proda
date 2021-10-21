<script setup>
import { ref } from 'vue'
import StorageTable from './StorageTable.vue'
import AddEditStorage from './AddEditStorage.vue'

const isAddEditStorageVisible = ref(false)

function onEditStorage() {
  isAddEditStorageVisible.value = true
}

function onAddEditStorageClose() {
  isAddEditStorageVisible.value = false
}

function onAddStorageClick() {
  isAddEditStorageVisible.value = true
}
</script>

<template>
  <div class="storage__header">
    <h1 class="header__title">Storage</h1>
    <el-button
      type="success"
      size="small"
      class="add-button"
      @click="onAddStorageClick"
    >
      <i class="el-icon-plus el-icon-left"></i>
      <span class="button-text">Add storage</span>
    </el-button>
  </div>
  <storage-table
    @edit="onEditStorage"
  />
  <add-edit-storage
    :is-visible="isAddEditStorageVisible"
    @close="onAddEditStorageClose"
  />
</template>

<style lang="scss" scoped>
.storage {
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