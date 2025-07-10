import { customColors } from '@/shared-theme/themePrimitives'
import { Typography, TypographyProps } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'

interface TypographyOwnProps extends Omit<TypographyProps, 'color'> {
  children?: React.ReactNode
  type: 'body' | 'heading' | 'caption' | 'button'
  color?: 'primary' | 'secondary' | 'white' | 'black' | 'gray'
}

const Typo = ({ children, type, color, sx: incomingSx, ...rest }: TypographyOwnProps) => {
  const typeSx: SxProps<Theme> = {
    ...(type === 'heading' && {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: 'primary.main',
    }),
    ...(type === 'body' && { fontSize: '1rem', fontWeight: 'normal' }),
    ...(type === 'caption' && { fontSize: '0.875rem', fontWeight: 'normal' }),
    ...(type === 'button' && { fontSize: '1rem', fontWeight: 'bold' }),
  }

  const colorSx: SxProps<Theme> = {
    ...(color === 'primary' && { color: customColors.main.Green01 }),
    ...(color === 'secondary' && { color: customColors.main.Green02 }),
    ...(color === 'white' && { color: customColors.main.White }),
    ...(color === 'black' && { color: customColors.main.Black }),
  }

  return (
    <Typography
      sx={[typeSx, colorSx, ...(Array.isArray(incomingSx) ? incomingSx : [incomingSx])]}
      {...rest}>
      {children}
    </Typography>
  )
}

export default Typo
