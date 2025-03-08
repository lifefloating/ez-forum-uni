// HTTP request utility
interface RequestOptions {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: any
  headers?: Record<string, string>
}

// 判断是否使用代理
const useProxy = __VITE_APP_PROXY__ === 'true'

// 根据是否使用代理决定 BASE_URL
// 如果使用代理，BASE_URL 为空，因为代理已经配置了前缀
// 如果不使用代理，BASE_URL 应该是完整的后端地址
const BASE_URL = useProxy ? '' : 'http://localhost:3009'

// Request function
export const request = async <T>(options: RequestOptions): Promise<T> => {
  const { url, method, data, params, headers = {} } = options

  // Add authorization header if token exists
  const token = uni.getStorageSync('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Build URL with query parameters
  let requestUrl = BASE_URL + url
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')

    if (queryString) {
      requestUrl += `?${queryString}`
    }
  }

  console.log('Request URL:', requestUrl)

  // Return promise
  return new Promise((resolve, reject) => {
    uni.request({
      url: requestUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...headers,
      },
      success: (res) => {
        // Check if response is successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // Handle unauthorized error
          uni.removeStorageSync('token')
          uni.removeStorageSync('user')

          uni.showToast({
            title: '请先登录',
            icon: 'none',
          })

          // Navigate to login page
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/user/login',
            })
          }, 1500)

          reject(new Error('Unauthorized'))
        } else {
          // Handle other errors
          uni.showToast({
            title: (res.data as any)?.message || '请求失败',
            icon: 'none',
          })

          reject(new Error((res.data as any)?.message || 'Request failed'))
        }
      },
      fail: (err) => {
        console.error('Request failed:', err)
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })

        reject(err)
      },
    })
  })
}

export default request
