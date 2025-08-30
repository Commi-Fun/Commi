'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect } from 'react'

const GetSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    router.push('/')
  }, [router, searchParams])

  return <div></div>
}

const Signin = () => {
  return (
    <Suspense>
      <GetSearch />
    </Suspense>
  )
}

export default Signin
