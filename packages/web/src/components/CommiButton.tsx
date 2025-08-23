import { classnameMerge } from '@/lib/utils/classnameMerge'
import clsx from 'clsx'

interface CommiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'filled' | 'outline'
}

const CommiButton = ({
  children,
  size = 'medium',
  variant = 'filled',
  className = '',
  disabled,
  ...props
}: CommiButtonProps) => {
  const sizeClasses = clsx({
    'px-6 py-2.5 font-bold text-[18px] rounded-[8px]': size === 'large',
    'px-2.5 py-[2.5px] font-semibold text-[14px] rounded-3xl': size === 'small',
    'px-2.5 py-2.5 font-bold text-[14px] rounded-[20px] text-1xl min-w-[100px]': size === 'medium',
  })

  const baseClasses = 'flex gap-2 items-center justify-center cursor-pointer'

  const getVariantClasses = () => {
    if (disabled) {
      return variant === 'filled'
        ? 'bg-gray-600 text-gray-400'
        : 'border border-gray-400 text-gray-400'
    }

    return variant === 'filled' ? 'bg-black text-lime-300' : 'border border-black text-black'
  }

  return (
    <button
      className={classnameMerge(baseClasses, getVariantClasses(), sizeClasses, className)}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  )
}

export default CommiButton
