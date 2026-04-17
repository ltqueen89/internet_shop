<template>
  <div
    :class="[
      'min-h-200 sm:p-6 md:p-8 flex flex-col items-center justify-center transition-colors duration-400',
      isDark ? 'bg-neutral-900' : 'bg-neutral-200',
    ]"
  >
    <div class="flex absolute top-40 left-10 p-2 gap-2 w-full max-w-4xl">
      <router-link
        to="/"
        :class="[
          'p-3 rounded-full transition-all hover:scale-110 shadow-lg',
          isDark ? 'bg-neutral-800 text-pink-600' : 'bg-white text-lime-500',
        ]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </router-link>
      <h1
        :class="[
          'text-3xl pt-1 md:text-4xl uppercase tracking-wider',
          isDark ? 'text-neutral-500' : 'text-neutral-600',
        ]"
      >
        Мой Профиль
      </h1>
    </div>

    <div
      :class="[
        'w-full max-w-5xl p-6 md:p-10 rounded-xl shadow-2xl transition-colors duration-300 border-2',
        isDark ? 'bg-neutral-800 border-pink-600' : 'bg-white border-lime-500',
      ]"
    >
      <div
        class="flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 md:gap-12"
      >
        <div class="flex flex-col items-center gap-4 flex-shrink-0">
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          />

          <div
            @click="triggerFileInput"
            :class="[
              'w-32 h-32 md:w-40 md:h-40 rounded-xl flex items-center justify-center border-2 shadow-inner cursor-pointer overflow-hidden group relative transition-transform hover:scale-[1.02]',
              isDark
                ? 'bg-neutral-900 border-pink-600 text-pink-600'
                : 'bg-neutral-100 border-lime-500 text-lime-600',
            ]"
          >
            <img v-if="userPhoto" :src="userPhoto" class="w-full h-full object-cover" />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1"
              stroke="currentColor"
              class="w-16 h-16 md:w-20 md:h-20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <span class="text-white text-xs font-bold text-center px-2">Сменить фото</span>
            </div>
          </div>

          <span
            :class="[
              'text-xs font-mono px-3 py-1 rounded-full',
              isDark ? 'bg-neutral-900 text-gray-400' : 'bg-gray-100 text-gray-500',
            ]"
          >
            UID: {{ userUid || 'Загрузка...' }}
          </span>
        </div>

        <div class="flex-grow w-full flex flex-col gap-5">
          <h2
            :class="[
              'text-2xl font-bold border-b-2 pb-2',
              isDark ? 'text-white border-pink-600' : 'text-gray-800 border-lime-500',
            ]"
          >
            Личные данные
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="flex flex-col gap-1">
              <label :class="['text-sm font-semibold', isDark ? 'text-gray-400' : 'text-gray-600']"
                >Email адрес</label
              >
              <div
                :class="[
                  'px-4 py-3 text-lg border-2 rounded-xl shadow-inner font-medium truncate flex justify-between items-center',
                  isDark
                    ? 'bg-neutral-900 border-pink-600 text-white'
                    : 'bg-gray-50 border-lime-500 text-gray-800',
                ]"
              >
                {{ userEmail || 'email@example.com' }}
                <div>
                  <button
                    v-if="!isEmailVerified && userEmail"
                    @click="handleVerifyEmail"
                    :disabled="verificationSent"
                    :class="[
                      'text-xs font-bold uppercase mt-1 self-start transition-opacity',
                      verificationSent
                        ? 'opacity-50 cursor-default'
                        : 'hover:underline cursor-pointer',
                      isDark ? 'text-pink-400' : 'text-lime-600',
                    ]"
                  >
                    {{ verificationSent ? 'Письмо отправлено' : 'Подтвердить' }}
                  </button>
                </div>
                <svg
                  v-if="isEmailVerified"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label :class="['text-sm font-semibold', isDark ? 'text-gray-400' : 'text-gray-600']"
                >Дата регистрации</label
              >
              <div
                :class="[
                  'px-4 py-3 text-lg border-2 rounded-xl shadow-inner font-medium',
                  isDark
                    ? 'bg-neutral-900 border-pink-600 text-white'
                    : 'bg-gray-50 border-lime-500 text-gray-800',
                ]"
              >
                {{ registrationDate || 'Загрузка...' }}
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label :class="['text-sm font-semibold', isDark ? 'text-gray-400' : 'text-gray-600']"
                >Статус аккаунта</label
              >
              <div
                :class="[
                  'px-4 py-3 text-lg border-2 rounded-xl shadow-inner font-bold flex items-center gap-2',
                  isDark
                    ? 'bg-neutral-900 border-pink-600 text-gray-300'
                    : 'bg-gray-50 border-lime-500 text-gray-600',
                ]"
              >
                <span class="relative flex h-3 w-3">
                  <span
                    :class="[
                      'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                      isDark ? 'bg-pink-500' : 'bg-lime-500',
                    ]"
                  ></span>
                  <span
                    :class="[
                      'relative inline-flex rounded-full h-3 w-3',
                      isDark ? 'bg-pink-500' : 'bg-lime-500',
                    ]"
                  ></span>
                </span>
                Online
              </div>
            </div>
          </div>

          <h2
            :class="[
              'text-2xl font-bold border-b-2 pb-2 mt-10',
              isDark ? 'text-white border-pink-600' : 'text-gray-800 border-lime-500',
            ]"
          >
            История заказов
          </h2>

          <div
            :class="[
              'mt-6 flex flex-col max-h-60 max-w-250 gap-4 pr-2 pl-2 overflow-y-auto overscroll-none custom-scrollbar',
              isDark ? 'scrollbar-dark' : 'scrollbar-light',
            ]"
          >
            <div
              v-if="orders.length === 0 && !isLoadingOrders"
              class="text-center py-10 opacity-50 font-medium"
            :class="['', isDark ? 'text-neutral-200' : 'text-neutral-600']"
              >
              У вас пока нет совершенных заказов
            </div>

            <div
              v-for="order in orders"
              :key="order.id"
              :class="[
                'p-5 rounded-xl border-2 flex flex-col md:flex-row justify-between items-center gap-4 transition-transform hover:scale-102 shrink-0',
                isDark
                  ? 'bg-neutral-900 border-neutral-700'
                  : 'bg-gray-50 border-gray-200 text-black',
              ]"
            >
              <div class="flex flex-col gap-1 w-full md:w-auto">
                <span class="text-xs font-bold uppercase opacity-60"
                  >Заказ №{{ order.id.slice(0, 8) }}...</span
                >
                <span class="text-lg font-bold">
                  {{
                    order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString('ru-RU')
                      : order.date
                  }}
                </span>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-sm opacity-60">Сумма</p>
                  <p :class="['text-xl font-black', isDark ? 'text-pink-500' : 'text-lime-600']">
                    {{ order.totalPrice.toLocaleString() }} ₽
                  </p>
                </div>
                <div
                  :class="[
                    'px-4 py-1 rounded-full text-xs font-bold uppercase',
                    order.status === 'delivered'
                      ? 'bg-green-500 text-white'
                      : 'bg-orange-400 text-white',
                  ]"
                >
                  {{ order.status === 'delivered' ? 'Доставлено' : 'В пути' }}
                </div>
              </div>
            </div>
          </div>

          <h2
            :class="[
              'text-2xl font-bold border-b-2 ',
              isDark ? 'text-white border-pink-600' : 'text-gray-800 border-lime-500',
            ]"
          ></h2>

          <div class="flex flex-wrap gap-4 md:justify-end">
            <button
              :class="[
                'px-6 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-2',
                isDark
                  ? 'bg-pink-500 hover:bg-pink-600 text-white'
                  : 'bg-lime-500 hover:bg-lime-600 text-white',
              ]"
            >
              Настройки
            </button>
            <button
              @click="handleLogout"
              class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center gap-2"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../main'
import { onAuthStateChanged, signOut, updateProfile, sendEmailVerification } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'

const isDark = (inject('theme') as any)?.isDark
const router = useRouter()

const userEmail = ref('')
const userUid = ref('')
const isEmailVerified = ref(false) // Статус верификации
const verificationSent = ref(false) // Статус отправки письма
const registrationDate = ref('')
const userPhoto = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const orders = ref<any[]>([])
const isLoadingOrders = ref(true)

const handleVerifyEmail = async () => {
  if (auth.currentUser) {
    // 1. Логируем начало процесса и текущий email пользователя
    console.log('Попытка отправки письма на:', auth.currentUser.email)
    console.log(
      'Текущий статус верификации в объекте пользователя:',
      auth.currentUser.emailVerified,
    )

    try {
      await sendEmailVerification(auth.currentUser)
      verificationSent.value = true
      alert('Ссылка для подтверждения отправлена на вашу почту!')
      console.log('Результат: Запрос на отправку успешно принят Firebase')
    } catch (err: any) {
      // 2. Логируем подробную ошибку
      console.error('ОШИБКА ПРИ ОТПРАВКЕ ПИСЬМА:')
      console.error('Код ошибки:', err.code)
      console.error('Сообщение:', err.message)

      if (err.code === 'auth/too-many-requests') {
        alert('Слишком много запросов. Попробуйте позже.')
      } else if (err.code === 'auth/user-token-expired') {
        alert('Сессия устарела. Пожалуйста, перезайдите в аккаунт.')
      }
    }
  } else {
    console.warn('Предупреждение: Попытка верификации, но auth.currentUser пуст (null)')
  }
}

const fetchOrders = async () => {
  if (!userUid.value) return
  try {
    isLoadingOrders.value = true
    const q = query(collection(db, 'orders'), where('userId', '==', userUid.value))
    const querySnapshot = await getDocs(q)

    orders.value = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
  } catch (err) {
    console.error('Firestore Error:', err)
  } finally {
    isLoadingOrders.value = false
  }
}

const checkUserStatus = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 3. Логируем данные при входе/обновлении
      console.log('Пользователь авторизован:', {
        uid: user.uid,
        email: user.email,
        isVerified: user.emailVerified,
      })

      userEmail.value = user.email || ''
      userUid.value = user.uid
      isEmailVerified.value = user.emailVerified // Убедись, что эта строка есть
      userPhoto.value = user.photoURL || localStorage.getItem('user_avatar')

      if (user.metadata.creationTime) {
        registrationDate.value = new Date(user.metadata.creationTime).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      }
    } else {
      console.log('Пользователь не авторизован, редирект...')
      router.push('/reg')
    }
  })
}

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 500000) return alert('Файл слишком большой (макс. 500 КБ)')

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result as string
    userPhoto.value = base64
    localStorage.setItem('user_avatar', base64)
    if (auth.currentUser) await updateProfile(auth.currentUser, { photoURL: base64 })
  }
  reader.readAsDataURL(file)
}

const handleLogout = async () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    await signOut(auth)
    router.push('/')
  }
}

watch(userUid, (uid) => uid && fetchOrders())
onMounted(checkUserStatus)
</script>

<style scoped>
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
  background: #84cc16;
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
  scrollbar-color: #84cc16 transparent;
}
</style>
