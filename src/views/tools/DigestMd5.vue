<template>
  <a-row :gutter="24">
    <!-- 主功能区域 -->
    <a-col :span="12">
      <a-card title="输入内容">
        <a-textarea
          v-model:value="inputText"
          placeholder="输入要生成摘要的内容"
          :auto-size="{ minRows: 8, maxRows: 12 }"
          allow-clear
        />
        <a-button 
          type="primary" 
          block 
          size="large"
          style="margin-top: 16px"
          @click="generateDigest"
        >
          <template #icon><form-outlined /></template>
          生成MD5摘要
        </a-button>
      </a-card>
    </a-col>

    <a-col :span="12">
      <a-card title="MD5生成结果">
        <a-input
          v-model:value="md5Result"
          placeholder="结果将在此显示"
          readonly
          class="result-input"
        >
          <template #suffix>
            <a-button type="link" @click="copyResult(md5Result)">
              <copy-outlined />
            </a-button>
          </template>
        </a-input>
        <div class="result-meta">
          <a-tag v-if="md5Result" color="blue">
            长度：{{ md5Result.length }} 字符
          </a-tag>
          <a-tag v-if="md5Result" color="green">
            大写：{{ md5Result.toUpperCase() }}
          </a-tag>
        </div>
      </a-card>
    </a-col>
    </a-row>
        <!-- 算法说明 -->
        <a-collapse style="margin-top: 24px">
          <a-collapse-panel key="1" header="常见摘要算法说明">
            <a-descriptions bordered :column="1">
              <a-descriptions-item label="MD5">
                <li>输出长度：128位（32字符）</li>
                <li>设计者：Ronald Rivest</li>
                <li>安全性：已不推荐用于安全场景</li>
                <li>典型应用：文件完整性校验</li>
              </a-descriptions-item>
              <a-descriptions-item label="SHA-1">
                <li>输出长度：160位（40字符）</li>
                <li>替代方案：SHA-2系列</li>
                <li>谷歌2017年完成首次碰撞攻击</li>
              </a-descriptions-item>
              <a-descriptions-item label="SHA-256">
                <li>输出长度：256位（64字符）</li>
                <li>比特币区块链采用算法</li>
                <li>当前推荐的安全哈希标准</li>
              </a-descriptions-item>
              <a-descriptions-item label="HMAC">
                <li>基于密钥的哈希消息认证</li>
                <li>需要配合其他哈希算法使用</li>
                <li>常用于API请求签名</li>
              </a-descriptions-item>
            </a-descriptions>
          </a-collapse-panel>
        </a-collapse>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import md5 from 'js-md5';
import { CopyOutlined, FormOutlined } from '@ant-design/icons-vue';

const inputText = ref('');
const md5Result = ref('');

const generateDigest = () => {
  if (!inputText.value.trim()) {
    message.warning('请输入有效内容');
    return;
  }
  md5Result.value = md5(inputText.value);
};

const copyResult = (text) => {
  if (!text) {
    message.warning('没有可复制的内容');
    return;
  }
  navigator.clipboard.writeText(text)
    .then(() => message.success('复制成功'))
    .catch(() => message.error('复制失败'));
};
</script>

<style scoped>
.ant-descriptions-item-content li {
  margin: 6px 0;
}

.result-input {
  font-family: monospace;
  font-size: 16px;
}

.result-meta {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ant-btn-block {
  height: 48px;
  font-size: 16px;
}

/* 不同屏幕尺寸适配 */
@media (max-width: 768px) {
  .ant-col {
    width: 100% !important;
    max-width: 100%;
  }
}
</style>