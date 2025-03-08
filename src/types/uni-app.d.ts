import { ApiResponse, Post, Comment, User } from '../service/types'

// 扩展 uni 对象
declare global {
  interface Uni {
    $api: {
      auth: {
        register: (data: {
          username: string
          email: string
          password: string
        }) => Promise<ApiResponse<{ user: User; token: string }>>
        login: (data: {
          email: string
          password: string
        }) => Promise<ApiResponse<{ user: User; token: string }>>
        getMe: () => Promise<ApiResponse<User>>
        logout: () => Promise<ApiResponse<null>>
      }
      posts: {
        getPosts: (params: any) => Promise<
          ApiResponse<{
            items: Post[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        getPostById: (id: string) => Promise<ApiResponse<Post>>
        createPost: (data: {
          title: string
          content: string
          images: string[]
        }) => Promise<ApiResponse<Post>>
        updatePost: (
          id: string,
          data: {
            title?: string
            content?: string
            images?: string[]
          },
        ) => Promise<ApiResponse<Post>>
        deletePost: (id: string) => Promise<ApiResponse<null>>
        likePost: (postId: string) => Promise<ApiResponse<null>>
        unlikePost: (postId: string) => Promise<ApiResponse<null>>
        getUserPosts: (
          userId: string,
          params?: any,
        ) => Promise<
          ApiResponse<{
            items: Post[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        getLikedPosts: (params?: any) => Promise<
          ApiResponse<{
            items: Post[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
      }
      comments: {
        getPostComments: (
          postId: string,
          params?: any,
        ) => Promise<
          ApiResponse<{
            items: Comment[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        createComment: (
          postId: string,
          data: {
            content: string
            parentId?: string
          },
        ) => Promise<ApiResponse<Comment>>
        updateComment: (
          commentId: string,
          data: {
            content: string
          },
        ) => Promise<ApiResponse<Comment>>
        deleteComment: (commentId: string) => Promise<ApiResponse<null>>
        getCommentReplies: (
          commentId: string,
          params?: any,
        ) => Promise<
          ApiResponse<{
            items: Comment[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        getMyComments: (params?: any) => Promise<
          ApiResponse<{
            items: Comment[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
      }
      users: {
        getUserById: (id: string) => Promise<ApiResponse<User>>
        updateProfile: (data: {
          username?: string
          bio?: string
          avatar?: string
        }) => Promise<ApiResponse<User>>
      }
      uploads: {
        uploadFile: (filePath: string) => Promise<
          ApiResponse<{
            url: string
            filename: string
            mimetype: string
          }>
        >
      }
      admin: {
        getAllPosts: (params?: any) => Promise<
          ApiResponse<{
            items: Post[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        deletePost: (id: string) => Promise<ApiResponse<null>>
        getAllUsers: (params?: any) => Promise<
          ApiResponse<{
            items: (User & { _count: { posts: number; comments: number } })[]
            total: number
            page: number
            limit: number
            totalPages: number
          }>
        >
        updateUserRole: (userId: string, role: 'USER' | 'ADMIN') => Promise<ApiResponse<User>>
      }
    }
  }
}
