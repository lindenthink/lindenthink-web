<template>
  <a-row :gutter="24">
    <!-- 左侧操作区 -->
    <a-col :span="12">
      <a-card title="RSA密钥管理">
        <a-button type="primary" block @click="generateKeyPair">
          <template #icon><key-outlined /></template>
          生成RSA密钥对
        </a-button>

        <a-tabs v-model:activeKey="activeTab" style="margin-top: 16px">
          <a-tab-pane key="public" tab="公钥">
            <a-textarea
              v-model:value="publicKey"
              :auto-size="{ minRows: 6, maxRows: 10 }"
              placeholder="公钥将在此显示"
            />
          </a-tab-pane>
          <a-tab-pane key="private" tab="私钥">
            <a-textarea
              v-model:value="privateKey"
              :auto-size="{ minRows: 6, maxRows: 10 }"
              placeholder="私钥将在此显示"
            />
          </a-tab-pane>
        </a-tabs>
      </a-card>

      <a-card title="加解密操作" style="margin-top: 24px">
        <a-tabs v-model:activeKey="operationType">
          <a-tab-pane key="encrypt" tab="加密">
            <a-textarea
              v-model:value="plainText"
              :auto-size="{ minRows: 4, maxRows: 8 }"
              placeholder="输入要加密的文本"
            />
            <a-button type="primary" block style="margin-top: 16px" @click="handleEncrypt">
              执行加密
            </a-button>
          </a-tab-pane>
          <a-tab-pane key="decrypt" tab="解密">
            <a-textarea
              v-model:value="cipherText"
              :auto-size="{ minRows: 4, maxRows: 8 }"
              placeholder="输入要解密的Base64文本"
            />
            <a-button type="primary" block style="margin-top: 16px" @click="handleDecrypt">
              执行解密
            </a-button>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-col>

    <!-- 右侧结果区 -->
    <a-col :span="12">
      <a-card title="执行结果">
        <a-textarea
          v-model:value="result"
          :auto-size="{ minRows: 10, maxRows: 20 }"
          :placeholder="operationType === 'encrypt' ? '加密结果' : '解密结果'"
          readonly
          class="result-area"
        />
        <div class="action-buttons">
          <a-tooltip title="复制结果">
            <a-button type="link" @click="copyResult">
              <copy-outlined />
            </a-button>
          </a-tooltip>
        </div>
      </a-card>
    </a-col>
  </a-row>
       <!-- 算法说明 -->
       <a-collapse style="margin-top: 24px">
        <a-collapse-panel key="1" header="RSA算法说明">
          <a-descriptions bordered :column="1">
            <a-descriptions-item label="基本原理">
              <li>非对称加密算法</li>
              <li>基于大整数因数分解难题</li>
              <li>公钥加密，私钥解密</li>
            </a-descriptions-item>
            <a-descriptions-item label="密钥规范">
              <li>推荐长度：2048位及以上</li>
              <li>常见格式：PKCS#1/PKCS#8</li>
              <li>标准指数：65537 (0x10001)</li>
            </a-descriptions-item>
            <a-descriptions-item label="安全实践">
              <li>私钥必须严格保密</li>
              <li>加密内容长度受限（建议加密对称密钥）</li>
              <li>推荐使用OAEP填充模式</li>
            </a-descriptions-item>
            <a-descriptions-item label="典型应用">
              <li>数字签名</li>
              <li>密钥交换</li>
              <li>HTTPS证书</li>
            </a-descriptions-item>
          </a-descriptions>
        </a-collapse-panel>
      </a-collapse>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { KeyOutlined, CopyOutlined } from '@ant-design/icons-vue';

const activeTab = ref('public');
const operationType = ref('encrypt');
const publicKey = ref('');
const privateKey = ref('');
const plainText = ref('');
const cipherText = ref('');
const result = ref('');

// 生成密钥对
const generateKeyPair = async () => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    publicKey.value = await exportKey(keyPair.publicKey, 'public');
    privateKey.value = await exportKey(keyPair.privateKey, 'private');
    
    message.success('密钥对生成成功');
  } catch (error) {
    message.error('密钥生成失败: ' + error.message);
  }
};

// 密钥格式转换
const exportKey = async (key, type) => {
  const exported = await window.crypto.subtle.exportKey(
    type === 'public' ? 'spki' : 'pkcs8',
    key
  );
  
  const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  return `-----BEGIN ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----\n` +
         base64.match(/.{1,64}/g).join('\n') +
         `\n-----END ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`;
};

// 加密处理
const handleEncrypt = async () => {
  if (!publicKey.value) {
    message.error('请先生成公钥');
    return;
  }
  
  try {
    const publicKeyObj = await importKey(publicKey.value, 'public');
    const encoded = new TextEncoder().encode(plainText.value);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKeyObj,
      encoded
    );
    
    result.value = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    message.success('加密成功');
  } catch (error) {
    message.error('加密失败: ' + error.message);
  }
};

// 解密处理
const handleDecrypt = async () => {
  if (!privateKey.value) {
    message.error('请先生成私钥');
    return;
  }
  
  try {
    const privateKeyObj = await importKey(privateKey.value, 'private');
    const rawData = Uint8Array.from(atob(cipherText.value), c => c.charCodeAt(0));
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKeyObj,
      rawData
    );
    
    result.value = new TextDecoder().decode(decrypted);
    message.success('解密成功');
  } catch (error) {
    message.error('解密失败: ' + error.message);
  }
};

// 导入密钥
const importKey = async (pem, type) => {
  const base64 = pem
    .replace(`-----BEGIN ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`, '')
    .replace(`-----END ${type === 'public' ? 'PUBLIC' : 'PRIVATE'} KEY-----`, '')
    .replace(/\s+/g, '');
  
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  
  return window.crypto.subtle.importKey(
    type === 'public' ? 'spki' : 'pkcs8',
    binary,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    type === 'public' ? ["encrypt"] : ["decrypt"]
  );
};

// 复制结果
const copyResult = () => {
  navigator.clipboard.writeText(result.value)
    .then(() => message.success('复制成功'))
    .catch(() => message.error('复制失败'));
};
</script>

<style scoped>
.result-area {
  font-family: monospace;
  margin: 16px 0;
  padding-right: 40px;
}

.action-buttons {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.ant-descriptions-item-content li {
  margin: 6px 0;
}
</style>