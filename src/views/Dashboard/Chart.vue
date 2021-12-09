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
  stepX: {
    type: Number,
    required: false,
    default: 1
  },
  stepY: {
    type: Number,
    required: false,
    default: 1
  },
  canvasId: {
    type: String,
    required: true
  },
  isLabelsVisible: {
    type: Boolean,
    required: false,
    default: false
  }
})

const backgroundColor = props.colors.map(color => chartColors[color])

onMounted(() => {
  const ctx = document.getElementById(props.canvasId)
  
  let datasets = null

  if (props.type.includes(',')) {
    datasets = props.type.split(',').map((type, index) => ({
      type,
      data: props.data[index],
      backgroundColor,
      borderColor: 'rgb(0, 0, 0)',
      borderWidth: 1
    }))
  } else {
    datasets = [{
      type: props.type,
      data: props.data,
      backgroundColor,
      borderColor: 'rgb(0, 0, 0)',
      borderWidth: 1
    }]
  }
  
  new Chart(ctx, {
    data: {
      labels: props.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: props.isLabelsVisible
        },
        tooltip: {
          callbacks: {
            label: ({ raw }) => raw
          }
        }
      },
      scales: {
        x: {
          ticks: {
            stepSize: props.stepX
          }
        },
        y: {
          ticks: {
            stepSize: props.stepY
          }
        }
      }
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