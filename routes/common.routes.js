const { Router } = require('express')
const router = Router()
const config = require('config')


router.get('/info', (request, response) => {
    response.json({version: config.get('version')})
})

module.exports = router 