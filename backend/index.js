const express = require('express')
const api = require('./api')
const config = require('./config')
const path = require('path')

const app = express()
app.use(express.json());
app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'build')))
app.get('/api/ping', api.ping)
app.get('/api/start', api.start)
app.post('/api/guess', api.guess)
app.get('/api/debug', api.debug)
app.listen(process.env.PORT || config.port, () => console.log(`Game is listening on port ${process.env.PORT || config.port}!`))