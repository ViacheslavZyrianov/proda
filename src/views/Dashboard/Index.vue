<script setup>
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

const store = useStore()

await Promise.all([
  store.dispatch('fetchOrders', { page: 0 }),
  store.dispatch('fetchProducts')
])

const { orders: { orders }, products: { products } } = store.state

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
  data: Object.values(orderInfoData)
}

Chart.register(...registerables)

onMounted(() => {
  const ctxTotalSelledProducts = document.getElementById('totalSelledProducts')
  new Chart(ctxTotalSelledProducts, {
    type: 'pie',
    data: {
        labels: orderInfoForChart.labels,
        datasets: [{
            data: orderInfoForChart.data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 1
        }]
    },
    responsive: true
  })
})
</script>

<template>
  <h1>dashboard</h1>
  <el-row>
    <el-col
      :xs="24"
      :sm="24"
      :md="12"
    >
      <el-card>
        <canvas id="totalSelledProducts"/>
      </el-card>
    </el-col>
  </el-row>
</template>