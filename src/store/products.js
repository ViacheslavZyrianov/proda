import axios from 'axios'
import { ref } from 'vue';

const state = {
  products: []
}

const actions = {
  async fetchProducts() {
    const { data } = await axios.get('products/')
    state.products = data
  }
}

export default {
  state,
  actions
}
