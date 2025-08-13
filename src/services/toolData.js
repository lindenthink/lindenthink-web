const tools = [
  {
    title: '格式化',
    children: [
      { title: 'JSON', path: '/tools/format-json', quickEntry: true, quickName: 'JSON格式化', searchKey: 'JSON格式化' },
      { title: 'XML', path: '/tools/format-xml', searchKey: 'XML格式化' },
      { title: 'SQL', path: '/tools/format-sql', searchKey: 'SQL格式化' },
    ],
  },
  {
    title: '编解码',
    children: [
      { title: 'BASE64', path: '/tools/encode-base64', quickEntry: true, quickName: 'BASE64编解码', searchKey: 'BASE64编码解码' },
      { title: 'URL', path: '/tools/encode-url', searchKey: 'URL编码解码' },
      { title: 'Unicode', path: '/tools/encode-unicode', searchKey: 'Unicode编码解码' },
      { title: 'Ascii', path: '/tools/encode-ascii', searchKey: 'Ascii编码解码' },
    ],
  },
  {
    title: '加解密',
    children: [
      { title: 'RSA', path: '/tools/encrypt-rsa', searchKey: 'RSA加密解密' },
      { title: 'AES', path: '/tools/encrypt-aes', quickEntry: true, quickName: `AES加解密`, searchKey: 'AES加密解密' },
    ],
  },
  {
    title: '摘要',
    children: [
      { title: 'MD5', path: '/tools/digest-md5', quickEntry: true, quickName: 'MD5', searchKey: 'MD5摘要' },
      { title: 'SHA1', path: '/tools/digest-sha1', searchKey: 'SHA1摘要' },
      { title: 'SHA256', path: '/tools/digest-sha256', searchKey: 'SHA256摘要' },
      { title: 'HMAC', path: '/tools/digest-hmac', searchKey: 'HMAC摘要' },
    ],
  },
  {
    title: '转换',
    children: [
      { title: '时间戳', path: '/tools/convert-timestamp', quickEntry: true, quickName: '时间戳转换', searchKey: '时间戳转换' },
      { title: 'Cron表达式', path: '/tools/convert-cron', quickEntry: true, quickName: 'Cron校验解释', searchKey: 'Cron表达式转换' },
    ],
  },
  {
    title: '图片',
    children: [
      { title: 'BASE64', path: '/tools/image-base64', searchKey: 'BASE64图片转换' },
      { title: '二维码', path: '/tools/image-qrcode', quickEntry: true, quickName: '二维码生成', searchKey: '二维码生成' },
    ],
  },
  {
    title: '密码',
    children: [
      { title: '密码生成', path: '/tools/password-generator', quickEntry: true, quickName: '密码生成', searchKey: '密码生成' },
      { title: '密码管理', path: '/tools/password-manager', searchKey: '密码管理' },
    ],
  },
  {
    title: '文本',
    children: [
      {
        title: '文本比对',
        path: '/tools/text-diff',
        quickEntry: true,
        quickName: '文本比对',
        searchKey: '文本差异比对',
      },
      {
        title: '正则匹配',
        path: '/tools/text-regular',
        quickEntry: true,
        quickName: '正则匹配',
        searchKey: '正则表达式匹配',
      },
    ],
  },
]

export default tools