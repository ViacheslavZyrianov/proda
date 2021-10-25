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
  data: Object.values(orderInfoData),
  labels: Object.keys(orderInfoData).map(key => products.find(({ product_name }) => key === product_name)?.title),
  colors: Object.keys(orderInfoData)
}

const costsEarned = orders.reduce((acc, val) => {
  acc += val.price
  return acc
}, 0)

const profit = costsSpent - costsEarned

const totalEarnedToTotalSpentCosts = {
  data: [
    costsEarned,
    costsSpent
  ],
  labels: ['Earned', 'Spent'],
  colors: ['earned', 'spent']
}

const productsTillProfit = {
  data: [
    Object.keys(orderInfoData).map(key => products.find(({ product_name }) => product_name === key)?.price * orderInfoData[key]),
    Array(Object.keys(orderInfoData).length).fill(profit)
  ],
  labels: Object.keys(orderInfoData).map(key => products.find(({ product_name }) => key === product_name)?.title),
  colors: Object.keys(orderInfoData)
}
</script>

<template>
  <h1 class="header__title">Dashboard</h1>
  <div class="charts">
    <el-card class="chart-card">
      <template #header>
        Sold
      </template>
      <div class="card__body">
        <chart
          type="bar"
          :data="orderInfoForChart.data"
          :labels="orderInfoForChart.labels"
          :colors="orderInfoForChart.colors"
          canvasId="totalSoldProducts"
        />
      </div>
    </el-card>
    <el-card class="chart-card">
      <template #header>
        Earned to spent
      </template>
      <div class="card__body">
        <chart
          type="bar"
          :data="totalEarnedToTotalSpentCosts.data"
          :labels="totalEarnedToTotalSpentCosts.labels"
          :colors="totalEarnedToTotalSpentCosts.colors"
          canvasId="totalEarnedToTotalSpentCosts"
        />
      </div>
    </el-card>
    <el-card class="chart-card">
      <template #header>
        Profit
      </template>
      <div class="card__body">
        <chart
          type="bar,line"
          :data="productsTillProfit.data"
          :labels="orderInfoForChart.labels"
          :colors="orderInfoForChart.colors"
          canvasId="howMuchToSellTillProfit"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
.chart-card.el-card .el-card__body {
  height: calc(100% - 56px);

  .card__body {
    height: 100%;
  }
}

.header {
  &__title {
    margin-right: auto;
    margin-bottom: 24px;
  }
}

.charts {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 20px;

  .chart-card {
    width: calc((100% / 3) - 20px);
    min-width: 300px;
    min-height: 300px;

    @media screen and (max-width: 991px) {
      min-width: 100%;
    }
  }
}
</style>