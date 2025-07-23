import React from 'react'
import clsx from 'clsx' // A tiny utility for constructing `className` strings conditionally

/**
 * Defines the props accepted by the InteractiveBox component.
 * It extends all standard HTML attributes for a div element,
 * allowing props like `onClick`, `id`, `style`, etc.
 */
interface InteractiveBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * A reusable div component with pre-defined, interactive styling using Tailwind CSS.
 * - Default: Black background, gray text.
 * - Hover: Green background, white text.
 * - Active: Black background, green text.
 * - Focus: A green ring for accessibility.
 */
export const InteractiveBox: React.FC<InteractiveBoxProps> = ({ children, className, ...rest }) => {
  // Base classes for layout, padding, and default appearance
  const baseClasses =
    'bg-black text-gray-300 cursor-pointer rounded-lg px-4 py-2 transition-all duration-200 ease-in-out'

  // State-related classes for hover and active states
  const stateClasses = 'hover:bg-green-600 hover:text-white active:bg-black active:text-green-600'

  // Accessibility-related classes for focus state (e.g., when tabbing with a keyboard)
  const focusClasses =
    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black'

  // Combine all classes using clsx. This allows you to easily override or extend
  // styles by passing a `className` prop from the parent component.
  const combinedClasses = clsx(baseClasses, stateClasses, focusClasses, className)

  return (
    <div
      className={'flex bg-blue-1300 text-blue-200 rounded-[8px] p-6 items-center gap-2'}
      {...rest}>
      {children}
    </div>
  )
}
