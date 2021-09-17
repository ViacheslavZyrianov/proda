import axios from 'axios'

export default {
  actions: {
    async fetchCities() {
      const { data } = await fetch('https://api.novaposhta.ua/v2.0/json/Address/getCities',
      {
        method: 'POST',
        body: JSON.stringify({
          modelName: 'Address',
          calledMethod: 'getCities',
          apiKey: import.meta.env.VITE_TOKEN_NOVA_POST
        })
      }).then(res => res.json()).then(res => res)
      return data.map(({ Description }) => Description)
    }
  }
}
