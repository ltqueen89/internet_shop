<script setup>
import Card from './Card.vue'

defineProps({
  items: Array,
  isFavorites: Boolean,
})

defineEmits(['addToFavorite', 'addToCart'])
</script>

<template>
  <div
    class="grid p-3 sm:p-5 gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    v-auto-animate="{ duration: 700 }"
  >
    <Card
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.name"
      :category="item.category"
      :image-url="item.imageUrl"
      :price="item.price"
      :is-added="item.isAdded"
      :is-favorite="item.isFavorite"
      :onClickAdd="() => $emit('addToCart', item)"
      :onClickFavorite="() => $emit('addToFavorite', item)"
    />
  </div>
</template>
