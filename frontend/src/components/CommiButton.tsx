import { Button, ButtonProps as MuiButtonProps } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'
import { customColors } from '@/shared-theme/themePrimitives'

// Define the custom props for our CommiButton
interface CommiButtonProps extends Omit<MuiButtonProps, 'variant' | 'size' | 'color'> {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'contained' | 'outlined'
  theme?: 'primary' | 'secondary' | 'default'
  color?: string
}

const cusSx = {
  justifyContent: 'center !important',
}

const CommiButton = ({
  children,
  size = 'medium',
  variant = 'contained',
  color,
  theme = 'primary',
  sx: incomingSx,
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
    ...(size === 'medium' &&
      {
        // height: '36px',
        // fontSize: '1rem',
      }),
    ...(size === 'large' &&
      {
        // height: '48px',
        // fontSize: '1.125rem',
      }),
  }

  const themeSx: SxProps<Theme> = {
    ...(theme === 'primary' && {
      color: color
        ? color
        : variant === 'contained'
        ? customColors.main.Black
        : customColors.main.Green01,
      borderColor: variant === 'outlined' ? `1px solid ${customColors.main.Green01}` : 'unset',
    }),
    // ...(theme === 'secondary' && {
    //   backgroundColor: theme.palette.secondary.main,
    //   color: theme.palette.secondary.contrastText,
    //   '&:hover': {
    //     backgroundColor: theme.palette.secondary.dark,
    //   },
    // }),
    // ...(theme === 'default' && {
    //   backgroundColor: theme.palette.grey[300],
    //   color: theme.palette.text.primary,
    //   '&:hover': {
    //     backgroundColor: theme.palette.grey[400],
    //   },
    // }),
  }

  //   const variantSx: SxProps<Theme> = {
  //     ...(variant === 'contained' &&
  //       {
  //         // Example:
  //         // backgroundColor: color === 'primary' ? 'primary.main' : 'secondary.main',
  //         // color: 'white',
  //       }),
  //     ...(variant === 'outlined' &&
  //       {
  //         // Example:
  //         // borderColor: color === 'primary' ? 'primary.main' : 'secondary.main',
  //         // color: color === 'primary' ? 'primary.main' : 'secondary.main',
  //       }),
  //   }
  // --- End of placeholder ---

  // Combine all sx props into an array for robust merging
  const finalSx = [
    sizeSx,
    themeSx,
    cusSx,
    ...(Array.isArray(incomingSx) ? incomingSx : [incomingSx]),
  ]

  return (
    <Button variant={variant} sx={finalSx} {...rest}>
      {children}
    </Button>
  )
}

export default CommiButton
