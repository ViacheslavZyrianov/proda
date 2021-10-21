import axios from 'axios'
import { reactive } from 'vue'

const state = reactive({
  storage: [],
  editingStorage: {}
})

const actions = {
  async fetchStorage({ commit }) {
    const { data } = await axios.get('storages/')
    commit('set_storage', data)
  },
  async postStorage(_, payload) {
    try {
      const { data } = await axios.post('storages/', payload)
      return data 
    } catch (err) {
      return err.response.data
    }
  },
  async putStorage(_, payload) {
    try {
      const { data } = await axios.put(`storages/${payload.storage_name}`, payload)
      let neededStorage = state.storage.find(storage => storage.storage_name === payload.storage_name)
      neededStorage = Object.assign(neededStorage, data.data)
      return data
    } catch (err) {
      return err.response.data
    }
  },
  async deleteStorage(_, payload) {
    try {
      const { data } = await axios.delete(`storages/${payload}`)
      return data 
    } catch (err) {
      return err.response.data
    }
  }
}

const mutations = {
  set_storage(state, payload) {
    state.storage = payload
  },
  set_editing_storage(state, payload) {
    state.editingStorage = payload
  }
}

export default {
  state,
  actions,
  mutations
}
