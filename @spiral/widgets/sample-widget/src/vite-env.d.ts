/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_RTC_DEBUG_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
