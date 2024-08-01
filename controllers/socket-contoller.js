const chatService = require("../services/chat-service")
const UserDto = require("../dtos/user-dto")
const wsMiddleware = require("../middlewares/ws-middleware")
const pool = require("../db/postgress-pool") 

class SocketController {

    socketsConnected
    triggerIds

    constructor() {
        this.socketsConnected = new Map()
        this.triggerIds = new Map() 
    }
 

    addTriggerIdSubscriber(socket, triggerId) {
        const triggerIdSubscribers = this.triggerIds.get(triggerId) 
        if(!triggerIdSubscribers) {
            this.triggerIds.set(triggerId, [socket]) 
        } else {
            this.triggerIds.set(triggerId, [...triggerIdSubscribers, socket])
        }  
    }   

    removeTriggersForUser(userid) {
        for (const [key, value] of this.triggerIds) {
            const filtered = value.filter(el => el.uid !== userid)
            if(!filtered.length) this.triggerIds.delete(key)
            else this.triggerIds.set(key, filtered) 
        }
    } 
 
    checkTriggers(userId, online) {
        const triggers = this.triggerIds.get(userId)
        if(!triggers || !triggers.length) return; 
        for(var i=0;i < triggers.length;i++) { 
            triggers[i].emit("triggeridstatusupdate", {
                refer:userId, 
                online
            })
        }
    }

    async handleSocketConnection(socket, server) {

        if(socket.user) {
            this.checkTriggers(socket.user.id, true)
            this.socketsConnected.set(socket.user.id, true)
            await pool.query("UPDATE usr SET online = true WHERE id = $1", [socket.user.id])
        }

        socket.on("vote", (data) => {
            server.emit("vote", data)
        })

        socket.on("subscribetriggerid", async(triggerId) => {
            this.addTriggerIdSubscriber(socket, triggerId)
            const triggerOnline = this.socketsConnected.get(triggerId)
            if(triggerOnline && triggerOnline===true) socket.emit("triggeridstatusupdate", {
                refer:triggerId, 
                online:true
            })
        })
  
        socket.on("message", async (payload) => {
            wsMiddleware(socket, async (err) => {
                if(err) {
                    console.error(err)
                    console.log("disconnecting socket")
                    return socket.disconnect()
                }
                
                const message = await chatService.createMessage(socket.user.id, payload)
                server.emit("message", {...message, refer:socket.user})
            }) 

            //const message = await chatService.createMessage(socket.request.user.id, payload)
            //server.emit("message", {...message, refer:socket.request.user})
            //server.emit("message", data)
        }) 
         
        socket.on("disconnect", async () => {
            this.removeTriggersForUser(socket.uid)
            if(socket.user) {
                this.checkTriggers(socket.user.id, false)
                this.socketsConnected.delete(socket.user.id)
                await pool.query("UPDATE usr SET online = false WHERE id = $1", [socket.user.id])
            }
        })
    }
}

module.exports = new SocketController()