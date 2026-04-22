import './assets/main.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Registrations from './pages/Registrations.vue'
import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'
import { initializeApp } from 'firebase/app'
import Profile from './pages/Profile.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import CardInfo from './components/CardInfo.vue'

const firebaseConfig = {
  apiKey: 'AIzaSyCEC0FepihNhfvnNLpIe1CCD7OLEhD9dBs',
  authDomain: 'authqueenpc.firebaseapp.com',
  projectId: 'authqueenpc',
  storageBucket: 'authqueenpc.firebasestorage.app',
  messagingSenderId: '631542581552',
  appId: '1:631542581552:web:c3ed3b6686f1bce7e7a0f5',
  measurementId: 'G-8X8PJ3Y4LS',
}

const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

const vueApp = createApp(App)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  { path: '/reg', name: 'register', component: Registrations },
  { path: '/product/:category/:id', name: 'ProductDetails', component: CardInfo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Дожидаемся первой проверки авторизации Firebase, чтобы route guard
// не редиректил пользователя до того, как Firebase восстановит сессию.
const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      () => {
        unsubscribe()
        resolve(null)
      },
    )
  })

router.beforeEach(async (to) => {
  if (to.meta?.requiresAuth) {
    const user = await getCurrentUser()
    if (!user) {
      return { path: '/reg', query: { redirect: to.fullPath } }
    }
  }
  return true
})

vueApp.use(router)
vueApp.use(autoAnimatePlugin)
vueApp.mount('#app')
