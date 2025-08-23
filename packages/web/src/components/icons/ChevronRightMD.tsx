import { IconType } from '@/types/Icon'

export const ChevronRightMD = (props: IconType) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...props}>
      <path
        d="M10 8.5L14 12.5L10 16.5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
