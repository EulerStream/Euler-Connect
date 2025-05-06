/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly CEB_LIVE_PAGE_PATH: string;
  readonly VITE_PUBLIC_PUSH_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
