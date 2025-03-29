/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrl = '/api/articles'

export default [
  {
    url: `${baseUrl}/:id`,
    method: 'get',
    response: (request, params) => {
      const { id } = request.query
      return {
        code: 0,
        message: 'success',
        data: {
          id,
          title: `标题${id}`,
          created: '2021-01-01',
          author: 'admin',
          category: '后端开发',
          source: '原创',
          tags: ['Java', 'SpringBoot'],
          visitCount: 100,
          commentCount: 10,
          praiseCount: 20,
          content: `
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
`,
        },
      }
    },
  },
  {
    url: baseUrl,
    method: 'post',
    response: (request, params) => {
      const { page, pageSize } = request.body
      const listData = []
      for (let i = 0; i < 48; i++) {
        listData.push({
          id: i,
          author: '菩提思',
          title: `ant design vue part ${i}`,
          avatar: `/logo.jpg`,
          cover: `/logo.jpg`,
          outline: 'ant design vue part',
          createTime: '2024-05-20',
          visitCount: i * 10,
          phaiseCount: i * 2,
          replyCount: i * 5,
        })
      }
      return {
        code: 0,
        message: 'success',
        total: listData.length,
        data: listData.slice(
          (page - 1) * pageSize,
          page * pageSize > listData.length ? listData.length : page * pageSize,
        ),
      }
    },
  },
]
