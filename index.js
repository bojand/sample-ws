'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')
const { WebSocketServer } = require('ws')

const port = process.env.PORT || 8080

let wsAddr = '${location.host}'

if (process.env.WS_HOST) {
   let appURL = parse(process.env.WS_HOST)
   wsAddr = appURL.hostname
}

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
const wss = new WebSocketServer({ noServer: true })

wss.on('connection', function (ws, req) {
  console.log('got connection')
  console.log(JSON.stringify(req.headers))

  const id = setInterval(function () {
    console.log('sending message to client')
    ws.send(JSON.stringify(process.memoryUsage()))
  }, 1000)

  console.log('started client interval')

  ws.on('close', function () {
    console.log('stopping client interval')
    clearInterval(id)
  })
})

server.on('upgrade', function upgrade (request, socket, head) {
  const { pathname } = parse(request.url)

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, function done (ws) {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

server.listen(port, function () {
  console.log(`Listening on http://0.0.0.0:${port}`)
})
