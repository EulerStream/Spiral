/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_SIGNALLING_SERVER: string;
  readonly VITE_PUBLIC_SIGNALLING_SERVER_SECURE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
