<template>
    <FormatLayout lang="xml">
        <template #default="{ formatted }">
            <pre class="formatted-xml" v-html="formatted"></pre>
        </template>
    </FormatLayout>
</template>

<script setup>
import FormatLayout from '@/components/FormatLayout.vue'
import 'highlight.js/styles/foundation.css'

</script>

<style scoped>
.formatted-xml {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>