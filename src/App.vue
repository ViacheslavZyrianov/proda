<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import TheElMenuAside from './components/TheElMenu/Aside.vue'
import TheElMenuFooter from './components/TheElMenu/Footer.vue'
import TheAuth from './components/TheAuth.vue'

import router from './router/index'
import { computed } from 'vue'

const isLoggedIn = computed(() => window.localStorage.getItem('auth'))

const elContainerDirection = computed(() => window.innerWidth < 767 ? 'vertical' : 'horizontal')
</script>

<template>
  <template v-if="isLoggedIn">
    <el-container :direction="elContainerDirection">
      <the-el-menu-aside class="hidden-xs-only" />
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
      <the-el-menu-footer class="hidden-sm-and-up" />
    </el-container>
  </template>
  <the-auth v-else />
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
  display: flex;
  height: 100vh;
}

.el-main {
  height: 100%;
  flex: 0;
}

.el-card {
  @media screen and (max-width: 960px) {
    font-size: 14px;
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

  &-dropdown__list {
    overflow: auto !important;
  }
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0 10px;
}

.el-space {
  width: 100%;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  &__title {
    text-transform: capitalize;
  }

  .button-text {
    @media screen and (max-width: 960px) {
      display: none;
    }
  }
}
</style>
