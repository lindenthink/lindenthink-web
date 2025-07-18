<template class="editor-layout">
    <!-- 顶部操作栏 -->
    <div
        style="background: #fff; padding: 16px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
        <h1 class="header">{{ isPreviewMode ? '文章预览' : '文章编辑' }}</h1>
        <div>
            <a-button :type="isPreviewMode ? 'default' : 'primary'" @click="togglePreview" size="small" :loading="previewLoading">
                {{ isPreviewMode ? '编辑' : '预览' }}
            </a-button>
            <a-button v-if="!isPreviewMode" type="primary" html-type="submit" :loading="submitting"
                style="margin-left: 10px" size="small">
                保存
            </a-button>
            <a-button @click="handleCancel" style="margin-left: 10px" size="small">取消</a-button>
        </div>
    </div>
    <!-- 编辑模式 -->
    <div v-if="!isPreviewMode">
        <a-form ref="formRef" :model="articleForm" :rules="formRules" @finish="handleSubmit">
            <a-row :gutter="[12, 12]">
                <a-col :span="8">
                    <a-form-item name="title" label="文章标题" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-input v-model:value="articleForm.title" placeholder="请输入文章标题" :max-length="64" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="category" label="文章分类" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-select v-model:value="articleForm.category" placeholder="请选择分类" allow-clear>
                            <a-select-option v-for="category in categories" :key="category.id">
                                {{ category.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="series" label="所属系列" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-select v-model:value="articleForm.series" placeholder="请选择系列" allow-clear>
                            <a-select-option v-for="series in seriesList" :key="series.id">
                                {{ series.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="articleType" label="文章类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-radio-group v-model:value="articleForm.articleType">
                            <a-radio-button value="original">原创</a-radio-button>
                            <a-radio-button value="reprint">转载</a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="8" v-if="articleForm.articleType === 'reprint'">
                    <a-form-item name="origin" label="来源地址" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-input v-model:value="articleForm.origin" placeholder="请输入转载文章的来源地址" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="tags" label="文章标签" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-space :wrap="true">
                            <a-tag v-for="tag in articleForm.tags" :key="tag" closable @close="() => removeTag(tag)">
                                {{ tag }}
                            </a-tag>
                            <a-input v-model:value="newTag" placeholder="输入标签并按回车" :style="{ width: '140px' }"
                                @press-enter="addTag" />
                        </a-space>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="coverImage" label="封面图片" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <ImageUploader v-model="articleForm.coverImage" upload-text="上传封面" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item name="isPublic" label="是否公开" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                        <a-switch v-model:checked="articleForm.isPublic" checked-children="公开"
                            un-checked-children="私有" />
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- 文章内容单独一行 -->
            <a-form-item name="content" label="文章内容" :label-col="{ span: 2.5 }" :wrapper-col="{ span: 21.5 }">
                <a-textarea v-model:value="articleForm.content" placeholder="请使用AsciiDoc格式编写文章内容，支持PlantUML！" :rows="15"
                    :style="{ fontFamily: 'monospace' }" />
                <p class="editor-hint">支持AsciiDoc格式语法，点击上方"预览文章"按钮查看效果</p>
            </a-form-item>
        </a-form>
    </div>

    <!-- 预览模式 -->
    <div v-else class="preview-content">
        <div class="preview-article">
            <div class="preview-header">
                <h1 class="preview-title">{{ articleForm.title || '请输入文章标题' }}</h1>
            </div>
            <AsciiDocViewer :content="articleForm.content || placeholderContent"
                @render-complete="handleRenderComplete" />
            <a-divider :style="{ color: 'lightgrey' }">•</a-divider>
            <div style="display: flex; justify-content: space-between">
                <span>分类：{{ articleForm.category }}</span>
                <div>
                    标签：
                    <a-tag v-for="tag in articleForm.tags" :key="tag">
                        <template #icon>
                            <tag-outlined />
                        </template>
                        {{ tag }}
                    </a-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { TagOutlined } from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import useApiFetch from '@/composables/useApiFetch'
import { getArticle, saveArticle } from '@/services/articleService'

// 路由和API相关
const router = useRouter()
const route = useRoute()
const fetch = useApiFetch()
const submitting = ref(false)

// 表单相关
const formRef = ref(null)
const articleForm = reactive({
    id: '',
    title: '',
    category: '',
    series: '',
    articleType: 'original', // 新增文章类型字段，默认原创
    tags: [],
    content: '',
    isPublic: false,
    coverImage: '', // 新增封面图片字段
    origin: '' // 新增来源地址字段
})

const newTag = ref('')
const placeholderContent = `= 文章标题示例

这是一篇示例文章，您可以在此处编写AsciiDoc格式的内容。

== 章节标题

* 列表项1
* 列表项2
* 列表项3

[source,java]
----
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
----`

// 分类数据（实际项目中应从API获取）
const categories = [
    { id: '1', name: '技术文章' },
    { id: '2', name: '学习笔记' },
    { id: '3', name: '项目经验' },
    { id: '4', name: '行业动态' },
    { id: '5', name: '其他' }
]

// 系列数据（实际项目中应从API获取）
const seriesList = [
    { id: '1', name: '系列1' },
    { id: '2', name: '系列2' },
    { id: '3', name: '系列3' },
    { id: '4', name: '系列4' },
    { id: '5', name: '其他' }
]

// 表单验证规则
const formRules = {
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    category: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
    series: [{ required: true, message: '请选择系列', trigger: 'change' }],
    articleType: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
    coverImage: [{ required: false, message: '请上传封面图片', trigger: 'change' }],
    // 新增来源地址验证规则
    origin: [{
        required: true,
        message: '请输入来源地址',
        trigger: 'blur',
        validator: (rule, value, callback) => {
            if (articleForm.articleType === 'reprint' && !value) {
                callback(new Error('请输入来源地址'));
            } else {
                callback();
            }
        }
    }]
}

// 标签操作
const addTag = () => {
    if (newTag.value && !articleForm.tags.includes(newTag.value)) {
        articleForm.tags.push(newTag.value)
    }
    newTag.value = ''
}

const removeTag = (tag) => {
    articleForm.tags = articleForm.tags.filter(t => t !== tag)
}

// 添加预览模式状态
const isPreviewMode = ref(false)

// 添加预览加载状态
const previewLoading = ref(false);


const togglePreview = () => {
    if (!isPreviewMode.value) {
        previewLoading.value = true;
    }
    isPreviewMode.value = !isPreviewMode.value;
};

// 添加渲染完成处理函数
const handleRenderComplete = () => {
    previewLoading.value = false;
};

async function initArticle() {
    const articleId = route.params.id
    if (articleId) {
        try {
            const response = await getArticle(articleId)
            const article = response.data
            articleForm.id = article.id
            articleForm.title = article.title
            articleForm.category = article.category
            articleForm.series = article.series
            articleForm.articleType = article.articleType || 'original' // 初始化文章类型
            articleForm.tags = article.tags ? article.tags.split(',') : []
            articleForm.content = article.content
            articleForm.isPublic = article.isPublic !== false
        } catch (error) {
            console.error('加载文章失败:', error)
            message.error('加载文章失败，请稍后重试')
            router.back()
        }
    } else {
        // 新文章，不自动加载预览
    }
}

onMounted(() => {
    initArticle()
})


// 表单提交
async function handleSubmit() {
    try {
        submitting.value = true;
        const formData = {
            ...articleForm,
            tags: articleForm.tags.join(',')
            // 封面图片会自动包含在formData中
        };

        await saveArticle(formData);
        message.success(articleForm.id ? '文章更新成功' : '文章创建成功');
        router.push('/articles');
    } catch (error) {
        console.error('保存文章失败:', error);
        message.error('保存文章失败，请稍后重试');
    } finally {
        submitting.value = false;
    }
}

const handleCancel = () => {
    router.back()
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

/* 优化顶部操作栏样式 */
.header {
    font-weight: 600;
    font-size: 16px;
    color: #333;
}

/* 优化表单样式 */
.ant-form {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 0;
}

.ant-form-item {
    margin-bottom: 16px;
}

/* 优化标签样式 */
.ant-tag {
    margin-bottom: 8px;
}

/* 优化文本框样式 */
.ant-input,
.ant-select-selector,
.ant-textarea {
    border-radius: 4px;
    transition: all 0.3s;
}

.ant-input:focus,
.ant-select-selector:focus,
.ant-textarea:focus {
    border-color: @primary-color;
    box-shadow: 0 0 0 2px rgba(55, 169, 255, 0.2);
}

/* 优化按钮样式 */
.ant-btn {
    border-radius: 4px;
}

/* 更新提示文本 */
.editor-hint {
    margin-top: 8px;
    color: #666;
    font-size: 12px;
}

.preview-article {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.preview-header {
    text-align: center;
}

.preview-title {
    color: #2c3e50;
    font-size: 2.2em;
    font-weight: 600;
}

.preview-content {
    padding: 20px;
    background: #fff;
    min-height: calc(100vh - 180px);
}

.preview-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}
</style>
