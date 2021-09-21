<script>
import router from '../router/index'

export default {
  setup() {
    const menuList = [
      {
        label: 'Dashboard',
        to: 'dashboard',
        icon: 'data-line'
      },
      {
        label: 'Products',
        to: 'products',
        icon: 'box'
      },
      {
        label: 'Clients',
        to: 'clients',
        icon: 'user'
      },
      {
        label: 'Orders',
        to: 'orders',
        icon: 'money'
      }
    ]

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

    const defaultActive = menuList.findIndex(({ to }) => to === window.location.pathname.slice(1)) || 0

    return {
      menuList,
      defaultActive,
      onMenuItemClick,
      onLogOutClick
    }
  }
}
</script>

<template>
  <el-aside
    width="200px"
  >
    <el-menu
        :default-active="`${defaultActive}`"
    >
      <el-menu-item
        v-for="(menuItem, menuItemIndex) in menuList"
        :key="menuItem.to"
        :index="`${menuItemIndex}`"
        @click="onMenuItemClick(menuItem.to)"
      >
        <i :class="`el-icon-${menuItem.icon}`"></i> {{ menuItem.label }}
      </el-menu-item>
      <el-menu-item
        class="el-menu-item_logout"
        @click="onLogOutClick"
      >
        <i class="el-icon-key"></i> Log out
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
.el-menu-item_logout {
  margin-top: auto;
}
</style>