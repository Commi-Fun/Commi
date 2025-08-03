'use client'

import * as React from 'react'
import { useConnect } from 'wagmi'
import { Button, Box, Typography, Modal } from '@mui/material'

// Basic modal style from MUI docs
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface CustomConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CustomConnectModal({ open, onClose }: CustomConnectModalProps) {
  const { connectors, connect } = useConnect()

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="connect-wallet-modal-title"
    >
      <Box sx={style}>
        <Typography id="connect-wallet-modal-title" variant="h6" component="h2">
          Connect Wallet
        </Typography>
        <Box sx={{ mt: 2 }}>
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="contained"
              fullWidth
              onClick={() => {
                connect({ connector });
                onClose(); // Close modal after clicking
              }}
              sx={{ mb: 1 }}
            >
              {connector.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  )
}
