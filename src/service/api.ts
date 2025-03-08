// API service for forum
import request from '../utils/request'
import { Post, Comment, User, ApiResponse } from './types'

// 判断是否使用代理
const useProxy = __VITE_APP_PROXY__ === 'true'

// 根据是否使用代理决定 BASE_URL
// 如果使用代理，BASE_URL 为空，因为代理已经配置了前缀
// 如果不使用代理，BASE_URL 应该是完整的后端地址
const BASE_URL = useProxy ? '' : 'http://localhost:3009'

// Auth API
export const authApi = {
  // Register
  register: (data: { username: string; email: string; password: string }) => {
    return request<ApiResponse<{ user: User; token: string }>>({
      url: '/api/auth/register',
      method: 'POST',
      data,
    })
  },

  // Login
  login: (data: { email: string; password: string }) => {
    return request<ApiResponse<{ user: User; token: string }>>({
      url: '/api/auth/login',
      method: 'POST',
      data,
    })
  },

  // Get current user
  getMe: () => {
    return request<ApiResponse<User>>({
      url: '/api/auth/me',
      method: 'GET',
    })
  },

  // Logout
  logout: () => {
    return request<ApiResponse<null>>({
      url: '/api/auth/logout',
      method: 'POST',
    })
  },
}

// Posts API
export const postsApi = {
  // Get posts list
  getPosts: (params: any) => {
    return request<
      ApiResponse<{
        items: Post[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: '/api/posts',
      method: 'GET',
      params,
    })
  },

  // Get post by ID
  getPostById: (id: string) => {
    return request<ApiResponse<Post>>({
      url: `/api/posts/${id}`,
      method: 'GET',
    })
  },

  // Create post
  createPost: (data: { title: string; content: string; images: string[] }) => {
    return request<ApiResponse<Post>>({
      url: '/api/posts',
      method: 'POST',
      data,
    })
  },

  // Update post
  updatePost: (
    id: string,
    data: {
      title?: string
      content?: string
      images?: string[]
    },
  ) => {
    return request<ApiResponse<Post>>({
      url: `/api/posts/${id}`,
      method: 'PUT',
      data,
    })
  },

  // Delete post
  deletePost: (id: string) => {
    return request<ApiResponse<null>>({
      url: `/api/posts/${id}`,
      method: 'DELETE',
      data: {},
    })
  },

  // Like post
  likePost: (postId: string) => {
    return request<ApiResponse<null>>({
      url: `/api/posts/${postId}/like`,
      method: 'POST',
      data: {},
    })
  },

  // Unlike post
  unlikePost: (postId: string) => {
    return request<ApiResponse<null>>({
      url: `/api/posts/${postId}/like`,
      method: 'DELETE',
      data: {},
    })
  },

  // Get user posts
  getUserPosts: (userId: string, params?: any) => {
    return request<
      ApiResponse<{
        items: Post[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: `/api/posts/user/${userId}`,
      method: 'GET',
      params,
    })
  },

  // Get liked posts
  getLikedPosts: (params?: any) => {
    return request<
      ApiResponse<{
        items: Post[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: '/api/posts/liked',
      method: 'GET',
      params,
    })
  },
}

// Comments API
export const commentsApi = {
  // Get post comments
  getPostComments: (postId: string, params?: any) => {
    return request<
      ApiResponse<{
        items: Comment[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: `/api/comments/post/${postId}`,
      method: 'GET',
      params,
    })
  },

  // Create comment
  createComment: (postId: string, data: { content: string; parentId?: string }) => {
    return request<ApiResponse<Comment>>({
      url: `/api/comments/post/${postId}`,
      method: 'POST',
      data,
    })
  },

  // Update comment
  updateComment: (commentId: string, data: { content: string }) => {
    return request<ApiResponse<Comment>>({
      url: `/api/comments/${commentId}`,
      method: 'PUT',
      data,
    })
  },

  // Delete comment
  deleteComment: (commentId: string) => {
    return request<ApiResponse<null>>({
      url: `/api/comments/${commentId}`,
      method: 'DELETE',
    })
  },

  // Get comment replies
  getCommentReplies: (commentId: string, params?: any) => {
    return request<
      ApiResponse<{
        items: Comment[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: `/api/comments/${commentId}/replies`,
      method: 'GET',
      params,
    })
  },

  // Get my comments
  getMyComments: (params?: any) => {
    return request<
      ApiResponse<{
        items: Comment[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: '/api/comments/me',
      method: 'GET',
      params,
    })
  },
}

// Users API
export const usersApi = {
  // Get user by ID
  getUserById: (id: string) => {
    return request<ApiResponse<User>>({
      url: `/api/users/${id}`,
      method: 'GET',
    })
  },

  // Update profile
  updateProfile: (data: { username?: string; bio?: string; avatar?: string }) => {
    return request<ApiResponse<User>>({
      url: '/api/users/profile',
      method: 'PUT',
      data,
    })
  },
}

// Uploads API
export const uploadsApi = {
  // Upload file
  uploadFile: (filePath: string) => {
    return new Promise<ApiResponse<{ url: string; filename: string; mimetype: string }>>(
      (resolve, reject) => {
        // 使用与 request.ts 相同的代理配置逻辑
        const uploadUrl = useProxy ? '/api/uploads' : 'http://localhost:3009/api/uploads'

        console.log('Upload URL:', uploadUrl)

        uni.uploadFile({
          url: uploadUrl,
          filePath,
          name: 'file',
          header: {
            Authorization: `Bearer ${uni.getStorageSync('token')}`,
          },
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(res.data))
            } else {
              reject(new Error('Upload failed'))
            }
          },
          fail: (err) => {
            console.error('Upload failed:', err)
            reject(err)
          },
        })
      },
    )
  },
}

// Admin API
export const adminApi = {
  // Get all posts (admin)
  getAllPosts: (params?: any) => {
    return request<
      ApiResponse<{
        items: Post[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: '/api/admin/posts',
      method: 'GET',
      params,
    })
  },

  // Delete post (admin)
  deletePost: (id: string) => {
    return request<ApiResponse<null>>({
      url: `/api/admin/posts/${id}`,
      method: 'DELETE',
    })
  },

  // Get all users (admin)
  getAllUsers: (params?: any) => {
    return request<
      ApiResponse<{
        items: (User & { _count: { posts: number; comments: number } })[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>
    >({
      url: '/api/admin/users',
      method: 'GET',
      params,
    })
  },

  // Update user role (admin)
  updateUserRole: (userId: string, role: 'USER' | 'ADMIN') => {
    return request<ApiResponse<User>>({
      url: `/api/admin/users/${userId}/role`,
      method: 'PUT',
      data: { role },
    })
  },
}

// Export all APIs
export default {
  auth: authApi,
  posts: postsApi,
  comments: commentsApi,
  users: usersApi,
  uploads: uploadsApi,
  admin: adminApi,
}
