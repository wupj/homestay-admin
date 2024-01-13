import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface HttpResponse<T = unknown> {
  message: string
  code: number
  data: T
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    const res = response.data
    return res
  },
  (error) => {}
)

export default instance
