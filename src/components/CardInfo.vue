<template>
  <div class="px-3 min-h-206 sm:px-4">
    <button
      type="button"
      @click="$router.back()"
      class="mb-4 sm:mb-6 pt-3 sm:pt-[15px] pl-1 sm:pl-[15px] flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
      :class="['', isDark ? 'text-neutral-200' : 'text-neutral-600']"
      aria-label="Назад к списку"
    >
      <span>←</span> Назад к списку
    </button>
    <div class="flex justify-center">
      <div
        :class="[
          'w-full max-w-[900px] mt-2 sm:mt-[15px] place-content-center transition-colors duration-300 rounded-xl',
          isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-300 text-black',
        ]"
      >
        <div v-if="loading" class="text-center py-16 sm:py-20 px-4">
          <h2 class="text-xl sm:text-2xl font-bold animate-pulse">Загрузка характеристик...</h2>
        </div>

        <div
          v-else-if="product"
          class="items-center max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-4 sm:p-6"
        >
          <div class="flex justify-center items-center p-1">
            <img
              :src="product.imageUrl"
              class="max-w-[260px] sm:max-w-[320px] w-full object-contain"
              alt="product image"
            />
          </div>

          <div class="flex flex-col">
            <h1
              class="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 uppercase break-words"
            >
              {{ product.name || product.title }}
            </h1>

            <div class="border-t border-gray-500/20 pt-4 sm:pt-6 pb-4 sm:pb-6">
              <h3
                class="text-xs sm:text-sm uppercase tracking-widest opacity-50 mb-3 sm:mb-4 font-bold"
              >
                Характеристики и описание
              </h3>
              <p class="mb-4 sm:mb-5 text-sm sm:text-base">{{ product.description }}</p>

              <div
                v-for="spec in product.specs"
                :key="spec.label"
                class="flex justify-between py-2 border-b border-gray-500/20 text-sm sm:text-base gap-3"
              >
                <span class="text-gray-400">{{ spec.label }}</span>
                <span class="font-bold text-right">{{ spec.value }}</span>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p
                :class="[
                  'text-2xl sm:text-3xl flex items-center mb-2 sm:mb-8',
                  isDark ? 'text-pink-500' : 'text-indigo-600',
                ]"
              >
                {{ formattedPrice }}
              </p>
              <button
                type="button"
                @click="toggleButton"
                :aria-pressed="isActive"
                aria-label="Добавить товар в корзину"
                :class="[
                  'w-full sm:w-60 py-4 sm:py-6 font-black rounded-2xl shadow-lg transform active:scale-95 transition-all uppercase tracking-widest text-sm sm:text-base',
                  isActive
                    ? '!bg-neutral-200/20 text-black hover:bg-neutral-300/20'
                    : ' text-white',
                  isDark ? 'bg-pink-500' : 'bg-indigo-600',
                ]"
              >
                {{ isActive ? 'Добавлено' : 'Добавить' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 sm:py-20 px-4">
          <h2 class="text-xl sm:text-2xl font-bold text-red-500">Товар не найден</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

interface Spec {
  label: string
  value: string | number
}

interface Product {
  id: number | string
  name?: string
  title?: string
  description?: string
  imageUrl?: string
  price?: number
  specs?: Spec[]
  [key: string]: unknown
}

interface ThemeApi {
  isDark: Ref<boolean>
  toggleTheme: () => void
}

interface CartApi {
  cart: Ref<Product[]>
  addToCart: (item: Product) => void
  removeFromCart: (item: Product) => void
}

const route = useRoute()
const loading = ref(true)
const product = ref<Product | null>(null)

const theme = inject<ThemeApi>('theme')
const isDark = computed(() => theme?.isDark.value ?? false)
const cartActions = inject<CartApi>('cart')

const formattedPrice = computed(() =>
  typeof product.value?.price === 'number'
    ? `${product.value.price.toLocaleString()} руб.`
    : '— руб.',
)

const isActive = computed<boolean>(() => {
  if (!product.value || !cartActions) return false
  return cartActions.cart.value.some((c) => c.id === product.value!.id)
})

const toggleButton = () => {
  if (!product.value || !cartActions) return

  if (isActive.value) {
    cartActions.removeFromCart(product.value)
  } else {
    cartActions.addToCart(product.value)
  }
}

const fetchProduct = async () => {
  try {
    loading.value = true

    const category = route.params.category as string
    const id = route.params.id as string

    if (!category || !id) {
      throw new Error('Некорректные параметры в URL')
    }

    const { data } = await axios.get<Product>(
      `https://d34e000f87467eb3.mokky.dev/${category}/${id}`,
    )

    const fetchedProduct: Product = data

    if (fetchedProduct && !fetchedProduct.specs) {
      if (category === 'cpu') {
        fetchedProduct.specs = [
          { label: 'Ядер', value: (data as any).core_count || 'Н/Д' },
          {
            label: 'Частота',
            value: (data as any).core_clock ? `${(data as any).core_clock} ГГц` : '—',
          },
          { label: 'TDP', value: (data as any).tdp ? `${(data as any).tdp} Вт` : '—' },
        ]
      } else if (category === 'motherboard') {
        fetchedProduct.specs = [
          { label: 'Сокет', value: (data as any).socket || 'Н/Д' },
          { label: 'Чипсет', value: (data as any).chipset || 'Н/Д' },
          { label: 'Форм-фактор', value: (data as any).form_factor || 'Н/Д' },
          {
            label: 'Макс. память',
            value: (data as any).max_memory ? `${(data as any).max_memory} ГБ` : 'Н/Д',
          },
          {
            label: 'Слотов памяти',
            value: (data as any).memory_slots ?? 'Н/Д',
          },
        ]
      } else if (category === 'gpu' || category === 'videocards') {
        fetchedProduct.specs = [
          { label: 'Чипсет', value: (data as any).chipset || 'Н/Д' },
          {
            label: 'Объем памяти',
            value: (data as any).memory ? `${(data as any).memory} ГБ` : 'Н/Д',
          },
          {
            label: 'Частота (Boost)',
            value: (data as any).boost_clock ? `${(data as any).boost_clock} МГц` : '—',
          },
          { label: 'Длина', value: (data as any).length ? `${(data as any).length} мм` : '—' },
          { label: 'Цвет', value: (data as any).color || 'Н/Д' },
        ]
      } else if (category === 'memory_ozu') {
        const d = data as any
        const modules = d.modules ? `${d.modules[0]}x${d.modules[1]} ГБ` : 'Н/Д'
        const speed = d.speed ? `DDR${d.speed[0]} ${d.speed[1]} МГц` : 'Н/Д'
        fetchedProduct.specs = [
          { label: 'Скорость', value: speed },
          { label: 'Модули', value: modules },
          { label: 'CAS Latency', value: d.cas_latency ?? 'Н/Д' },
          {
            label: 'First Word Latency',
            value: d.first_word_latency ? `${d.first_word_latency} нс` : 'Н/Д',
          },
          { label: 'Цвет', value: d.color || 'Н/Д' },
        ]
      } else if (category === 'memory') {
        const d = data as any
        fetchedProduct.specs = [
          { label: 'Ёмкость', value: d.capacity ? `${d.capacity} ГБ` : 'Н/Д' },
          { label: 'Тип', value: d.type || 'Н/Д' },
          { label: 'Форм-фактор', value: d.form_factor || 'Н/Д' },
          { label: 'Интерфейс', value: d.interface || 'Н/Д' },
          { label: 'Кэш', value: d.cache ? `${d.cache} МБ` : 'Н/Д' },
          { label: 'Цена за ГБ', value: d.price_per_gb ? `${d.price_per_gb} руб.` : 'Н/Д' },
        ]
      }
    }
    product.value = fetchedProduct
  } catch (err) {
    console.error('Ошибка при загрузке товара:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)

watch(
  () => [route.params.category, route.params.id],
  ([cat, id], [oldCat, oldId]) => {
    if (cat !== oldCat || id !== oldId) {
      fetchProduct()
    }
  },
)
</script>
