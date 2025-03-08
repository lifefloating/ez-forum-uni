<template>
  <view class="custom-tabbar">
    <view class="tabbar-item" @click="switchTab('pages/forum/index')">
      <image
        :src="
          currentPage === 'pages/forum/index'
            ? '/static/tabbar/homeHL.png'
            : '/static/tabbar/home.png'
        "
        class="tabbar-icon"
      />
      <text :class="['tabbar-text', currentPage === 'pages/forum/index' ? 'active' : '']">
        论坛
      </text>
    </view>

    <view class="tabbar-item publish-item" @click="navigateToPublish">
      <view class="publish-btn">
        <text class="publish-icon">+</text>
      </view>
      <text class="tabbar-text">发布</text>
    </view>

    <view class="tabbar-item" @click="switchTab('pages/user/profile')">
      <image
        :src="
          currentPage === 'pages/user/profile'
            ? '/static/tabbar/exampleHL.png'
            : '/static/tabbar/example.png'
        "
        class="tabbar-icon"
      />
      <text :class="['tabbar-text', currentPage === 'pages/user/profile' ? 'active' : '']">
        我的
      </text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 定义组件名称
defineOptions({
  name: 'CustomTabBar',
})

// 当前页面路径
const currentPage = ref('')

// 切换标签页
const switchTab = (path: string) => {
  if (currentPage.value === path) return
  uni.switchTab({
    url: `/${path}`,
  })
}

// 导航到发布页面
const navigateToPublish = () => {
  uni.navigateTo({
    url: '/pages/forum/publish',
  })
}

// 获取当前页面路径
const getCurrentPage = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentRoute = pages[pages.length - 1].route
    currentPage.value = currentRoute
  }
}

onMounted(() => {
  getCurrentPage()
})

onShow(() => {
  getCurrentPage()
})
</script>

<style lang="scss">
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.tabbar-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 3px;
}

.tabbar-text {
  font-size: 10px;
  color: #999999;

  &.active {
    color: #ff5a5f;
  }
}

.publish-item {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.publish-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ff5a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(255, 90, 95, 0.3);
  position: absolute;
  bottom: 15px;
  transform: translateY(-50%);
}

.publish-icon {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
}
</style>
