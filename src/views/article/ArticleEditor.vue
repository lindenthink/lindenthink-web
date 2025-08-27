<template>
    <a-layout>
        <a-layout-sider> </a-layout-sider>
        <a-layout-content>
            <!-- 顶部操作栏 -->
            <div
                style="background: #fff; padding: 16px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
                <h1 class="header">{{ isPreviewMode ? '文章预览' : '文章编辑' }}</h1>
                <div>
                    <a-button type="primary " @click="togglePreview" size="small" :loading="previewLoading">
                        {{ isPreviewMode ? '编辑' : '预览' }}
                    </a-button>
                    <!-- 修改保存按钮 -->
                    <a-button v-if="!isPreviewMode" type="primary" :loading="submitting" style="margin-left: 10px"
                        size="small" @click="handleSave">
                        保存
                    </a-button>
                    <a-button @click="handleCancel" style="margin-left: 10px" size="small">取消</a-button>
                </div>
            </div>

            <!-- 加载状态 -->
            <a-spin :spinning="loading" tip="加载文章中..."
                style="min-height: 400px; display: flex; justify-content: center; align-items: center;" v-if="loading">
            </a-spin>

            <template v-else>
                <!-- 编辑模式 -->
                <div v-if="!isPreviewMode">
                    <a-form ref="formRef" :model="articleForm" :rules="formRules" @finish="handleSubmit">
                        <a-row :gutter="[12, 12]">
                            <a-col :span="6">
                                <a-form-item name="title" label="文章标题" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-input v-model:value="articleForm.title" placeholder="请输入文章标题" :max-length="64" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="categoryId" label="所属分类" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-tree-select v-model:value="articleForm.categoryId" :tree-data="categoryTree"
                                        placeholder="请选择分类" show-search filterTreeNode />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="seriesId" label="所属系列" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-select v-model:value="articleForm.seriesId" placeholder="请选择系列" allow-clear>
                                        <a-select-option v-for="series in seriesList" :key="series.id">
                                            {{ series.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="type" label="来源类型" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-radio-group v-model:value="articleForm.type">
                                        <a-radio-button value="ORIGINAL">原创</a-radio-button>
                                        <a-radio-button value="REPRINT">转载</a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="isPublic" label="是否公开" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-switch v-model:checked="articleForm.isPublic" checked-children="公开"
                                        un-checked-children="私有" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="tags" label="文章标签" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-space :wrap="true">
                                        <a-tag v-for="tag in articleForm.tags" :key="tag" closable
                                            @close="() => removeTag(tag)">
                                            {{ tag }}
                                        </a-tag>
                                        <a-input v-model:value="newTag" placeholder="输入标签并按回车"
                                            :style="{ width: '140px' }" @press-enter="addTag" />
                                    </a-space>
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item name="cover" label="封面图片" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <ImageUploader v-model="articleForm.cover" upload-text="上传封面" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6" v-if="articleForm.type === 'REPRINT'">
                                <a-form-item name="origin" label="转载来源" :label-col="{ span: 9 }"
                                    :wrapper-col="{ span: 15 }">
                                    <a-input v-model:value="articleForm.origin" placeholder="输入转载地址" />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-form-item name="outline" label="文章简介" :label-col="{ span: 2 }"
                            :wrapper-col="{ span: 22 }">
                            <a-textarea v-model:value="articleForm.outline" placeholder="请输入文章简介（非必填，最多200字符）"
                                :max-length="200" :rows="2" />
                        </a-form-item>

                        <a-form-item name="content" label="文章内容" :label-col="{ span: 2 }"
                            :wrapper-col="{ span: 22 }">
                            <div class="editor-toolbar">
                                <a-button size="small" @click="insertLink">链接</a-button>
                                <a-button size="small" @click="insertImage">图片</a-button>
                                <a-button size="small" @click="insertTable">表格</a-button>
                                <a-button size="small" @click="insertCodeBlock">代码块</a-button>
                                <a-button size="small" @click="insertPlantUml">PlantUML</a-button>
                                <a-button size="small" @click="insertFootnote">脚注</a-button>
                                <a-button size="small" @click="insertStrikeThrough">删除线</a-button>
                                <a-button size="small" @click="insertTimeline">时间线</a-button>
                            </div>
                            <a-textarea v-model:value="articleForm.content"
                                placeholder="请使用AsciiDoc格式编写文章内容，支持PlantUML！" :rows="15"
                                :style="{ fontFamily: 'monospace' }" ref="contentTextarea" />
                            <p class="editor-hint">支持AsciiDoc格式语法，点击上方"预览"按钮查看效果</p>
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
                    </div>
                </div>
                <!-- 图片上传模态框 -->
                <a-modal v-model:visible="showUploadModal" title="上传图片" :width="500" @ok="showUploadModal = false"
                    @cancel="showUploadModal = false">
                    <ImageUploader v-model="uploadImageUrl" upload-text="点击上传" @success="handleUploadSuccess" />
                </a-modal>
            </template>

        </a-layout-content>
        <a-layout-sider> </a-layout-sider>
    </a-layout>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import { saveArticle, getArticle } from '@/services/articleService'
import { querySeries, queryCategory } from '@/services/materialService'

// 路由和API相关
const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loading = ref(false)

// 表单相关
const formRef = ref(null)
const contentTextarea = ref(null)
const articleForm = reactive({
    id: '',
    title: '',
    categoryId: '',
    seriesId: '',
    type: 'ORIGINAL',
    tags: [],
    content: '',
    isPublic: false,
    cover: '',
    origin: '',
    outline: '' 
})

const newTag = ref('')
const placeholderContent = `

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

const categoryTree = ref([])
const seriesList = ref([])

const formRules = {
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
    type: [{ required: true, message: '请选择文章类型', trigger: 'change' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
    origin: [{
        required: true,
        message: '请输入来源地址',
        trigger: 'blur',
        validator: (rule, value, callback) => {
            if (articleForm.type === 'REPRINT' && !value) {
                callback(new Error('请输入来源地址'));
            } else {
                callback();
            }
        }
    }]
}

const addTag = () => {
    if (newTag.value && !articleForm.tags.includes(newTag.value)) {
        articleForm.tags.push(newTag.value)
    }
    newTag.value = ''
}

const removeTag = (tag) => {
    articleForm.tags = articleForm.tags.filter(t => t !== tag)
}

const isPreviewMode = ref(false)

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
    const id = route.params.id
    if (id == 0) {
        return
    }
    loading.value = true
    try {
        const res = await getArticle(id)
        const article = res.data
        articleForm.id = article.id
        articleForm.title = article.title
        articleForm.categoryId = article.categoryId
        articleForm.seriesId = article.seriesId
        articleForm.type = article.type || 'ORIGINAL'
        articleForm.tags = article.tags ? article.tags.split(',') : []
        articleForm.content = article.content
        articleForm.isPublic = article.isPublic === 1
        articleForm.cover = article.cover
        articleForm.origin = article.origin
        articleForm.outline = article.outline || ''
    } catch (error) {
        console.error('获取文章失败:', error)
        message.error('获取文章失败，请刷新页面重试')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    initArticle()
    fetchSeries()
    fetchCategories()
})

async function fetchSeries() {
    try {
        const data = await querySeries()
        // 转换数据格式以适应Select组件
        seriesList.value = data.map(item => ({
            id: item.id,
            name: item.content
        }))
    } catch (error) {
        console.error('获取系列数据失败:', error)
        message.error('获取系列数据失败，请刷新页面重试')
    }
}

async function handleSubmit() {
    try {
        submitting.value = true;
        const formData = {
            ...articleForm,
            tags: articleForm.tags.join(','),
            isPublic: articleForm.isPublic ? 1 : 0,
            outline: articleForm.outline || ''
            // 封面图片会自动包含在formData中
        };

        const res = await saveArticle(formData);
        message.success(articleForm.id ? '文章更新成功' : '文章创建成功');
        router.push(`/articles/${res.data}`);
    } catch (error) {
        console.error('保存文章失败:', error);
        message.error('保存文章失败，请稍后重试');
    } finally {
        submitting.value = false;
    }
}

// 添加保存处理函数
async function handleSave() {
    if (!formRef.value) return;
    try {
        // 手动触发表单验证
        await formRef.value.validate();
        // 验证通过后提交表单
        await handleSubmit();
    } catch (error) {
        // 验证失败，Ant Design会自动显示错误提示
        console.log('表单验证失败:', error);
    }
}

const handleCancel = () => {
    router.back()
}

// 编辑器工具函数
const insertAtCursor = (text) => {
    nextTick(() => {
        if (!contentTextarea.value) {
            console.log('contentTextarea.value is null or undefined');
            return;
        }
        const textarea = contentTextarea.value.$el
        if (!textarea) {
            console.log('Failed to get textarea element');
            return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = articleForm.content;
        // 在光标位置插入文本
        articleForm.content = currentValue.substring(0, start) + text + currentValue.substring(end);

        // 移动光标到插入文本之后
        nextTick(() => {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
            textarea.focus();
        });
    });
}

const insertLink = () => {
    const linkSyntax = 'https://www.example.com[Example Link]\n';
    insertAtCursor(linkSyntax);
}

// 图片上传相关
const showUploadModal = ref(false);
const uploadImageUrl = ref('');

const handleUploadSuccess = (url) => {
    console.log('上传成功', url);
    uploadImageUrl.value = url;
    showUploadModal.value = false;
    // 插入图片语法到编辑器
    const imgTitle = url.split('/').pop()
    const imageSyntax = `\nimage::${url}[${imgTitle}]\n`;
    insertAtCursor(imageSyntax);
};

const insertImage = () => {
    uploadImageUrl.value = '';
    showUploadModal.value = true;
}

const insertTable = () => {
    const tableSyntax = '[cols="1,3"]\n|===\n|Column 1, header row |Column 2, header row\n\n|Cell in column 1, row 2 |Cell in column 2, row 2\n|===\n';
    insertAtCursor(tableSyntax);
}

const insertCodeBlock = () => {
    const codeSyntax = '[source,language]\n----\n// 代码内容\n----\n';
    insertAtCursor(codeSyntax);
}

const insertPlantUml = () => {
    const plantUmlSyntax = '[plantuml]\n----\n@startuml\nclass Diagrama {\n  +mostrar(): void\n}\n@enduml\n----\n';
    insertAtCursor(plantUmlSyntax);
}

const insertFootnote = () => {
    const footnoteSyntax = 'footnote:[脚注内容]';
    insertAtCursor(footnoteSyntax);
}

const insertStrikeThrough = () => {
    const strikeThroughSyntax = '[.line-through]#删除线内容#';
    insertAtCursor(strikeThroughSyntax);
}

const insertTimeline = () => {
    const timelineSyntax = '[timeline]\n2023-08:: 实现 Vue3 迁移\n2023-12:: 发布 1.0 版本\n2024-04:: 新增 2.0 版本\n';
    insertAtCursor(timelineSyntax);
}

async function fetchCategories() {
    try {
        const data = await queryCategory()
        categoryTree.value = data
    } catch (error) {
        console.error('获取分类数据失败:', error)
        message.error('获取分类数据失败，请刷新页面重试')
    }
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

/* 编辑器工具栏 */
.editor-toolbar {
    margin-bottom: 1px;
    display: flex;
    gap: 5px;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    border-bottom: none;
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
