<template>
    <FormatterLayout lang="json">
        <template #default="{ formatted }">
            <vue-json-pretty :data="formatted" :deep="1" :showIcon="true" />
        </template>
    </FormatterLayout>
</template>

<script setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import FormatterLayout from '@/components/common/FormatterLayout.vue'

</script>

<style scoped></style>