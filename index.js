const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()

dotenv.config()

//############# DATABASE STUFF #################

mongoose.connect(process.env.DATABASE,
    { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true},
    err => console.log(err ? err : '> Database connected')
)

//############# REQUIRE ROUTES #################

const authRoutes = require('./routes/auth')
const postsRoutes = require('./routes/posts')

//############# MIDDLE ASS WARE #################

app.use(express.json())

//############# ROUTE MIDDLEWARE #################

app.use('/api/user', authRoutes)
app.use('/api/posts', postsRoutes)

app.listen(3000, () => console.log('> The server is up'))