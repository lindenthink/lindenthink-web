<template>
  <a-timeline>
    <a-timeline-item>
      <template #dot><ClockCircleOutlined style="font-size: 16px" /></template>
      2022
    </a-timeline-item>
    <a-timeline-item><a>07-22 文章一</a></a-timeline-item>
    <a-timeline-item>07-23 文章二</a-timeline-item>
    <a-timeline-item>
      <template #dot><ClockCircleOutlined style="font-size: 16px" /></template>
      2021
    </a-timeline-item>
    <a-timeline-item>07-22 文章一</a-timeline-item>
    <a-timeline-item>07-23 文章二</a-timeline-item>

  </a-timeline>
</template>

<script lang="ts" setup>
import { ClockCircleOutlined } from '@ant-design/icons-vue';
</script>

<style scoped lang="less"></style>
