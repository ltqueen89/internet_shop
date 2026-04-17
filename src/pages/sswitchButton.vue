<template>
  <div class="">
    <svg
      class="h-10 switch-mode hover:scale-120 transition duration-300 stroke-neutral-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="1 1 22 22"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: false,
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')

      // Добавляем класс для body если нужно
      if (this.isDark) {
        document.body.classList.add('dark-theme')
        document.body.classList.remove('light-theme')
      } else {
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
      }
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }

      // Устанавливаем классы для body при инициализации
      if (this.isDark) {
        document.body.classList.add('dark-theme')
        document.body.classList.remove('light-theme')
      } else {
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
      }
    },
  },
  mounted() {
    this.initTheme()
  },
}
</script>
