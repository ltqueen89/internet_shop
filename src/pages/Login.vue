<template>
  <div class="login-container">
    <h2>Вход в систему</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email"
          required
        >
      </div>
      <div class="form-group">
        <input 
          type="password" 
          v-model="password" 
          placeholder="Пароль"
          required
        >
      </div>
      <button type="submit" class="btn-login">Войти</button>
    </form>
    
    <p class="signup-link">
      Нет аккаунта?
      <button @click="goToSignUp" class="btn-signup">Зарегистрироваться</button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      // Логика входа
      console.log('Вход:', this.email, this.password)
    },
    goToSignUp() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-login, .btn-signup {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-signup {
  background-color: transparent;
  color: #4CAF50;
  text-decoration: underline;
  width: auto;
  padding: 5px;
}

.signup-link {
  text-align: center;
  margin-top: 20px;
}
</style>