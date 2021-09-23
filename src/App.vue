<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import TheElMenu from './components/TheElMenu/Index.vue'
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
  overflow: hidden;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

@for $i from 1 through 6 {
  h#{$i} {
    margin: 0;
  }
}

#app {
  min-height: 100vh;
}

.el-main {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.el-aside {
  .el-menu {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.el-input,
.el-select,
.el-select-v2,
.el-date-editor {
  width: 100% !important;
}

.el-select,
.el-select-v2 {
  &__placeholder {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
