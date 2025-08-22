'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ArrayRightMd } from '@/components/icons/ArrayRightMd'
import { ChevronDown } from '@/components/icons/ChevronDown'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection = ({ title, children, defaultOpen = true }: CollapsibleSectionProps) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="py-2">
      <button
        onClick={() => setOpen(!open)}
        className="px-5 py-1 w-full flex justify-between items-center text-left bg-transparent cursor-pointer">
        <span className="font-semibold text-[16px]">{title}</span>
        <div
          className={`transition-transform duration-200 ease-in-out ${
            open ? 'rotate-180' : 'rotate-0'
          }`}>
          <ChevronDown className="text-[18px]" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
        {open && children}
      </div>
    </div>
  )
}

export default CollapsibleSection
