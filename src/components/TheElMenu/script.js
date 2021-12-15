import { ref, computed } from 'vue'
import router from '../../router/index'
import menuList from './menuList'

export default () => {
  const defaultActive = menuList.findIndex(({ to }) => to === window.location.pathname.slice(1)) || 0

  function onMenuItemClick (to) {
    router.push(to)
  }

  function onLogOutClick () {
    const isLogOut = window.confirm('Are you sure you want to log out?')
    if (isLogOut) {
      window.localStorage.removeItem('auth')
      window.location.reload()
    }
  }

  return {
    menuList,
    defaultActive,
    onMenuItemClick,
    onLogOutClick
  }
}