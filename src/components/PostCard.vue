<template>
  <view class="post-card" @click="navigateToDetail">
    <view class="post-card-header">
      <view class="post-card-author">
        <image :src="post.author.avatar || '/static/default-avatar.png'" class="post-card-avatar" />
        <text class="post-card-username">{{ post.author.username }}</text>
      </view>
      <text class="post-card-time">{{ formatTime(post.createdAt) }}</text>
    </view>

    <view class="post-card-title">{{ post.title }}</view>

    <view class="post-card-image-container" v-if="post.images && post.images.length > 0">
      <image
        :src="post.images[0]"
        class="post-card-image-single"
        mode="aspectFill"
        @click.stop="previewImage(0)"
      />
      <view class="image-count" v-if="post.images.length > 1">
        <text>+{{ post.images.length - 1 }}</text>
      </view>
    </view>

    <view class="post-card-footer">
      <view class="post-card-stats">
        <view class="post-card-stat">
          <uni-icons type="eye" size="16"></uni-icons>
          <text>{{ post.views }}</text>
        </view>
        <view class="post-card-stat">
          <uni-icons type="chat" size="16"></uni-icons>
          <text>{{ post.commentCount }}</text>
        </view>
        <view class="post-card-stat" @click.stop="toggleLike">
          <uni-icons
            :type="post.isLiked ? 'heart-filled' : 'heart'"
            size="16"
            :color="post.isLiked ? '#ff5a5f' : '#666'"
          ></uni-icons>
          <text>{{ post.likeCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { defineComponent, onMounted } from 'vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['like', 'unlike'],
  setup(props, { emit }) {
    // Format time to relative time (e.g., "3 hours ago")
    const formatTime = (time: string) => {
      return dayjs(time).fromNow()
    }

    // Navigate to post detail page
    const navigateToDetail = () => {
      console.log(`Navigating to post detail: ${props.post.id}`)
      // 使用绝对路径
      uni.navigateTo({
        url: `/pages/post/detail?id=${props.post.id}`,
        fail: (err) => {
          console.error('Navigation failed:', err)
          // 尝试使用相对路径
          uni.navigateTo({
            url: `../post/detail?id=${props.post.id}`,
            fail: (err2) => {
              console.error('Second navigation attempt failed:', err2)
            },
          })
        },
      })
    }

    // Preview image
    const previewImage = (index: number) => {
      console.log(`Previewing image at index: ${index}`)
      uni.previewImage({
        urls: props.post.images,
        current: props.post.images[index],
      })
    }

    // Toggle like status
    const toggleLike = () => {
      console.log(`Toggling like for post: ${props.post.id}, current status: ${props.post.isLiked}`)
      if (props.post.isLiked) {
        emit('unlike', props.post.id)
      } else {
        emit('like', props.post.id)
      }
    }

    // Component mounted
    onMounted(() => {
      console.log(`PostCard mounted for post: ${props.post.id}`)
    })

    return {
      formatTime,
      navigateToDetail,
      previewImage,
      toggleLike,
    }
  },
})
</script>

<style lang="scss">
.post-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &-author {
    display: flex;
    align-items: center;
  }

  &-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
  }

  &-username {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  &-time {
    font-size: 12px;
    color: #999;
  }

  &-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  &-image-container {
    position: relative;
    width: 100%;
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
  }

  &-image-single {
    width: 100%;
    height: 200px;
    border-radius: 8px;
  }

  .image-count {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-stats {
    display: flex;
    align-items: center;
  }

  &-stat {
    display: flex;
    align-items: center;
    margin-right: 16px;
    font-size: 12px;
    color: #666;

    text {
      margin-left: 4px;
    }
  }
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .post-card {
    padding: 12px;

    &-image-single {
      height: 160px;
    }
  }
}
</style>
