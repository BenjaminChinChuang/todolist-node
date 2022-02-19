const headers = require('./header/baseHeader')

const errorContentCenter = {
  400: {
    40001: 'data is illegal.',
    40002: 'data format error.',
    40003: 'data not found.',
  },
  403: 'login error',
  default: 'connect error.',
  404: 'page not found.',
}

const errorHandle = (res, status, errorCode) => {
  let customErrorMessage = errorContentCenter['default']

  if (status) customErrorMessage = errorContentCenter[status]
  if (status && errorCode)
    customErrorMessage = errorContentCenter[status][errorCode]

  let data = {
    status: 'error',
    data: `error : ${customErrorMessage}`,
  }

  if (errorCode) {
    data = {
      ...data,
      code: errorCode,
      data: `error : ${errorContentCenter[status][errorCode]}`,
    }
  }

  res.writeHead(status, headers)
  res.write(JSON.stringify(data))
  res.end()
}

module.exports = errorHandle
