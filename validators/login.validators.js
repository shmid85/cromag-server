const { check } = require('express-validator')

const validators = [
    check('email',  'Input right email').normalizeEmail().isEmail(),
    check('password', 'Input password').exists()
]

module.exports = validators