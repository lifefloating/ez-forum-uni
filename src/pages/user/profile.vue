<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>

<template>
  <view class="profile-container">
    <view class="profile-header">
      <view class="user-info" v-if="userInfo">
        <image :src="userInfo.avatar || '/static/default-avatar.png'" class="user-avatar" />
        <view class="user-details">
          <text class="user-name">{{ userInfo.username }}</text>
          <text class="user-email">{{ userInfo.email }}</text>
        </view>
      </view>

      <view class="login-btn" v-else @click="navigateToLogin">
        <text>登录/注册</text>
      </view>
    </view>

    <view class="profile-menu">
      <view class="menu-item" @click="navigateToMyPosts">
        <uni-icons type="list" size="20" color="#666"></uni-icons>
        <text class="menu-text">我的帖子</text>
        <uni-icons type="right" size="16" color="#ccc"></uni-icons>
      </view>

      <view class="menu-item" @click="navigateToLikedPosts">
        <uni-icons type="heart" size="20" color="#666"></uni-icons>
        <text class="menu-text">我的收藏</text>
        <uni-icons type="right" size="16" color="#ccc"></uni-icons>
      </view>

      <view class="menu-item" @click="navigateToSettings">
        <uni-icons type="gear" size="20" color="#666"></uni-icons>
        <text class="menu-text">设置</text>
        <uni-icons type="right" size="16" color="#ccc"></uni-icons>
      </view>
    </view>

    <view class="logout-btn" v-if="userInfo" @click="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'

defineOptions({
  name: 'Profile',
})

// User info
const userInfo = ref<any>(null)

// Get user info from storage
const getUserInfo = () => {
  const user = uni.getStorageSync('user')
  if (user) {
    userInfo.value = user
  }
}

// Navigate to login page
const navigateToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login',
  })
}

// Navigate to my posts
const navigateToMyPosts = () => {
  if (!userInfo.value) {
    return navigateToLogin()
  }

  uni.navigateTo({
    url: '/pages/forum/index?filter=my',
  })
}

// Navigate to liked posts
const navigateToLikedPosts = () => {
  if (!userInfo.value) {
    return navigateToLogin()
  }

  uni.navigateTo({
    url: '/pages/forum/index?filter=liked',
  })
}

// Navigate to settings
const navigateToSettings = () => {
  if (!userInfo.value) {
    return navigateToLogin()
  }

  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  })
}

// Handle logout
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // Clear storage
        uni.removeStorageSync('token')
        uni.removeStorageSync('user')

        // Reset user info
        userInfo.value = null

        uni.showToast({
          title: '已退出登录',
          icon: 'success',
        })
      }
    },
  })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style lang="scss">
.profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-header {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.user-email {
  font-size: 14px;
  color: #999;
}

.login-btn {
  height: 44px;
  background-color: #ff5a5f;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
}

.profile-menu {
  background-color: #fff;
  margin-bottom: 10px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f5f5f5;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #333;
  margin-left: 10px;
}

.logout-btn {
  margin: 20px;
  height: 44px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5a5f;
  font-size: 16px;
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .profile-header {
    padding: 15px;
  }

  .menu-item {
    padding: 12px 15px;
  }
}
</style>
