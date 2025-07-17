import { customColors } from '@/shared-theme/themePrimitives'
import { SVGProps } from 'react'

interface Props extends SVGProps<SVGSVGElement> {
  color?: string
}

const Close = ({ color = customColors.main.White, width = 24, height = 24, ...rest }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}>
      <path
        d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Close
