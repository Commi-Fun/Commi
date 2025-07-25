import { NextRequest, NextResponse } from 'next/server';

export function withErrorHandler(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (e: any) {
      // You can add logging here
      return NextResponse.json(
        { success: false, error: e.message || 'Internal server error' },
        { status: e.status || 500 }
      );
    }
  };
} 