/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrl = '/api/friends'

export default [
  {
    url: `${baseUrl}`,
    method: 'get',
    response: (request, params) => {
      const listData = []
      for (let i = 0; i < 10; i++) {
        listData.push({
          title: `菩提思 ${i}`,
          avator: '/logo.jpg',
          link: 'https://www.baidu.com',
          slogan: '一叶一世界，一花一菩提',
        })
      }
      return {
        code: 0,
        message: 'success',
        data: listData,
      }
    },
  },
  {
    url: `${baseUrl}`,
    method: 'post',
    response: (request, params) => {
      return {
        code: 0,
        message: 'success',
      }
    },
  },
]
