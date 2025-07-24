import { SVGProps } from 'react'

export const ArrayRightMd = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor" // Use currentColor to inherit from CSS 'color' property
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
