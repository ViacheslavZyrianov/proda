<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import tableColumns from './tableColumns'

const store = useStore()
await store.dispatch('fetchProducts')

const emit = defineEmits(['edit'])

const isTableDataLoading = ref(false)

const isDeleteButtonLoading = ref(false)

function onEditProduct(productName) {
  store.commit('set_editing_product', store.state.products.products.find(({ product_name }) => product_name === productName))
  emit('edit')
}

async function onDeleteProduct(productName) {
  isDeleteButtonLoading.value = true
  const data = await store.dispatch('deleteProduct', productName)
  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const indexProductToDelete = store.state.products.products.findIndex(({ product_name }) => product_name === productName)
    store.state.products.products.splice(indexProductToDelete, 1)
    ElMessage({ message: data.status, type: 'success' })
  }
  isDeleteButtonLoading.value = false
}
</script>

<template>
  <el-table
    v-loading="isTableDataLoading"
    :data="store.state.products.products"
    border
    fit
  >
    <el-table-column
      v-for="tableColumn in tableColumns"
      :key="tableColumn.prop"
      :prop="tableColumn.prop"
      :label="tableColumn.label"
      :min-width="tableColumn.minWidth"
      :align="tableColumn.align"
      :sortable="tableColumn.sortable"
    />
    <el-table-column
      label="Operations"
      align="center"
      fixed="right"
      :width="200"
    >
      <template #default="scope">
        <el-button
          size="mini"
          @click="onEditProduct(scope.row.product_name)"
        >
          Edit
        </el-button>
        <el-button
          :loading="isDeleteButtonLoading"
          size="mini"
          type="danger"
          @click="onDeleteProduct(scope.row.product_name)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>