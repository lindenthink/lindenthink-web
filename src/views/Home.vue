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
        <div><h3>1</h3></div>
        <div><h3>2</h3></div>
        <div><h3>3</h3></div>
        <div><h3>4</h3></div>
      </a-carousel>

       <!-- 内容模块 -->
      <div class="content-section">
        <!-- 最新动态模块 -->
        <div class="section latest-news">
          <h2>最新动态</h2>
          <div class="news">
            <div class="news-item" v-for="news in latestNews" :key="news.id">
              <h3>{{ news.title }}</h3>
              <p>{{ news.summary }}</p>
            </div>
          </div>
        </div>

        <!-- 热门文章模块 -->
        <div class="section popular-articles">
          <h2>热门文章</h2>
          <div class="articles">
            <div class="article" v-for="article in popularArticles" :key="article.id">
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';

const popularArticles = reactive([
  { id: 1, title: '热门文章1', summary: '这是热门文章1的摘要...'},
  { id: 2, title: '热门文章2', summary: '这是热门文章2的摘要...'},
  { id: 3, title: '热门文章3', summary: '这是热门文章3的摘要...'},
]);

const latestNews = reactive([
  { id: 1, title: '最新动态1', summary: '这是最新动态1的摘要...'},
  { id: 2, title: '最新动态2', summary: '这是最新动态2的摘要...'},
  { id: 3, title: '最新动态3', summary: '这是最新动态3的摘要...'},
]);

</script>

<style scoped lang="less">
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 280px;
  line-height: 280px;
  background: #364d79;
  overflow: hidden;
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

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.content-section {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.section {
  flex: 1;
  margin: 0 10px;
}

.articles, .news {
  display: flex;
  flex-direction: column;
}

.article, .news-item {
  background: #f0f2f5;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
}

.article h3, .news-item h3 {
  margin: 0 0 10px 0;
}

.article p, .news-item p {
  margin: 0;
}

</style>
