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
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
    <div class="page-header__content">
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
  </header>
  <storage-table
    @edit="onEditStorage"
  />
  <add-edit-storage
    :is-visible="isAddEditStorageVisible"
    @close="onAddEditStorageClose"
  />
</template>