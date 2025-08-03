import { NextRequest, NextResponse } from 'next/server';
import { error } from './response';

export function withErrorHandler(
  handler: (req: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (e: any) {
      // Handle different types of errors
      if (e.name === 'ValidationError') {
        return error(e.message, 400);
      } else if (e.name === 'UnauthorizedError') {
        return error(e.message, 401);
      } else if (e.name === 'NotFoundError') {
        return error(e.message, 404);
      } else if (e.name === 'ConflictError') {
        return error(e.message, 409);
      } else {
        return error(e.message || 'Internal server error', e.status || 500);
      }
    }
  };
} 