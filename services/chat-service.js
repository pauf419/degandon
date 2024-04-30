const randomId = require("random-id")
const pool = require("../db/postgress-pool")
const Response = require("../responses/response")
class ChatService {
    async createMessage(data, username) {
        const message = await pool.query("INSERT INTO message(id, data, username, timestamp, isAdmin) VALUES($1, $2, $3, $4, $5) RETURNING *", [
            randomId(12, "aA0"), 
            data,
            username,
            Date.now(), 
            false
        ]).then(data => data.rows[0])
        return Response.OK(message)
    }

    async getMessages() {
        const messages = await pool.query("SELECT * FROM message ORDER BY timestamp ASC").then(data => data.rows)
        return Response.OK(messages)
    }
}

module.exports = new ChatService() 