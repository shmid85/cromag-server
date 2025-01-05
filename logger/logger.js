const fs = require('fs')
const findRemoveSync = require('find-remove')
const { dirname } = require('path');
const appDir = dirname(require.main.filename)
let timerId

/** Log middleware */
function logger(request, response, next) {
    const now = new Date()
    const hour = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    
    logToFile(`${hour}:${minutes}:${seconds} ${request.method} ${request.url}`)
    next()
}

function logToFile(message) {
    const today = new Date().toLocaleDateString();
    
    fs.appendFile(
        `./log/server-${today}.log`,
        `${new Date().toLocaleString()} ${message}\n`, 
        error => { if(error) throw error }
    );
}

function startLogCleaning() {
    !timerId ?? clearTimeout(timerId)
    timerId = setInterval(() => {
        findRemoveSync(
            appDir + '/log', 
            {
                age: {
                    /** 15 days */
                    seconds: 1296e4
                },
                extensions: '.log'
            }
        )
    /** Every hour */    
    }, 36e5)
}

const log = console.log

module.exports = { 
    logger, 
    logToFile,
    log,
    startCleaning
}