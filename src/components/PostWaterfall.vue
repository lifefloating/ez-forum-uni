<template>
  <view class="post-waterfall">
    <z-paging
      ref="paging"
      v-model="postList"
      @query="queryList"
      :default-page-size="10"
      :show-refresher-when-reload="true"
      :auto-show-back-to-top="true"
      :refresher-threshold="80"
      :refresher-default-text="'下拉刷新'"
      :refresher-pulling-text="'释放更新'"
      :refresher-refreshing-text="'加载中...'"
      :empty-view-text="'暂无数据'"
      :loading-more-no-more-text="'没有更多了'"
      :loading-more-loading-text="'加载中...'"
      :auto-clean-list-when-reload="true"
      :use-virtual-list="true"
      :safe-area-inset-bottom="true"
    >
      <view class="waterfall-container">
        <view class="waterfall-column">
          <post-card
            v-for="post in leftColumn"
            :key="post.id"
            :post="post"
            @like="handleLike"
            @unlike="handleUnlike"
          />
        </view>
        <view class="waterfall-column">
          <post-card
            v-for="post in rightColumn"
            :key="post.id"
            :post="post"
            @like="handleLike"
            @unlike="handleUnlike"
          />
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent, onMounted } from 'vue'
import PostCard from './PostCard.vue'

export default defineComponent({
  name: 'PostWaterfall',
  components: {
    PostCard,
  },
  props: {
    filter: {
      type: String,
      default: 'latest',
      validator: (value: string) => ['latest', 'hot', 'my', 'liked'].includes(value),
    },
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    // Reference to z-paging component
    const paging = ref(null)

    // Post list data
    const postList = ref<any[]>([])

    // Computed properties for waterfall layout
    const leftColumn = computed(() => {
      return postList.value.filter((_, index) => index % 2 === 0)
    })

    const rightColumn = computed(() => {
      return postList.value.filter((_, index) => index % 2 === 1)
    })

    // Watch for filter changes
    watch(
      () => props.filter,
      (newVal, oldVal) => {
        console.log(`Filter changed from ${oldVal} to ${newVal}`)
        reload()
      },
    )

    // Query list data
    const queryList = async (pageNo: number, pageSize: number) => {
      try {
        console.log(
          `Querying posts with filter: ${props.filter}, page: ${pageNo}, limit: ${pageSize}`,
        )
        // Call API to get post list
        const response = await uni.$api.posts.getPosts({
          page: pageNo,
          limit: pageSize,
          filter: props.filter,
          sort: 'createdAt',
          order: 'desc',
        })

        // Check if response is successful
        if (response.code === 'success') {
          console.log(`Loaded ${response.data.items.length} posts, total: ${response.data.total}`)
          // Complete loading with data and total count
          paging.value.complete(response.data.items, response.data.total)
        } else {
          console.error('Failed to load posts:', response.message)
          // Complete loading with empty data
          paging.value.complete(false)
        }
      } catch (error) {
        console.error('Failed to load posts:', error)
        // Complete loading with error
        paging.value.complete(false)
      }
    }

    // Reload data
    const reload = () => {
      if (paging.value) {
        console.log('Reloading posts...')
        paging.value.reload()
      } else {
        // 如果 paging 还没有初始化，设置一个定时器稍后再试
        console.log('Paging not initialized, trying again in 100ms...')
        setTimeout(() => {
          if (paging.value) {
            paging.value.reload()
          } else {
            console.error('Paging still not initialized after timeout')
          }
        }, 100)
      }
    }

    // Handle like action
    const handleLike = async (postId: string) => {
      try {
        const response = await uni.$api.posts.likePost(postId)
        if (response.code === 'success') {
          // Update post in the list
          const index = postList.value.findIndex((post) => post.id === postId)
          if (index !== -1) {
            postList.value[index].isLiked = true
            postList.value[index].likeCount += 1
          }
        }
      } catch (error) {
        console.error('Failed to like post:', error)
        uni.showToast({
          title: '点赞失败',
          icon: 'none',
        })
      }
    }

    // Handle unlike action
    const handleUnlike = async (postId: string) => {
      try {
        const response = await uni.$api.posts.unlikePost(postId)
        if (response.code === 'success') {
          // Update post in the list
          const index = postList.value.findIndex((post) => post.id === postId)
          if (index !== -1) {
            postList.value[index].isLiked = false
            postList.value[index].likeCount -= 1
          }
        }
      } catch (error) {
        console.error('Failed to unlike post:', error)
        uni.showToast({
          title: '取消点赞失败',
          icon: 'none',
        })
      }
    }

    // 组件挂载后初始化
    onMounted(() => {
      console.log('PostWaterfall component mounted')
      // 确保 paging 已经初始化
      setTimeout(() => {
        if (paging.value) {
          console.log('Initial loading of posts...')
        } else {
          console.error('Paging not initialized in onMounted')
        }
      }, 100)
    })

    return {
      paging,
      postList,
      leftColumn,
      rightColumn,
      queryList,
      reload,
      handleLike,
      handleUnlike,
    }
  },
})
</script>

<style lang="scss">
.post-waterfall {
  width: 100%;
  height: 100%;

  .waterfall-container {
    display: flex;
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
  }

  .waterfall-column {
    flex: 1;
    padding: 0 6px;
    box-sizing: border-box;
  }
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .post-waterfall {
    .waterfall-container {
      padding: 8px;
    }

    .waterfall-column {
      padding: 0 4px;
    }
  }
}
</style>
