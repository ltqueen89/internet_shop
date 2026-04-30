interface ImportMetaEnv {
  readonly VITE_GOOGLE_API_KEY: string
  // здесь можно перечислить и другие переменные, если они появятся
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}