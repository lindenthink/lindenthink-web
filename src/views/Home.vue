<template>
  <a-layout class="home-layout">
    <a-layout-sider breakpoint="lg" collapsed-width="0" />
    <a-layout-content>
      <a-carousel autoplay effect="fade" class="custom-carousel" :autoplay-speed="5000" arrows>
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <LeftCircleFilled />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <RightCircleFilled />
          </div>
        </template>

        <div v-for="img in carouselImgs" :key="img.id" class="carousel-slide">
          <img :src="img.url" class="carousel-image" :alt="img.title" />
          <div class="carousel-caption">
            <div class="caption-content">
              <p class="poetry-text">{{ img.title }}</p>
              <div class="gradient-overlay" />
            </div>
          </div>
        </div>
      </a-carousel>

      <div class="content-container">
        <section class="articles-section">
          <h2 class="section-title">
            <fire-outlined class="title-icon" style="color: orangered" />
            热门文章
          </h2>
          <a-row :gutter="[24, 24]">
            <a-col v-for="article in popularArticles" :key="article.id" :xs="24" :sm="12" :lg="8">
              <a-card hoverable class="article-card">
                <a-tag class="article-tag" color="#2db7f5">
                  {{ article.category }}
                </a-tag>
                <a-card-meta :title="article.title" :description="article.summary" />
                <div class="stats-bar">
                  <div class="stat-item">
                    <eye-outlined />
                    <span>{{ article.likes }}</span>
                  </div>
                  <div class="stat-item">
                    <like-outlined />
                    <span>{{ article.likes }}</span>
                  </div>
                  <div class="stat-item">
                    <message-outlined />
                    <span>{{ article.comments }}</span>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </section>
        
        <section class="dynamic-section">
          <h2 class="section-title">
            <bulb-outlined class="title-icon" />
            最新动态
          </h2>
          <a-row :gutter="[24, 24]">
            <a-col v-for="news in latestNews" :key="news.id" :xs="24" :sm="12" :lg="8">
              <a-card hoverable class="news-card" :cover="news.cover">
                <template #actions>
                  <span><edit-outlined /> {{ news.author }}</span>
                  <span><clock-circle-outlined /> {{ news.date }}</span>
                </template>
                <a-card-meta :title="news.title" :description="news.summary">
                  <template #avatar>
                    <a-avatar :src="news.avatar" />
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </section>
      </div>
    </a-layout-content>
    <a-layout-sider breakpoint="lg" collapsed-width="0" />
  </a-layout>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import {
  LeftCircleFilled,
  RightCircleFilled,
  BulbOutlined,
  FireOutlined,
  EditOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'
import { queryCarousel } from '@/services/materialService'

const popularArticles = reactive([
  {
    id: 1,
    title: 'Vue3性能优化实战',
    summary: '深入探讨Vue3组合式API的最佳实践...',
    category: '前端开发',
    likes: 245,
    comments: 38,
    cover: '/1.png',
  },
  {
    id: 2,
    title: 'Vue3性能优化实战',
    summary: '深入探讨Vue3组合式API的最佳实践...',
    category: '前端开发',
    likes: 245,
    comments: 38,
    cover: '/1.png',
  },
  {
    id: 3,
    title: 'Vue3性能优化实战',
    summary: '深入探讨Vue3组合式API的最佳实践...',
    category: '前端开发',
    likes: 245,
    comments: 38,
    cover: '/1.png',
  },
])

const latestNews = reactive([
  {
    id: 1,
    title: '新功能发布',
    summary: '新增实时协作编辑功能...',
    date: '2024-03-15',
    author: 'Linden',
    avatar: 'https://ui-avatars.com/api?name=jack&background=random',
  },
  {
    id: 2,
    title: '新文章发布',
    summary: 'Vue3性能优化实战',
    date: '2024-03-15',
    author: 'Linden',
    avatar: 'https://ui-avatars.com/api?name=lucy&background=random',
  },
  // 其他数据...
])

const carouselImgs = reactive([])

onMounted(async () => {
  try {
    const res = await queryCarousel()
    const data = res.map(item => {
      return {
        id: item.id,
        ...JSON.parse(item.content)
      }
    })
    data.sort((a, b) => a.order - b.order)
    carouselImgs.length = 0
    data.forEach(item => carouselImgs.push(item))
  } catch (error) {
    console.error('获取轮播图数据失败:', error)
    message.error('获取轮播图数据失败: ' + error.message)
  }
})
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

@carousel-height: 300px;

.custom-carousel {
  margin: 20px 16px 0px 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: @box-shadow-base;

  :deep(.slick-slide) {
    height: @carousel-height;
    position: relative;
  }
}

.carousel-slide {
  position: relative;
  height: 100%;

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.carousel-caption {
  position: absolute;
  top: @carousel-height - 110px;
  left: 0;
  right: 0;
  padding: 2.5rem;
  color: white;
  text-align: center;

  .poetry-text {
    font-size: 1.5rem;
    font-family: @font-family-serif;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 3;
  }

  .gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    z-index: 1;
  }
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.custom-slick-arrow {
  width: 40px;
  height: 40px;
  font-size: 2rem;
  opacity: 0.3;
  transition: all 0.3s @ease-in-out;

  .arrow-icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
  }

  &:hover {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.content-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.75rem;
  margin: 2rem 0 1.5rem;
  color: @heading-color;

  .title-icon {
    font-size: 1.1em;
    color: @primary-color;
  }
  position: relative;
  letter-spacing: 2px;
  &::after {
    content: '';
    display: block;
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, #2075f5, #19b4f1, transparent);
    border-radius: 2px;
    margin-top: 0.2em;
  }
}

.news-card,
.article-card {
  transition:
    transform 0.3s @ease-in-out,
    box-shadow 0.3s @ease-in-out;
  border-radius: 8px;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: @box-shadow-lg;
  }

  :deep(.ant-card-meta-title) {
    font-size: 1.1rem;
    font-weight: 500;
  }

  :deep(.ant-card-meta-description) {
    color: @text-color-secondary;
    line-height: 1.6;
  }
}

.article-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0 0;
  margin-top: 1rem;
  border-top: 1px solid @border-color-base;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: @text-color-secondary;

    &:hover {
      color: @primary-color;
      cursor: pointer;
    }
  }
}

@media (max-width: @screen-sm) {
  .custom-carousel :deep(.slick-slide) {
    height: 300px;
  }

  .carousel-caption .poetry-text {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
