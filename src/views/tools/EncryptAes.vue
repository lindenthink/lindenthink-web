<template>
    <a-row :gutter="24">
        <!-- 左侧配置区 -->
        <a-col :span="12">
            <a-card title="AES加解密配置">
                <a-form layout="vertical">
                    <a-form-item label="加密模式">
                        <a-select v-model:value="config.mode" style="width: 200px">
                            <a-select-option value="CBC">CBC</a-select-option>
                            <a-select-option value="ECB">ECB</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="密钥">
                        <a-input-password v-model:value="config.key" placeholder="输入16/24/32字节密钥" allow-clear>
                            <template #addonAfter>
                                <a-tooltip title="生成随机密钥">
                                    <a-button @click="generateKey">
                                        <key-outlined />
                                    </a-button>
                                </a-tooltip>
                            </template>
                        </a-input-password>
                    </a-form-item>

                    <a-form-item :label="mode === 'encrypt' ? '明文输入' : '密文输入'">
                        <a-textarea v-model:value="inputText" :auto-size="{ minRows: 6, maxRows: 10 }"
                            :placeholder="mode === 'encrypt' ? '输入要加密的文本' : '输入Base64格式密文'" />
                    </a-form-item>

                    <a-space>
                        <a-button type="primary" @click="handleEncrypt" :disabled="mode === 'decrypt'">
                            <lock-outlined /> 加密
                        </a-button>
                        <a-button type="primary" @click="handleDecrypt" :disabled="mode === 'encrypt'">
                            <unlock-outlined /> 解密
                        </a-button>
                        <a-button @click="swapMode">
                            <swap-outlined /> 切换模式
                        </a-button>
                    </a-space>
                </a-form>
            </a-card>
        </a-col>

        <!-- 右侧结果区 -->
        <a-col :span="12">
            <a-card title="处理结果">
                <div class="result-container">
                    <a-textarea v-model:value="outputText" :auto-size="{ minRows: 6, maxRows: 10 }"
                        :placeholder="mode === 'encrypt' ? 'Base64加密结果' : '解密后文本'" readonly class="result-area" />
                    <div class="copy-button-wrapper">
                        <a-tooltip title="复制结果">
                            <a-button type="link" @click="copyResult" :disabled="!outputText">
                                <copy-outlined />
                            </a-button>
                        </a-tooltip>
                    </div>
                </div>

                <!-- 元信息标签 -->
                <div v-if="mode === 'encrypt'" class="result-meta">
                    <a-tag color="blue">IV：{{ iv }}</a-tag>
                    <a-tag color="green">密文长度：{{ outputText.length }}</a-tag>
                </div>
            </a-card>
        </a-col>
    </a-row>
    <!-- 算法说明 -->
    <a-collapse style="margin-top: 24px">
        <a-collapse-panel key="1" header="AES算法说明">
            <a-descriptions bordered :column="1">
                <a-descriptions-item label="算法标准">
                    <li>全称：高级加密标准 (Advanced Encryption Standard)</li>
                    <li>规范：FIPS PUB 197</li>
                    <li>替代：取代DES成为新标准</li>
                </a-descriptions-item>
                <a-descriptions-item label="密钥规格">
                    <li>AES-128：16字节密钥</li>
                    <li>AES-192：24字节密钥（部分国家限制使用）</li>
                    <li>AES-256：32字节密钥（推荐安全级别）</li>
                </a-descriptions-item>
                <a-descriptions-item label="工作模式">
                    <li>CBC模式：需要初始化向量IV（默认推荐）</li>
                    <li>ECB模式：简单但不安全（不推荐）</li>
                    <li>CTR/GCM：支持流加密/认证加密</li>
                </a-descriptions-item>
                <a-descriptions-item label="最佳实践">
                    <li>每次加密使用不同IV（CBC模式）</li>
                    <li>密钥应通过安全渠道传输</li>
                    <li>定期轮换加密密钥</li>
                    <li>结合HMAC进行完整性验证</li>
                </a-descriptions-item>
            </a-descriptions>
        </a-collapse-panel>
    </a-collapse>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import CryptoJS from 'crypto-js';
import {
    LockOutlined,
    UnlockOutlined,
    SwapOutlined,
    CopyOutlined,
    KeyOutlined,
} from '@ant-design/icons-vue';

const mode = ref('encrypt');
const inputText = ref('');
const outputText = ref('');
const iv = ref('');

const config = ref({
    mode: 'CBC',
    key: ''
});

const generateKey = () => {
    const keyLengths = [16, 24, 32];
    const length = keyLengths[Math.floor(Math.random() * 3)];
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';

    // 使用更安全的随机生成方式
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    config.value.key = Array.from(randomValues)
        .map(byte => charset[byte % charset.length])
        .join('');

    message.success(`已生成AES-${length * 8}密钥`);
};

const validKeyLengths = [16, 24, 32]; // AES-128/192/256

const handleEncrypt = () => {
    try {
        validateKey();
        const key = CryptoJS.enc.Utf8.parse(config.value.key);
        const ivBytes = CryptoJS.lib.WordArray.random(128 / 8);
        iv.value = CryptoJS.enc.Base64.stringify(ivBytes);

        const encrypted = CryptoJS.AES.encrypt(
            inputText.value,
            key,
            {
                iv: ivBytes,
                mode: CryptoJS.mode[config.value.mode],
                padding: CryptoJS.pad.Pkcs7
            }
        );

        outputText.value = encrypted.toString();
    } catch (error) {
        message.error(`加密失败: ${error.message}`);
    }
};

const handleDecrypt = () => {
    try {
        if (config.value.mode === 'CBC' && !iv.value) {
            throw new Error('CBC模式需要提供IV值');
        }
        validateKey();
        const key = CryptoJS.enc.Utf8.parse(config.value.key);
        const ivBytes = CryptoJS.enc.Base64.parse(iv.value);

        const decrypted = CryptoJS.AES.decrypt(
            inputText.value,
            key,
            {
                iv: ivBytes,
                mode: CryptoJS.mode[config.value.mode],
                padding: CryptoJS.pad.Pkcs7
            }
        );

        outputText.value = decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        message.error(`解密失败: ${error.message}`);
    }
};

const validateKey = () => {
    const keyLength = config.value.key.length;
    if (!validKeyLengths.includes(keyLength)) {
        throw new Error(`密钥长度需为16/24/32字节，当前为${keyLength}字节`);
    }
};

const swapMode = () => {
    mode.value = mode.value === 'encrypt' ? 'decrypt' : 'encrypt';
    [inputText.value, outputText.value] = [outputText.value, inputText.value];
};

const copyResult = () => {
    navigator.clipboard.writeText(outputText.value)
        .then(() => message.success('复制成功'))
        .catch(() => message.error('复制失败'));
};
</script>

<style scoped>
.result-area {
    font-family: monospace;
    margin: 16px 0;
}

.result-meta {
  margin-top: 16px;
}

.ant-tag {
    user-select: all;
}

.result-container {
  position: relative;
}

.copy-button-wrapper {
  position: absolute;
  top: 15px;
  right: -5px;
  z-index: 1;
}

.result-area {
  padding-right: 40px; /* 为按钮留出空间 */
}

.ant-btn-link {
  color: #1890ff;
  transition: color 0.3s;
}

.ant-btn-link:hover {
  color: #40a9ff;
}

.ant-btn-link[disabled] {
  color: rgba(0,0,0,0.25);
  cursor: not-allowed;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .copy-button-wrapper {
    right: 8px;
    top: 8px;
  }
  
  .result-area {
    padding-right: 36px;
  }
}

</style>