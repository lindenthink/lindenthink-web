<template>
  <a-layout class="home-layout">
    <a-layout-sider breakpoint="md" collapsed-width="1" />
    <a-layout-content>
      <!-- 轮播图 - 仅在非移动端显示 -->
      <template v-if="!isLoading && !isMobile">
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
      </template>
      <template v-else-if="!isLoading && isMobile">
        <!-- 移动端不显示轮播图 -->
      </template>
      <template v-else>
        <div v-if="!isMobile" class="skeleton-container">
          <Skeleton active :loading="isLoading" class="carousel-skeleton" />
        </div>
        <div v-else class="mobile-placeholder skeleton-container">
          <Skeleton active :loading="isLoading" class="mobile-skeleton" />
        </div>
      </template>

      <div class="content-container">
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :md="12">
            <template v-if="!isLoading">
              <section class="articles-section">
                <h2 class="hot-section-title">
                  <fire-outlined class="title-icon" />
                  本站热门
                </h2>
                <a-row :gutter="[16, 16]">
                  <a-col v-for="(article, index) in popularArticles" :key="article.id" :xs="24" :sm="12" :lg="24">
                    <a-card hoverable :class="['article-card', {
                      'gold-medal': index === 0,
                      'silver-medal': index === 1,
                      'bronze-medal': index === 2
                    }]" @click="handleClick(article)">
                      <div class="medal-badge">{{ index + 1 }}</div>
                      <a-card-meta :title="article.title" :description="article.outline" />
                      <div class="stats-bar">
                        <div class="stat-item">
                          <eye-outlined />
                          <span>{{ article.visitCount }}</span>
                        </div>
                        <div class="stat-item">
                          <heart-outlined />
                          <span>{{ article.likeCount }}</span>
                        </div>
                        <div class="stat-item">
                          <message-outlined />
                          <span>{{ article.commentCount }}</span>
                        </div>
                      </div>
                    </a-card>
                  </a-col>
                </a-row>
              </section>
            </template>
            <template v-else>
              <div class="skeleton-container">
                <Skeleton active :loading="isLoading" class="articles-skeleton" />
              </div>
            </template>
          </a-col>
          <a-col :xs="24" :md="12">
            <template v-if="!isLoading">
              <section class="dynamic-section">
                <h2 class="section-title">
                  <bulb-outlined class="title-icon" />
                  最新资讯
                </h2>
                <div class="news-list">
                  <div v-for="news in latestNews" :key="news.id" class="news-item">
                    <a :href="news.url" class="news-link" target="_blank">
                      {{ news.title }}
                      <span class="news-source">来源: {{ news.source }} - {{ news.date }}</span>
                    </a>
                  </div>
                </div>
              </section>
            </template>
            <template v-else>
              <div class="skeleton-container">
                <Skeleton active :loading="isLoading" class="news-skeleton" />
              </div>
            </template>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
    <a-layout-sider breakpoint="md"  collapsed-width="2" />
  </a-layout>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import {
  LeftCircleFilled,
  RightCircleFilled,
  BulbOutlined,
  FireOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'
import { Skeleton } from 'ant-design-vue'
import { queryCarousel, queryNews } from '@/services/materialService'
import { getTop3 } from '@/services/articleService'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'

const router = useRouter()
const popularArticles = reactive([])

const latestNews = reactive([])

const carouselImgs = reactive([])

const isLoading = ref(true)
const isMobile = useMediaQuery('(max-width: 768px)')

onMounted(async () => {
  try {
    isLoading.value = true
    
    // 使用Promise.all并行发起请求，提高处理速度
    // 在移动端只请求文章和资讯数据，不请求轮播图数据
    const requests = [getTop3(), queryNews()]
    if (!isMobile.value) {
      requests.unshift(queryCarousel())
    }
    
    const results = await Promise.all(requests)
    
    // 处理轮播图数据（仅在非移动端）
    if (!isMobile.value) {
      const carouselRes = results[0]
      const carouselData = carouselRes.map(item => ({
        id: item.id,
        ...JSON.parse(item.content)
      }))
      carouselData.sort((a, b) => a.order - b.order)
      carouselImgs.length = 0
      carouselData.forEach(item => carouselImgs.push(item))
      
      // 文章和资讯数据索引
      const articlesRes = results[1]
      const newsRes = results[2]
      
      // 处理热门文章数据
      const topArticles = articlesRes.data
      popularArticles.length = 0
      popularArticles.push(...topArticles)
      
      // 处理最新资讯数据
      const newsData = newsRes.map(item => ({
        id: item.id,
        ...JSON.parse(item.content)
      }))
      // 按日期降序排序
      newsData.sort((a, b) => new Date(b.date) - new Date(a.date))
      latestNews.length = 0
      latestNews.push(...newsData)
    } else {
      // 移动端数据索引
      const articlesRes = results[0]
      const newsRes = results[1]
      
      // 处理热门文章数据
      const topArticles = articlesRes.data
      popularArticles.length = 0
      popularArticles.push(...topArticles)
      
      // 处理最新资讯数据
      const newsData = newsRes.map(item => ({
        id: item.id,
        ...JSON.parse(item.content)
      }))
      // 按日期降序排序
      newsData.sort((a, b) => new Date(b.date) - new Date(a.date))
      latestNews.length = 0
      latestNews.push(...newsData)
    }
    
    isLoading.value = false
  } catch (error) {
    console.error('获取数据失败:', error)
    message.error('获取数据失败: ' + error.message)
    isLoading.value = false
  }
})

const handleClick = (article) => {
  router.push({
    path: '/articles/' + article.id
  })
}

</script>

<style scoped lang="less">
@import '@/styles/variables.less';

@carousel-height: 300px;
@mobile-placeholder-height: 1px;

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
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.2rem;
  margin: 1rem 0 1rem;
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
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #2075f5, #19b4f1, transparent);
    border-radius: 2px;
    margin-top: 0.2em;
  }
}

/* 本站热门标题样式 */
.hot-section-title {
  font-size: 1.2rem;
  margin: 1rem 0 1rem;
  color: @heading-color;

  .title-icon {
    font-size: 1.1em;
    color: #ff7d00;
  }

  position: relative;
  letter-spacing: 2px;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #ff7d00, #ffb74d, transparent);
    border-radius: 2px;
    margin-top: 0.2em;
  }
}

.article-card {
  transition:
    transform 0.3s @ease-in-out,
    box-shadow 0.3s @ease-in-out;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: @box-shadow-lg;
  }

  .medal-badge {
    position: absolute;
    top: 1.4rem;
    left: 0.5rem;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #f0f0f0;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    z-index: 2;
  }

  &.gold-medal {
    .medal-badge {
      background: linear-gradient(135deg, #ffd700, #ffaa00);
      color: #fff;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    }
  }

  &.silver-medal {
    .medal-badge {
      background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
      color: #fff;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    }
  }

  &.bronze-medal {
    .medal-badge {
      background: linear-gradient(135deg, #cd7f32, #a67c52);
      color: #fff;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
    }
  }

  :deep(.ant-card-meta-title) {
    padding-left: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  :deep(.ant-card-meta-description) {
    color: @text-color-secondary;
    line-height: 1.6;
    font-size: 0.75rem;
  }
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0 0;
  margin-top: 0.5rem;
  border-top: 1px solid @border-color-base;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: @text-color-secondary;
    font-size: 0.85rem;

    &:hover {
      color: @primary-color;
      cursor: pointer;
    }
  }
}

.news-item {
  padding: 0.7rem 0;
  border-bottom: 1px solid @border-color-base;
  transition: all 0.3s @ease-in-out;
}

.news-item:last-child {
  border-bottom: none;
}

.news-link {
  color: @text-color;
  font-size: 0.9rem;
  text-decoration: none;
  display: block;
  transition: color 0.3s @ease-in-out;
  position: relative;

  &:hover {
    color: @primary-color;
    transform: translateY(-0.1rem);
  }
}

.news-source {
  font-size: 0.75rem;
  color: @text-color-secondary;
  margin-left: 0.5rem;
  display: inline-block;
}

/* 移动端占位样式 */
.mobile-placeholder {
  height: @mobile-placeholder-height;
  width: 100%;
  margin: 20px 16px 0px 16px;
}

.mobile-skeleton {
  height: @mobile-placeholder-height;
  width: 100%;
}

/* 骨架屏样式 */
.skeleton-container {
  margin: 20px 16px 0px 16px;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-skeleton {
  height: @carousel-height;
  width: 100%;
}

.articles-skeleton,
.news-skeleton {
  margin-top: 24px;
  width: 100%;
}
</style>
