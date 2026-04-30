<script setup>
import { ref, watch, provide, onMounted, computed } from 'vue'
import Headerr from './components/Headerr.vue'
import Drawer from './components/Drawer.vue'
import { useRoute } from 'vue-router'
import { db, auth } from './main'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const cart = ref([])
const drawerOpen = ref(false)
const isCreatingOrder = ref(false)
const route = useRoute()
const isHeaderVisible = computed(() => route.path !== '/reg')
const isDark = ref(false)

const applyTheme = (dark) => {
  isDark.value = dark
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  if (dark) {
    document.body.classList.add('dark-theme')
    document.body.classList.remove('light-theme')
  } else {
    document.body.classList.add('light-theme')
    document.body.classList.remove('dark-theme')
  }
}

const toggleTheme = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark)
})

provide('theme', {
  isDark,
  toggleTheme,
})

try {
  const savedCart = localStorage.getItem('cart')
  if (savedCart && savedCart !== 'undefined') {
    const parsed = JSON.parse(savedCart)
    if (Array.isArray(parsed)) cart.value = parsed
  }
} catch (err) {
  console.error('Не удалось восстановить корзину из localStorage:', err)
  localStorage.removeItem('cart')
}

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const cartIsEmpty = computed(() => cart.value.length === 0)
const cartButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const closeDrawer = () => {
  drawerOpen.value = false
}
const openDrawer = () => {
  drawerOpen.value = true
}

const removeFromCart = (item) => {
  const index = cart.value.findIndex((cartItem) => cartItem.id === item.id)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

const addToCart = (item) => {
  const index = cart.value.findIndex((i) => i.id === item.id)
  if (index === -1) {
    cart.value.push(item)
  }
}

const createOrder = async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт, чтобы оформить заказ.')
      return
    }

    isCreatingOrder.value = true

    const orderData = {
      userId: user.uid,
      userEmail: user.email,
      items: cart.value,
      totalPrice: totalPrice.value,
      createdAt: serverTimestamp(),
      status: 'pending',
    }

    const docRef = await addDoc(collection(db, 'orders'), orderData)
    alert(`Заказ успешно оформлен! Номер заказа: ${docRef.id}`)

    cart.value = []
    closeDrawer()
  } catch (err) {
    console.error('Ошибка при создании заказа в Firebase:', err)
    alert('Произошла ошибка при оформлении.')
  } finally {
    isCreatingOrder.value = false
  }
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true },
)

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
})
</script>

<template>
  <div :class="[' transition-colors duration-400', isDark ? 'bg-neutral-900' : 'bg-neutral-200']">
    <Headerr v-if="isHeaderVisible" @open-drawer="openDrawer" />

    <div>
      <Transition name="cart-anim">
        <Drawer
          v-if="drawerOpen"
          :total-price="totalPrice"
          @create-order="createOrder"
          @close-drawer="closeDrawer"
          :button-disabled="cartButtonDisabled"
        />
      </Transition>

      <router-view />
    </div>
  </div>
</template>

<style>
.cart-anim-enter-active,
.cart-anim-leave-active {
  transition: all 0.3s ease;
}

.cart-anim-enter-from,
.cart-anim-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Global scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}

.dark-theme ::-webkit-scrollbar-thumb,
.dark-theme::-webkit-scrollbar-thumb {
  background: #db2777;
  border-radius: 20px;
}
.light-theme ::-webkit-scrollbar-thumb,
.light-theme::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  filter: brightness(1.2);
}

.dark-theme {
  scrollbar-width: thin;
  scrollbar-color: #db2777 transparent;
}
.light-theme {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 transparent;
}

/* Scoped scrollbar classes for components */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-dark::-webkit-scrollbar-thumb {
  background: #db2777;
  border-radius: 20px;
}
.scrollbar-light::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  filter: brightness(1.2);
}
.scrollbar-dark {
  scrollbar-width: thin;
  scrollbar-color: #db2777 transparent;
}
.scrollbar-light {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 transparent;
}
</style>
