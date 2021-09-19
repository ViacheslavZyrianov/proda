<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import TheElMenu from './components/TheElMenu.vue'
import TheAuth from './components/TheAuth.vue'

import router from './router/index'
import { computed } from 'vue'

const isLoggedIn = computed(() => window.localStorage.getItem('auth'))
</script>

<template>
  <el-container>
    <template v-if="isLoggedIn">
      <the-el-menu />
      <el-main>
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <span>Loading...</span>
          </template>
        </Suspense>
      </el-main>
    </template>
    <the-auth v-else />
  </el-container>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
  padding: 0;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

#app {
  min-height: 100vh;
}

.el-main {
  min-height: 100vh;
}

.el-aside {
  .el-menu {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.el-select,
.el-select-v2 {
  width: 100%;

  &__placeholder {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
