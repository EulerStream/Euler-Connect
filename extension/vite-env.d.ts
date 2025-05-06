/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_PUBLIC_LIVE_PAGE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
