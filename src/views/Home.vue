<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <a-carousel autoplay arrows>
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px">
            <right-circle-outlined />
          </div>
        </template>

        <div v-for="img in carouselImgs" :key="img.id" class="carousel-slide">
          <img :src="img.url" class="carousel-image" />
          <div class="carousel-caption">{{ img.desc }}</div>
        </div>
      </a-carousel>

      <!-- 内容模块 -->
      <div class="content-section">
        <!-- 最新动态模块 -->
        <div class="section">
          <h2>最新动态</h2>
          <a-row :gutter="16">
            <a-col v-for="news in latestNews" :key="news.id" :span="8">
              <a-card :title="news.title" hoverable>
                <p class="card-summary">{{ news.summary }}</p>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- 热门文章模块 -->
        <div class="section">
          <h2>热门文章</h2>
          <a-row :gutter="16">
            <a-col v-for="article in popularArticles" :key="article.id" :span="8">
              <a-card :title="article.title" hoverable>
                <p class="card-summary">{{ article.summary }}</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue'

const popularArticles = reactive([
  { id: 1, title: '热门文章1', summary: '这是热门文章1的摘要...' },
  { id: 2, title: '热门文章2', summary: '这是热门文章2的摘要...' },
  { id: 3, title: '热门文章3', summary: '这是热门文章3的摘要...' },
])

const latestNews = reactive([
  { id: 1, title: '最新动态1', summary: '这是最新动态1的摘要...' },
  { id: 2, title: '最新动态2', summary: '这是最新动态2的摘要...' },
  { id: 3, title: '最新动态3', summary: '这是最新动态3的摘要...' },
])

const carouselImgs = reactive([
  { id: 1, desc: '清明时节雨纷纷，路上行人欲断魂。—— 『清明』', url: '/1.png' },
  { id: 2, desc: '图片2的说明文字', url: '/2.png' },
  { id: 3, desc: '图片3的说明文字', url: '/3.png' },
])
</script>

<style scoped lang="less">
.carousel-caption {
  position: absolute;
  top: 320px;
  /* 将文字放在图片更低的位置 */
  height: 150px;
  line-height: 150px;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  white-space: normal;
  /* 支持换行 */
  font-size: larger;
}

.ant-carousel {
  padding: 23px;
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 360px;
  /* 调整高度到360px */
  line-height: 360px;
  /* 调整行高到360px */
  background: #364d79;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  position: relative;
  /* 确保 .carousel-caption 绝对定位有效 */
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}

.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.content-section {
  display: flex;
  flex-direction: column;
  margin: 0 10px 10px 10px;
}

.section {
  margin: 10px;
}

.section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-summary {
  font-size: 14px;
  color: #666;
}

.articles,
.news {
  display: flex;
  flex-direction: column;
}

.article,
.news-item {
  background: #f0f2f5;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.article h3,
.news-item h3 {
  margin: 0 0 10px 0;
}

.article p,
.news-item p {
  margin: 0;
}
</style>
