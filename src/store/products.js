import axios from 'axios'
import { reactive } from 'vue'

const state = reactive({
  products: [],
  editingProduct: {}
})

const actions = {
  async fetchProducts({ commit }) {
    const { data } = await axios.get('products/')
    commit('set_products', data)
  },
  async postProduct(_, payload) {
    try {
      const { data } = await axios.post('products/', payload)
      return data 
    } catch (err) {
      return err.response.data
    }
  },
  async putProduct(_, payload) {
    try {
      const { data } = await axios.put(`products/${payload.product_name}`, payload)
      let neededProduct = state.products.find(product => product.product_name === payload.product_name)
      neededProduct = Object.assign(neededProduct, data.data)
      return data
    } catch (err) {
      return err.response.data
    }
  },
  async deleteProduct(_, payload) {
    try {
      const { data } = await axios.delete(`products/${payload}`)
      return data 
    } catch (err) {
      return err.response.data
    }
  }
}

const mutations = {
  set_products(state, payload) {
    state.products = payload
  },
  set_editing_product(state, payload) {
    state.editingProduct = payload
  }
}

export default {
  state,
  actions,
  mutations
}
