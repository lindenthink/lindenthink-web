<template>
    <FormatLayout lang="json">
        <template #default="{ formatted }">
            <vue-json-pretty :data="formatted" :deep="1" :showIcon="true" />
        </template>
    </FormatLayout>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import FormatLayout from '@/components/FormatLayout.vue'

</script>

<style scoped></style>