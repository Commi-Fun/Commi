import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {}

export const CloseLgIcon = ({ ...rest }: Props) => {
  return (
    <i {...rest}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
          stroke="#8B9193"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </i>
  )
}
