<!-- eslint-disable vue/no-v-html -->
<template>
  <FormatLayout lang="sql">
    <template #default="{ formatted }">
      <pre class="formatted-sql" v-html="formatted"></pre>
    </template>
  </FormatLayout>
</template>

<script setup>
import FormatLayout from './FormatLayout.vue'
import 'highlight.js/styles/foundation.css'
</script>

<style scoped>
.formatted-sql {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
