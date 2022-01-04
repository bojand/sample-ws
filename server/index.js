'use strict'

const express = require('express')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')

const port = process.env.PORT || 8080

const app = express()

const server = createServer(app)
const wss = new WebSocketServer({ server })

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

server.listen(port, function () {
  console.log(`Listening on http://0.0.0.0:${port}`)
})
