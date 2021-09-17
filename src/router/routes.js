import dashboard from '../views/Dashboard/Index.vue'

import products from '../views/Products/Index.vue'
import productsItem from '../views/Products/Item.vue'

import clients from '../views/Clients/Index.vue'
import clientsItem from '../views/Clients/Item.vue'

import orders from '../views/Orders/Index.vue'


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
    path: '/products/:id',
    name: 'productsItem',
    component: productsItem,
  },
  {
    path: '/clients',
    name: 'clients',
    component: clients,
  },
  {
    path: '/clients/:id',
    name: 'clientsItem',
    component: clientsItem,
  },
  {
    path: '/orders',
    name: 'orders',
    component: orders,
  }
]
