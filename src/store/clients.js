import axios from 'axios'

const actions = {
  async fetchClients(_, payload) {
    const { data } = await axios.get('clients/', { params: payload })
    return data
  }
}

export default {
  actions
}