import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Above Below',
  description: 'Fashion and lifestyle brand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/cart">Cart</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; 2025 Above Below. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
