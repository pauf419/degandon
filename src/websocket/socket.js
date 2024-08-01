import io from "socket.io-client";
import { store } from "..";

export var socket

export const server = process.env.REACT_APP_WEBSOCKET || process.env.WEBSOCKET

export const connect = () => {

    socket = io(server, {
        extraHeaders: {
            authorization: `bearer ${localStorage.getItem('token')}`
        },
        
    })

    socket.on("connect_error", (data) => {
        store.addSocketDebugLog({
            action: "AUTH",
            error: false,
            message: `error`,
            timestamp: Date.now().toString()
        })
    })

    socket.on("connect", (data) => {
        store.addSocketDebugLog({
            action: "AUTH",
            error: false,
            message: "connected successfully",
            timestamp: Date.now().toString()
        })
    })

    socket.on("disconnect", (data) => {
        store.addSocketDebugLog({
            action: "AUTH",
            error: false,
            message: "disconnected successfully",
            timestamp: Date.now().toString()
        })
    })
    
}

export const updateInstance = async () => {
    socket.on("disconnect", () => {
        connect()
    })

    socket.disconnect()
}


