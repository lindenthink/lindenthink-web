<template>
    <div class="image-uploader">
        <a-upload name="file" list-type="picture-card" class="uploader" :show-upload-list="false"
            :before-upload="beforeUpload" :custom-request="handleUpload" :disabled="disabled" @change="handleChange">
            <img v-if="modelValue" :src="modelValue" class="uploader-image"/>
            <div v-else class="upload-placeholder" >
                <upload-outlined />
                <div class="ant-upload-text">{{ uploadText }}</div>
            </div>
        </a-upload>
        <div v-if="uploadError" class="upload-error">{{ uploadError }}</div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { uploadFile } from '@/services/userService'

const props = defineProps({
    // 双向绑定的图片URL
    modelValue: {
        type: String,
        default: ''
    },
    // 上传按钮文本
    uploadText: {
        type: String,
        default: '上传图片'
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false
    },
    // 文件大小限制(MB)
    fileSizeLimit: {
        type: Number,
        default: 2
    },
})

const emit = defineEmits(['update:modelValue', 'error', 'success'])
const uploadError = ref('')
const uploadLoading = ref(false)

// 监听modelValue变化
watch(() => props.modelValue, (value) => {
    uploadError.value = ''
})

// 上传前验证
const beforeUpload = (file) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        uploadError.value = '只能上传图片文件!'
        return false
    }

    // 检查文件大小
    const isLtSize = file.size / 1024 / 1024 < props.fileSizeLimit
    if (!isLtSize) {
        uploadError.value = `图片大小不能超过${props.fileSizeLimit}MB!`
        return false
    }

    uploadError.value = ''
    return true
}

// 自定义上传逻辑
const handleUpload = async ({ file, onSuccess, onError }) => {
    uploadLoading.value = true
    uploadError.value = ''
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await uploadFile(formData)
        const avatarUrl = response.data
        emit('update:modelValue', avatarUrl)
        onSuccess(result, file)
        emit('success', avatarUrl)
        message.success('图片上传成功')
    } catch (error) {
        const errorMsg = '上传失败: ' + (error.message || '网络错误')
        uploadError.value = errorMsg
        emit('error', errorMsg)
        onError(error)
    } finally {
        uploadLoading.value = false
    }
}

// 上传状态变化处理
const handleChange = (info) => {
    if (info.file.status === 'removed') {
        emit('update:modelValue', '')
    } else if (info.file.status === 'error') {
        uploadError.value = '上传失败，请重试'
    }
}
</script>

<style lang="less" scoped>
.uploader {
    .uploader-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.upload-error {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
    white-space: nowrap;
}
</style>