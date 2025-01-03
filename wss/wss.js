const chalk = require('chalk')
const { WebSocketServer }  = require('ws')
const WsMessagesEnum = require('../routes/ws-messages.enum')
const Message = require('../models/Message')
const startWss = () => {
    const wss = new WebSocketServer({port: 8080})
    wss.broadcast = msg => wss.clients.forEach(client => client.send(msg))
    
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error)
      
        ws.on('message', event => {  
            const message = JSON.parse(event)
            const { type, data } = message
    
            switch(type) {
                case WsMessagesEnum.GET_MESSAGES:
                    return sendMessages(ws)
                case WsMessagesEnum.DELETE_MESSAGE:
                    return deleteMessage(ws, data)
                case WsMessagesEnum.GET_MESSAGE:
                    return getMessage(ws, data)
                case WsMessagesEnum.ADD_MESSAGE: 
                    return addMessage(ws, data)  
                case WsMessagesEnum.UPDATE_MESSAGE: 
                    return updateMessage(ws, data) 
                default:
                    //TODO ERROR            
            }
        });
      });
    
    const sendMessages = (ws) => {
        Message    
            .find()
            .then(messages => {
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.GET_MESSAGES,
                        data: messages
                    })
                )  
            })
            .catch(e => {
                console.log(chalk.red(JSON.stringify(e)))
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.ERROR,
                        data: { message: `An Error has occupied: ${JSON.stringify(e)}!` }
                    })
                )
            })
    }  
    
    const deleteMessage = (ws, data) => {
        const { _id } = data
    
        Message
            .findByIdAndDelete(_id)
            .then(res => {
                console.log(res)
                wss.broadcast(
                    JSON.stringify({
                        type: WsMessagesEnum.DELETE_MESSAGE,
                        data: res
                    })
                )
            })
            .catch(e => {
                console.log(chalk.red(JSON.stringify(e)))
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.ERROR,
                        data: { message: `Message with id ${_id} was not found or error has occupied`}
                    })
                )
            })
    }
    
    const getMessage = (ws, data) => {
        const { _id } = data
    
        Message
            .findById(_id)
            .then(element => {
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.GET_MESSAGE,
                        data: element
                    })
                )
            })
            .catch(e => {
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.ERROR,
                        data: { message: `Message with id ${_id} was not found or error has occupied: ${JSON.stringify(e)}`}
                    })
                )
            })
         
    }
    
    const addMessage = (ws, data) => {
        const { message: messageData } = data
        const message = new Message(messageData)
    
        message
            .save()
            .then(res => {
                wss.broadcast(
                    JSON.stringify({
                        type: WsMessagesEnum.ADD_MESSAGE,
                        data: res
                    })
                )
            })
            .catch(e => {
                console.log(chalk.red(JSON.stringify(e)))
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.ERROR,
                        data: { message: `Could not add a message becouse of an error: ${JSON.stringify(e)}` }
                    })
                )
            })  
    }
    
    const updateMessage = (ws, data) => {
        const { _id, message } = data
        delete message._id
    
        Message
            .findByIdAndUpdate(_id, message)
            .then(element => {
                wss.broadcast(
                    JSON.stringify({
                        type: WsMessagesEnum.UPDATE_MESSAGE,
                        data: element
                    })
                )
            })
            .catch(e => {
                console.log(chalk.red(JSON.stringify(e)))
                ws.send(
                    JSON.stringify({
                        type: WsMessagesEnum.ERROR,
                        data: { message: `Message with id ${_id} was not found or error has occupied: ${JSON.stringify(e)}`}
                    })
                )
            })
    }
}

module.exports =  startWss