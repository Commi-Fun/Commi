import { NextResponse } from 'next/server'

export function success(data: unknown, status = 200) {
  return NextResponse.json({ status, data })
}

export function error(message: string, status = 400) {
  return NextResponse.json(message, { status })
}
