
class SocketController {


    handleSocketConnection(socket) {

        console.log("connected")
         
        socket.on("disconnect", () => {
            console.log("disconnected")
        })
    }
}

module.exports = new SocketController()