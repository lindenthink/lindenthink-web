---
description: 
globs: 
alwaysApply: false
---
# LindenThink Web 项目结构规则

本项目是一个基于 Vue 3 + JavaScript + Vite 的前端工具集合网站。主要项目结构如下：

## 核心配置文件

- [package.json](mdc:package.json): 项目依赖配置
- [vite.config.ts](mdc:vite.config.ts): Vite 构建配置
- [tsconfig.json](mdc:tsconfig.json): TypeScript 配置
- [.eslintrc.json](mdc:.eslintrc.json): ESLint 代码规范配置
- [.prettierrc](mdc:.prettierrc): Prettier 代码格式化配置

## 主要目录

- `src/`: 源代码目录
  - `views/`: 页面组件
  - `components/`: 可复用组件
  - `router/`: 路由配置
  - `store/`: 状态管理
  - `assets/`: 静态资源

- `public/`: 静态资源目录，构建时会直接复制
- `mock/`: 接口模拟数据
- `live2d/`: Live2D 模型资源

## 开发规范

1. 使用 JavaScript 进行开发
2. 遵循 ESLint 和 Prettier 配置的代码规范
3. 组件和工具页面统一放在对应目录下
4. 新增依赖需要更新 package.json

> 开发新功能时应当遵循项目既有的目录结构和开发规范。

# 代码风格规则

## 格式化配置

项目使用 ESLint 和 Prettier 进行代码规范和格式化：

- [.eslintrc.json](mdc:.eslintrc.json): ESLint 规则配置
- [.prettierrc](mdc:.prettierrc): Prettier 格式化配置
- [.editorconfig](mdc:.editorconfig): 编辑器配置

## Vue 组件规范

1. 使用 `<script setup>` 语法
2. 组件名称采用 PascalCase 格式
3. Props 和 Emits 需要明确类型定义
4. 样式使用 `scoped` + `less`
5. 组件内部结构顺序：
   - template
   - script
   - style

## 样式规范

1. 使用 Less 预处理器
2. 颜色值优先使用变量
3. 布局使用 flex 或 grid
4. 响应式设计考虑移动端适配
5. 整体为蓝色系古风风格

> 开发时应当遵循这些规范，保持代码风格统一。

