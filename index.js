const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')

//DB Setup
mongoose.connect('mongodb://<REPLACE WITH YOUR MONGO DB URI>')

//App Setup
const app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.json({ type: '*/*' }))
router(app)

//Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('server listening')
