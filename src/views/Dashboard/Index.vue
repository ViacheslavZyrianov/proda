<script setup>
import { useStore } from 'vuex'
import chart from './Chart.vue'

const store = useStore()

await Promise.all([
  store.dispatch('fetchOrders', { page_size: 0 }),
  store.dispatch('fetchCosts', { page_size: 0 }),
  store.dispatch('fetchProducts')
])

const { orders: { orders }, products: { products }, costs: { costsSpent } } = store.state

const orderInfoData = orders.reduce((acc, { order_info }) => {
  const orderInfo = JSON.parse(order_info)
  for (let key in orderInfo) {
    if (acc[key]) acc[key] += orderInfo[key].amount
    else acc[key] = 1
  }
  return acc
}, {})

const orderInfoForChart = {
  labels: Object.keys(orderInfoData).map(key => products.find(({ product_name }) => key === product_name).title),
  data: Object.values(orderInfoData),
  colors: Object.keys(orderInfoData)
}

const costsEarned = orders.reduce((acc, val) => {
  acc += val.price
  return acc
}, 0)

const totalEarnedToTotalSpentCosts = {
  data: [
    costsEarned,
    costsSpent
  ],
  labels: ['Earned', 'Spent'],
  colors: ['earned', 'spent']
}
</script>

<template>
  <h1 class="header__title">Dashboard</h1>
  <el-row :gutter="16">
    <el-col
      :xs="24"
      :sm="24"
      :md="8"
    >
      <el-card>
        <chart
          type="pie"
          :data="orderInfoForChart.data"
          :labels="orderInfoForChart.labels"
          :colors="orderInfoForChart.colors"
          canvasId="totalSoldProducts"
        />
      </el-card>
    </el-col>
    <el-col
      :xs="24"
      :sm="24"
      :md="8"
    >
      <el-card>
        <chart
          type="bar"
          :data="totalEarnedToTotalSpentCosts.data"
          :labels="totalEarnedToTotalSpentCosts.labels"
          :colors="totalEarnedToTotalSpentCosts.colors"
          canvasId="totalEarnedToTotalSpentCosts"
        />
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss">
.el-card {
  height: 100%;

  &__body {
    height: 100%;
  }
}

.header {
  &__title {
    margin-right: auto;
    margin-bottom: 24px;
  }
}
</style>