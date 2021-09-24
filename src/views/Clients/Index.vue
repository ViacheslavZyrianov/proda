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

modifyRouteQuery({ page: router.currentRoute.value.query.page || 1 })
</script>

<template>
  <div class="clients__header">
    <h1 class="header__title">Clients</h1>
    <el-button
      type="primary"
      size="small"
      class="header__filter-button"
      @click="onFilterOrderClick"
    >
      <i class="el-icon-s-operation el-icon-left"></i>
      <span class="button-text">Filter</span>
    </el-button>
  </div>
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
      v-for="product in clients"
      :key="product.product_name"
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
          {{ product[prop] }}
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
    />
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
    margin-bottom: 16px;

    .header {
      &__title {
        margin-right: auto;
      }

      &__filter-button {
        margin-left: auto;
      }
    }

    .button-text {
      @media screen and (max-width: 960px) {
        display: none;
      }
    }
  }
}

.card-row {
  margin-bottom: 8px;

  &__value {
    overflow-wrap: break-word;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>