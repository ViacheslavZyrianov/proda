<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import tableColumns from './tableColumns'

const store = useStore()
await store.dispatch('fetchStorage')

const emit = defineEmits(['edit'])

const isTableDataLoading = ref(false)

const isDeleteButtonLoading = ref(false)

const isMobile = window.innerWidth < 961

function onEditStorage(storageName) {
  store.commit('set_editing_storage', store.state.storage.storage.find(({ storage_name }) => storage_name === storageName))
  emit('edit')
}

async function onDeleteStorage(storageName) {
  isDeleteButtonLoading.value = true
  const data = await store.dispatch('deleteStorage', storageName)
  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const indexStorageToDelete = store.state.storage.storage.findIndex(({ storage_name }) => storage_name === storageName)
    store.state.storage.storage.splice(indexStorageToDelete, 1)
    ElMessage({ message: data.status, type: 'success' })
  }
  isDeleteButtonLoading.value = false
}
</script>

<template>
  <el-space
    v-if="isMobile"
    direction="vertical"
    size="large"
    fill
  >
    <el-card
      v-for="storage in store.state.storage.storage"
      :key="storage.storage_name"
    >
      <el-row
        v-for="({ label, prop }) in tableColumns"
        :key="prop"
        class="card-row"
      >
        <el-col :span="11">
          <b>{{ label }}</b>
        </el-col>
        <el-col
          :span="11"
          :offset="2"
          class="card-row__value"
        >
          {{ storage[prop] }}
        </el-col>
      </el-row>
      <el-row justify="end">
        <el-button
          size="mini"
          @click="onEditStorage(storage.storage_name)"
        >
          Edit
        </el-button>
        <el-button
          :loading="isDeleteButtonLoading"
          size="mini"
          type="danger"
          @click="onDeleteStorage(storage.storage_name)"
        >
          Delete
        </el-button>
      </el-row>
    </el-card>
  </el-space>
  <el-table
    v-else
    v-loading="isTableDataLoading"
    :data="store.state.storage.storage"
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
          @click="onEditStorage(scope.row.storage_name)"
        >
          Edit
        </el-button>
        <el-button
          :loading="isDeleteButtonLoading"
          size="mini"
          type="danger"
          @click="onDeleteStorage(scope.row.storage_name)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
.el-space {
  width: 100%;
}

.card-row {
  margin-bottom: 8px;

  &__value {
    overflow-wrap: break-word;
  }
}
</style>