import { FC, useContext, useEffect, useRef, useState } from "react"
import { IMessage } from "../../interface/IMessage"
import m from "./Chat.module.sass"
import { observer } from "mobx-react-lite"
import { ctx } from "../.."
import { socket } from "../../websocket/socket"
import Message from "../Message/Message"
import ChatService from "../../service/ChatService"


const Chat:FC = () => {

    const {store} = useContext(ctx)

    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState<string>("")
    const [username, setUsername] = useState<string>("")

    const endRef = useRef<HTMLDivElement>(null)

    const sendMessage = async (e:any) => {
        e.preventDefault()
        if(username && !store.username) store.setUsername(username)
        localStorage.setItem("username", store.username)
        const response = await ChatService.createMessage(message, store.username)
        socket.emit("message", response.data.data)
        setMessage("")
        
    }

    const loadChatHistory = async() => {
        const response:any = await ChatService.getMessages()
        setMessages(response.data.data)
    }
    
    useEffect(() => {
        socket.on("message", (data:IMessage) => {
            setMessages(prev => {
                return [...prev, data]
            })
        })
    }, [socket])

    useEffect(() => {
        endRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        loadChatHistory()
    }, [])

    return (
        <div className={m.ChatContainer}>
            <div className={m.ChatHeader}>
                <div className={m.StatSegment}>
                    Базар
                </div>
                <div className={m.StatSegment}>
                    <div className={m.HeaderStat}>
                        Кол.во подключенных сокетов: {store.socketsg}
                    </div>
                </div>
            </div>
            <div className={m.ChatBody}>
                {
                    messages.map((m:IMessage) => {
                        return (
                            <Message key={m.id} model={m}/>
                        )
                    })
                }
                <div ref={endRef}></div>
            </div>
            <form className={m.ChatFooter} onSubmit={sendMessage}>
                {
                    !store.username 
                        ?
                        <input required onChange={e => setUsername(e.target.value)} placeholder="Никнейм"/>
                        :
                        ""
                }
                <input  value={message} required placeholder="Сообщение..." onChange={e => setMessage(e.target.value)}/>
                <button type="submit">Туда</button>
            </form>
        </div>
    )
}

export default observer(Chat)