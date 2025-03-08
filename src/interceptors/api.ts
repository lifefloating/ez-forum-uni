import api from '../service/api'

export const apiInterceptor = {
  install() {
    // Register all API modules
    // @ts-ignore
    uni.$api = api

    // Log available API modules for debugging
    console.log('API modules registered:', Object.keys(api))
  },
}
