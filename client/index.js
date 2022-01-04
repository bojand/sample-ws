'use strict'

const express = require('express')
const fs = require('fs')
const path = require('path')

const { createServer } = require('http')

const port = process.env.PORT || 8080
const app = express()

let html = fs.readFileSync(path.join(__dirname, 'index.tmpl.html'), 'utf8')
html = html.replace('{{location}}', process.env.WS_LOCATION || '${location.host}')

const dir = path.join(__dirname, 'public')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

fs.writeFileSync(path.join(__dirname, 'public/index.html'), html)

app.use(express.static(path.join(__dirname, '/public')))

const server = createServer(app)

server.listen(port, function () {
  console.log(`Listening on http://0.0.0.0:${port}`)
})
