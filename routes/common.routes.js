const { Router } = require('express')
const router = Router()
const config = require('config')
const fs = require('fs')
const { dirname } = require('path');
const appDir = dirname(require.main.filename)


router.get('/info', (request, response) => {
    response.json({version: config.get('version')})
})

router.get('/log', async (request, response) => {
    const today = new Date().toLocaleDateString('RU')
      
    response.sendFile(`${appDir}/log/server-${today}.log`)
})

module.exports = router 