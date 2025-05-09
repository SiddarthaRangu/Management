import type { Metadata } from 'next'
import './globals.css'
// app/layout.jsx
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
