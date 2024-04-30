
class SocketController {

    socketsConnected = 2

    handleSocketConnection(socket, server) {

        this.socketsConnected++

        server.emit("nsconn", this.socketsConnected)

        socket.on("vote", (data) => {
            server.emit("vote", data)
        })

        socket.on("message", (data) => {
            server.emit("message", data)
        })
         
        socket.on("disconnect", () => {
            this.socketsConnected--
            server.emit("nsdiss", this.socketsConnected)
        })
    }
}

module.exports = new SocketController()