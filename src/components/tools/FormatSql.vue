<template>
    <FormatterLayout lang="sql">
        <template #default="{ formatted }">
            <pre class="formatted-sql" v-html="formatted"></pre>
        </template>
    </FormatterLayout>
</template>

<script setup>
import FormatterLayout from '@/components/common/FormatterLayout.vue'
import 'highlight.js/styles/foundation.css'

</script>

<style scoped>
.formatted-sql {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>