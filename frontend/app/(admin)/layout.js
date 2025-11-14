import '../(user)/globals.css';
import { Poppins, Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Sidebar from './admin/components/Sidebar';
import styles from './AdminLayout.module.css';

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
  title: 'Admin Dashboard',
  description: 'Admin dashboard for UCCD',
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className={poppins.className} suppressHydrationWarning={true}>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#28a745',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#dc3545',
                color: 'white',
              },
            },
          }}
        />
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}