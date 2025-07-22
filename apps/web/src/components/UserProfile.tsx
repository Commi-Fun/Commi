
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Box, Typography, Button, Paper } from '@mui/material';

export const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();

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
          <strong>Wallet:</strong> {user.walletAddress}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>Twitter:</strong> {user.twitterHandle || 'Not linked'}
        </Typography>
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
