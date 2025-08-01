import React, { useState, useRef, useEffect } from 'react'
import { XIcon } from './icons/XIcon'
import { GreenBlackXIcon } from './icons/GreenBlackXIcon'
import { customColors } from '@/shared-theme/themePrimitives'

interface SlideButtonProps {
  onSlideComplete?: () => void
  text?: string
  completedText?: string
  disabled?: boolean
  className?: string
}

export function SlideButton({
  onSlideComplete,
  text = 'Log in with X',
  completedText = 'Log in with X',
  disabled = false,
  className = '',
}: SlideButtonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [slidePosition, setSlidePosition] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleStart = (clientX: number) => {
    if (disabled || isCompleted) return
    setIsDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !buttonRef.current || !sliderRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const sliderWidth = sliderRef.current.offsetWidth
    const padding = 4 // 1rem = 4px, same as left padding
    const maxSlide = buttonRect.width - sliderWidth - padding

    console.log('clientX', clientX)
    const newPosition = Math.max(
      0,
      Math.min(clientX - buttonRect.left - sliderWidth / 2 - padding, maxSlide),
    )
    setSlidePosition(newPosition)

    // Check if slide is complete (90% of the way)
    if (newPosition >= maxSlide * 0.9) {
      setIsCompleted(true)
      setSlidePosition(maxSlide)
      setIsDragging(false)
      onSlideComplete?.()
    }
  }

  const handleEnd = () => {
    if (!isCompleted) {
      setSlidePosition(0)
    }
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      ref={buttonRef}
      className={`
        relative w-full h-14 rounded-full overflow-hidden cursor-pointer select-none
        transition-colors duration-300
        ${isCompleted ? 'primary-linear' : 'bg-black'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}>
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-semibold text-lg text-main-Green01">
          {isCompleted ? completedText : text}
        </span>
      </div>

      {/* Sliding circle */}
      {/* Progress indicator */}
      {!isCompleted && slidePosition > 0 && (
        <div
          className="absolute top-0 left-0 h-full primary-linear"
          style={{
            width: `${4 + slidePosition + 24}px`, // left padding (4px) + slidePosition + slider radius (24px) = center of circle
          }}
        />
      )}

      <div
        ref={sliderRef}
        className={`
          absolute top-1 left-5 w-12 h-12 rounded-full flex items-center justify-center
          ${isDragging ? 'scale-115' : 'scale-100'}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{
          left: `${slidePosition || 4}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}>
        <GreenBlackXIcon className="text-[50px] absolute" fill={customColors.main.Green01} />
      </div>
    </div>
  )
}
