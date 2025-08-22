import { IconType } from '@/types/Icon'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {}

export const CloseLgIcon = (props: IconType) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
