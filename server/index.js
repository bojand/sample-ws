'use strict'

const express = require('express')
const { createServer } = require('http')

const WebSocket = require('ws')

const app = express()

const server = createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', function (ws) {
  console.log('got connection')
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

server.listen(8080, function () {
  console.log('Listening on http://0.0.0.0:8080')
})
