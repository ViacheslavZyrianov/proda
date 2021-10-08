<script setup>
import { useStore } from 'vuex'
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isVisible: Boolean,
})
 
const emit = defineEmits(['close'])

const store = useStore()

const { products } = store.state.products

const isAddProductDisabled = false

const isSubmitButtonLoading = ref(false)

const mode = computed(() => Object.keys(store.state.products.editingProduct).length ? 'edit' : 'add')

const refForm = ref(null)
const form = reactive({})
resetForm()

watch(() => store.state.products.editingProduct, newEditingProduct => {
  console.log('newEditingProduct', newEditingProduct);
  const productKeys = Object.keys(newEditingProduct)
  if (productKeys.length) {
    productKeys.forEach(productKey => {
      form[productKey] = newEditingProduct[productKey]
    })
  }
}, { deep: true })

const drawerTitle = computed(() => mode.value === 'add' ? 'Add product' : 'Edit product')

async function onSubmit() {
  let isFormValid = false

  refForm.value.validateField(Object.keys(form), (errorMessage) => {
    isFormValid = !errorMessage
  })

  if (!isFormValid) return
  
  isSubmitButtonLoading.value = true

  let data = null
  if (mode.value === 'add') data = await store.dispatch('postProduct', {
    title: form.title,
    product_name: form.product_name,
    price: Number(form.price),
    costs: form.costs,
    amount: Number(form.amount)
  })

  if (mode.value === 'edit') data = await store.dispatch('putProduct', form)

  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    if (mode.value === 'add') {
      const { length } = store.state.products.products
      store.state.products.products[length] = data.data
    }
    ElMessage({ message: data.status, type: 'success' })
    emit('close')
  }

  isSubmitButtonLoading.value = false
}

function resetForm() {
  Object.assign(form, {
    title: null,
    product_name: null,
    price: null,
    amount: null,
    costs: null
  })
}

function onAddEditProductClose() {
  emit('close')
}

function onAddEditProductClosed() {
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
    @close="onAddEditProductClose"
    @closed="onAddEditProductClosed"
  >
    <el-form
      :model="form"
      ref="refForm"
      label-width="100px"
    >
      <el-form-item
        prop="title"
        label="Product title"
      >
        <el-input
          v-model="form.title"
          placeholder="Hot as hell sauce"
        />
      </el-form-item>
      <el-form-item
        prop="product_name"
        label="Product name"
      >
        <el-input
          v-model="form.product_name"
          placeholder="hot_as_hell_sauce"
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
        />
      </el-form-item>
      <el-form-item
        prop="costs"
        label="Costs"
        type="number"
      >
        <el-input
          v-model="form.costs"
          placeholder="99"
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
          @click="onAddEditProductClose"
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