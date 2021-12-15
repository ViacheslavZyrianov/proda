import router from '../router'
import removeEmptyProperties from './removeEmptyProperties'

export default async params => {
  await router.push({
    query: removeEmptyProperties({
      ...router.currentRoute.value.query,
      ...params
    })
  })
}