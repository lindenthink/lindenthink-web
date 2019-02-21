import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

import '../static/img/logo.png'

import Vue from 'vue'

/** 页眉组件 */
Vue.component('linden-header', {
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <span class="navbar-brand">菩提思</span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link glyphicon glyphicon-home text-info" href="index.html">主页</a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link glyphicon glyphicon-usd text-info" href="wealth.html">日积月累</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link glyphicon glyphicon-briefcase text-info" href="tool.html">匠心独运</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link glyphicon glyphicon-book text-info" href="life.html">人生百味</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link glyphicon glyphicon-music text-info" href="fun.html">闲情逸致</a>
                    </li>
                </ul>
                <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" placeholder="输入搜索内容" aria-label="Search">
                    <button class="btn btn-outline-info my-2 my-sm-0" type="button" id="searchBtn">搜索</button>
                </form>
            </div>
        </nav>
        <div class="card-header">&nbsp;</div><!-- 用来防止导航栏覆盖到页面内容 -->

        <div class="alert alert-info" role="alert">
            <div class="row">
                <div class="col-1">
                    公告 <i class="glyphicon glyphicon-volume-up"></i>
                </div>
                <div class="col-10">
                    <marquee class="d-block">千呼万唤始出来，犹抱琵琶半遮面。网站建设中，敬请期待^_^</marquee>
                </div>
                <div class="col-1">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" class="text-danger">&times;</span>
                    </button>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            notice: {
                show: true,
                message: '千呼万唤始出来，犹抱琵琶半遮面。网站正在建设中，敬请期待^_^'
            }
        };
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
