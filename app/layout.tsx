import React from "react"
import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Cinzel, Cormorant } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'

const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas"
});

const oswald = Oswald({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald"
});

const cinzel = Cinzel({ // Declaring Cinzel font
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cinzel"
});

const cormorant = Cormorant({ // Declaring Cormorant font
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cormorant"
});

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ADINKRAROTA | Fusion of Tarot & Adinkra',
  description: 'An immersive journey through the fusion of traditional Tarot archetypes and West African Adinkra symbols. Explore 78 cards of cosmic wisdom.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#07060d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${bebasNeue.variable} ${oswald.variable} ${cinzel.variable} ${cormorant.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
