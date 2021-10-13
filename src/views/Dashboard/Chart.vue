<script setup>
import { onMounted } from 'vue'
import Chart from '../../plugins/chart'
import chartColors from './chartColors'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    required: true
  },
  canvasId: {
    type: String,
    required: true
  }
})

const backgroundColor = props.colors.map(color => chartColors[color])

onMounted(() => {
  const ctx = document.getElementById(props.canvasId)
  new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: 'Chart',
        data: props.data,
        backgroundColor,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
})

</script>

<template>
  <canvas
    :key="canvasId"
    :id="canvasId"
  />
</template>