// API 服务的类型定义

// 帖子类型
export interface Post {
  id: string
  title: string
  content: string
  images: string[]
  views: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    username: string
    avatar: string | null
  }
  commentCount: number
  likeCount: number
  isLiked: boolean
}

// 评论类型
export interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  postId: string
  parentId?: string | null
  author: {
    id: string
    username: string
    avatar: string | null
  }
  replies?: Comment[]
  parent?: {
    id: string
    content: string
    author: {
      id: string
      username: string
      avatar: string | null
    }
  } | null
}

// 用户类型
export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  role: string
  bio?: string | null
}

// API 响应类型
export interface ApiResponse<T> {
  code: 'success' | 'error'
  message: string
  data: T
}
