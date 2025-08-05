import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'OpenCTF',
    template: '%s | OpenCTF',
  },
  description: 'Professional Capture The Flag platform for teams, contests, and community',
  keywords: ['CTF', 'cybersecurity', 'capture the flag', 'hacking', 'competition'],
  authors: [{ name: 'OpenCTF Team' }],
  creator: 'OpenCTF',
  publisher: 'OpenCTF',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'OpenCTF - Professional CTF Platform',
    description: 'Professional Capture The Flag platform for teams, contests, and community',
    url: '/',
    siteName: 'OpenCTF',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OpenCTF Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenCTF - Professional CTF Platform',
    description: 'Professional Capture The Flag platform for teams, contests, and community',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-sans antialiased">
        <div id="root">
          <Providers>
            {children}
          </Providers>
        </div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}
