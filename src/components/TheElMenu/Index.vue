<script setup>
import { ref, computed } from 'vue'
import router from '../../router/index'
import menuList from './menuList'

const isCollapsed = ref(window.innerWidth < 961)
const defaultActive = menuList.findIndex(({ to }) => to === window.location.pathname.slice(1)) || 0

const collapseButtonIcon = computed(() => isCollapsed.value ? 'el-icon-right' : 'el-icon-back')

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

function onCollapseExpandMenu() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <el-menu
    :default-active="`${defaultActive}`"
    :collapse="isCollapsed"
  >
    <div class="el-menu__header">
      <el-button
        :icon="collapseButtonIcon"
        circle
        class="el-menu__expand-collapse-button"
        @click="onCollapseExpandMenu"
      />
      <img
        src="/img/logo.svg" 
        alt="Logo"
        class="logo"
      >
    </div>
    <el-menu-item
      v-for="(menuItem, menuItemIndex) in menuList"
      :key="menuItem.to"
      :index="`${menuItemIndex}`"
      @click="onMenuItemClick(menuItem.to)"
    >
      <i :class="`el-icon-${menuItem.icon}`" />
      <template #title>
        {{ menuItem.label }}
      </template>
    </el-menu-item>
    <el-menu-item
      class="el-menu-item_logout"
      @click="onLogOutClick"
    >
      <i class="el-icon-key" />
      <template #title>
        Log out
      </template>    
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  max-width: 200px;
  padding: 20px 0;

  &__header {
    display: flex;
    align-items: center;
    padding-left: 11px;

    @media screen and (min-width: 961px) {
      padding-left: 22px;
      margin-bottom: 10px;
    }
  }

  &__expand-collapse-button {
    margin-right: 10px;

    @media screen and (min-width: 961px) {
      display: none;
    }
  }

  .logo {
    width: 60%;

    @media screen and (max-width: 960px) {
      display: none;
    }
  }
}
.el-menu-item_logout {
  margin-top: auto;
}
</style>