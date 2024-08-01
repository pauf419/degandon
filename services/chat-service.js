const randomId = require("random-id")
const pool = require("../db/postgress-pool")
const Response = require("../responses/response")
const UserDto = require("../dtos/user-dto")
const MessageDto = require("../dtos/message-dto")

class ChatService {

    async createMessage(userid, payload) {
        const message = await pool.query("INSERT INTO message(id, payload, timestamp, refer) VALUES($1, $2, $3, $4) RETURNING *", [
            randomId(12, "aA0"), 
            payload,
            Date.now(), 
            userid
        ]).then(data => data.rows[0])
        return message
    }

    async getMessages() {
        var messages = await pool.query("f").then(data => data.rows)
        
        messages = messages.map(el => {
            const udto = new UserDto(el)
            return new MessageDto({
                ...el, 
                id: el.message_id,
                refer:udto
            })
        })
        return Response.OK(messages)
    }

    async getMessageChunk(offset, cursor=0) {
        
        if(Number(offset) < 0) return Response.BadRequest()
            const query = `
            SELECT message.*, message.id AS message_id, usr.* 
            FROM message 
            INNER JOIN usr ON message.refer = usr.id 
            ${cursor && `WHERE timestamp <= '${cursor}'`}
            ORDER BY timestamp DESC
            LIMIT 100 OFFSET ${offset}
        `;
        
        var messages = await pool.query(query).then(data => data.rows.reverse())
        messages = messages.map(el => {
            const udto = new UserDto(el)
            return new MessageDto({
                ...el,
                id: el.message_id,
                refer:udto
            })
        })
        return Response.OK(messages)
    }

    async getMessageCursor() { 
        const cursor = await pool.query("SELECT timestamp FROM message ORDER BY timestamp DESC").then(data => data.rows[0])
        return Response.OK(cursor.timestamp)
    }
}

module.exports = new ChatService() 