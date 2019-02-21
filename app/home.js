import './static/img/app-tool.jpg'
import './static/img/app-life.jpg'
import './static/img/app-enjoy.jpg'
import './static/img/app-fund.jpg'
import './static/icon/hot.png'
import './static/icon/new.png'

import './home.less'

import Vue from 'vue'

const vue = new Vue({
    el: '#app',
    data: {
        notice: {
            show: true,
            message: '千呼万唤始出来，犹抱琵琶半遮面。网站正在建设中，敬请期待^_^'
        },
        quotations: '在这人世间，有些路是非要单独一个人去面对，单独一个人去跋涉的，路再长再远，夜再黑再暗，也得独自默默地走下去。[席慕蓉]',
        statistics: {
            filesCount: 2,
            visitorsCount: 5,
            commentsCount: 10
        },
        newArticles: [{
            title: '最新文章1',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }, {
            title: '最新文章2',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }, {
            title: '最新文章3',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }],
        hotArticles: [{
            title: '最热文章1',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }, {
            title: '最热文章2',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }, {
            title: '最热文章3',
            url: 'https://www.runoob.com/vue2/vue-watch.html'
        }
        ]
    },
    methods: {}
});
