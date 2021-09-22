<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import router from '../../router'
import tableColumns from './tableColumns'
import modifyRouteQuery from '../../utils/modifyRouteQuery'
import FilterClients from './FilterClients.vue'

let isTableDataLoading = ref(false)

const store = useStore()
const clients = reactive([])
const total = ref(0)

const currentPage = ref(Number(router.currentRoute.value.query.page))

const formattedFilters = reactive({ ...router.currentRoute.value.query })

const isFilterClientsVisible = ref(false)

watch(() => router, async () => {
  if (router.currentRoute.value.name === 'clients' && Object.keys(router.currentRoute.value.query).length) {
    isTableDataLoading.value = true
    clients.length = 0
    const data = await store.dispatch('fetchClients', router.currentRoute.value.query)
    currentPage.value = Number(router.currentRoute.value.query.page)
    clients.push(...data.data)
    total.value = data.total
    isTableDataLoading.value = false
  }
}, { deep: true, immediate: true })

async function onPaginationChange(page) {
  currentPage.value = Number(page)
  modifyRouteQuery({ page })
}

function onSortChange({ prop, order }) {
  if (prop && order) modifyRouteQuery({ sort_by: prop, sort_way: order.replace('ending', '') })
  else modifyRouteQuery({ sort_by: null, sort_way: null })
}

function onFilterChange(filters) {
  Object.keys(filters).forEach(filterKey => {
    formattedFilters[filterKey] = filters[filterKey].join(',')
  })
  modifyRouteQuery({ ...formattedFilters })
}

function onFilterSearch() {
  modifyRouteQuery({ ...formattedFilters })
}

function onFilterOrderClick() {
  isFilterClientsVisible.value = true
}

function onFilterClientsClose() {
  isFilterClientsVisible.value = false
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <div class="clients__header">
    <h1 class="header__title">Clients</h1>
    <el-button
      type="primary"
      size="small"
      @click="onFilterOrderClick"
    >
      <i class="el-icon-s-operation el-icon-left"></i>
      Filter
    </el-button>
  </div>
  <filter-clients
    :is-visible="isFilterClientsVisible"
    @close="onFilterClientsClose"
  />
  <el-table
    v-loading="isTableDataLoading"
    :data="clients"
    border
    fit
    lazy
    @filter-change="onFilterChange"
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
    >
      <template #header>
        {{ tableColumn.label }}
        <el-popover
          v-if="tableColumn.searchable"
          placement="bottom"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <el-button
              icon="el-icon-search"
              size="mini"
              circle
              class="el-button__filter-search"
            />
          </template>
          <template #default>
            <el-input
              v-model="formattedFilters[tableColumn.prop]"
              size="mini"
            />
            <el-button
              size="mini"
              type="text"
              class="el-popover__search-button"
              @click="onFilterSearch"
            >
              Search
            </el-button>
          </template>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :disabled="isTableDataLoading"
    :total="total"
    :current-page="currentPage"
    layout="prev, pager, next"
    mini
    background
    hide-on-single-page
    @current-change="onPaginationChange"
  />
</template>

<style lang="scss">
.clients {
  &__header {
    display: flex;
    align-items: center;

    .header {
      &__title {
        margin-right: auto;
      }
    }
  }
}
</style>