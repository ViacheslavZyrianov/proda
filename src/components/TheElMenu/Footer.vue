<script setup>
import script from './script'
import router from '../../router'

const {
  menuList,
  onMenuItemClick,
  onLogOutClick
} = script()

function menuItemClassList (currentPage) {
  return [
    'menu-item',
    { 'menu-item_active': currentPage === router.currentRoute.value.name }
  ]
}
</script>

<template>
  <el-scrollbar class="el-scrollbar">
    <div class="horizontal-menu">    
      <div
        v-for="({ to, label, icon }, menuItemIndex) in menuList"
        :key="to"
        :index="`${menuItemIndex}`"
        :class="menuItemClassList(to)"
        @click="onMenuItemClick(to)"
      >
        <el-icon :size="24"><component :is="icon" /></el-icon>
        <div class="menu-item__label">{{ label }}</div>
      </div>
      <div
        class="menu-item"
        @click="onLogOutClick"
      >
        <el-icon :size="24"><key /></el-icon>
        <div class="menu-item__label">Log out</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.el-scrollbar {
  height: 57px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgb(228, 231, 237);
}
.horizontal-menu {
  display: flex;
}
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-width: 50px;
  flex: 1 0 auto;

  &__label {
    font-size: 10px;
  }

  &_active {
    color: #409eff;
  }
}
</style>