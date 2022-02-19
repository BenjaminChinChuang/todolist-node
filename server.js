const http = require('http')
const todoListRoute = require('./routes/todoList')
const PORT = '3800'

const server = http.createServer(todoListRoute)

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})
