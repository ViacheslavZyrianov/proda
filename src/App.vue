<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import TheElMenu from './components/TheElMenu.vue'
import router from './router/index'

if (!window.localStorage.getItem('auth')) {
  // const users = {
  //   slava: 'slavapass',
  //   roma: 'romapass'
  // }
  // const [login, password] = window.prompt('Enter login and password')?.split('@')
  // if (!users[login] || users[login] !== password) router.push('error-auth')
  // else {
  //   window.localStorage.setItem('auth', `${login}@${password}`)
  //   router.push('/')
  // }
  const loginData = window.prompt('Enter login and password')
  if (loginData !== import.meta.env.VITE_USER) router.push('error-auth')
  else {
    window.localStorage.setItem('auth', loginData)
    router.push('/dashboard')
  }
}
</script>

<template>
  <el-container>
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
  </el-container>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Urbanist', sans-serif;
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

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

#app {
  min-height: 100vh;
}

.el-aside {
  min-height: 100vh;

  .el-menu {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.el-select,
.el-select-v2 {
  width: 100%;
}
</style>
