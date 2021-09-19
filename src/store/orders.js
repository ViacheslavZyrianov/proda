import { reactive } from 'vue'
import axios from 'axios'

const state = reactive({
  orders: [],
  ordersTotal: 0,
  editingOrder: {}
})

const actions = {
  async fetchOrders({ commit }, payload) {
    const { data } = await axios.get('orders/', { params: payload })
    commit('set_orders', data.data)
    commit('set_orders_total', data.total)
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
  },
  set_orders(state, payload) {
    state.orders = payload
  },
  set_orders_total(state, payload) {
    state.ordersTotal = payload
  }
}

export default {
  state,
  actions,
  mutations
}
