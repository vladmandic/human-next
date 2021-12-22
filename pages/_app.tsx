import '../styles/globals.css'
import type { AppProps } from 'next/app'

function HumanApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default HumanApp
