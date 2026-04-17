<template>
  <div>
    <button
      @click="$router.back()"
      class="mb-6 pt-15 pl-15 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
    >
      <span>←</span> Назад к списку
    </button>
    <div class="flex justify-center">
      <div
        :class="[
          'min-h-120 max-h-400 min-w-300 max-w-400 !mt-15 place-content-center transition-colors duration-400 rounded-xl',
          isDark ? 'bg-neutral-800 text-white' : 'bg-neutral-300 text-black',
        ]"
      >
        <div v-if="loading" class="text-center py-20">
          <h2 class="text-2xl font-bold animate-pulse">Загрузка характеристик...</h2>
        </div>

        <div
          v-else-if="product"
          class="items-center max-w-6xl !mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          <div class="flex justify-center items-center p-1 max-w-100">
            <img :src="product.imageUrl" class="max-w-80 object-contain" alt="product image" />
          </div>

          <div class="flex flex-col">
            <h1 class="text-4xl font-black mb-4 uppercase">{{ product.name || product.title }}</h1>

            <div class="border-t border-gray-500/20 pt-6 pb-6">
              <h3 class="text-sm uppercase tracking-widest opacity-50 mb-4 font-bold">
                Характеристики и описание
              </h3>
              <p class="mb-5">{{ product.description }}</p>

              <div
                v-for="spec in product.specs"
                :key="spec.label"
                class="flex justify-between py-2 border-b"
              >
                <span class="text-gray-400">{{ spec.label }}</span>
                <span class="!font-bold">{{ spec.value }}</span>
              </div>
            </div>
            <div class="flex !justify-between">
              <p
                :class="[
                  'text-3xl flex !items-center mb-8',
                  isDark ? 'text-pink-500' : 'text-lime-600',
                ]"
              >
                {{ product.price?.toLocaleString() }} руб.
              </p>
              <button
                @click="toggleButton"
                :class="[
                  '!mt-auto w-60 py-6 font-black rounded-2xl shadow-lg transform active:scale-95 transition-all uppercase tracking-widest',
                  isActive
                    ? 'bg-neutral-200/20 text-black hover:bg-neutral-300/20'
                    : 'bg-pink-500 text-white',
                ]"
              >
                {{ isActive ? 'Добавлено' : 'Добавить' }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20">
          <h2 class="text-2xl font-bold text-red-500">Товар не найден</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const loading = ref(true)
const product = ref<any>(null)

const isActive = ref(false)

const theme = inject<any>('theme')
const isDark = computed(() => theme?.isDark?.value || false)
const cartActions = inject<any>('cart')

const toggleButton = () => {

  isActive.value = !isActive.value

  if (isActive.value) {

    if (cartActions && cartActions.addToCart) {
      cartActions.addToCart(product.value)
    }
  } else {

    if (cartActions && cartActions.removeFromCart) {
      cartActions.removeFromCart(product.value)
    }
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

    const { data } = await axios.get(`https://d34e000f87467eb3.mokky.dev/${category}/${id}`)

    const fetchedProduct = data

    if (fetchedProduct && !fetchedProduct.specs) {
      if (category === 'cpu') {
        fetchedProduct.specs = [
          { label: 'Ядер', value: data.core_count || 'Н/Д' },
          { label: 'Частота', value: data.core_clock ? `${data.core_clock} ГГц` : '—' },
          { label: 'TDP', value: data.tdp ? `${data.tdp} Вт` : '—' },
        ]
      } else if (category === 'motherboard') {
        fetchedProduct.specs = [
          { label: 'Сокет', value: data.socket || 'Н/Д' },
          { label: 'Чипсет', value: data.chipset || 'Н/Д' },
          { label: 'Форм-фактор', value: data.form_factor || 'Н/Д' },
        ]
      } else if (category === 'gpu' || category === 'videocards') {
        // Добавляем обработку видеокарт
        fetchedProduct.specs = [
          { label: 'Чипсет', value: data.chipset || 'Н/Д' },
          { label: 'Объем памяти', value: data.memory ? `${data.memory} ГБ` : 'Н/Д' },
          { label: 'Частота (Boost)', value: data.boost_clock ? `${data.boost_clock} МГц` : '—' },
          { label: 'Длина', value: data.length ? `${data.length} мм` : '—' },
          { label: 'Цвет', value: data.color || 'Н/Д' },
        ]
      }
    }
    product.value = fetchedProduct
  } catch (err) {
    console.error('Ошибка при загрузке товара:', err)
    product.value = null // Чтобы сработал v-else в шаблоне
  } finally {
    loading.value = false
  }
}
onMounted(fetchProduct)
</script>
