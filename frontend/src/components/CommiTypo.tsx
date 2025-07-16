import { Typography, TypographyProps } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'

interface TypographyOwnProps extends Omit<TypographyProps, 'color'> {
  children?: React.ReactNode
  type?: 'title' | 'heading-h1' | 'button' | 'alert2' | 'content'
  color?: string
  weight?: 'bold' | 'semibold'
}

const CommiTypo = ({
  children,
  type = 'content',
  color = 'black',
  sx: incomingSx,
  ...rest
}: TypographyOwnProps) => {
  const typeSx: SxProps<Theme> = {
    ...(type === 'heading-h1' && {
      fontSize: '1.5rem',
      fontWeight: '800',
    }),
    ...(type === 'content' && { fontSize: '1rem' }),
    ...(type === 'title' && { fontSize: '1.125rem' }),
    ...(type === 'button' && { fontSize: '1rem', fontWeight: 'bold' }),
  }

  const weightSx: SxProps<Theme> = {
    ...(rest.weight === 'bold' && { fontWeight: 'bold' }),
    ...(rest.weight === 'semibold' && { fontWeight: '600' }),
  }

  const colorSx: SxProps<Theme> = {
    color,
  }

  return (
    <Typography
      sx={[typeSx, colorSx, weightSx, ...(Array.isArray(incomingSx) ? incomingSx : [incomingSx])]}
      {...rest}>
      {children}
    </Typography>
  )
}

export default CommiTypo
