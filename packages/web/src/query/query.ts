import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  connectUser,
  createCampaign,
  getCampaignCreated,
  getCampaignDetail,
  getCampaignList,
} from './apiCalls'
import { UserConnectRequest, connectedUser } from '../types/user'
import { CampaignCreateRequest, Campaign } from '../types/campaign'

// Query Keys
export const queryKeys = {
  user: {
    all: ['user'] as const,
    connected: () => [...queryKeys.user.all, 'connected'] as const,
  },
  campaign: {
    all: ['campaign'] as const,
    list: () => [...queryKeys.campaign.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.campaign.all, 'detail', id] as const,
    created: () => [...queryKeys.campaign.all, 'created'] as const,
  },
} as const

// User Queries
export const useConnectUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UserConnectRequest): Promise<connectedUser> => {
      const response = await connectUser(data)
      return response.data
    },
    onSuccess: data => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
      // Optionally set the connected user data
      queryClient.setQueryData(queryKeys.user.connected(), data)
    },
    onError: error => {
      console.error('Failed to connect user:', error)
    },
  })
}

// Campaign Queries
export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CampaignCreateRequest): Promise<Campaign> => {
      const response = await createCampaign(data)
      return response.data
    },
    onSuccess: data => {
      // Invalidate campaign list to refetch with new campaign
      queryClient.invalidateQueries({ queryKey: queryKeys.campaign.list() })
      // Optionally add the new campaign to the cache
      queryClient.setQueryData(queryKeys.campaign.detail(data.id), data)
    },
    onError: error => {
      console.error('Failed to create campaign:', error)
    },
  })
}

export const useCampaigns = () => {
  return useQuery({
    queryKey: queryKeys.campaign.list(),
    queryFn: () => getCampaignList(), // You'll need to implement this API call
    // staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCampaign = (id: number) => {
  return useQuery({
    queryKey: queryKeys.campaign.detail(id),
    queryFn: () => getCampaignDetail(id), // You'll need to implement this API call
    enabled: !!id, // Only run query if id is provided
  })
}
export const useCampaignCreated = () => {
  return useQuery({
    queryKey: queryKeys.campaign.created(),
    queryFn: () => getCampaignCreated(), // You'll need to implement this API call
  })
}

// export const useConnectedUser = () => {
//   return useQuery({
//     queryKey: queryKeys.user.connected(),
//     queryFn: () => fetchConnectedUser(), // You'll need to implement this API call
//     staleTime: 10 * 60 * 1000, // 10 minutes
//   })
// }
