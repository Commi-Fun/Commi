import { UserConnectRequest, connectedUser } from '../types/user'
import { CampaignCreateRequest, Campaign } from '../types/campaign'
import { axiosGet, axiosPost } from '../utils/axios'
import { AxiosResponse } from '../types/axios'

export const API_URLS = {
  USER_CONNECT: 'api/user/connect',
  USER_CONNECTED: 'api/user/connected',
  CAMPAIGN_CREATE: 'api/campaign/create',
  CAMPAIGN_LIST: 'api/campaign/list',
  CAMPAIGN_DETAIL: 'api/campaign/get',
  CAMPAIGN_CREATED: 'api/campaign/created',
  CAMPAIGN_LIST_PARTICIPATED: 'api/campaign/listParticipated',
}

// API call functions
export const connectUser = async (
  data: UserConnectRequest,
): Promise<AxiosResponse<connectedUser>> => {
  const response: AxiosResponse<connectedUser> = await axiosPost({
    url: API_URLS.USER_CONNECT,
    data,
  })

  return response
}

export const createCampaign = async (
  data: CampaignCreateRequest,
): Promise<AxiosResponse<Campaign>> => {
  const response: AxiosResponse<Campaign> = await axiosPost({
    url: API_URLS.CAMPAIGN_CREATE,
    data,
  })

  return response
}

export const getCampaignList = async (): Promise<Campaign[]> => {
  const response = await axiosGet({
    url: API_URLS.CAMPAIGN_LIST,
  })

  return response.data.data
}
export const getCampaignDetail = async (id: number): Promise<AxiosResponse<Campaign>> => {
  const response: AxiosResponse<Campaign> = await axiosGet({
    url: API_URLS.CAMPAIGN_DETAIL,
    config: {
      params: {
        id,
      },
    },
  })

  return response
}
export const getCampaignCreated = async (): Promise<AxiosResponse<Campaign[]>> => {
  const response: AxiosResponse<Campaign[]> = await axiosGet({
    url: API_URLS.CAMPAIGN_CREATED,
  })

  return response
}
export const checkUserConnected = async (address: string): Promise<boolean> => {
  const response = await axiosPost({
    url: API_URLS.USER_CONNECTED,
    data: {
      address,
    },
  })
  return response.data.data
}
export const getCampaignListParticipated = async (
  userId: string,
): Promise<AxiosResponse<Campaign[]>> => {
  const response = await axiosGet({
    url: API_URLS.CAMPAIGN_LIST_PARTICIPATED,
    config: {
      params: {
        twitterId: userId,
      },
    },
  })

  return response.data
}
