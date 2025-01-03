const { check } = require('express-validator')

const validators = [
    check('email',  'Wrong email format').normalizeEmail().isEmail(),
    check('password', 'Password should be longet then 6 symbols').isLength({
        min: 6,
    }),
    check('name', 'Name should be longer than 2 symbols').isLength({
        min: 2
    })
]

module.exports = validators