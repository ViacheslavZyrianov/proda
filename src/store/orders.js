import { reactive } from 'vue'
import axios from 'axios'

const state = reactive({
  orders: [],
  editingOrder: {}
})

const actions = {
  async fetchOrders() {
    try {
      const { data: { data } } = await axios.get('orders/')
      state.orders = data
    } catch (err) {
      return err.response.data
    }
  },
  async postOrder(_, payload) {
    try {
      const { data } = await axios.post('orders/', payload)
      return data 
    } catch (err) {
      return err.response.data
    }
  },
  async putOrder(_, { payload, id }) {
    try {
      const { data } = await axios.put(`orders/${id}`, payload)
      let neededOrder = state.orders.find(({ order_id }) => order_id === id)
      neededOrder = Object.assign(neededOrder, data.data)
      return data
    } catch (err) {
      return err.response.data
    }
  },
  async deleteOrder(_, payload) {
    try {
      const { data } = await axios.delete(`orders/${payload}`)
      return data 
    } catch (err) {
      return err.response.data
    }
  }
}

const mutations = {
  set_editing_order(state, payload) {
    state.editingOrder = payload
  }
}

export default {
  state,
  actions,
  mutations
}
