<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import axios from 'axios'
import CardList from '../components/CardList.vue'

const favorites = ref([])

// 1. Получаем глобальные состояния из App.vue
const { isDark } = inject('theme')
const { cart, addToCart, removeFromCart } = inject('cart')

// 2. Функция обработки клика по кнопке корзины
const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
    item.isAdded = true
  } else {
    removeFromCart(item)
    item.isAdded = false
  }
}

// 3. Функция синхронизации избранного с состоянием корзины
const mapFavorites = (items) => {
  return items.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }))
}

// Удаление товара из избранного
const onClickRemoveFavorite = async (item) => {
  if (!item?.favoriteId) {
    favorites.value = favorites.value.filter((f) => f.id !== item.id)
    return
  }
  const prev = favorites.value
  favorites.value = favorites.value.filter((f) => f.id !== item.id)
  try {
    await axios.delete(`https://d34e000f87467eb3.mokky.dev/favorites/${item.favoriteId}`)
  } catch (err) {
    console.error('Не удалось удалить из избранного:', err)
    favorites.value = prev
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://d34e000f87467eb3.mokky.dev/favorites?_relations=items',
    )

    // Превращаем массив связей в массив объектов товаров и помечаем те, что в корзине.
    // Фильтруем записи, у которых связанный товар был удалён.
    const items = data
      .filter((obj) => obj && obj.item)
      .map((obj) => ({
        ...obj.item,
        favoriteId: obj.id,
        isFavorite: true,
      }))
    favorites.value = mapFavorites(items)
  } catch (err) {
    console.error('Не удалось загрузить избранное:', err)
  }
})

// 4. Следим за изменениями корзины, чтобы иконки обновлялись в реальном времени
watch(
  cart,
  () => {
    favorites.value = mapFavorites(favorites.value)
  },
  { deep: true },
)
</script>

<template>
  <h1
    class="flex flex-col md:flex-row text-2xl justify-between items-center pt-8 px-10 gap-4"
    :class="[
      'text-3xl font-bold uppercase transition-colors',
      isDark ? 'text-pink-600' : 'text-lime-500',
    ]"
  >
    Избранное
  </h1>

  <div class="px-10 mt-10">
    <CardList
      :items="favorites"
      is-favorites
      @add-to-cart="onClickAddPlus"
      @add-to-favorite="onClickRemoveFavorite"
    />
  </div>
</template>
