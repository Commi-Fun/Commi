export interface ServiceResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

export function createSuccessResult<T>(data: T): ServiceResult<T> {
  return {
    success: true,
    data,
    error: undefined
  }
}

export function createErrorResult(error: string): ServiceResult {
  return {
    success: false,
    data: undefined,
    error
  }
}

// Helper function to wrap async operations
export async function wrapServiceOperation<T>(
  operation: () => Promise<T>
): Promise<ServiceResult<T>> {
  try {
    const result = await operation()
    return createSuccessResult(result)
  } catch (error: any) {
    return createErrorResult(error.message || 'Operation failed')
  }
} 