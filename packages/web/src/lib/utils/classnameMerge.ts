import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function classnameMerge(...inputs: string[]) {
  return twMerge(clsx(inputs))
}
