/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_STUN_SERVER: string;
  readonly VITE_PUBLIC_SIGNALLING_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
