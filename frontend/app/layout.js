import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UAS Frontend",
  description: "UAS Frontend with Next.js and Laravel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link href="/" className="navbar-brand">UAS</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link href="/lomba" className="nav-link">Lomba</Link>
                </li>
                <li className="nav-item">
                  <Link href="/beasiswa" className="nav-link">Beasiswa</Link>
                </li>
                <li className="nav-item">
                  <Link href="/bootcamp" className="nav-link">Bootcamp</Link>
                </li>
                <li className="nav-item">
                  <Link href="/talk" className="nav-link">Talk</Link>
                </li>
                <li className="nav-item">
                  <Link href="/member" className="nav-link">Member</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
