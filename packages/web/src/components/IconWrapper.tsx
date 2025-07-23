import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export const IconWrapper = ({ children }: Props) => {
  return <i>{children}</i>
}
