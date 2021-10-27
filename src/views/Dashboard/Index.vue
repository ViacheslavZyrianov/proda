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

const totalProductsSold = formatOrdersToProductsAndAmount(orders)

const productsSoldDataForChart = {
  data: Object.values(totalProductsSold),
  labels: Object.keys(totalProductsSold).map(key => products.find(({ product_name }) => key === product_name)?.title),
  colors: Object.keys(totalProductsSold)
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

const productsTillProfit = tillProfit >= 0 ? products.reduce((acc, { title, product_name, price }) => {
  acc.data.push(Math.ceil(tillProfit / price))
  acc.labels.push(title)
  acc.colors.push(product_name)

  return acc
}, { data: [], labels: [], colors: [] }) : null

const ordersWithStatusNew = orders.filter(({ status }) => status === 'new')

const productsNeedToCook = ordersWithStatusNew.length ? formatOrdersToProductsAndAmount(ordersWithStatusNew) : null

const productsNeedToCookDataForChart = {
  data: Object.values(productsNeedToCook),
  labels: Object.keys(productsNeedToCook).map(key => products.find(({ product_name }) => key === product_name)?.title),
  colors: Object.keys(productsNeedToCook)
}

function formatOrdersToProductsAndAmount (unformattedOrders) {
  return unformattedOrders.reduce((acc, { order_info }) => {
    const orderInfo = JSON.parse(order_info)
    for (let key in orderInfo) {
      if (acc[key]) acc[key] += orderInfo[key].amount
      else acc[key] = 1
    }
    return acc
  }, {})
}
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
          :data="productsSoldDataForChart.data"
          :labels="productsSoldDataForChart.labels"
          :colors="productsSoldDataForChart.colors"
          canvasId="productsSoldDataForChart"
        />
      </div>
    </el-card>
    <el-card class="chart-card">
      <template #header>
        Till profit, QTY
      </template>
      <div
        v-if="productsTillProfit"
        class="card__body"
      >
        <chart
          type="bar"
          :data="productsTillProfit.data"
          :labels="productsTillProfit.labels"
          :colors="productsTillProfit.colors"
          canvasId="productsTillProfit"
        />
      </div>
      <div
        v-else
        class="profit"
      >
        {{ Math.ceil(-tillProfit) }} ₴
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
    <el-card class="chart-card">
      <template #header>
        Need to cook, QTY
      </template>
      <div
        v-if="productsNeedToCook"
        class="card__body"
      >
        <chart
          type="bar"
          :data="productsNeedToCookDataForChart.data"
          :labels="productsNeedToCookDataForChart.labels"
          :colors="productsNeedToCookDataForChart.colors"
          canvasId="productsNeedToCook"
        />
      </div>
      <div
        v-else
        class="no-need-to-cook"
      >
        No need to cook 👨‍🍳
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

.el-card__body {
  display: flex;
  align-items: center;
  justify-content: center;
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

.profit {
  text-align: center;
  color: #95D42F;
  font-weight: bold;
  font-size: 64px;
}

.no-need-to-cook {
  text-align: center;
  color: rgb(48, 49, 51);
  font-weight: bold;
  font-size: 32px;
}
</style>