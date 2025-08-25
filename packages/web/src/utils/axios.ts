import { AIP_DOMAIN } from '@/constants'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
const api = axios.create({
  baseURL: AIP_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
})
// Add request interceptor for authentication
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log('🚀 ~ error:', error)
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    // Check if response code is not 200 and handle as error
    if (response.data?.code && response.data.code !== 200) {
      const error = new Error(response.data.errMsg || 'API Error')
      error.name = 'APIError'
      return Promise.reject(error)
    }
    return response
  },
  error => {
    if (error.response?.status === 401) {
      console.log('🚀 ~ error:', error)
    }
    return Promise.reject(error)
  },
)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function axiosGet<T = any>({
  url,
  config,
}: {
  url: string
  jwtToken?: string
  config?: AxiosRequestConfig
}): Promise<AxiosResponse<T>> {
  // need move params to url for encrypted

  if (config?.params) {
    Object.keys(config.params).forEach(key => {
      if (config.params[key] === undefined) {
        delete config.params[key]
      }
    })
    const pa = new URLSearchParams(config.params)
    pa.sort()
    const params = pa.toString()
    url += (url.includes('?') ? '&' : '?') + params
    config.params = undefined
  }

  return await api.get<T>(url, {
    ...config,
    headers: {
      ...config?.headers,
    },
  })
}
export async function axiosPost({
  url,
  data,
  config,
}: {
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  config?: AxiosRequestConfig
  chainId?: number | undefined
  excludeDataForEncrypt?: boolean
}): Promise<AxiosResponse> {
  return await api.post(url, data, {
    ...config,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      ...config?.headers,
    },
  })
}
