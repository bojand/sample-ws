'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')
const { Server } = require('socket.io')

const port = process.env.PORT || 8080

const wsAddr = process.env.WS_HOST || '${location.host}'

const app = express()

let html = fs.readFileSync(path.join(__dirname, 'index.tmpl.html'), 'utf8')

let protcol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws'

html = html.replace('{{ws_location}}', `${protcol}:${wsAddr}`)

const dir = path.join(__dirname, 'public')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

fs.writeFileSync(path.join(__dirname, 'public/index.html'), html)

app.use(express.static(path.join(__dirname, '/public')))

const server = createServer(app)

const io = new Server(server);


io.on('connection', (socket) => {
  console.log('got connection')

  const id = setInterval(function () {
    console.log('sending message to client')
    io.emit('stats', JSON.stringify(process.memoryUsage()));
  }, 1000)

  console.log('started client interval')

  socket.conn.on('close', function () {
    console.log('stopping client interval')
    clearInterval(id)
  })
})

server.listen(port, function () {
  console.log(`Listening on http://0.0.0.0:${port}`)
})
