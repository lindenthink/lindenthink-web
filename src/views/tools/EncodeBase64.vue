<template>
    <a-row :gutter="24">
        <!-- 左侧编码区 -->
        <a-col :span="12">
            <a-card title="Base64转换">
                <a-radio-group v-model:value="mode" button-style="solid" @change="handleModeChange">
                    <a-radio-button value="encode">编码</a-radio-button>
                    <a-radio-button value="decode">解码</a-radio-button>
                </a-radio-group>

                <a-textarea v-model:value="inputText" :placeholder="mode === 'encode' ? '输入要编码的内容' : '输入Base64字符串'"
                    :auto-size="{ minRows: 8, maxRows: 12 }" allow-clear class="input-area" />

                <a-button type="primary" block size="large" @click="handleConvert">
                    <template #icon>
                        <swap-outlined :rotate="90" />
                    </template>
                    {{ mode === 'encode' ? '执行编码' : '执行解码' }}
                </a-button>
            </a-card>
        </a-col>

        <!-- 右侧结果区 -->
        <a-col :span="12">
            <a-card title="转换结果">
            <div class="result-container">
        <a-textarea 
          v-model:value="outputText"
          :placeholder="mode === 'encode' ? 'Base64编码结果' : '解码后内容'"
          :auto-size="{ minRows: 8, maxRows: 12 }"
          readonly 
          class="result-area"
        />
        <div class="copy-button-wrapper">
          <a-tooltip title="复制结果">
            <a-button 
              type="link" 
              @click="copyResult" 
              :disabled="!outputText"
              class="copy-btn"
            >
              <copy-outlined />
            </a-button>
          </a-tooltip>
        </div>
      </div>

      <div class="action-bar">
        <a-tag color="blue">
          {{ mode === 'encode' ? '编码后长度' : '解码后长度' }}: {{ outputText.length }}
        </a-tag>
      </div>
            </a-card>
        </a-col>
    </a-row>
    <!-- 算法说明 -->
    <a-collapse style="margin-top: 24px">
        <a-collapse-panel key="1" header="Base64使用说明">
            <a-descriptions bordered :column="1">
                <a-descriptions-item label="编码规则">
                    <li>每3个字节（24位）转换为4个Base64字符</li>
                    <li>输出长度通常是输入长度的4/3倍</li>
                    <li>末尾用=号补足位数（最多2个）</li>
                </a-descriptions-item>
                <a-descriptions-item label="典型应用">
                    <li>在URL中传输二进制数据</li>
                    <li>Data URI Scheme（如内联图片）</li>
                    <li>简单的内容混淆</li>
                </a-descriptions-item>
                <a-descriptions-item label="注意事项">
                    <li>非加密算法（需加密请使用AES等）</li>
                    <li>中文字符需要先进行UTF-8编码</li>
                    <li>URL安全场景需替换+/为-_</li>
                </a-descriptions-item>
            </a-descriptions>
        </a-collapse-panel>
    </a-collapse>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { message } from 'ant-design-vue';
import { SwapOutlined, CopyOutlined } from '@ant-design/icons-vue';

const mode = ref('encode');
const inputText = ref('');
const outputText = ref('');

const handleConvert = () => {
    try {
        if (mode.value === 'encode') {
            outputText.value = btoa(unescape(encodeURIComponent(inputText.value)));
        } else {
            outputText.value = decodeURIComponent(escape(atob(inputText.value)));
        }
    } catch (error) {
        message.error(`转换失败：${error.message}`);
        outputText.value = '⚠ 输入内容格式不正确';
    }
};

const handleModeChange = () => {
    [inputText.value, outputText.value] = [outputText.value, inputText.value];
}


const copyResult = () => {
    navigator.clipboard.writeText(outputText.value)
        .then(() => message.success('复制成功'))
        .catch(() => message.error('复制失败'));
}
</script>

<style scoped>
.input-area,
.result-area {
    font-family: monospace;
    margin: 16px 0;
}

.ant-btn-block {
    height: 48px;
    font-size: 16px;
}

.ant-radio-group {
    margin-bottom: 16px;
}

.ant-card-head .ant-btn-link {
    color: #1890ff;
    margin-right: -12px;
}

.ant-card-head .ant-btn-link[disabled] {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
}

/* 调整操作栏样式 */
.action-bar {
    margin-top: 16px;
    justify-content: flex-start;
    gap: 12px;
}

.result-container {
  position: relative;
}

.copy-button-wrapper {
  position: absolute;
  top: 15px;
  right: 2px;
  z-index: 1;
}

.copy-btn {
  color: #1890ff;
  font-size: 16px;
  padding: 4px;
}

.copy-btn:hover {
  color: #40a9ff;
}

.copy-btn[disabled] {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

.result-area {
  padding-right: 40px; /* 为按钮留出空间 */
}

/* 响应式调整 */
@media (max-width: 768px) {
    .ant-card-head .ant-btn-link {
        margin-right: 0;
        padding: 0 8px;
    }

    .action-bar {
        flex-wrap: wrap;
    }
}
</style>