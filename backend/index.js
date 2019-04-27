const express = require('express')
const app = express()
const config = require('./config')

app.get('/ping', api.ping)
app.get('/start', api.start)
app.post('/guess', api.guess)
app.post('/debug', api.debug)
app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))