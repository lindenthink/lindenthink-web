import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import '../static/img/logo.png'
import '../static/icon/leaf.ico'

import Vue from 'vue'

/** 页眉组件 */
Vue.component('linden-header', {
    template: `
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <span class="navbar-brand font-weight-bold glyphicon glyphicon-leaf text-success">菩提思</span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item"  v-for="page in pages">
                        <a :class="['nav-link', isCurPage(page.url) ? 'text-white' : 'text-info']"  :href="isCurPage(page.url) ? '#' : page.url">{{page.title}}</a>
                    </li>
                </ul>
                <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" placeholder="输入搜索内容" aria-label="Search">
                    <button class="btn btn-outline-info my-2 my-sm-0" type="button" id="searchBtn">搜索</button>
                </form>
            </div>
        </nav>
        <div class="card-header">&nbsp;</div><!-- 用来防止导航栏覆盖到页面内容 -->

        <div class="alert alert-info" role="alert" v-if="notice.show">
            <div class="row">
                <div class="col-1">
                    公告 <i class="glyphicon glyphicon-volume-up"></i>
                </div>
                <div class="col-10">
                    <marquee class="d-block">{{notice.message}}</marquee>
                </div>
                <div class="col-1">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" class="text-danger">&times;</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            pages: [{
                url: 'index.html',
                title: '主页'
            }, {
                url: 'wealth.html',
                title: '日积月累'
            }, {
                url: 'tool.html',
                title: '匠心独运'
            }, {
                url: 'life.html',
                title: '人生百味'
            }, {
                url: 'fun.html',
                title: '闲情逸致'
            }
            ],
            curPage: 'index',
            notice: {
                show: true,
                message: '千呼万唤始出来，犹抱琵琶半遮面。网站正在建设中，敬请期待^_^'
            }
        };
    },
    methods: {
        isCurPage: curPage => {
            return window.location.toString().indexOf(curPage) > -1;
        }
    }

});

/** 页脚组件 */
Vue.component('linden-footer', {
    template: `
        <div class="bg-dark text-center text-white mt-3 p-2">
        <div class="row p-2">
            <div class="col-2 text-center border-right offset-3">
                <span class="glyphicon glyphicon-link">站内链接</span>
                <ul class="list-group">
                    <a class="list-group-item bg-dark text-info" href="#">关于我</a>
                    <a class="list-group-item bg-dark text-info" href="#">联系我</a>
                    <a class="list-group-item bg-dark text-info" href="http://47.104.243.84:9000/">发布平台</a>
                    <a class="list-group-item bg-dark text-info" href="#">管理平台</a>
                </ul>
            </div>
            <div class="col-2 text-center border-right">
                <span class="glyphicon glyphicon-link">参考链接</span>
                <ul class="list-group">
                    <a class="list-group-item bg-dark text-info" href="https://getbootstrap.com/">BootStrap</a>
                    <a class="list-group-item bg-dark text-info" href="http://www.runoob.com">菜鸟教程</a>
                    <a class="list-group-item bg-dark text-info" href="https://www.glyphicons.com">Glyphicon</a>
                    <a class="list-group-item bg-dark text-info" href="http://webpack.css88.com">Webpack中文文档</a>
                    <a class="list-group-item bg-dark text-info" href="https://www.easyicon.net/">EasyIcon</a>
                </ul>
            </div>
            <div class="col-2 text-center">
                <span class="glyphicon glyphicon-link">友情链接</span>
                <ul class="list-group">
                    <a class="list-group-item bg-dark text-info" href="http://www.ruanyifeng.com/blog">阮一峰的网络日志</a>
                </ul>
            </div>
        </div>
        <div>版权所有&copy;2018-2019 lindenthink.com</div>
        <div>沪ICP备×××号</div>
    </div>
    `
});
