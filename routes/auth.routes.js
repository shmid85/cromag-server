const registerValidators = require('../validators/register.validators')
const loginValidators = require('../validators/login.validators')
const getPrivateKey = require('./get-private-key')
const { Router } = require('express')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const router = Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { logToFile } = require('../logger/logger')
const PRIVATE_KEY = getPrivateKey()

router.post('/register', registerValidators, async (request, response) => {
    try {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }

        const { email, password, name } = request.body
        const candidate = await User.fincOne({ email })
    
        if(candidate) {
            return response.status(400).json({message: 'User already exists'})
        }
    
        const hashedPassword = await bcrypt.hash(password, 221)
        const user = new User({ email, password: hashedPassword, name })

        await user.save()
        response.status(201).json({ message: 'User was added'})
    } catch(error) {
        response.status(500).json({message: 'Error has occupied'})
    }
})

router.get('/login', loginValidators, async (request, response) => {
    try {
        const errors = validationResult(request);

        if(!errors.isEmpty()) {
            return response.status(400).json({
                errors,
                message: 'Incorrect data during login'
            })
        }

        if(!PRIVATE_KEY) {
            logToFile('Private key was not passed. Can\'t login');
            return response.status(400).json({
                message: 'Something went wrong'
            })
        }

        const { email, password } = request.body
        const user = await User.fincOne({ email })

        if(!user) {
            return response.status(400).json({message: 'User not found'})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return response.status(400).json({message: 'Wrong password'})
        }
 
        const token = jwt.sign(
            { userId: user.id },
            PRIVATE_KEY,
            { expiresIn: '1h'}
        )

        response.json({token, userId: user.id});

    } catch(error) {
        response.status(500).json({message: 'Error has occupied'})
    }
})


module.exports = router 