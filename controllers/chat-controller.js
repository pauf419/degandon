const logic = require("../utils/logic")
const Response = require("../responses/response")
const chatService = require("../services/chat-service")

class ChatController {
    async createMessage(req, res, next) {
        try {
            const {data, username} = req.body 
            if(logic.regexobject({data,username})) throw Response.BadRequest("Expected data not validated")
            const res = await chatService.createMessage(data,username) 
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }

    async getMessages(req, res, next) {
        try {
            const res = await chatService.getMessages()
            return next(res)
        } catch(e) {
            console.error(e) 
            next(e)
        }
    }
}

module.exports = new ChatController() 