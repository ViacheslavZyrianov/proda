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

const isMobile = window.innerWidth < 961

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

function generateHrefForOrderColumn(firstName, lastName) {
  return `/orders?page=1&first_name=${firstName}&last_name=${lastName}`
}

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <header class="page-header">
    <h1 class="page-header__title">{{ $route.name }}</h1>
    <div class="page-header__content">
      <el-button
        size="small"
        class="header__filter-button"
        @click="onFilterOrderClick"
      >
        <i class="el-icon-s-operation el-icon-left"></i>
        <span class="button-text">Filter</span>
      </el-button>
    </div>
  </header>
  <filter-clients
    :is-visible="isFilterClientsVisible"
    @close="onFilterClientsClose"
  />
  <el-space
    v-if="isMobile"
    direction="vertical"
    size="large"
    fill
  >
    <el-card
      v-for="client in clients"
      :key="client.product_name"
      :body-style="{ padding: '12px' }"
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
          <el-link
            v-if="prop === 'phone'"
            :href="`tel:+380${client[prop]}`"
          >
            +380{{ client[prop] }}
          </el-link>
          <el-link
            v-else-if="prop === 'orders'"
            :href="generateHrefForOrderColumn(client.first_name, client.last_name)"
          >
            {{ client[prop] }}
          </el-link>
          <template v-else>
            {{ client[prop] }}
          </template>
        </el-col>
      </el-row>
    </el-card>
  </el-space>
  <el-table
    v-else
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
      <template #default="scope">
        <template v-if="tableColumn.prop === 'phone'">
          +380{{ scope.row[tableColumn.prop] }}
        </template>
          <el-link
            v-else-if="tableColumn.prop === 'orders'"
            :href="generateHrefForOrderColumn(scope.row.first_name, scope.row.last_name)"
          >
            {{ scope.row[tableColumn.prop] }}
          </el-link>
        <template v-else>
          {{ scope.row[tableColumn.prop] }}
        </template>
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
.card-row {
  margin-bottom: 8px;

  &__value {
    overflow-wrap: break-word;
    white-space: pre-line;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>