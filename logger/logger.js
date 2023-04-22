const fs = require('fs')

function logger(request, response, next) {
    const now = new Date()
    const hour = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url}`
    
    console.log(data)
    fs.appendFile(
        'server.log',
        data + "\n", 
        error => { if(error) throw error }
    );
    next()
}

module.exports = logger