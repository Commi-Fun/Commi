'use client';

import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { Button } from '@mui/material';
import { injected } from 'wagmi/connectors';
import { useAuth } from '@/context/AuthContext';
import { useCallback } from 'react';

export const LoginButton = () => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { login, logout, isAuthenticated } = useAuth();

  const handleLogin = useCallback(async () => {
    if (!address) return;
    try {
      const message = `Sign this message to log in. Nonce: ${Date.now()}`;
      const signature = await signMessageAsync({ message });
      
      // In a real app, you would send the signature and address to your backend
      // The backend would verify the signature and return a session token (e.g., JWT)
      console.log('Signature:', signature);
      console.log('Address:', address);
      
      // For now, we'll just log the user in on the client side
      login({ walletAddress: address });

    } catch (error) {
      console.error('Failed to sign message:', error);
    }
  }, [address, login, signMessageAsync]);

  const handleLogout = useCallback(() => {
    logout();
    disconnect();
  }, [logout, disconnect]);

  if (isAuthenticated) {
    return (
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Sign-In to Verify
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => connect({ connector: injected() })}
    >
      Connect Wallet
    </Button>
  );
};