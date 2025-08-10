export type WhitelistStatusKey = 'registered' | 'followed' | 'posted' | 'referred' | 'claimed'

export type WhitelistStatus = Partial<{
  [p in WhitelistStatusKey]: boolean
}>
