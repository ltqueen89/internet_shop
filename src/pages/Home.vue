<script setup>
import { reactive, watch, ref, onMounted, computed } from 'vue'
import { inject } from 'vue'
import CardList from '../components/CardList.vue'
import axios from 'axios'

const { isDark } = inject('theme')
const { cart, addToCart, removeFromCart } = inject('cart')

const items = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

const filters = reactive({
  sortBy: 'name',
  searchQuery: '',
  category: '',
})

// Список твоих эндпоинтов
const endpoints = {
  Процессоры: 'https://d34e000f87467eb3.mokky.dev/cpu',
  Платы: 'https://d34e000f87467eb3.mokky.dev/motherboard',
  Видеокарты: 'https://d34e000f87467eb3.mokky.dev/gpu',
}

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return items.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage))

const onChangeCategory = (cat) => {
  filters.category = cat
  currentPage.value = 1
}

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
    item.isAdded = true
  } else {
    removeFromCart(item)
    item.isAdded = false
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value
  currentPage.value = 1
}

const addToFavorite = async (item) => {
  const wasFavorite = !!item.isFavorite
  const prevFavoriteId = item.favoriteId
  try {
    if (!wasFavorite) {
      // Оптимистично помечаем как избранное, откатываем при ошибке.
      item.isFavorite = true
      const { data } = await axios.post('https://d34e000f87467eb3.mokky.dev/favorites', {
        item_id: item.id,
        item,
      })
      item.favoriteId = data.id
    } else {
      if (!prevFavoriteId) {
        item.isFavorite = false
        return
      }
      item.isFavorite = false
      await axios.delete(`https://d34e000f87467eb3.mokky.dev/favorites/${prevFavoriteId}`)
      item.favoriteId = null
    }
  } catch (err) {
    console.error('Ошибка при обновлении избранного:', err)
    // Откат
    item.isFavorite = wasFavorite
    item.favoriteId = prevFavoriteId
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://d34e000f87467eb3.mokky.dev/favorites`)
    items.value = items.value.map((item) => {
      const favorite = favorites.find((f) => f.item_id === item.id)
      if (!favorite) return item
      return { ...item, isFavorite: true, favoriteId: favorite.id }
    })
  } catch (err) {
    console.log(err)
  }
}

const fetchItems = async () => {
  try {
    let combinedData = []

    if (filters.category) {
      if (endpoints[filters.category]) {
        const { data } = await axios.get(endpoints[filters.category])
        combinedData = data
      } else {
        combinedData = []
      }
    } else {
      const requests = Object.values(endpoints).map((url) => axios.get(url))
      const responses = await Promise.all(requests)
      combinedData = responses.flatMap((res) => res.data)
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      combinedData = combinedData.filter((item) => (item.name ?? '').toLowerCase().includes(q))
    }

    // ИСПРАВЛЕННАЯ СОРТИРОВКА
    combinedData.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return (a.name ?? '').localeCompare(b.name ?? '')
      }

      // Преобразуем в числа на случай, если в JSON пришла строка
      const priceA = Number(a.price) || 0
      const priceB = Number(b.price) || 0

      if (filters.sortBy === 'price') {
        return priceA - priceB // От дешевых к дорогим
      }
      if (filters.sortBy === '-price') {
        return priceB - priceA // От дорогих к дешевым
      }
      return 0
    })

    items.value = combinedData.map((item) => ({
      ...item,
      isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
    }))

    await fetchFavorites()
  } catch (err) {
    console.log('Ошибка загрузки:', err)
    items.value = []
  }
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(async () => {
  await fetchItems()
})

watch(
  cart,
  () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
    }))
  },
  { deep: true },
)

// Debounce для fetchItems, чтобы поиск/фильтры не спамили API на каждый символ.
let fetchDebounceId = null
const debouncedFetchItems = () => {
  if (fetchDebounceId) clearTimeout(fetchDebounceId)
  fetchDebounceId = setTimeout(() => {
    fetchDebounceId = null
    fetchItems()
  }, 300)
}

watch(filters, debouncedFetchItems)
</script>

<template>
  <div
    class="w-full grid grid-cols-1 md:grid-cols-3 items-start pt-4 sm:pt-8 px-3 sm:px-6 md:px-10 gap-4 transition-all duration-400"
  >
    <h2
      :class="[
        'text-2xl sm:text-3xl font-bold uppercase transition-colors text-center md:text-left',
        isDark ? 'text-pink-600' : 'text-lime-600',
      ]"
    >
      {{ filters.category ? filters.category : 'Все комплектующие' }}
    </h2>

    <div class="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-self-center md:!mt-[-32px]">
      <div
        @click="onChangeCategory('')"
        :class="[
          'h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base content-center text-center rounded-lg md:rounded-b-lg md:rounded-t-none shadow-sm cursor-pointer transition-all duration-300',
          filters.category === ''
            ? isDark
              ? 'bg-pink-600 text-white'
              : 'bg-lime-500 text-white'
            : isDark
              ? 'bg-neutral-800 text-pink-500 '
              : 'bg-lime-300 text-white',
        ]"
      >
        Все
      </div>

      <div
        v-for="cat in [
          'Процессоры',
          'Видеокарты',
          'Платы',
          'ОЗУ',
          'Накопители',
          'Охлаждение',
          'БП',
          'Корпуса',
        ]"
        :key="cat"
        @click="onChangeCategory(cat)"
        :class="[
          'h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base content-center text-center rounded-lg md:rounded-b-lg md:rounded-t-none shadow-sm cursor-pointer transition-all duration-300 font-bold',
          filters.category === cat
            ? isDark
              ? 'bg-pink-600 text-white'
              : 'bg-lime-500 text-white'
            : isDark
              ? 'bg-neutral-800 text-pink-500'
              : 'bg-lime-300 text-white',
        ]"
      >
        {{ cat }}
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto md:justify-self-end">
      <select
        @change="onChangeSelect"
        aria-label="Сортировка"
        :class="[
          'border-1 font-semibold rounded-xl py-2 px-4 outline-none transition-all duration-300 w-full sm:w-auto',
          isDark
            ? 'bg-neutral-800 border-pink-700 text-pink-500 focus:border-pink-500'
            : 'bg-white border-lime-400 text-lime-600 focus:border-lime-500',
        ]"
      >
        <option value="name">По названию</option>
        <option value="-price">Сначала дорогие</option>
        <option value="price">Сначала дешевые</option>
      </select>

      <div class="relative w-full">
        <svg
          :class="['h-11 w-8 pl-3 absolute z-10', isDark ? 'stroke-pink-500' : 'stroke-lime-500']"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          @input="onChangeSearchInput"
          type="text"
          placeholder="Поиск деталей..."
          aria-label="Поиск деталей"
          :class="[
            'border-1 rounded-xl py-2 pl-10 pr-4  outline-none font-semibold transition-all duration-300 w-full',
            isDark
              ? 'bg-neutral-800 border-pink-700 text-white placeholder-gray-500 focus:border-pink-500'
              : 'bg-white border-lime-400 text-gray-700 placeholder-gray-400 focus:border-lime-500',
          ]"
        />
      </div>
    </div>
  </div>

  <div class="px-3 sm:px-6 md:px-10 mt-6 sm:mt-10">
    <CardList
      :items="paginatedItems"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddPlus"
    />

    <div v-if="totalPages > 1" class="flex justify-center items-center !pb-5 gap-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        :class="[
          'px-4 py-2 rounded-xl font-bold transition-all',
          isDark
            ? 'bg-neutral-800 text-pink-500 disabled:opacity-30'
            : 'bg-lime-200 text-lime-700 disabled:opacity-50',
        ]"
      >
        Назад
      </button>

      <span :class="['font-bold', isDark ? 'text-white' : 'text-gray-700']">
        Страница {{ currentPage }} из {{ totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        :class="[
          'px-4 py-2 rounded-xl font-bold transition-all',
          isDark
            ? 'bg-neutral-800 text-pink-500 disabled:opacity-30'
            : 'bg-lime-200 text-lime-700 disabled:opacity-50',
        ]"
      >
        Вперед
      </button>
    </div>
  </div>
</template>
