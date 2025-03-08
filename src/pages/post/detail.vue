<route lang="json5">
{
  style: {
    navigationBarTitleText: '帖子详情',
  },
}
</route>

<template>
  <view class="post-detail-container">
    <view class="post-detail" v-if="post">
      <view class="post-header">
        <view class="post-author">
          <image :src="post.author.avatar || '/static/default-avatar.png'" class="author-avatar" />
          <view class="author-info">
            <text class="author-name">{{ post.author.username }}</text>
            <text class="post-time">{{ formatTime(post.createdAt) }}</text>
          </view>
        </view>

        <!-- 添加更多操作按钮 -->
        <view class="post-actions" v-if="canEditComputed">
          <view class="more-icon" @click="showActionSheet">⋮</view>
        </view>
      </view>

      <view class="post-content">
        <!-- 图片轮播图 - 移到内容上方 -->
        <swiper
          v-if="post.images && post.images.length > 0"
          class="post-images-swiper"
          :indicator-dots="true"
          :autoplay="false"
          :interval="3000"
          :duration="500"
          indicator-active-color="#ff5a5f"
          indicator-color="rgba(0, 0, 0, 0.3)"
        >
          <swiper-item v-for="(image, index) in post.images" :key="index" class="swiper-item">
            <image
              :src="image"
              class="swiper-image"
              mode="aspectFit"
              @click="previewImage(index)"
            />
          </swiper-item>
        </swiper>

        <view class="post-title">{{ post.title }}</view>
        <view class="post-text">{{ post.content }}</view>
      </view>

      <view class="post-stats">
        <view class="post-stat">
          <text class="icon-text">👁️</text>
          <text>{{ post.views }}</text>
        </view>
        <view class="post-stat">
          <text class="icon-text">💬</text>
          <text>{{ post.commentCount }}</text>
        </view>
        <view class="post-stat" @click="toggleLike">
          <text class="icon-text" :class="{ 'icon-liked': post.isLiked }">
            {{ post.isLiked ? '❤️' : '♡' }}
          </text>
          <text>{{ post.likeCount }}</text>
        </view>
      </view>

      <comment-list :postId="postId" />
    </view>

    <view class="comment-input-container">
      <input
        class="comment-input"
        type="text"
        v-model="commentText"
        placeholder="说点什么..."
        confirm-type="send"
        @confirm="submitComment"
      />
      <view class="send-btn" @click="submitComment">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import '../../components/CommentList.vue'
import { useUserStore } from '../../store/user'

// 定义组件名称
defineOptions({
  name: 'Detail',
})

// Post ID from route params
const postId = ref('')
const post = ref(null)
const loading = ref(false)
const commentText = ref('')
const userStore = useUserStore()

// 判断当前用户是否可以编辑帖子
const canEditComputed = computed(() => {
  if (!post.value || !userStore.userInfo) {
    return false
  }

  // 用户是帖子作者或管理员可以编辑
  return post.value.author.id === userStore.userInfo.id || userStore.userInfo.role === 'ADMIN'
})

// 显示操作菜单
const showActionSheet = () => {
  uni.showActionSheet({
    itemList: ['编辑帖子', '删除帖子'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 编辑帖子
        editPost()
      } else if (res.tapIndex === 1) {
        // 删除帖子
        deletePost()
      }
    },
  })
}

// 编辑帖子
const editPost = () => {
  uni.navigateTo({
    url: `/pages/forum/publish?id=${postId.value}`,
  })
}

// 删除帖子
const deletePost = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这篇帖子吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await uni.$api.posts.deletePost(postId.value)
          if (response.code === 'success') {
            uni.showToast({
              title: '删除成功',
              icon: 'success',
            })

            // 返回上一页
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          } else {
            uni.showToast({
              title: response.message || '删除失败',
              icon: 'none',
            })
          }
        } catch (error) {
          console.error('Failed to delete post:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none',
          })
        }
      }
    },
  })
}

// Get post ID from route params
onLoad((options) => {
  if (options && options.id) {
    postId.value = options.id
    getPostDetails()
  } else {
    uni.showToast({
      title: '帖子ID不存在',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

// Get post details
const getPostDetails = async () => {
  loading.value = true

  try {
    const response = await uni.$api.posts.getPostById(postId.value)

    if (response.code === 'success') {
      post.value = response.data
    } else {
      uni.showToast({
        title: response.message || '获取帖子失败',
        icon: 'none',
      })
    }
  } catch (error) {
    uni.showToast({
      title: '获取帖子失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// Preview image
const previewImage = (index: number) => {
  uni.previewImage({
    urls: post.value.images,
    current: post.value.images[index],
  })
}

// Toggle like
const toggleLike = async () => {
  try {
    if (!uni.getStorageSync('token')) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      })
      return
    }

    if (post.value.isLiked) {
      // Unlike
      const response = await uni.$api.posts.unlikePost(postId.value)
      if (response.code === 'success') {
        post.value.isLiked = false
        post.value.likeCount--
      }
    } else {
      // Like
      const response = await uni.$api.posts.likePost(postId.value)
      if (response.code === 'success') {
        post.value.isLiked = true
        post.value.likeCount++
      }
    }
  } catch (error) {
    uni.showToast({
      title: '操作失败',
      icon: 'none',
    })
  }
}

// Format time
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

// Submit comment
const submitComment = async () => {
  if (!commentText.value.trim()) {
    uni.showToast({
      title: '请输入评论内容',
      icon: 'none',
    })
    return
  }

  try {
    // Check if the comments API is available
    if (!uni.$api.comments) {
      return
    }

    const response = await uni.$api.comments.createComment(postId.value, {
      content: commentText.value.trim(),
    })

    if (response.code === 'success') {
      uni.showToast({
        title: '评论成功',
        icon: 'success',
      })
      commentText.value = ''

      // Refresh comments
      if (post.value) {
        post.value.commentCount += 1
      }
    } else {
      uni.showToast({
        title: response.message || '评论失败',
        icon: 'none',
      })
    }
  } catch (error) {
    uni.showToast({
      title: '评论失败',
      icon: 'none',
    })
  }
}

// Component mounted
onMounted(async () => {
  // 检查用户登录状态
  const token = uni.getStorageSync('token')

  // 如果有token但没有用户信息，尝试获取用户信息
  if (token && !userStore.userInfo?.id) {
    try {
      const response = await uni.$api.auth.getMe()
      if (response.code === 'success') {
        userStore.setUserInfo(response.data)
      }
    } catch (error) {
      // 处理错误
    }
  }
})
</script>

<style lang="scss">
.post-detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.post-detail {
  flex: 1;
  padding-bottom: 60px;
}

.post-header {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  display: flex;
  align-items: center;
}

.post-actions {
  padding: 5px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-content {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 10px;
}

/* 轮播图样式调整 */
.post-images-swiper {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px; /* 添加底部间距 */
}

.swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.post-stats {
  display: flex;
  background-color: #fff;
  padding: 12px 16px;
  margin-bottom: 10px;
}

.post-stat {
  display: flex;
  align-items: center;
  margin-right: 24px;
  font-size: 12px;
  color: #666;

  text {
    margin-left: 4px;
  }
}

.icon-text {
  font-size: 16px;
}

.icon-liked {
  color: #ff5a5f;
}

.post-comments {
  background-color: #fff;
  padding: 16px;
}

.comments-header {
  margin-bottom: 16px;
}

.comments-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.comments-list {
  display: flex;
  flex-direction: column;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.no-comments {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
}

.comment-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
}

.comment-input {
  flex: 1;
  height: 36px;
  background-color: #f5f5f5;
  border-radius: 18px;
  padding: 0 12px;
  font-size: 14px;
}

.send-btn {
  width: 60px;
  height: 36px;
  background-color: #ff5a5f;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;

  text {
    color: #fff;
    font-size: 14px;
  }
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .post-header,
  .post-content,
  .post-stats,
  .post-comments {
    padding: 12px;
  }

  .post-title {
    font-size: 16px;
  }

  .post-images-swiper {
    height: 240px;
  }

  .comment-input-container {
    padding: 8px 12px;
  }
}

.more-icon {
  font-size: 28px;
  color: #333;
  font-weight: bold;
  padding: 0 5px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
