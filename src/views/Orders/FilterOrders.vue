<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import router from '../../router'
import statusList from './statusList'
import modifyRouteQuery from '../../utils/modifyRouteQuery'

const store = useStore()

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close', 'closed'])

const { query: { first_name, last_name, phone, city, post, ttn, order_date, status } } = router.currentRoute.value

const form = reactive({
  first_name,
  last_name,
  phone,
  city,
  post,
  ttn,
  order_date: order_date?.split('-'),
  statusList: status ? status?.split(',') : []
})

const isButtonSubmitLoading = ref(false)

function onClose() {
  emit('close')
}

function onFieldClear(field) {
  modifyRouteQuery({ [field]: null })
}

async function filterOrders(query) {
  isButtonSubmitLoading.value = true
  await store.dispatch('fetchOrders', query)
  isButtonSubmitLoading.value = false
}

async function onFiltersSubmitClick() {
  const filters = {
    first_name: form.first_name,
    last_name: form.last_name,
    phone: form.phone,
    city: form.city,
    nova_post: form.post,
    ttn: form.ttn,
    order_date: form?.order_date?.join('-'),
    status: form?.statusList.join(',')
  }

  modifyRouteQuery(filters)
  await filterOrders(filters)
}

async function onFiltersResetClick() {
  const { page } = router.currentRoute.value.query
  const query = { page }

  for (let formKey in form) {
    if (formKey === 'statusList') {
      form.statusList.length = 0
      query.status = null
    }
    else delete form[formKey]
    query[formKey] = null
  }

  await filterOrders(query)

  modifyRouteQuery(query)
}

function onDatePickerChange() {
  onFieldClear('order_date')
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
      <el-form-item
        prop="post"
        label="Post"
      >
        <el-input
          v-model="form.post"
          placeholder="000"
          maxlength="3"
          clearable
          @clear="onFieldClear('nova_post')"
        />
      </el-form-item>
      <el-form-item
        prop="ttn"
        label="TTN"
      >
        <el-input
          v-model="form.ttn"
          placeholder="000000000000"
          maxlength="12"
          clearable
          @clear="onFieldClear('ttn')"
        />
      </el-form-item>
      <el-form-item
        label="Date"
      >
        <el-date-picker
          v-model="form.order_date"
          type="daterange"
          range-separator="-"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="onDatePickerChange"
        />
      </el-form-item>
      <el-form-item
        prop="status"
        label="Status"
      >
        <el-checkbox-group
          v-model="form.statusList"
        >
          <el-checkbox-button
            v-for="({ text, value }) in statusList"
            :key="value"
            :label="value"
            type="success"
          >
            {{ text }}
          </el-checkbox-button>
        </el-checkbox-group>
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

<style lang="scss">
.el-select_date-type {
  margin-bottom: 16px;
}

.el-date-range-picker {
  width: 320px;

  .el-picker-panel__body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
}

.el-date-range-picker__content {
  width: 100%;
  float: none;
}
</style>