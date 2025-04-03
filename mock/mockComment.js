/* eslint-disable @typescript-eslint/no-unused-vars */
const baseUrl = '/api'

export default [
  {
    url: `${baseUrl}/comments/:owner`,
    method: 'get',
    response: (request, params) => {
      const { owner } = request.query
      const data = [
        {
          id: 1,
          username: `author${owner}1`,
          avatar: 'https://ui-avatars.com/api?name=random&background=random',
          content:
            '1We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          created: '2023-07-16 22:54',
          children: [
            {
              id: 11,
              username: `author${owner}11`,
              avatar: 'https://ui-avatars.com/api?name=random&background=random',
              content:
                '1We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
              created: '2023-07-16 22:54',
              children: [],
            },
          ],
        },
        {
          id: 2,
          username: `author${owner}2`,
          avatar: 'https://ui-avatars.com/api?name=random2?background=random',
          content:
            '2We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
          created: '2025-03-30 22:54',
          children: [],
        },
      ]
      return {
        code: 0,
        message: 'success',
        data,
      }
    },
  },
  {
    url: `${baseUrl}/comment`,
    method: 'put',
    response: (request, params) => {
      return {
        code: 0,
        message: 'success',
      }
    },
  },
]
