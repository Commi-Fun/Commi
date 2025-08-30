export interface UserConnectRequest {
  address: string
  signature: string
  twitterId?: string
}

export interface connectedUser {
  id: number
  address: string
  isPrimary: boolean
  userId: number
  createdAt: Date
  updatedAt: Date
}
