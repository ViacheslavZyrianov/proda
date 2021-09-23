const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const history = require('connect-history-api-fallback')

app = express()
app.use(history())
app.use(serveStatic(path.join(__dirname, 'dist')))

app.listen(process.env.PORT || 3000)