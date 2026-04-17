<script setup>
defineProps({
  title: String,
  description: String,
  imageUrl: String,
})
</script>

<template>
  <div class="flex flex-col items-center text-center !mx-auto">
    <img height="80" width="80" :src="imageUrl" alt="Info Image" />
    <h2 class="!mt-2 text-2xl font-semibold text-black">{{ title }}</h2>
    <p class="text-gray-400 !mt-2">{{ description }}</p>
  </div>
</template>
