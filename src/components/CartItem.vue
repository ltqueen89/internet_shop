<script setup>
import { inject } from 'vue'
const { isDark } = inject('theme') 
const emit = defineEmits(['onClickRemove'])

defineProps({
  id: Number,
  title: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function,
})
</script>

<template>
  <div :class="['flex items-center border p-4 rounded-xl gap-4 transition-colors', isDark ? 'border-neutral-700 bg-neutral-800' : 'border-slate-200 bg-white']">
    <img class="w-16 h-16 object-contain" :src="imageUrl" :alt="title" />

    <div class="flex flex-col justify-between flex-1">
      <p :class="['pl-1 font-medium', isDark ? 'text-white' : 'text-black']">{{ title }}</p>

      <div class="flex justify-between items-center mt-2">
        <b :class="['pl-1', isDark ? 'text-pink-500' : 'text-black']">{{ price }} ₽</b>
        <img
          @click="emit('onClickRemove')"
          class="opacity-50 cursor-pointer transition hover:opacity-100 hover:scale-110"
          src="/src/assets/close.svg"
          alt="close"
        />
      </div>
    </div>
  </div>
</template>
