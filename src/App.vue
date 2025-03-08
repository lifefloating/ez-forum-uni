<template>
  <view class="app-container">
    <router-view></router-view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

// 是否显示tabBar
const showTabBar = computed(() => {
  const pages = getCurrentPages()
  if (pages.length === 0) return true

  const currentRoute = pages[pages.length - 1].route
  // 在这些页面显示tabBar
  const tabBarPages = ['pages/forum/index', 'pages/user/profile']
  return tabBarPages.includes(currentRoute)
})

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* stylelint-disable selector-type-no-unknown */
button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 单行省略，优先使用 unocss: text-ellipsis
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 两行省略
.ellipsis-2 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 三行省略
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
