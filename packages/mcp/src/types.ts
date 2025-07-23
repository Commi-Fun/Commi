// Model Context Protocol types for fast UI interactions

export interface MCPMessage {
  id: string;
  type: 'request' | 'response' | 'notification';
  method?: string;
  params?: any;
  result?: any;
  error?: MCPError;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

export interface MCPConnection {
  id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastActivity: Date;
}

// Real-time data update types
export interface DataUpdate {
  type: 'tweet' | 'user' | 'nft_distribution' | 'influence_score';
  action: 'create' | 'update' | 'delete';
  id: string;
  data: any;
  timestamp: Date;
}

// UI state sync types
export interface UIStateSync {
  sessionId: string;
  userId?: string;
  path: string;
  state: Record<string, any>;
  timestamp: Date;
}

// Fast data query types
export interface FastQueryRequest {
  type: 'users' | 'tweets' | 'stats' | 'leaderboard';
  filters?: Record<string, any>;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface FastQueryResponse<T = any> {
  data: T[];
  total: number;
  cached: boolean;
  timestamp: Date;
}

// Real-time metrics
export interface RealTimeMetrics {
  totalUsers: number;
  totalTweets: number;
  totalInfluence: number;
  activeDistributions: number;
  lastUpdate: Date;
}