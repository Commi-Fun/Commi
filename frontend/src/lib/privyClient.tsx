'use client'
import React from 'react';
import { PrivyProvider } from "@privy-io/react-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
console.log('PRIVY_APP_ID', PRIVY_APP_ID)

interface PrivyClientProps {
  children: React.ReactNode;
}

export const PrivyClient: React.FC<PrivyClientProps> = ({ children }) => {
  return (
    <PrivyProvider appId={PRIVY_APP_ID}>
      {children}
    </PrivyProvider>
  );
};