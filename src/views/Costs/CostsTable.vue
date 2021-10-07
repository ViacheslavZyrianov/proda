<script setup>
import { useStore } from 'vuex'
import { ref, watch } from 'vue'
import router from '../../router'
import tableColumns from './tableColumns'
import modifyRouteQuery from '../../utils/modifyRouteQuery'
import { ElMessage } from 'element-plus'
import debounce from 'lodash/debounce'

const store = useStore()

const emit = defineEmits(['edit'])

defineProps({
  isVisible: Boolean
})

const isTableDataLoading = ref(false)

const currentPage = ref(Number(router.currentRoute.value.query.page))

const defaultSort = {
  prop: router.currentRoute.value.query.sort_by,
  cost: router.currentRoute.value.query.sort_way + 'ending'
}

const currentCostDeletingIndex = ref(null)

const search = ref('')

watch(() => router, async () => {
  if (router.currentRoute.value.name === 'costs' && Object.keys(router.currentRoute.value.query).length) {
    isTableDataLoading.value = true
    await store.dispatch('fetchCosts', router.currentRoute.value.query)
    currentPage.value = Number(router.currentRoute.value.query.page)
    isTableDataLoading.value = false
  }
}, { deep: true, immediate: true })

watch(() => search.value, debounce(() => {
  modifyRouteQuery({ title: search.value })
}, 1000))

function onEditCost(id) {
  store.commit('set_editing_cost', store.state.costs.costs.find(({ cost_id }) => cost_id === id))
  emit('edit')
}

async function onDeleteCost(id, index) {
  currentCostDeletingIndex.value = index
  const data = await store.dispatch('deleteCost', id)
  if (data.message) ElMessage({ message: data.message, type: 'error' })
  else {
    const indexCostToDelete = parsedCosts.value.findIndex(({ cost_id }) => cost_id === id)
    parsedCosts.value.splice(indexCostToDelete, 1)
    ElMessage({ message: data.status, type: 'success' })
  }
  currentCostDeletingIndex.value = null
}

function isDeleteButtonLoadingCalculated(CostIndex) {
  return currentCostDeletingIndex.value === null ? false : currentCostDeletingIndex.value === CostIndex
}

async function onPaginationChange(page) {
  currentPage.value = Number(page)
  modifyRouteQuery({ page })
}

function onSortChange({ prop, order }) {
  if (prop && order) modifyRouteQuery({ sort_by: prop, sort_way: order.replace('ending', '') })
  else modifyRouteQuery({ sort_by: null, sort_way: null })
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <el-table
    v-loading="isTableDataLoading"
    :data="store.state.costs.costs"
    border
    fit
    @sort-change="onSortChange"
  >
    <el-table-column
      v-for="tableColumn in tableColumns"
      :key="tableColumn.prop"
      :prop="tableColumn.prop"
      :label="tableColumn.label"
      :width="tableColumn.width"
      :min-width="tableColumn.minWidth"
      :align="tableColumn.align"
      :sortable="tableColumn.sortable"
      :filters="tableColumn.filters"
    />
    <el-table-column
      label="Operations"
      align="center"
      fixed="right"
      :width="200"
    >
    <template #header>
      <el-input
        v-model="search"
        size="mini"
        placeholder="Type to search"
        suffix-icon="el-icon-search"
      />
    </template>
    <template #default="scope">
      <el-button
        size="mini"
        @click="onEditCost(scope.row.cost_id)"
      >
        Edit
      </el-button>
      <el-button
        :loading="isDeleteButtonLoadingCalculated(scope.$index)"
        size="mini"
        type="danger"
        @click="onDeleteCost(scope.row.cost_id, scope.$index)"
      >
        Delete
      </el-button>
    </template>
  </el-table-column>
  </el-table>
  <el-pagination
    :disabled="isTableDataLoading"
    :total="store.state.costs.costsTotal"
    :current-page="currentPage"
    layout="prev, pager, next"
    mini
    background
    hide-on-single-page
    @current-change="onPaginationChange"
  />
</template>