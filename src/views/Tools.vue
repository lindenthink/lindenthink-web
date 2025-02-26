<template>
  <a-layout>
    <a-layout-sider></a-layout-sider>
    <a-layout-content>
      <AsciiDocViewer :content="asciidocContent" />
    </a-layout-content>
    <a-layout-sider></a-layout-sider>
  </a-layout>
</template>

<script setup>
import AsciiDocViewer from '@/components/AsciiDocViewer.vue'

const asciidocContent = `
= Hello, AsciiDoc!

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
</script>