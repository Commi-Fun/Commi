import { Nunito } from 'next/font/google'
import { Metadata } from 'next'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://commi.fun'),
  title: 'Commi - Join the Airdrop Early!',
  description:
    "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/inviteLogo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commi - Join the Airdrop Early!',
    description:
      "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
    images: ['/images/twitterDisplay.png'],
    creator: '@commidotfun',
    site: '@commidotfun',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={nunito.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
