<script setup>
import { useStore } from 'vuex'
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isVisible: Boolean,
})
 
const emit = defineEmits(['close'])

const store = useStore()

const { storage } = store.state.storage

const isAddStorageDisabled = false

const isSubmitButtonLoading = ref(false)

const mode = computed(() => Object.keys(store.state.storage.editingStorage).length ? 'edit' : 'add')

const refForm = ref(null)
const form = reactive({})
resetForm()

watch(() => store.state.storage.editingStorage, newEditingStorage => {
  const productKeys = Object.keys(newEditingStorage)
  if (productKeys.length) {
    productKeys.forEach(productKey => {
      form[productKey] = newEditingStorage[productKey]
    })
  }
}, { deep: true })

const drawerTitle = computed(() => mode.value === 'add' ? 'Add storage' : 'Edit storage')

async function onSubmit() {
  let isFormValid = false

  refForm.value.validateField(Object.keys(form), (errorMessage) => {
    isFormValid = !errorMessage
  })

  if (!isFormValid) return
  
  isSubmitButtonLoading.value = true

  let data = null
  if (mode.value === 'add') data = await store.dispatch('postStorage', {
    title: form.title,
    storage_name: form.storage_name,
    amount: Number(form.amount)
  })

  if (mode.value === 'edit') data = await store.dispatch('putStorage', form)

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    if (mode.value === 'add') {
      const { length } = store.state.storage.storage
      store.state.storage.storage[length] = data.data
    }
    ElMessage({ message: data.status, type: 'success' })
    emit('close')
  }

  isSubmitButtonLoading.value = false
}

function resetForm() {
  Object.assign(form, {
    title: null,
    storage_name: null,
    amount: null
  })
}

function onAddEditStorageClose() {
  emit('close')
}

function onAddEditStorageClosed() {
  store.commit('set_editing_product', {})
  refForm.value?.resetFields()
  resetForm()
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    :title="drawerTitle"
    size="500px"
    @close="onAddEditStorageClose"
    @closed="onAddEditStorageClosed"
  >
    <el-form
      :model="form"
      ref="refForm"
      label-width="100px"
    >
      <el-form-item
        prop="title"
        label="Storage title"
      >
        <el-input
          v-model="form.title"
          placeholder="Storag title"
        />
      </el-form-item>
      <el-form-item
        prop="storage_name"
        label="Storage name"
      >
        <el-input
          v-model="form.storage_name"
          placeholder="storage_name"
        />
      </el-form-item>
      <el-form-item
        prop="amount"
        label="Amount"
        type="number"
      >
        <el-input
          v-model="form.amount"
          placeholder="1"
        />
      </el-form-item>
      <div class="el-drawer__footer">
        <el-button
          @click="onAddEditStorageClose"
        >
          Cancel
        </el-button>
        <el-button
          v-if="mode === 'add'"
          :loading="isSubmitButtonLoading"
          type="success"
          @click="onSubmit"
        >
          Add
        </el-button>
        <el-button
          v-if="mode === 'edit'"
          :loading="isSubmitButtonLoading"
          type="primary"
          @click="onSubmit"
        >
          Submit
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<style lang="scss">
.el-drawer {
  &__body {
    padding: var(--el-drawer-padding-primary);
    padding-top: 0;
    overflow: auto;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
  }

  .el-form {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .el-divider--horizontal {
    margin: 18px 0;
  }
}
</style>