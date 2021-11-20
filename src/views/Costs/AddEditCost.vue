<script setup>
import { useStore } from 'vuex'
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import modifyRouteQuery from '../../utils/modifyRouteQuery'

const props = defineProps({
  isVisible: Boolean,
})
 
const emit = defineEmits(['close'])

const store = useStore()

const { costs } = store.state.costs

const isAddCostDisabled = false

const isSubmitButtonLoading = ref(false)

const mode = computed(() => Object.keys(store.state.costs.editingCost).length ? 'edit' : 'add')

const refForm = ref(null)
const form = reactive({})
resetForm()

watch(() => store.state.costs.editingCost, newEditingCost => {
  const costKeys = Object.keys(newEditingCost)
  if (costKeys.length) {
    costKeys.forEach(costKey => {
      form[costKey] = newEditingCost[costKey]
    })
  }
}, { deep: true })

const drawerTitle = computed(() => mode.value === 'add' ? 'Add cost' : 'Edit cost')

async function onSubmit() {
  let isFormValid = false

  refForm.value.validateField(Object.keys(form), (errorMessage) => {
    isFormValid = !errorMessage
  })

  if (!isFormValid) return
  
  isSubmitButtonLoading.value = true

  let data = null
  if (mode.value === 'add') data = await store.dispatch('postCost', {
    cost_id: form.cost_id,
    title: form.title,
    price: Number(form.price),
    order_date: form.order_date
  })

  if (mode.value === 'edit') data = await store.dispatch('putCost', form)

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    if (mode.value === 'add') {
      const { length } = store.state.costs.costs
      store.state.costs.costs[length] = data.data
    }
    ElMessage({ message: data.status, type: 'success' })
    emit('close')
  }

  isSubmitButtonLoading.value = false
}

function onFieldClear(field) {
  modifyRouteQuery({ [field]: null })
}

function resetForm() {
  Object.assign(form, {
    title: null,
    price: null,
    order_date: null
  })
}

function onAddEditCostClose() {
  emit('close')
}

function onAddEditCostClosed() {
  store.commit('set_editing_cost', {})
  refForm.value?.resetFields()
  resetForm()
}

function onDatePickerChange() {
  onFieldClear('order_date')
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    :title="drawerTitle"
    size="500px"
    @close="onAddEditCostClose"
    @closed="onAddEditCostClosed"
  >
    <el-form
      :model="form"
      ref="refForm"
      label-width="100px"
    >
      <el-form-item
        prop="title"
        label="Cost title"
      >
        <el-input
          v-model="form.title"
          placeholder="Hot as hell sauce"
          @clear="onFieldClear('title')"
        />
      </el-form-item>
      <el-form-item
        prop="price"
        label="Price"
        type="number"
      >
        <el-input
          v-model="form.price"
          placeholder="99"
          @clear="onFieldClear('price')"
        />
      </el-form-item>
      <el-form-item
        label="Date"
      >
        <el-date-picker
          v-model="form.order_date"
          type="date"
          range-separator="-"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="onDatePickerChange"
        />
      </el-form-item>
      <div class="el-drawer__footer">
        <el-button
          @click="onAddEditCostClose"
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
          @click="onSubmit"
        >
          Edit
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