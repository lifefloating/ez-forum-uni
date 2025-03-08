<template>
  <view class="comment-list">
    <!-- Comment count -->
    <view class="comment-count">
      <text class="count-text">评论 ({{ total }})</text>
    </view>

    <!-- Comment input -->
    <view class="comment-input-container" v-if="isLoggedIn">
      <view class="comment-input-wrapper">
        <input
          class="comment-input"
          type="text"
          v-model="commentContent"
          :placeholder="replyTo ? `回复 ${replyTo.author.username}` : '添加评论...'"
          @confirm="submitComment"
        />
        <button class="comment-submit" :disabled="!commentContent.trim()" @click="submitComment">
          发送
        </button>
      </view>
      <view class="reply-info" v-if="replyTo">
        <text>回复: {{ replyTo.author.username }}</text>
        <text class="cancel-reply" @click="cancelReply">取消</text>
      </view>
    </view>
    <view class="login-tip" v-else>
      <text @click="goToLogin">登录</text>
      后参与评论
    </view>

    <!-- Comments list -->
    <view class="comments-container">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      <view v-else-if="comments.length === 0" class="no-comments">
        <text>暂无评论，快来发表第一条评论吧！</text>
      </view>
      <view v-else class="comments-list">
        <view v-for="comment in comments" :key="comment.id" class="comment-item">
          <!-- Comment main content -->
          <view class="comment-main">
            <image
              class="avatar"
              :src="comment.author.avatar || '/static/default-avatar.png'"
              mode="aspectFill"
            />
            <view class="comment-content">
              <view class="comment-header">
                <text class="username">{{ comment.author.username }}</text>
                <text class="time">{{ formatTime(comment.createdAt) }}</text>
              </view>
              <text class="content">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="action-btn" @click="handleReply(comment)">回复</text>
                <text class="action-btn" v-if="canDelete(comment)" @click="handleDelete(comment)">
                  删除
                </text>
              </view>
            </view>
          </view>

          <!-- Replies -->
          <view class="replies-container" v-if="comment.replies && comment.replies.length > 0">
            <view v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <image
                class="avatar small"
                :src="reply.author.avatar || '/static/default-avatar.png'"
                mode="aspectFill"
              />
              <view class="reply-content">
                <view class="reply-header">
                  <text class="username">{{ reply.author.username }}</text>
                  <text class="time">{{ formatTime(reply.createdAt) }}</text>
                </view>
                <text class="content">{{ reply.content }}</text>
                <view class="reply-actions">
                  <text class="action-btn" @click="handleReply(comment, reply)">回复</text>
                  <text class="action-btn" v-if="canDelete(reply)" @click="handleDelete(reply)">
                    删除
                  </text>
                </view>
              </view>
            </view>
            <view
              class="view-more"
              v-if="comment.replies.length < comment.replyCount"
              @click="loadMoreReplies(comment)"
            >
              <text>查看更多回复</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Load more -->
      <view class="load-more" v-if="hasMore" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineComponent } from 'vue'
import { Comment } from '../service/types'
import { useUserStore } from '../store/user'

// 定义组件名称，用于调试
defineOptions({
  name: 'CommentList',
})

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

// State
const comments = ref<Comment[]>([])
const loading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(0)
const commentContent = ref('')
const replyTo = ref<{ id: string; author: { username: string } } | null>(null)
const userStore = useUserStore()

// Computed
const isLoggedIn = computed(() => userStore.isLogined)
const currentUser = computed(() => userStore.userInfo)
const hasMore = computed(() => page.value < totalPages.value)

// Methods
const loadComments = async (reset = false) => {
  if (loading.value) return

  loading.value = true

  try {
    if (reset) {
      page.value = 1
      comments.value = []
    }

    // Check if the comments API is available
    if (!uni.$api.comments) {
      console.error('Comments API not available')
      return
    }

    const response = await uni.$api.comments.getPostComments(props.postId, {
      page: page.value,
      limit: limit.value,
      order: 'desc',
    })

    if (response.code === 'success') {
      if (reset) {
        comments.value = response.data.items
      } else {
        comments.value = [...comments.value, ...response.data.items]
      }

      total.value = response.data.total
      totalPages.value = response.data.totalPages
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
    uni.showToast({
      title: '加载评论失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

const loadMoreReplies = async (comment: Comment) => {
  try {
    // Check if the comments API is available
    if (!uni.$api.comments) {
      console.error('Comments API not available')
      return
    }

    const response = await uni.$api.comments.getCommentReplies(comment.id, {
      page: 1,
      limit: 20,
      order: 'asc',
    })

    if (response.code === 'success') {
      // Find the comment and update its replies
      const index = comments.value.findIndex((c) => c.id === comment.id)
      if (index !== -1) {
        comments.value[index].replies = response.data.items
      }
    }
  } catch (error) {
    console.error('Failed to load replies:', error)
    uni.showToast({
      title: '加载回复失败',
      icon: 'none',
    })
  }
}

const submitComment = async () => {
  if (!commentContent.value.trim() || !isLoggedIn.value) return

  try {
    // Check if the comments API is available
    if (!uni.$api.comments) {
      console.error('Comments API not available')
      return
    }

    const data = {
      content: commentContent.value.trim(),
      parentId: replyTo.value?.id,
    }

    const response = await uni.$api.comments.createComment(props.postId, data)

    if (response.code === 'success') {
      uni.showToast({
        title: '评论成功',
        icon: 'success',
      })

      commentContent.value = ''
      cancelReply()

      // Reload comments to show the new one
      loadComments(true)
    }
  } catch (error) {
    console.error('Failed to submit comment:', error)
    uni.showToast({
      title: '评论失败',
      icon: 'none',
    })
  }
}

const handleReply = (comment: Comment, reply?: Comment) => {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }

  replyTo.value = reply || comment
}

const cancelReply = () => {
  replyTo.value = null
}

const handleDelete = async (comment: Comment) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条评论吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // Check if the comments API is available
          if (!uni.$api.comments) {
            console.error('Comments API not available')
            return
          }

          const response = await uni.$api.comments.deleteComment(comment.id)

          if (response.code === 'success') {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
            })

            // Reload comments
            loadComments(true)
          }
        } catch (error) {
          console.error('Failed to delete comment:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
      }
    },
  })
}

const canDelete = (comment: Comment) => {
  if (!isLoggedIn.value) return false

  // User can delete their own comments or if they are admin
  return comment.author.id === currentUser.value?.id || currentUser.value?.role === 'ADMIN'
}

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++
    loadComments()
  }
}

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login',
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  // Less than 1 minute
  if (diff < 60 * 1000) {
    return '刚刚'
  }

  // Less than 1 hour
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`
  }

  // Less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  }

  // Less than 30 days
  if (diff < 30 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  }

  // Format as date
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Watch for postId changes
watch(
  () => props.postId,
  () => {
    loadComments(true)
  },
)

// Load comments on mount
onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comment-list {
  padding: 16px;
  background-color: #fff;
}

.comment-count {
  margin-bottom: 16px;
}

.count-text {
  font-size: 18px;
  font-weight: bold;
}

.comment-input-container {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.comment-input-wrapper {
  display: flex;
  align-items: center;
}

.comment-input {
  flex: 1;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0 16px;
  font-size: 14px;
}

.comment-submit {
  margin-left: 10px;
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  background-color: #007aff;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
}

.comment-submit[disabled] {
  background-color: #ccc;
}

.reply-info {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
}

.cancel-reply {
  color: #007aff;
}

.login-tip {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
  text-align: center;
}

.login-tip text {
  color: #007aff;
}

.loading,
.no-comments {
  padding: 20px 0;
  text-align: center;
  color: #999;
}

.comment-item {
  margin-bottom: 20px;
}

.comment-main {
  display: flex;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.avatar.small {
  width: 30px;
  height: 30px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.username {
  font-weight: bold;
  font-size: 14px;
}

.time {
  font-size: 12px;
  color: #999;
}

.content {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.comment-actions,
.reply-actions {
  display: flex;
}

.action-btn {
  font-size: 12px;
  color: #666;
  margin-right: 16px;
}

.replies-container {
  margin-left: 52px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.reply-item {
  display: flex;
  margin-bottom: 12px;
}

.reply-content {
  flex: 1;
}

.view-more {
  font-size: 12px;
  color: #007aff;
  text-align: center;
  margin-top: 8px;
}

.load-more {
  text-align: center;
  padding: 16px 0;
  color: #007aff;
  font-size: 14px;
}
</style>
