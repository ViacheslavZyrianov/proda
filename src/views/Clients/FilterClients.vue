<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import router from '../../router'
import modifyRouteQuery from '../../utils/modifyRouteQuery'

const store = useStore()

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const { query: { first_name, last_name, phone, city } } = router.currentRoute.value

const form = reactive({
  first_name,
  last_name,
  phone,
  city
})

const isButtonSubmitLoading = ref(false)

watch(() => router, async () => {
  if (router.currentRoute.value.name === 'clients' && Object.keys(router.currentRoute.value.query).length) {
    isButtonSubmitLoading.value = true
    await store.dispatch('fetchClients', router.currentRoute.value.query)
    isButtonSubmitLoading.value = false
  }
}, { deep: true, immediate: true })

function onFieldClear(field) {
  modifyRouteQuery({ [field]: null })
}

function onFiltersSubmitClick() {
  const filters = {
    first_name: form.first_name,
    last_name: form.last_name,
    phone: form.phone,
    city: form.city
  }

  for (let filterKey in filters) {
    if (!filters[filterKey]) delete filters[filterKey]
  }

  modifyRouteQuery(filters)
}

function onFiltersResetClick() {
  const { page } = router.currentRoute.value.query
  const query = { page }

  for (let formKey in form) {
    delete form[formKey]
    query[formKey] = null
  }

  modifyRouteQuery(query)
}

function onClose() {
  emit('close')
}
</script>

<template>
  <el-drawer
    v-model="isVisible"
    title="Fiter orders"
    size="500px"
    @close="onClose"
  >
    <el-form
      :model="form"
      ref="refForm"
      label-width="100px"
    >
      <el-form-item
        prop="first_name"
        label="First name"
      >
        <el-input
          v-model="form.first_name"
          placeholder="John"
          clearable
          @clear="onFieldClear('first_name')"
        />
      </el-form-item>
      <el-form-item
        prop="last_name"
        label="Last name"
      >
        <el-input
          v-model="form.last_name"
          placeholder="Doe"
          clearable
          @clear="onFieldClear('last_name')"
        />
      </el-form-item>
      <el-form-item
        prop="phone"
        label="Phone"
      >
        <el-input
          v-model="form.phone"
          placeholder="991234567"
          type="tel"
          maxlength="9"
          clearable
          @clear="onFieldClear('phone')"
        >
          <template #prepend>
            +380
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="city"
        label="City"
      >
        <el-input
          v-model="form.city"
          placeholder="Kyiv"
          clearable
          @clear="onFieldClear('city')"
        />
      </el-form-item>
      <div class="el-drawer__footer">
        <el-button
          type="default"
          native-type="reset"
          @click="onFiltersResetClick"
        >
          Reset
        </el-button>
        <el-button
          :loading="isButtonSubmitLoading"
          type="primary"
          @click="onFiltersSubmitClick"
        >
          Submit
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>