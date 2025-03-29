export default [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === 'admin') {
        return {
          code: 200,
          data: {
            token: 'admin-token',
          },
        }
      } else {
        return {
          code: 401,
          message: '用户名或密码错误',
        }
      }
    },
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = headers['authorization']
      if (token === 'admin-token') {
        return {
          code: 200,
          data: {
            roles: ['admin'],
            username: 'admin',
          },
        }
      } else {
        return {
          code: 401,
          message: 'Token 无效',
        }
      }
    },
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        data: 'success',
      }
    },
  },
  {
    url: '/api/user/register',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      return {
        code: 200,
        data: {
          username,
          password,
        },
      }
    },
  },
]
