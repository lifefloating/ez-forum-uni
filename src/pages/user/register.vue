<route lang="json5">
{
  style: {
    navigationBarTitleText: '注册',
  },
}
</route>

<template>
  <view class="register-container">
    <view class="register-header">
      <text class="register-title">注册账号</text>
    </view>

    <view class="register-form">
      <view class="form-item">
        <text class="form-label">用户名</text>
        <input
          class="form-input"
          type="text"
          v-model="formData.username"
          placeholder="请输入用户名"
        />
      </view>

      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input class="form-input" type="text" v-model="formData.email" placeholder="请输入邮箱" />
      </view>

      <view class="form-item">
        <text class="form-label">密码</text>
        <input
          class="form-input"
          type="password"
          v-model="formData.password"
          placeholder="请输入密码"
        />
      </view>

      <view class="form-item">
        <text class="form-label">确认密码</text>
        <input
          class="form-input"
          type="password"
          v-model="formData.confirmPassword"
          placeholder="请再次输入密码"
        />
      </view>

      <view class="register-btn" @click="handleRegister">
        <text>注册</text>
      </view>

      <view class="login-link" @click="navigateToLogin">
        <text>已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

defineOptions({
  name: 'Register',
})

// Form data
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Handle register
const handleRegister = async () => {
  // Validate form
  if (!formData.username.trim()) {
    return uni.showToast({
      title: '请输入用户名',
      icon: 'none',
    })
  }

  if (!formData.email.trim()) {
    return uni.showToast({
      title: '请输入邮箱',
      icon: 'none',
    })
  }

  if (!formData.password.trim()) {
    return uni.showToast({
      title: '请输入密码',
      icon: 'none',
    })
  }

  if (formData.password !== formData.confirmPassword) {
    return uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none',
    })
  }

  uni.showLoading({
    title: '注册中...',
  })

  try {
    // Call API to register
    const response = await uni.$api.auth.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })

    uni.hideLoading()

    if (response.code === 'success') {
      // Save token and user info
      uni.setStorageSync('token', response.data.token)
      uni.setStorageSync('user', response.data.user)

      uni.showToast({
        title: '注册成功',
        icon: 'success',
      })

      // Navigate to forum
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/forum/index',
        })
      }, 1500)
    } else {
      uni.showToast({
        title: response.message || '注册失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('Failed to register:', error)
    uni.hideLoading()
    uni.showToast({
      title: '注册失败',
      icon: 'none',
    })
  }
}

// Navigate to login page
const navigateToLogin = () => {
  uni.navigateTo({
    url: '/pages/user/login',
  })
}
</script>

<style lang="scss">
.register-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
}

.register-header {
  margin-top: 40px;
  margin-bottom: 40px;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.register-form {
  flex: 1;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  height: 44px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
}

.register-btn {
  height: 44px;
  background-color: #ff5a5f;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  margin-top: 30px;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #ff5a5f;
  font-size: 14px;
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .register-container {
    padding: 15px;
  }

  .register-header {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
</style>
