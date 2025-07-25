const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors') // Install cors later
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware') // Will be created soon
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', middleware.tokenExtractor,middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app