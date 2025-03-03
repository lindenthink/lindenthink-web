<template>
  <a-layout>
    <a-layout-sider>
      <div class="article-toc">
        <a-tabs v-model:activeKey="activeKey" centered>
          <a-tab-pane key="1" tab="系列">
            <div class="article-toc-content">
              <div v-for="(item, index) in series" :key="index" style="border-bottom: 1px #f0f2f5 solid">
                <FileOutlined :style="{ color: 'grey' }" /> <a>{{ item }}</a>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="目录">
            <div class="article-toc-content">
              <a-anchor :affix="false" :offsetTop="40" showInkInFixed>
                <a-anchor-link
                  :href="anchor.href"
                  :title="anchor.title"
                  :key="index"
                  v-for="(anchor, index) in anchors"
                >
                  <a-anchor-link
                    :href="anchor2.href"
                    :title="anchor2.title"
                    :key="index2"
                    v-for="(anchor2, index2) in anchor.children"
                    v-if="anchor.hasChildren"
                  >
                    <a-anchor-link
                      :href="anchor3.href"
                      :title="anchor3.title"
                      :key="index3"
                      v-for="(anchor3, index3) in anchor2.children"
                      v-if="anchor2.hasChildren"
                    >
                    </a-anchor-link>
                  </a-anchor-link>
                </a-anchor-link>
              </a-anchor>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-sider>

    <a-layout-content>
      <a-breadcrumb separator=">" style="background-color: #f0f2f5; padding: 10px">
        <a-breadcrumb-item> <router-link :to="{ path: '/articles' }"> 文章 </router-link></a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{ path: '/articles' }">
            {{ tabName }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>正文</a-breadcrumb-item>
      </a-breadcrumb>

      <a-badge-ribbon text="原创" color="green" style="z-index: 9;">
        <div class="article">
          <div class="article-head">
            <h1 class="article-head-title">解放C盘</h1>
            <div class="article-head-meta">
              <EditOutlined style="margin-right: 5px" />
              <span>作者：Linden</span>
              <a-divider type="vertical"></a-divider>
              <CalendarOutlined style="margin-right: 5px" /><span>发表于：2022-04-24</span
              ><a-divider type="vertical"></a-divider> <EyeOutlined style="margin-right: 5px" /><span>浏览数：202</span
              ><a-divider type="vertical"></a-divider> <LikeOutlined style="margin-right: 5px" /><span>点赞数：202</span
              ><a-divider type="vertical"></a-divider> <MessageOutlined style="margin-right: 5px" />
              <span>评论数：20</span><br />
            </div>
            <a-typography style="text-align: left; padding: 0rem 3rem">
              <blockquote style="letter-spacing: 0.2em; font-weight: 50; font-style: italic">
                C盘一般都是作为系统盘来使用，相对空间会小一些。由于大多软件默认都是安装到这个磁盘，而且我们平时使用的应用依赖的配置或者缓存文件也同样存到这个磁盘中，所以它的空间很容易被占满。
              </blockquote>
            </a-typography>
          </div>

          <AsciiDocViewer :content="asciidocContent" ref="viewerRef" />

          <div class="article-foot">
            <div style="text-align: center"></div>
            <ul class="article-foot-copyright">
              <li><strong>本文作者：</strong>流年</li>
              <li>
                <strong>本文链接：</strong>
                <a href="{{curUrl}}" title="解放C盘">{{ curUrl }}</a>
              </li>
              <li>
                <strong>版权声明：</strong>本博客所有文章除特别声明外，均采用
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="noopener" target="_blank"
                  ><copyright-outlined />BY-NC-SA</a
                >
                许可协议。转载请注明出处！
              </li>
            </ul>
            <div style="display: flex; justify-content: space-between">
              <span>分类：JAVA</span>
              <div>
                标签：
                <a-tag>
                  <template #icon>
                    <tag-outlined />
                  </template>
                  JAVA
                </a-tag>
                <a-tag>
                  <template #icon> <tag-outlined /> </template>
                  HTML
                </a-tag>
                <a-tag>
                  <template #icon> <tag-outlined /> </template>
                  CSS
                </a-tag>
              </div>
            </div>
            <a-divider :style="{ color: 'lightgrey' }">•</a-divider>
            <div class="article-foot-nav">
              <div>
                <a href="#"><left-outlined /> 文章1文章1文章1</a>
              </div>
              <div>
                <a href="#">文章2文章2文章2文章2 <right-outlined /></a>
              </div>
            </div>
          </div>
        </div>
      </a-badge-ribbon>

      <MyComment ref="commentRef" target="1" />
    </a-layout-content>
    <a-layout-sider>
      <div class="fixed-praise" @click="clickPraise" :style="{ 'background-color': isPraise ? '#1890ff' : '' }">
        <LikeOutlined class="fixed-btn-icon" ref="likeRef" />
      </div>
      <div class="fixed-comment" @click="clickComment">
        <MessageOutlined class="fixed-btn-icon" />
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CopyrightOutlined,
  LeftOutlined,
  RightOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CalendarOutlined,
  TagOutlined,
  FileOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import MyComment from '@/components/MyComment.vue'
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'
import { TagColors, showMessage, bindTip } from '@/static/linden'

const tabNameMap = new Map([
  ['list', '列表'],
  ['series', '系列'],
  ['archive', '归档'],
])
const tagColors = TagColors

const router = useRouter()
const routeParams: any = router.currentRoute.value.params
const tabKey = routeParams['tab']
const tabName = tabNameMap.get(tabKey)
const isPraise = ref(false)
const curUrl = location.href
const commentRef: any = ref()
const viewerRef: any = ref()
const likeRef: any = ref()
const activeKey = ref('2')
const series = [
  'Racing car .',
  'Japanese princess.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
  'Australian walks 100km.',
  'missing wedding girl.',
  'Los Angeles battles huge wildfires.',
]

// onMounted(() => {
//   bindTip()
// })
// const recommendInterval = setInterval(() => showMessage('这篇文章怎么样啊，记得点赞和评论喔(*^_^*)', 4000), 100000)
// onUnmounted(() => clearInterval(recommendInterval))

const asciidocContent = `
= Hello, AsciiDoc!gitlab.hd123.com

- https://gitlab.hd123.com/huzexiong/im-h6-doc/-/blob/master/cloud-fund/multi-batch-settle-logic.adoc[多批次结算流程]
- https://gitlab.hd123.com/pay/pay-doc/-/blob/develop/%E8%AE%BE%E8%AE%A1%E6%96%87%E6%A1%A3/cloudfund/%E8%AF%84%E4%BC%B0/%E9%9C%80%E6%B1%82%E8%AF%84%E4%BC%B0/%E5%AD%98%E9%87%8F%E7%BD%91%E5%95%86%E5%95%86%E6%88%B7%E5%88%87%E5%A4%9A%E6%89%B9%E6%AC%A1%E8%AF%84%E4%BC%B0.adoc[存量网商商户切多批次评估]

== Introduction
This is a simple AsciiDoc example with PlantUML support and syntax highlighting.

|===
|类型|译名|用途|说明|参考

|Received payment details report|来款明细| | | https://docs.adyen.com/reporting/received-payment-details-report[详情参见>>]
|Payment accounting report|支付账户报表| | | https://docs.adyen.com/reporting/invoice-reconciliation/payment-accounting-report[详情参见>>]
|Settlement details report|结算明细报表| | | https://docs.adyen.com/reporting/settlement-detail-report[详情参见>>]
|Monthly invoice|月度发票| | | https://docs.adyen.com/reporting/invoice-reconciliation/payment-processing-invoice[详情参见>>]
|===

== PlantUML Diagram

[plantuml]
----
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi!
@enduml
----

== Code Example

[source,java]
----
@ApiModel("总部资金账户类型")
public enum HqAccountAttributeEnum {
    HQ('普通账户', true, "SH"),
    HQ_PAYER('支出账户', true, "00"),
    HQ_TAKEOUT('外卖结算专户', true, "SH"),
    HQ_FEEBACK('营销补贴专户', true, "00"),
    HQ_BANK_CRO_ACCOUNT('银企直连账户', false, "00");

    HqAccountAttributeEnum(String desc, boolean needCreate, String memberProperty) {
        this.desc = desc;
        this.needCreate = needCreate;
        this.memberProperty = memberProperty;
    }
    private String desc;
    private boolean needCreate;
    private String memberProperty;
}
----

[source,python]
----
# 此处str()的作用：把数值变成了字符串
a = str(input("输入一个数字："))
print(a)
b = str(input("输入一个数字："))
print(b)
print("打印两个数字相加：%s " % (a + "+" + b))
----

[plantuml]
----
@startuml
title 多批次结算处理状态模式类图
skin rose
actor 商户
participant 云资金
participant 平安见证宝
participant 平安云收款

autonumber 1.1
==开户==
商户->云资金++:进件申请\\nfundaccount/open
云资金->平安见证宝++:注册开户\\n（KFEJZB6248）
return 开户结果\\n（子账户账号）

return 申请结果
loop 开户异常
    云资金->平安见证宝++:查询会员子账号\\n（KFEJZB6092）
    return 开户结果\\n（子账户账号）
end
云资金->平安见证宝++: 登记行为记录\\n（KFEJZB6244）
return 登记结果
alt 平安收单
    云资金->平安云收款++:门店商户进件\\n（3.1）
    return 申请结果
end
==绑卡==
autonumber 2.1
商户->云资金++:绑定提现账户\\nfundaccount/bankcard/bind
云资金->平安见证宝++:操作绑卡\\n（KFEJZB6240）
平安见证宝->平安见证宝:小额打款
平安见证宝-->商户:短信通知客户打款金额+指令
return 操作结果
return 操作结果
商户->云资金++:输入打款金额+指令\\nfundaccount/bankcard/verify
云资金->平安见证宝++: 回填打款金额+指令\\n（KFEJZB6241）
return 校验结果
return 绑定结果
@enduml
----


[plantuml]
----
@startuml
title 多批次结算处理状态模式类图

abstract class State {
    +void handle(Contex context)
}

class InitialState {
    +void handle(Contex context)
}

class ProcessingState {
    +void handle(Contex context)
}

class CompletedState {
    +void handle(Contex context)
}

class Context {
    -State state
    +void setState(State state)
    +void request()
}

Context *-- State
Context o-- "1" InitialState
Context o-- "1" ProcessingState
Context o-- "1" CompletedState

InitialState --|> State
ProcessingState --|> State
CompletedState --|> State

@enduml
----


`

// const clickPraise = () => {
//   isPraise.value = !isPraise.value
//   if (isPraise.value) {
//     showMessage('谢谢点赞，你的支持是对作者最大的鼓励！', 5000)
//   }
// }

const clickComment = () => {
  commentRef.value.scrollToReply()
}
</script>

<script lang="ts">
// 处理锚点
export default {
  data() {
    return {
      anchors: [],
    }
  },
  mounted() {
    const els = this.$refs.viewerRef.$el.querySelectorAll('h1,h2,h3')
    let el,
      nextEl,
      parentAnchors = [], // 正在处理的父锚点集合
      parentAnchor
    for (let i = 0; i < els.length; i++) {
      el = els[i]
      nextEl = els.length === i + 1 ? null : els[i + 1]
      el.id = 'toc-' + (i + 1)
      let anchor: any = {
        id: el.id,
        title: el.innerText.trim(),
        href: '#' + el.id,
        tagName: el.tagName,
        hasChildren: el.tagName < nextEl?.tagName,
        children: [],
      }
      if (parentAnchors.length > 0) {
        parentAnchor = parentAnchors[parentAnchors.length - 1]
        parentAnchor.children.push(anchor)
      } else {
        this.anchors.push(anchor)
      }
      if (anchor.hasChildren) {
        parentAnchors.push(anchor)
      } else {
        while (true) {
          if (parentAnchors.length === 0 || parentAnchor.tagName < nextEl?.tagName) {
            break
          }
          parentAnchors.pop()
        }
      }
    }
  },
}
</script>

<style lang="less" scoped>
.ant-layout-content {
  position: relative;
  min-width: 0;
  background: #f0f2f5;
  transition: all 0.2s;
  min-width: 780px;
}

.article {
  background-color: white;
  margin-top: 5px;
  padding: 10px;
}

.article-head {
  margin-top: 40px;
  text-align: center;
  .article-head-title {
    font-size: 2.2em;
  }
  .article-head-meta {
    // margin: 0 0 10px 0;
    color: #999;
    font-family: 'Lato', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 12px;
    text-align: center;
  }
}
.article-foot {
  padding: 0rem 2.5rem;
  .article-foot-copyright {
    padding: 0.5em 1em;
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    list-style: none;
  }
  .article-foot-nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
}

.article-toc {
  background-color: #fff;
  position: sticky;
  top: 120px;
  z-index: 9;
  margin-right: 10px;
  padding: 10px 0px 0px 0px;
  max-width: 200px;
  left: 12%;
  .article-toc-content {
    padding: 0 10px 10px 10px;
    max-height: 80vh;
    overflow-y: auto;
  }
}

.mixin-fixed-btn(@index) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  font-feature-settings: 'tnum';
  position: fixed;
  right: 15vw;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.45);
  bottom: calc(14vh + @index * 50px);
  text-align: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .fixed-btn-icon {
    font-size: 24px;
    color: white;
    line-height: 40px;
  }
}

.fixed-praise {
  .mixin-fixed-btn(2);
}
.fixed-comment {
  .mixin-fixed-btn(1);
}
</style>
