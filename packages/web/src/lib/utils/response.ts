import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  status: number
  data?: T
  error?: string
}

export function success<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    status,
    data,
    error: undefined
  } as ApiResponse<T>, { status })
}

export function error(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({
    status,
    data: undefined,
    error: message
  } as ApiResponse, { status })
}
