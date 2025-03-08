import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'EZ论坛',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/homeHL.png',
        pagePath: 'pages/forum/index',
        text: '论坛',
      },
      {
        iconPath: 'static/tabbar/example.png',
        selectedIconPath: 'static/tabbar/exampleHL.png',
        pagePath: 'pages/user/profile',
        text: '我的',
      },
    ],
  },
  pages: [
    {
      path: 'pages/forum/index',
      style: {
        navigationBarTitleText: '论坛',
      },
    },
    {
      path: 'pages/forum/publish',
      style: {
        navigationBarTitleText: '发布帖子',
      },
    },
    {
      path: 'pages/post/detail',
      style: {
        navigationBarTitleText: '帖子详情',
      },
    },
    {
      path: 'pages/user/login',
      style: {
        navigationBarTitleText: '登录',
      },
    },
    {
      path: 'pages/user/profile',
      style: {
        navigationBarTitleText: '个人中心',
      },
    },
    {
      path: 'pages/user/register',
      style: {
        navigationBarTitleText: '注册',
      },
    },
  ],
})
