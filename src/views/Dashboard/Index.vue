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

const tillProfit = costsSpent - costsEarned

const totalEarnedToTotalSpentCosts = {
  data: [
    costsEarned,
    costsSpent,
    tillProfit >= 0 ? tillProfit : 0
  ],
  labels: ['Earned', 'Spent', 'Till profit'],
  colors: ['earned', 'spent', 'tillProfit']
}

const productsTillProfit = products.reduce((acc, { title, product_name, amount, price }) => {
  acc.data.push(Math.ceil((tillProfit / price)))
  acc.labels.push(title)
  acc.colors.push(product_name)

  return acc
}, { data: [], labels: [], colors: [] })
</script>

<template>
  <h1 class="header__title">Dashboard</h1>
  <div class="charts">
    <el-card class="chart-card">
      <template #header>
        Sold, QTY
      </template>
      <div class="card__body">
        <chart
          type="bar"
          :data="orderInfoForChart.data"
          :labels="orderInfoForChart.labels"
          :colors="orderInfoForChart.colors"
          canvasId="orderInfoForChart"
        />
      </div>
    </el-card>
    <el-card class="chart-card">
      <template #header>
        Till profit, QTY
      </template>
      <div class="card__body">
        <chart
          type="bar"
          :data="productsTillProfit.data"
          :labels="productsTillProfit.labels"
          :colors="productsTillProfit.colors"
          canvasId="productsTillProfit"
        />
      </div>
    </el-card>
    <el-card class="chart-card">
      <template #header>
        Finances, UAH
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
    flex: 1;
    min-width: 300px;
    min-height: 300px;

    @media screen and (max-width: 991px) {
      min-width: 100%;
    }
  }
}
</style>