import { Poppins, Montserrat } from 'next/font/google'
import Script from 'next/script'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './globals.css'
import { TransitionProvider } from './context/TransitionContext'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: 'UCCD - Untar Computer Club Development',
  description: 'Empowering FTI Students Through Technology & Innovation - The official platform for sharing insights, learning and growing in the world of technology',
  keywords: 'UCCD, Untar, Computer Club, FTI, Technology, Innovation, Bootcamp, Insight, Glory, Talks, Info',
}

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <TransitionProvider>
          {children}
        </TransitionProvider>
        
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}