<script setup>
import DrawerHead from './DrawerHead.vue'
import CartItemList from './CartItemList.vue'
import { inject } from 'vue'

const { isDark } = inject('theme')
const { closeDrawer } = inject('cart')

const emit = defineEmits(['createOrder'])

defineProps({
  totalPrice: Number,
  buttonDisabled: Boolean,
  // Эти пропсы можно использовать для отображения статуса заказа (например, "Заказ оформлен")
  title: String,
  description: String,
  imageUrl: String,
})
</script>

<template>
  <div class="fixed inset-0 z-[100]">
    <Transition name="fade">
      <div 
        @click="closeDrawer" 
        class="absolute inset-0 bg-black/70"
      ></div>
    </Transition>

    <Transition name="slide">
      <div
        :class="[
          'absolute right-0 top-0 h-full w-96 z-[110] p-8 shadow-2xl flex flex-col transition-colors duration-300',
          isDark ? 'bg-neutral-900 text-white' : 'bg-white text-black',
        ]"
      >
        <DrawerHead />

        <div v-if="!totalPrice" class="flex flex-1 flex-col items-center justify-center text-center">
          <img class="h-32 w-32 mb-4" src="/src/assets/package-icon.png" alt="Empty cart" />
          <h1 class="text-xl font-bold mb-2" :class="[isDark ? 'text-pink-500' : 'text-black']">
            {{ title || 'Корзина пуста' }}
          </h1>
          <p class="text-gray-500">{{ description || 'Добавьте хотя бы один товар, чтобы сделать заказ.' }}</p>
        </div>

        <div v-else class="flex flex-col flex-1 justify-between mt-5 overflow-hidden">
          <div class="overflow-y-auto flex-1 pr-2">
            <CartItemList />
          </div>

          <div class="mt-auto pt-5">
            <div class="flex items-end gap-2 mb-4">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-700'">Итого:</span>
              <div :class="['flex-1 border-b border-dashed mb-1.5', isDark ? 'border-gray-700' : 'border-gray-200']"></div>
              <b :class="['text-xl font-bold', isDark ? 'text-pink-500' : 'text-lime-600']">
                {{ totalPrice.toLocaleString() }} ₽
              </b>
            </div>

            <button 
              :disabled="buttonDisabled"
              @click="() => emit('createOrder')"
              :class="[
                'w-full py-4 rounded-2xl text-lg font-bold transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed',
                isDark
                  ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-lime-500 hover:bg-lime-600 text-white shadow-lg shadow-lime-500/20',
              ]"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Анимация появления фона (Fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Анимация выезда корзины (Slide) */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Убираем старые ручные анимации, так как Transition делает всё сам */
</style>