import express from 'express'

import bodyParser from 'body-parser'

import cors from 'cors'
import logger from './modules/logger/winston'

import authMiddleWare from './modules/auth/middleware'

import { connect } from './modules/database/mongo'
import Seed from './modules/database/validator'

// loading routes
import userRoutes from './modules/user/routes'

require('dotenv').config()

// seed collections with validations
connect(async () => {
  logger.info('Database Connected')
  await Seed()
})

// create instance of express
const app = express()

// define port to start server on
const port = process.env.port || 3000

// parse valid requests only
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())
app.use(cors())

// user interaction allowed without token headers
app.use('/user', userRoutes)

// all routes next to this will require authentication
app.use('/', authMiddleWare)

// start listening on ports
app.listen(port, () => {
  logger.info(`Express server started at port: ${port}`)
})
