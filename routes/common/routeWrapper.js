const errorHandle = require('../../errorHandler')

const isRouteError = (req, routePath) => {
  let error = true
  const splitReqUrl = req.url.split('/').filter(e => e)

  if (req.url.startsWith(routePath)) {
    switch (req.method) {
      case 'DELETE':
      case 'PATCH':
        error = false
        break
      case 'GET':
      case 'POST':
      case 'OPTIONS':
      default:
        if (splitReqUrl.length === 1) error = false
        break
    }
  }

  return error
}

const routeWrapper = (routePath, targetRoute) => {
  return (req, res) => {
    if (isRouteError(req, routePath)) {
      errorHandle(res, 404)
      return
    }
    return targetRoute.call(this, req, res)
  }
}

module.exports = routeWrapper
