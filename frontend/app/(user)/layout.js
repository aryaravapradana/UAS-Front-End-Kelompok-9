import { Poppins, Montserrat } from 'next/font/google'
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

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" 
          crossOrigin="anonymous"
        />
        
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        <link rel="icon" href="/favicon.ico" />
        
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <TransitionProvider>
          {children}
        </TransitionProvider>
        
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
          async
        ></script>
      </body>
    </html>
  )
}