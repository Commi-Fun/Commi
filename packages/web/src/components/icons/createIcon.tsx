import React, { SVGProps } from 'react'

export const createIcon = ({
  color,
  style,
  children,
  ...rest
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) => {
  if (React.isValidElement(children)) {
    React.cloneElement(children, {
      width: '1em',
      height: '1em',
      fill: 'currentColor',
      focusable: 'false',
      'aria-hidden': 'true',
    })
  }

  return (
    <svg
      viewBox="0 0 50 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '1em', height: '1em', ...style }}
      {...rest}>
      <path
        d="M27.0833 31.75L33.3333 25.5M33.3333 25.5L27.0833 19.25M33.3333 25.5H16.6667M43.75 25.5C43.75 15.1447 35.3553 6.75 25 6.75C14.6447 6.75 6.25 15.1447 6.25 25.5C6.25 35.8553 14.6447 44.25 25 44.25C35.3553 44.25 43.75 35.8553 43.75 25.5Z"
        stroke={color || 'currentColor'}
        strokeWidth="4.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
