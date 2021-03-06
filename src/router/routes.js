import dashboard from '../views/Dashboard/Index.vue'
import products from '../views/Products/Index.vue'
import clients from '../views/Clients/Index.vue'
import orders from '../views/Orders/Index.vue'
import costs from '../views/Costs/Index.vue'
import info from '../views/Info/Index.vue'
import storage from '../views/Storage/Index.vue'

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
  },
  {
    path: '/products',
    name: 'products',
    component: products,
  },
  {
    path: '/clients',
    name: 'clients',
    component: clients,
  },
  {
    path: '/orders',
    name: 'orders',
    component: orders,
  },
  {
    path: '/costs',
    name: 'costs',
    component: costs,
  },
  {
    path: '/info',
    name: 'info',
    component: info,
  },
  {
    path: '/storage',
    name: 'storage',
    component: storage,
  }
]
