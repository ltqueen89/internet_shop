import { createRouter, createWebHistory } from 'vue-router'

// 1. Импортируем все необходимые компоненты
import HomeView from '../components/HomeView.vue'
import Registrations from '../components/Registrations.vue'
import CardInfo from '../components/CardInfo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // Теперь на главной будет список товаров
  },
  {
    path: '/reg',
    name: 'register',
    component: Registrations,
  },
  {
    path: '/:category/:id', // Проверьте каждый символ и слеш
    name: 'ProductDetails',
    component: CardInfo,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: { template: '<p>Страница не найдена: {{ $route.path }}</p>' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
