import './assets/main.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Headerr from './components/Headerr.vue'
import Registrations from './pages/Registrations.vue'
import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'
import { initializeApp } from 'firebase/app'
import Profile from './pages/Profile.vue'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth' // Добавьте этот импорт
import { getFirestore } from 'firebase/firestore'
// ... ваш firebaseConfig ...
import CardInfo from './components/CardInfo.vue' // Проверь, чтобы путь был верным

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
export const auth = getAuth(firebaseApp) // Экспортируйте auth для использования в компонентах
// 2. Создаем Vue приложение (называем переменную vueApp, чтобы не путаться)
const vueApp = createApp(App)
export const db = getFirestore(firebaseApp)
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/favorites', name: 'Favorites', component: Favorites },
  { path: '/header', name: 'Header', component: Headerr },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/reg', name: 'register', component: Registrations },
  { path: '/product/:category/:id', name: 'ProductDetails', component: CardInfo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

vueApp.use(router)
vueApp.use(autoAnimatePlugin)
vueApp.mount('#app')

export default router
