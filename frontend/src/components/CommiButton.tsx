import { Button, ButtonProps as MuiButtonProps } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { customColors, primaryLinear } from '@/shared-theme/themePrimitives'
import CommiTypo from './CommiTypo'

// Define the custom props for our CommiButton
interface CommiButtonProps extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'contained' | 'outlined'
  theme?: 'primary' | 'primaryLinear' | 'default'
  color?: string
}

const themeSx = {
  primary: {
    backgroundColor: customColors.main.Green01,
    color: customColors.main.Black,
  },
  primaryLinear: {
    background: primaryLinear,
    color: customColors.main.Black,
  },
  default: {
    backgroundColor: 'unset',
    color: customColors.main.White,
  },
}

const CommiButton = ({
  children,
  size = 'medium',
  variant = 'contained',
  color = '',
  sx: incomingSx,
  theme = 'default',
  ...rest
}: CommiButtonProps) => {
  // --- Placeholder for your custom styles ---
  // You can fill in the specific values here based on the props.
  const sizeSx: SxProps<Theme> = {
    ...(size === 'small' && {
      height: '24px',
      fontSize: '0.875rem',
      px: 1,
      fontWeight: '600',
      borderRadius: '60px',
      justifyContent: 'center',
    }),
    ...(size === 'medium' && {
      height: '40px',
      borderRadius: '20px',
      fontSize: '1rem',
    }),
    ...(size === 'large' &&
      {
        // height: '48px',
        // fontSize: '1.125rem',
      }),
  }

  const fontSx =
    size === 'medium'
      ? {
          type: 'content' as const,
          weight: 'bold' as const,
        }
      : {}

  const cusSx: SxProps<Theme> = {
    justifyContent: 'center !important',
  }
  if (color) {
    cusSx.color = color
  }

  const finalSx = [
    sizeSx,
    themeSx[theme] || {},
    cusSx,
    ...(Array.isArray(incomingSx) ? incomingSx : [incomingSx]),
  ]

  return (
    <Button variant={variant} sx={finalSx} {...rest}>
      <CommiTypo {...fontSx}>{children}</CommiTypo>
    </Button>
  )
}

export default CommiButton
