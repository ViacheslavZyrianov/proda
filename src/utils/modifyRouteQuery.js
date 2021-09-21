import router from '../router'
import removeEmptyProperties from './removeEmptyProperties'

export default params => {
  router.push({
    query: removeEmptyProperties({
      ...router.currentRoute.value.query,
      ...params
    })
  })
}