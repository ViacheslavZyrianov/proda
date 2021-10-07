import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.headers['X-API-KEY'] = import.meta.env.VITE_TOKEN
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
