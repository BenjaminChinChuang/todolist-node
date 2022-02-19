const {v4: uuid4} = require('uuid')
const errorHandle = require('../errorHandler')
const routeWrapper = require('./common/routeWrapper')
const headers = require('../header/baseHeader')

const routePath = '/todolist'
const todoes = [
  {
    title: '刷牙唷!',
    id: uuid4(),
  },
]

const todoListRoute = (req, res) => {
  let body = ''
  req.on('data', dataChunks => {
    body += dataChunks
  })

  const METHOD = req.method
  switch (METHOD) {
    case 'GET':
      res.writeHead(200, headers)
      res.write(
        JSON.stringify({
          status: 'success',
          data: todoes,
        })
      )
      res.end()
      break
    case 'POST':
      req.on('end', () => {
        try {
          const title = JSON.parse(body).title
          if (title !== undefined) {
            todoes.push({
              title,
              id: uuid4(),
            })
            res.writeHead(200, headers)
            res.write(
              JSON.stringify({
                status: 'success',
                data: todoes,
              })
            )
            res.end()
          } else {
            errorHandle(res, 400, 40002)
          }
        } catch (error) {
          errorHandle(res, 400, 40001)
        }
      })
      break
    case 'DELETE':
      const splitUrl = req.url.split('/').filter(e => e)
      const isDeleteAll = splitUrl.length === 1

      if (isDeleteAll) {
        // delete all
        todoes.length = 0
      } else {
        // delete specific id
        const index = todoes.findIndex(e => e.id === splitUrl[1])
        console.log(index)
        if (index !== -1) {
          todoes.splice(index, 1)
        } else {
          errorHandle(res, 400, 40003)
          return
        }
      }

      res.writeHead(200, headers)
      res.write(
        JSON.stringify({
          status: 'success',
          data: todoes,
        })
      )
      res.end()
      break
    case 'PATCH':
      req.on('end', () => {
        try {
          const splitUrl = req.url.split('/').filter(e => e)
          const title = JSON.parse(body).title
          const index = todoes.findIndex(e => e.id === splitUrl[1])

          if (title && index !== -1) {
            todoes[index].title = title
          } else {
            errorHandle(res, 400, 40002)
            return
          }

          res.writeHead(200, headers)
          res.write(
            JSON.stringify({
              status: 'success',
              data: todoes,
            })
          )
          res.end()
        } catch (error) {
          errorHandle(res, 400, 40001)
        }
      })
      break
    case 'OPTIONS': // for preflight 表示可以支援跨網域
      res.writeHead(200, headers)
      res.end()
      break
    default:
      break
  }
}

module.exports = routeWrapper(routePath, todoListRoute)
