<script>
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    store.dispatch('fetchProducts')
  }
}
</script>

<template>
  <h1>products</h1>
</template>
