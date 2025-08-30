'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const Signin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get('error')

    // TODO: Handle case if manually navigated

    if (error === 'Callback') {
      router.push('/')
    }
  }, [router, searchParams])

  return <div> </div>
}

export default Signin
