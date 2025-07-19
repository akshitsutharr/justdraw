import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Akshit App',
  description: 'Created By Akshit',
  generator: 'Akshit',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link type="image/png" sizes="16x16" rel="icon" href="./favicon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
