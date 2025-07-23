import { customColors } from '@/shared-theme/themePrimitives'
import { Typography, TypographyProps } from '@mui/material'
import { SxProps, Theme } from '@mui/material/styles'

interface TypographyOwnProps extends Omit<TypographyProps, 'color'> {
  children?: React.ReactNode
  type?: 'title' | 'heading-h1' | 'button' | 'alert2' | 'content' | 'heading-alert3' | 'body'
  color?: string
  weight?: 'bold' | 'semibold'
  colorType?: 'main' | 'secondary' | 'secondary-2'
}

const CommiTypo = ({
  children,
  type = 'content',
  color,
  sx: incomingSx,
  colorType = 'main',
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
    ...(type === 'heading-alert3' && { fontSize: '1.125rem', fontWeight: '800' }),
    ...(type === 'body' && { fontSize: '0.875rem' }),
    ...(type === 'alert2' && { fontSize: '1.75rem', fontWeight: '800' }),
  }

  const weightSx: SxProps<Theme> = {
    ...(rest.weight === 'bold' && { fontWeight: 'bold' }),
    ...(rest.weight === 'semibold' && { fontWeight: '600' }),
  }

  let colorSx: SxProps<Theme> = {}
  if (color) {
    colorSx = {
      color,
    }
  } else if (colorType) {
    colorSx = {
      color:
        colorType === 'main'
          ? customColors.main.White
          : colorType === 'secondary'
          ? customColors.blue['200']
          : customColors.blue['300'],
    }
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
