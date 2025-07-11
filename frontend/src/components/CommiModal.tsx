import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CommiTypo from './CommiTypo'
import Close from './icons/Close'
import { customColors } from '@/shared-theme/themePrimitives'

interface CommiModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

const sizeStyles = {
  small: {
    width: '408px',
    height: '340px',
  },
  medium: {
    width: '640px',
    height: '656px',
  },
  large: {
    width: '1208px',
    height: '740px',
  },
}

export default function CommiModal({
  open,
  onClose,
  title,
  children,
  size = 'medium',
}: CommiModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          ...sizeStyles[size],
        },
      }}>
      {title && (
        <DialogTitle>
          <CommiTypo type="alert2" color="white">
            {title}
          </CommiTypo>
        </DialogTitle>
      )}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 24,
          top: 24,
        }}>
        <Close color={customColors.blue[300]} />
      </IconButton>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
