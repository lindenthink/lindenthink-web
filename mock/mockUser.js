/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrl = '/api/user'

export default [
  {
    url: `${baseUrl}/auth/qrcode`,
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'QR code generated successfully',
        data: {
          url: 'http://example.com/qrcode',
          ticket: '1234567890',
        },
      }
    },
  },
  {
    url: `${baseUrl}/auth/check`,
    method: 'get',
    response: ({ query }) => {
      console.log('query', query.ticket)
      return {
        code: 0,
        data: {
          status: 'success',
          userInfo: {
            id: 1,
            phone: '12456789941',
            nickname: '菩提思',
            email: 'linden@lindenthink.com',
            avatar: 'http://localhost:3001/logo.jpg',
          },
        },
      }
    },
  },
]
