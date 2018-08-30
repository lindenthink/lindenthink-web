module.exports = {
    root: true, // 作用的目录是根目录
    parserOptions: {
        sourceType: 'module' // 按照模块的方式解析
    },
    env: {
        browser: true, // 开发环境配置表示可以使用浏览器的方法
    },
    rules: {
        // 自定义的规则
        "linebreak-style": [0 ,"error", "windows"],
        "indent": ['error', 4], // 缩进用4个空格
        "quotes": ["error", "single"] // 字符串用单引号
    }
}