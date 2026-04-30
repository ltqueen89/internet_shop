<template>
  <div :class="['min-h-screen duration-400', isDark ? 'bg-neutral-800' : 'bg-neutral-200']">
    <section class="flex flex-col items-center w-full h-full p-3 gap-y-4 sm:gap-y-6">
      <router-link to="/" class="flex items-center gap-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="['h-14 sm:h-20 duration-400', isDark ? 'stroke-pink-500' : 'stroke-indigo-500']"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 19H20M4 5V16H20V5L16 9L12 5L8 9L4 5Z"
          />
        </svg>
      </router-link>

      <div
        :class="[
          'w-full max-w-[440px] p-4 border-3 rounded-md sm:p-6 sm:rounded-lg transition-colors duration-300',
          isDark ? 'border-pink-700 bg-pink-600' : 'border-indigo-400 bg-indigo-500',
        ]"
      >
        <h2 class="text-white text-2xl font-bold mb-4 text-center">
          {{ isLogin ? 'Log In' : 'Sign Up' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-4 sm:gap-y-6">
          <div class="flex flex-col gap-y-1">
            <label for="email" class="text-sm !font-semibold sm:text-base">Email</label>
            <input
              v-model="email"
              placeholder="Ivanivanov@gmail.com"
              type="email"
              id="email"
              required
              :class="[
                'px-4 py-2 text-sm border-2 rounded-md text-neutral-600 shadow-sm sm:text-base sm:rounded-lg transition-colors duration-300',
                isDark
                  ? 'border-pink-700 bg-pink-800 text-white focus:border-pink-800 focus:outline focus:outline-pink-800 placeholder:text-gray-400'
                  : 'border-indigo-400 bg-white focus:border-indigo-800 focus:outline focus:outline-indigo-800 placeholder:text-gray-400',
              ]"
            />
          </div>

          <div class="flex flex-col gap-y-1">
            <label for="password" class="text-sm !font-semibold sm:text-base">Password</label>
            <input
              v-model="password"
              placeholder="Password"
              type="password"
              id="password"
              required
              :class="[
                'px-4 py-2 text-sm border-2 rounded-md text-neutral-600 shadow-sm sm:text-base sm:rounded-lg transition-colors duration-300',
                isDark
                  ? 'border-pink-700 bg-pink-800 text-white focus:border-pink-800 focus:outline focus:outline-pink-800 placeholder:text-gray-400'
                  : 'border-indigo-400 bg-white focus:border-indigo-800 focus:outline focus:outline-indigo-800 placeholder:text-gray-400',
              ]"
            />
          </div>

          <div v-if="!isLogin" class="flex flex-col gap-y-1">
            <label for="passwordConfirmation" class="text-sm !font-semibold sm:text-base">
              Password Confirmation
            </label>
            <input
              v-model="passwordConfirm"
              placeholder="Repeat the Password"
              type="password"
              id="passwordConfirmation"
              required
              :class="[
                'px-4 py-2 text-sm border-2 rounded-md text-neutral-600 shadow-sm sm:text-base sm:rounded-lg transition-colors duration-300',
                isDark
                  ? 'border-pink-700 bg-pink-800 text-white focus:border-pink-800 focus:outline focus:outline-pink-800 placeholder:text-gray-400'
                  : 'border-indigo-400 bg-white focus:border-indigo-800 focus:outline focus:outline-indigo-800 placeholder:text-gray-400',
              ]"
            />
          </div>

          <p
            v-if="errorMessage"
            class="text-white text-xs font-bold bg-red-500 p-2 rounded text-center"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            :class="[
              'px-6 py-2 mt-2 text-sm !font-semibold rounded-md text-indigo-50 transition-all duration-300 sm:mt-1 sm:text-base sm:rounded-lg',
              isDark ? 'bg-pink-700 hover:bg-pink-800' : 'bg-indigo-600 hover:bg-indigo-700',
              loading ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          >
            {{ loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up' }}
          </button>
        </form>

        <p
          :class="[
            'mt-6 text-sm text-center sm:mt-8 transition-colors duration-300 relative top-3',
            isDark ? 'text-gray-300' : 'text-gray-600',
          ]"
        >
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button
            @click="toggleMode"
            :class="[
              'font-medium hover:text-indigo-700 transition-colors duration-300 underline bg-transparent border-none cursor-pointer',
              isDark
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700',
            ]"
          >
            {{ isLogin ? 'Sign Up' : 'Log In' }}
          </button>
        </p>
      </div>

      <button @click="toggleTheme" class="cursor-pointer transition-transform duration-300">
        <sswitch></sswitch>
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import sswitch from './sswitchButton.vue'
import { auth } from '../main'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export default {
  components: { sswitch },
  inject: ['theme'],
  data() {
    return {
      isLogin: false, // Переключатель режимов
      email: '',
      password: '',
      passwordConfirm: '',
      errorMessage: '',
      loading: false,
    }
  },
  computed: {
    isDark() {
      return (this as any).theme?.isDark?.value ?? false
    },
  },
  methods: {
    // Общий метод для обработки формы
    async handleSubmit() {
      if (this.isLogin) {
        await this.login()
      } else {
        await this.register()
      }
    },

    async register() {
      this.errorMessage = ''
      if (this.password !== this.passwordConfirm) {
        this.errorMessage = 'Passwords do not match'
        return
      }
      this.loading = true
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password)
        this.$router.push('/')
      } catch (error: any) {
        this.handleAuthError(error)
      } finally {
        this.loading = false
      }
    },

    async login() {
      this.errorMessage = ''
      this.loading = true
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password)
        this.$router.push('/')
      } catch (error: any) {
        this.handleAuthError(error)
      } finally {
        this.loading = false
      }
    },

    handleAuthError(error: any) {
      console.error(error.code)
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'This email is already registered'
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'Password should be at least 6 characters'
      } else if (error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Invalid email or password'
      } else {
        this.errorMessage = 'An error occurred. Please try again.'
      }
    },

    toggleTheme() {
      ;(this as any).theme?.toggleTheme?.()
    },

    toggleMode() {
      this.isLogin = !this.isLogin
      this.errorMessage = ''
    },
  },
}
</script>
