const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const logger = require('./logger/logger')
const config = require('config')
// const { getDb, connectToDb } = require('./db/db')
const mongoose = require('mongoose')
const startWss = require('./wss/wss')

const app = express()
const PORT = config.get('port')
const log = console.log
//TODO: Make it configurable
const URL = 'mongodb://localhost:27017/cromag'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors({
    //TODO Add cors
    origin: '*'
}));

app.use(logger);
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/common', require('./routes/common.routes'))

// let db
// connectToDb(err => {
//     if(err) {
//         log(chalk.green(`Db connections error:  ${err}`))
//         return;
//     }

//     db = getDb()
//     app.listen(PORT, '192.168.2.142', () => {
//         log(chalk.green(`CROMAG Server is started on ${PORT} port`))
//         fs.appendFile(
//             'server.log',
//             `Server is started on ${PORT} port at ${(new Date()).toLocaleString()}\n`,
//             (error) => {
//                 if(error) throw error
//             }
//         )
//     })
// })

mongoose
    .connect(URL)
    .then(() => {
        startWss()
        log(chalk.green('DB is connected!'))
    })
    .catch(() => log(chalk.red('DB connection error!')))

app.listen(PORT, '0.0.0.0', () => {
    log(chalk.green(`CROMAG Server is started on ${PORT} port`))
    fs.appendFile(
        'server.log',
        `Server is started on ${PORT} port at ${(new Date()).toLocaleString()}\n`,
        (error) => {
            if(error) throw error
        }
    )
})   