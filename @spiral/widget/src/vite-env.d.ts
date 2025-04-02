/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_PUBLIC_SIGNALLING_SERVER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
