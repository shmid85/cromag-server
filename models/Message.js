const mongoose = require('mongoose')
const { Schema, model } = mongoose

const messageSchema = new Schema({
    text: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true,
    },
    user: {
        type: String,
        require: true,
    },
    editedDate: String,
})

const Message = model('Message', messageSchema)

module.exports = Message