<script setup>
import { inject } from 'vue'
const { isDark } = inject('theme')
const { closeDrawer } = inject('cart')
</script>

<template>
  <div class="flex items-center gap-5 !mb-5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      @click="closeDrawer"
      class="size-6"
      :class="['hover:scale-105 ', isDark ? 'stroke-pink-500' : 'stroke-indigo-500']"
    >
      <path
        fill-rule="evenodd"
        d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
        clip-rule="evenodd"
      />
    </svg>

    <h2>
      <p :class="['!font-bold text-2xl', isDark ? 'text-pink-500' : 'text-black']">Корзина</p>
    </h2>
  </div>
</template>
