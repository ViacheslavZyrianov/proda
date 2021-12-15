<script setup>
import script from './script'

const {
  menuList,
  defaultActive,
  onMenuItemClick,
  onLogOutClick
} = script()
</script>

<template>
  <el-menu :default-active="`${defaultActive}`">
    <el-menu-item
      v-for="({ to, label, icon }, menuItemIndex) in menuList"
      :key="to"
      :index="`${menuItemIndex}`"
      @click="onMenuItemClick(to)"
    >
      <el-icon><component :is="icon" /></el-icon>
      <template #title>
        {{ label }}
      </template>
    </el-menu-item>
    <el-menu-item
      class="el-menu-item_logout"
      @click="onLogOutClick"
    >
      <el-icon><key /></el-icon>
      <template #title>
        Log out
      </template>    
    </el-menu-item>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  max-width: 200px;

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