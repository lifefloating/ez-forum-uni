<route lang="json5">
{
  style: {
    navigationBarTitleText: '发布帖子',
  },
}
</route>

<template>
  <view class="publish-container">
    <view class="publish-form">
      <view class="form-item">
        <input
          class="title-input"
          type="text"
          v-model="formData.title"
          placeholder="Enter the title to get more likes (2-30 words)"
          maxlength="30"
        />
      </view>

      <view class="form-item">
        <textarea
          class="content-textarea"
          v-model="formData.content"
          placeholder="Please enter text"
          maxlength="2000"
        />
      </view>

      <view class="form-item">
        <view class="image-upload">
          <view class="image-item" v-for="(image, index) in formData.images" :key="index">
            <image :src="image" class="preview-image" mode="aspectFill" />
            <view class="delete-btn" @click="removeImage(index)">
              <uni-icons type="closeempty" size="20" color="#fff"></uni-icons>
            </view>
          </view>

          <view class="upload-btn" @click="chooseImage" v-if="formData.images.length < 9">
            <uni-icons type="plusempty" size="30" color="#ddd"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <view class="publish-btn" @click="submitPost">
      <text>发布</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'

defineOptions({
  name: 'PublishPost',
})

// Form data
const formData = reactive({
  title: '',
  content: '',
  images: [] as string[],
})

// Choose image
const chooseImage = () => {
  uni.chooseImage({
    count: 9 - formData.images.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // Upload images
      uploadImages(res.tempFilePaths as string[])
    },
  })
}

// Upload images
const uploadImages = async (tempFilePaths: string[]) => {
  uni.showLoading({
    title: '上传中...',
  })

  try {
    // In a real app, you would upload the images to a server
    // For this example, we'll just use the local paths
    formData.images = [...formData.images, ...tempFilePaths]

    uni.hideLoading()
  } catch (error) {
    console.error('Failed to upload images:', error)
    uni.hideLoading()
    uni.showToast({
      title: '上传失败',
      icon: 'none',
    })
  }
}

// Remove image
const removeImage = (index: number) => {
  formData.images.splice(index, 1)
}

// Submit post
const submitPost = async () => {
  // Validate form
  if (!formData.title.trim()) {
    return uni.showToast({
      title: '请输入标题',
      icon: 'none',
    })
  }

  if (!formData.content.trim()) {
    return uni.showToast({
      title: '请输入内容',
      icon: 'none',
    })
  }

  uni.showLoading({
    title: '发布中...',
  })

  try {
    // Call API to create post
    const response = await uni.$api.posts.createPost({
      title: formData.title,
      content: formData.content,
      images: formData.images,
    })

    uni.hideLoading()

    if (response.code === 'success') {
      uni.showToast({
        title: '发布成功',
        icon: 'success',
      })

      // Navigate back to forum
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({
        title: response.message || '发布失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('Failed to publish post:', error)
    uni.hideLoading()
    uni.showToast({
      title: '发布失败',
      icon: 'none',
    })
  }
}
</script>

<style lang="scss">
.publish-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
}

.publish-form {
  flex: 1;
}

.form-item {
  margin-bottom: 20px;
}

.title-input {
  width: 100%;
  height: 44px;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  padding: 0 10px;
}

.content-textarea {
  width: 100%;
  height: 200px;
  border: none;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px;
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
}

.image-item {
  width: calc(33.33% - 10px);
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  position: relative;

  &:nth-child(3n) {
    margin-right: 0;
  }
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: calc(33.33% - 10px);
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish-btn {
  height: 44px;
  background-color: #ff5a5f;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  margin-top: 20px;
}

/* Responsive styles for mobile */
@media screen and (max-width: 768px) {
  .publish-container {
    padding: 15px;
  }

  .image-item {
    height: 80px;
  }

  .upload-btn {
    height: 80px;
  }
}
</style>
