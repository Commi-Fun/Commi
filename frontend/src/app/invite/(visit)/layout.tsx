// src/app/invite/layout.tsx
import AppTheme from '@/shared-theme/AppTheme'
import '../../globals.css'
import '../invite.css'
import React from 'react'
import { Header } from '../components/Header'

export const metadata = {
  title: 'You are invited!',
  description: 'A special invitation.',
}

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={'font-nunito !bg-green01-500'}>
        {/* This is a completely separate layout for the /invite route */}
        <Header></Header>
        <main>
          <AppTheme>{children}</AppTheme>
        </main>
      </body>
    </html>
  )
}
