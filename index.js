const chalk = require('chalk')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const mocks = require('./mocks/messages.mock')
const logger = require('./logger/logger')
const crypto = require('crypto')

const app = express()
const port = 5000
const log = console.log

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors({
    origin: ['http://localhost:4200']
}));

app.use(logger);

app.get('/info', (request, response) => {
    response.json({version: '0.0.1'})
})

app.get('/messages', (request, response) => {
    response.json(mocks)
})

app.delete('/message/:id', (request, response) => {
    chalk.red(console.log(request.params))
    const index = mocks.findIndex(item => item.id === request.params.id)

    if(index === -1) {
        response.status(404)
        response.json({ error: 'Message was not found' })
        response.end()    
    }

    mocks.splice(index, 1)
    response.status(200)
    response.end()
})


app.get('/message/:id', (request, response) => {
    const item = mocks.find(item => item.id === request.params.id)

    if(!item) {
        response.status(404)
        response.json({ error: 'Message was not found' })
        response.end()    
    }

    response.status(200)
    response.json(item)
    response.end()
})

app.post('/message', (request, response) => {
    const message = {
        ...request.body,
        id: crypto.randomUUID()
    }

    mocks.push(message)
    response.status(200)
    response.end()
})

app.put('/message/:id', (request, response) => {
    const index = mocks.findIndex(item => item.id === request.params.id)
    
    if(index === -1) {
        response.status(404)
        response.json({ error: 'Message was not found' })
        response.end()        
    }

    mocks[index] = {
        ...mocks[index],
        ...request.body
    }

    response.status(200)
    response.end()
})

app.listen(port, () => {
    log(chalk.green(`CROMAG Server is started on ${port} port`))
    fs.appendFile(
        'server.log',
        `Server is started on ${port} port at ${(new Date()).toLocaleString()}\n`,
        (error) => {
            if(error) throw error
        }
    )
})