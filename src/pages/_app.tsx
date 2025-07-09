// src/pages/_app.tsx
import '@/app/globals.css' // 既存のCSSを読み込む
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
