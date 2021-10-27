<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()

const { products } = store.state.products

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const refForm = ref(null)
const form = reactive({})
resetForm()

const isSubmitButtonLoading = ref(false)

function resetForm() {
  Object.assign(form, {
    product_name: null,
    amount: null
  })
}

function onCookedProductClose() {
  emit('close')
}

function onCookedProductClosed() {
  refForm.value?.resetFields()
  resetForm()
}

async function onSubmit() {
  let isFormValid = false

  refForm.value.validateField(Object.keys(form), (errorMessage) => {
    isFormValid = !errorMessage
  })

  if (!isFormValid) return
  
  isSubmitButtonLoading.value = true

  const data = await store.dispatch('putProductCooked', {
    product_name: form.product_name,
    amount: Number(form.amount)
  })

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else ElMessage({ message: data.status, type: 'success' })
  
  emit('close')

  isSubmitButtonLoading.value = false
}

function onCookedProductChange(product) {
  console.log('product', product)
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    title="Cooked product"
    size="500px"
    @closed="onCookedProductClosed"
  >
    <el-form
      :model="form"
      ref="refForm"
      label-width="100px"
    >
      <el-form-item
        prop="product_name"
        label="Product"
      >
        <el-select
          v-model="form.product_name"
          @change="onCookedProductChange"
        >
          <el-option
            v-for="product in products"
            :key="product.product_name"
            :value="product.product_name"
            :label="product.title"
          />
        </el-select>
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
          @click="onCookedProductClose"
        >
          Cancel
        </el-button>
        <el-button
          :loading="isSubmitButtonLoading"
          type="success"
          @click="onSubmit"
        >
          Cook
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>