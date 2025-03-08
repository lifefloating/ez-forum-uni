<route lang="json5">
{
  style: {
    navigationBarTitleText: '论坛',
  },
}
</route>

<template>
  <view class="forum-container">
    <view class="forum-tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="forum-tab"
        :class="{ active: activeTab === tab.value }"
        @click="changeTab(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <view class="forum-content">
      <post-waterfall ref="waterfallRef" :filter="activeTab" @refresh="handleRefresh" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import PostWaterfall from '@/components/PostWaterfall.vue'

defineOptions({
  name: 'ForumIndex',
})

// Tabs for different post filters
const tabs = [
  { label: '最新', value: 'latest' },
  { label: '热门', value: 'hot' },
  { label: '我的', value: 'my' },
  { label: '喜欢', value: 'liked' },
]

// Active tab
const activeTab = ref('latest')

// Reference to waterfall component
const waterfallRef = ref(null)

// Change tab
const changeTab = (value: string) => {
  console.log(`Changing tab to: ${value}`)
  activeTab.value = value
}

// Handle refresh
const handleRefresh = () => {
  console.log('Handling refresh')
  // Additional refresh logic if needed
}

// Check login status for my/liked tabs
const checkLoginForTabs = () => {
  const token = uni.getStorageSync('token')
  if (!token && (activeTab.value === 'my' || activeTab.value === 'liked')) {
    uni.showModal({
      title: '提示',
      content: '请先登录',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/user/login',
          })
        } else {
          activeTab.value = 'latest'
        }
      },
    })
  }
}

// Watch tab changes
watch(
  () => activeTab.value,
  (newVal, oldVal) => {
    console.log(`Active tab changed from ${oldVal} to ${newVal}`)
    if (newVal === 'my' || newVal === 'liked') {
      checkLoginForTabs()
    }
  },
)

// Component mounted
onMounted(() => {
  console.log('ForumIndex component mounted')
})
</script>

<style lang="scss">
.forum-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.forum-tabs {
  display: flex;
  background-color: #fff;
  padding: 0 12px;
  height: 44px;
  border-bottom: 1px solid #eee;
}

.forum-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  font-size: 14px;
  color: #666;
  position: relative;

  &.active {
    color: #ff5a5f;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background-color: #ff5a5f;
      border-radius: 3px;
    }
  }
}

.forum-content {
  flex: 1;
  overflow: hidden;
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .forum-tab {
    padding: 0 12px;
    font-size: 13px;
  }
}
</style>
