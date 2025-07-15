
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Box, Typography, Button, Paper } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { publicKey } = useWallet();

  if (!isAuthenticated || !user) {
    return (
      <Paper elevation={3} sx={{ p: 2, mt: 4, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body1">Please log in to see your profile.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        User Profile
      </Typography>
      <Box>
        <Typography variant="body1">
          <strong>EVM Wallet:</strong> {user.walletAddress}
        </Typography>
        {publicKey && (
          <Typography variant="body1">
            <strong>Solana Wallet:</strong> {publicKey.toBase58()}
          </Typography>
        )}
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Twitter:</strong> {user.twitterHandle || 'Not linked'}
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <WalletMultiButton />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button 
          variant="outlined" 
          disabled 
          onClick={() => console.log('Implement Twitter linking logic here')}
        >
          Link Twitter Account
        </Button>
        <Typography variant="caption" display="block" sx={{mt: 1}}>
          (This functionality will be enabled in the future)
        </Typography>
      </Box>
    </Paper>
  );
};
