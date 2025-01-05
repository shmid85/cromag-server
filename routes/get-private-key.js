const config = require('config')

/** For producntion it is needed a privateKey */
function getPrivateKey() {
    if(process.env.NODE_ENV === 'development' ) {
        return process.env.privateKey || config.get('privateKey')
    }

    return process.env.privateKey || ''
}

module.exports = getPrivateKey