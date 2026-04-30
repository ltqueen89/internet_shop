<script setup>
import { useRouter } from 'vue-router'
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { auth } from '../main' // Импортируем auth
import { onAuthStateChanged } from 'firebase/auth'
import sswitch from '../pages/sswitchButton.vue'

const router = useRouter()
const emit = defineEmits(['openDrawer'])

// Состояние авторизации
const isLoggedIn = ref(false)
let unsubscribeAuth = null

// Проверяем статус пользователя при загрузке
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user // true если юзер есть, false если нет
  })
})

onBeforeUnmount(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})

// Получаем глобальное состояние темы
const { isDark, toggleTheme } = inject('theme')
</script>

<template>
  <header>
    <div
      :class="[
        'flex flex-wrap rounded-b-3xl shadow-2xl pt-4 sm:pt-6 md:pt-10 pb-6 sm:pb-8 md:pb-12 justify-between items-center px-3 sm:px-6 md:px-10 gap-3 transition-colors duration-400',
        isDark ? 'bg-neutral-800' : 'bg-indigo-100',
      ]"
    >
      <div
        @click="router.push('/')"
        class="flex h-10 items-center gap-2 cursor-pointer transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="[
            'h-12 sm:h-16 md:h-20 duration-400',
            isDark ? 'stroke-pink-500' : 'stroke-indigo-500',
          ]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 19H20M4 5V16H20V5L16 9L12 5L8 9L4 5Z"
          />
        </svg>
        <h2
          :class="[
            'text-base sm:text-lg md:text-xl uppercase font-bold whitespace-nowrap',
            isDark ? 'text-pink-500' : 'text-indigo-600',
          ]"
        >
          Queen pc
        </h2>
      </div>

      <div class="flex flex-wrap items-center gap-2 sm:gap-4">
        <div @click="toggleTheme" class="cursor-pointer hover:scale-110 transition-transform">
          <sswitch></sswitch>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
          <div
            @click.stop="() => emit('openDrawer')"
            :class="[
              'h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base md:text-lg hover:scale-105 duration-300 shadow-lg gap-2 cursor-pointer flex items-center rounded-xl transition-all',
              isDark
                ? 'bg-neutral-900 text-pink-500 hover:bg-neutral-600'
                : 'bg-white text-indigo-500 hover:bg-gray-50',
            ]"
          >
            <span class="hidden sm:inline">Корзина</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 sm:size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>

          <router-link to="/favorites">
            <div
              :class="[
                'h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base md:text-lg hover:scale-105 duration-300 shadow-lg gap-2 cursor-pointer flex items-center rounded-xl transition-all',
                isDark
                  ? 'bg-neutral-900 text-pink-500 hover:bg-neutral-600'
                  : 'bg-white text-indigo-500 hover:bg-gray-50',
              ]"
            >
              <span class="hidden sm:inline">Избранное</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5 sm:size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
          </router-link>

          <router-link to="/profile">
            <div
              :class="[
                'h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base md:text-lg hover:scale-105 duration-300 shadow-lg gap-2 cursor-pointer flex items-center rounded-xl transition-all',
                isDark
                  ? 'bg-neutral-900 text-pink-500 hover:bg-neutral-600'
                  : 'bg-white text-indigo-500 hover:bg-gray-50',
              ]"
            >
              <span class="hidden sm:inline">Профиль</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5 sm:size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          </router-link>

          <router-link v-if="!isLoggedIn" to="/reg">
            <div
              class="bg-indigo-500 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base rounded-xl flex items-center justify-center font-semibold text-white shadow-xl cursor-pointer hover:bg-indigo-600 hover:scale-105 transition-all"
            >
              Sign Up
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Стили теперь scoped, чтобы не ломать другие страницы */
header {
  z-index: 50;
  position: relative;
}
</style>
