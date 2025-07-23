// Main export file for @commi-dashboard/mcp package

export * from './types';
export { MCPClient } from './client';
export { MCPServer } from './server';

// Utility functions for MCP integration
import { MCPMessage } from './types';

/**
 * Generates a unique message ID for MCP communication
 * @returns A unique string identifier
 */
export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Type guard to check if data is a valid MCP message
 * @param data - Unknown data to validate
 * @returns True if data is a valid MCPMessage
 */
export function isValidMCPMessage(data: unknown): data is MCPMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as MCPMessage).id === 'string' &&
    typeof (data as MCPMessage).type === 'string' &&
    ['request', 'response', 'notification'].includes((data as MCPMessage).type)
  );
}

// Re-export types for convenience
export type {
  MCPMessage,
  MCPError,
  MCPConnection,
  DataUpdate,
  UIStateSync,
  FastQueryRequest,
  FastQueryResponse,
  RealTimeMetrics
} from './types';