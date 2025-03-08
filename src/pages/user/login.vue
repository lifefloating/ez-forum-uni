<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>

<template>
  <view class="login-container">
    <view class="login-header">
      <text class="login-title">登录账号</text>
    </view>

    <view class="login-form">
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

      <view class="login-btn" @click="handleLogin">
        <text>登录</text>
      </view>

      <view class="register-link" @click="navigateToRegister">
        <text>没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

defineOptions({
  name: 'Login',
})

// Form data
const formData = reactive({
  email: '',
  password: '',
})

// Handle login
const handleLogin = async () => {
  // Validate form
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

  uni.showLoading({
    title: '登录中...',
  })

  try {
    // Call API to login
    const response = await uni.$api.auth.login({
      email: formData.email,
      password: formData.password,
    })

    uni.hideLoading()

    if (response.code === 'success') {
      // Save token and user info
      uni.setStorageSync('token', response.data.token)
      uni.setStorageSync('user', response.data.user)

      uni.showToast({
        title: '登录成功',
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
        title: response.message || '登录失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('Failed to login:', error)
    uni.hideLoading()
    uni.showToast({
      title: '登录失败',
      icon: 'none',
    })
  }
}

// Navigate to register page
const navigateToRegister = () => {
  uni.navigateTo({
    url: '/pages/user/register',
  })
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
}

.login-header {
  margin-top: 40px;
  margin-bottom: 40px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.login-form {
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

.login-btn {
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

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #ff5a5f;
  font-size: 14px;
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .login-container {
    padding: 15px;
  }

  .login-header {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}
</style>
