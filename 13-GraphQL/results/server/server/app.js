const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const schema = require('../schema/schema.js')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = 3005

mongoose.connect("mongodb+srv://root:root@cluster0.82qao.mongodb.net/?retryWrites=true&w=majority")

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`connection error: ${err}`))
dbConnection.once('open', () => console.log('Connected to DB!'))

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!')
})