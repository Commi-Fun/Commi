import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CommiTypo from './CommiTypo'
import Close from './icons/Close'
import { customColors } from '@/shared-theme/themePrimitives'
import { CloseLgIcon } from './icons/CloseLgIcon'

interface CommiModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const sizeStyles = {
  small: {
    width: '440px',
    // height: '320px',
    padding: '4px 0',
  },
  medium: {
    width: '640px',
    height: 'fit-content',
    minHeight: '400px',
    maxHeight: '800px',
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
  className,
}: CommiModalProps) {
  const closeIconPosition =
    size === 'small'
      ? { right: 16, top: 20 }
      : size === 'medium'
        ? { right: 24, top: 24 }
        : { right: 32, top: 32 }

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
      <CloseLgIcon
        onClick={onClose}
        color={customColors.blue[300]}
        style={{ position: 'absolute', cursor: 'pointer', ...closeIconPosition }}
      />
      {children}
    </Dialog>
  )
}
