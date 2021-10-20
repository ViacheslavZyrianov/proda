import axios from 'axios'
import { reactive } from 'vue'

const state = reactive({
  costs: [],
  editingCost: {},
  costsTotal: 0,
  costsSpent: 0
})

const actions = {
  async fetchCosts({ commit }, payload) {
    const { data } = await axios.get('costs/', { params: payload })
    commit('set_costs', data.data)
    commit('set_orders_total', data.total)
    commit('set_orders_total_spent', data.total_costs)
  },
  async postCost(_, payload) {
    try {
      const { data } = await axios.post('costs/', payload)
      return data 
    } catch (err) {
      return err.response.data
    }
  },
  async putCost(_, { cost_id, title, price, order_date }) {
    try {
      const { data } = await axios.put(`costs/${cost_id}`, { title, price, order_date })
      let neededCost = state.costs.find(cost => cost.cost_id === cost_id)
      neededCost = Object.assign(neededCost, data.data)
      return data
    } catch (err) {
      return err.response.data
    }
  },
  async deleteCost(_, payload) {
    try {
      const { data } = await axios.delete(`costs/${payload}`)
      return data 
    } catch (err) {
      return err.response.data
    }
  }
}

const mutations = {
  set_costs(state, payload) {
    state.costs = payload
  },
  set_editing_cost(state, payload) {
    state.editingCost = payload
  },
  set_orders_total(state, payload) {
    state.costsTotal = payload
  },
  set_orders_total_spent(state, payload) {
    state.costsSpent = payload
  }
}

export default {
  state,
  actions,
  mutations
}