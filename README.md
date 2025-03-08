<h1 align="center">
  ez-forum
</h1>

<div align="center">

![Vue Version](https://img.shields.io/badge/Vue-3.4.21-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)
![Uni-App](https://img.shields.io/badge/Uni--App-3.0.0-green.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18-green)
![PNPM Version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

</div>

## 📱 项目简介

EZ论坛是一个基于 uni-app 开发的现代化社区交流平台，支持多端部署，包括 H5、微信小程序、App 等。项目采用 Vue 3 + TypeScript + Vite 构建，提供了流畅的用户体验和丰富的社区功能。

## ✨ 主要特性

- 📋 **帖子浏览**：支持瀑布流布局，图文并茂展示社区内容
- 🖼️ **图片轮播**：帖子详情页支持多图轮播展示
- 💬 **评论互动**：支持帖子评论，促进用户交流
- 📝 **内容发布**：用户可发布图文帖子，分享精彩内容
- 👤 **用户中心**：个人资料管理，查看历史发布内容
- 🔒 **用户认证**：完善的登录注册功能，保障账户安全
- 📱 **多端适配**：一套代码，多端运行（H5、小程序、App）

## 🛠️ 技术栈

- **前端框架**：Vue 3 + TypeScript + Vite
- **跨端框架**：uni-app
- **UI 组件**：wot-design-uni + @dcloudio/uni-ui
- **状态管理**：Pinia
- **分页组件**：z-paging
- **CSS 框架**：UnoCSS
- **HTTP 请求**：uni.request + 自定义封装

## 📦 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 7.30

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# H5
pnpm dev:h5

# 微信小程序
pnpm dev:mp-weixin

# App
pnpm dev:app
```

### 打包构建

```bash
# H5
pnpm build:h5

# 微信小程序
pnpm build:mp-weixin

# App
pnpm build:app
```

## 📂 项目结构

```
├── src
│   ├── App.vue                 # 应用入口组件
│   ├── components              # 公共组件
│   │   ├── CommentList.vue     # 评论列表组件
│   │   ├── CustomTabBar.vue    # 自定义底部导航栏组件
│   │   ├── PostCard.vue        # 帖子卡片组件
│   │   └── ...                 # 其他组件
│   ├── composables             # 组合式函数
│   ├── interceptions           # 拦截器
│   ├── pages                   # 页面
│   │   ├── forum               # 论坛相关页面
│   │   ├── post                # 帖子相关页面
│   │   └── user                # 用户相关页面
│   ├── pages.json              # 页面配置
│   ├── service                 # 服务层
│   ├── static                  # 静态资源
│   │   ├── tabbar              # 底部导航图标
│   │   └── images              # 图片资源
│   ├── stores                  # 状态管理
│   ├── styles                  # 全局样式
│   ├── types                   # 类型定义
│   └── utils                   # 工具函数
└── ...
```

## 🎨 UI 展示

应用采用现代化设计风格，界面简洁直观：

- **首页**：瀑布流展示帖子，支持下拉刷新和上拉加载更多
- **帖子详情**：顶部图片轮播，下方显示帖子内容和评论
- **发布页**：支持多图上传和文字编辑
- **个人中心**：展示用户信息和操作选项

## 🧩 底部导航

应用使用原生 tabBar 导航，包含三个主要选项：

- **论坛**：浏览社区内容
- **发布**：创建新帖子
- **我的**：个人中心

tabBar 图标位于 `src/static/tabbar/` 目录，包括：

- home.png / homeHL.png：论坛图标（普通/高亮）
- publish.png / publishHL.png：发布图标（普通/高亮）
- example.png / exampleHL.png：个人中心图标（普通/高亮）

## 📋 功能说明

### 帖子列表

- 瀑布流布局展示帖子
- 每个帖子卡片显示标题、首图、浏览量和评论数
- 点击卡片进入帖子详情

### 帖子详情

- 顶部图片轮播展示所有图片
- 下方显示帖子标题、内容和评论
- 支持评论交互

### 发布功能

- 支持多图上传
- 文字内容编辑
- 发布后自动刷新列表

### 用户中心

- 个人信息展示
- 我的帖子查看
- 账户设置

## 📄 License

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 EZ论坛团队
