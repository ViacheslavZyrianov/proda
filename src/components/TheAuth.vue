<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const login = ref('')
const password = ref('')

function onSubmit() {
  const [correctLogin, correctPassword] = import.meta.env.VITE_USER.split('@')
  if (login.value === correctLogin && password.value === correctPassword) {
    window.localStorage.setItem('auth', import.meta.env.VITE_USER)
    document.location.href = 'dashboard'
  } else ElMessage({ message: 'Wrong auth data', type: 'error' })
}
</script>

<template>
  <el-main class="login">
    <el-card
      :body-style="{ width: '300px' }"
    >
      <img
        src="/img/logo.svg" 
        alt="Logo"
        class="logo"
      >
      <el-form
        class="login__form"
        @submit.prevent="onSubmit"
      >
        <el-input
          v-model="login"
          placeholder="Login"
        />
        <el-input
          v-model="password"
          placeholder="Password"
          type="password"
        />
        <el-button
          native-type="submit"
          class="form__submit-button"
        >
          Login
        </el-button>
      </el-form>
    </el-card>
  </el-main>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;

  &__form {
    .el-input {
      margin-bottom: 16px;
    }
  }

  .form {
    &__submit-button {
      width: 100%;
    }
  }
}

.logo {
  display: block;
  width: 50%;
  margin: 0 auto 20px;
}
</style>