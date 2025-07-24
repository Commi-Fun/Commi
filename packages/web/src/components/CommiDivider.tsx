import { customColors } from '@/shared-theme/themePrimitives'
import { Divider, DividerProps } from '@mui/material'

export const CommiDivider = (props: DividerProps) => {
  const { sx, ...rest } = props
  return (
    <Divider
      sx={{
        borderColor: customColors.blue[400],
        ...sx,
      }}
      {...rest}></Divider>
  )
}
