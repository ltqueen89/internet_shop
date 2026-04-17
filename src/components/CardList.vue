<script setup>
import Card from './Card.vue'

defineProps({
  items: Array,
  addToFavorite: Function,
  isFavorites: Boolean,
})

const emit = defineEmits(['addToFavorite', 'addToCart'])
</script>

<template>
  <div class="grid p-5 !grid-cols-5 !gap-5" v-auto-animate="{ duration: 700 }">
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
