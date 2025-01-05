const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const { logger, logToFile, log, startLogCleaning } = require('./logger/logger')
const config = require('config')
const mongoose = require('mongoose')
const startWss = require('./wss/wss')

const app = express()
const PORT = process.env.PORT || config.get('port')
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

startLogCleaning()

mongoose
    .connect(URL)
    .then(() => {
        startWss()
        log(chalk.green('DB is connected!'))
        logToFile(`🛩 Server is started on ${PORT} port in ${process.env.NODE_ENV} mode`);
    })
    .catch(error => { 
            log(chalk.red('DB connection error!'))
            logToFile(`DB connection error ${JSON.stringify(error)}`)
        } 
    )

app.listen(PORT, '0.0.0.0', () => {
    const today = new Date().toLocaleDateString();
    log(chalk.green(`🛩 CROMAG Server is started on ${PORT} port in ${process.env.NODE_ENV} mode`))
    logToFile(`🛩 Server is started on ${PORT} port in ${process.env.NODE_ENV} mode`);
})   