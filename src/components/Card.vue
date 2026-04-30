<script setup lang="ts">
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

// 1. Исправляем inject: добавляем дефолтное значение, чтобы избежать undefined
const theme = inject('theme', { isDark: ref(false) }) as any
const isDark = theme.isDark

// 2. Явно описываем пропсы для TS
interface Props {
  id: number | string
  title?: string
  category: string
  imageUrl?: string
  price?: number
  isFavorite?: boolean
  isAdded?: boolean
  onClickFavorite?: () => void // Уточняем, что это функция
  onClickAdd?: () => void
}

const props = defineProps<Props>()

const router = useRouter()

const goToProduct = () => {
  if (props.id && props.category) {
    const cleanCategory = props.category.toLowerCase()

    // Определяем папку для роутинга
    let catFolder = ''

    if (cleanCategory.includes('проц')) {
      catFolder = 'cpu'
    } else if (cleanCategory.includes('видеокар')) {
      catFolder = 'gpu'
    } else if (cleanCategory.includes('озу')) {
      catFolder = 'memory_ozu'
    } else if (cleanCategory.includes('накопител')) {
      catFolder = 'memory'
    } else {
      catFolder = 'motherboard'
    }

    router.push(`/product/${catFolder}/${props.id}`)
  } else {
    console.warn('Невозможно перейти: отсутствует id или category', props)
  }
}
</script>

<template>
  <div class="group p-1">
    <div
      @click="goToProduct"
      :class="[
        'relative rounded-md sm:rounded-md p-4 sm:p-3 md:p-10 cursor-pointer shadow-xl transition-all duration-300 ease-in-out transform',
        'group-hover:-translate-y-2 group-hover:shadow-2xl border-1',
        'will-change-transform backface-hidden',
        isDark ? 'bg-neutral-800 border-pink-600/20' : 'bg-white border-indigo-600/20',
      ]"
    >
      <div
        v-if="props.onClickFavorite"
        @click.stop="props.onClickFavorite()"
        class="absolute top-5 left-5 z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          :class="[
            'w-7 h-7 sm:w-8 sm:h-8 cursor-pointer duration-300 transition-all',
            isFavorite ? 'fill-current' : 'fill-none',
            isDark
              ? isFavorite
                ? 'text-pink-500'
                : 'text-neutral-400 hover:text-pink-500'
              : isFavorite
                ? 'text-indigo-500'
                : 'text-neutral-400 hover:text-indigo-500',
          ]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      </div>

      <img
        :src="props.imageUrl"
        alt="Product Image"
        loading="lazy"
        class="rounded-2xl sm:rounded-3xl justify-self-center h-40 sm:h-56 md:h-64 lg:h-70 w-full max-w-[360px] object-contain mx-auto"
      />

      <p
        :class="[
          'text-base sm:text-lg md:text-xl font-semibold mt-3 sm:mt-4 transition-colors line-clamp-2 min-h-[2.5em]',
          isDark ? 'text-pink-500' : 'text-indigo-600',
        ]"
      >
        {{ title }}
      </p>

      <div class="flex justify-between items-center pt-3 sm:pt-4 gap-2">
        <div class="flex flex-col min-w-0">
          <span :class="['text-xs sm:text-sm', isDark ? 'text-gray-400' : 'text-slate-400']"
            >Цена:</span
          >
          <b
            :class="[
              'text-base sm:text-lg md:text-xl truncate',
              isDark ? 'text-white' : 'text-slate-700',
            ]"
            >{{ price }} руб.</b
          >
        </div>

        <div
          v-if="props.onClickAdd"
          @click.stop="props.onClickAdd()"
          class="relative group shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.8"
            stroke="currentColor"
            :class="[
              'w-9 h-9 sm:w-11 sm:h-11 p-2 rounded-full cursor-pointer duration-300 ease-in-out shadow-md',
              isDark
                ? isAdded
                  ? 'bg-neutral-800 border-1 border-pink-500 text-pink-500 shadow-pink-700/50'
                  : 'bg-neutral-800 border border-neutral-500 text-white hover:border-pink-500 hover:text-pink-500'
                : isAdded
                  ? 'bg-white border-1 border-indigo-400 text-indigo-500 shadow-indigo-200/50'
                  : 'bg-white border border-neutral-200 text-neutral-400 hover:border-indigo-500 hover:text-indigo-500',
            ]"
          >
            <path
              v-if="isAdded"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
