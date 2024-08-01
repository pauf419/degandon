import { FC, useContext, useEffect, useRef, useState } from "react"
import { IMessage } from "../../models/IMessage"
import m from "./Chat.module.sass"
import { observer } from "mobx-react-lite"
import { ctx } from "../.."
import { socket, connect, server } from "../../websocket/socket"
import Message from "../Message/Message"
import ChatService from "../../service/ChatService"
import { Link } from "react-router-dom"
import { IMessageResolved } from "../../models/IMessageResolved"
import { IUser } from "../../models/IUser"
import { ISocketDebugLog } from "../../models/ISocketDebugLog"
import MessageGroup from "../MessageGroup/MessageGroup"
import { useObserver } from "../../hook/observer.hook"
import InfiniteScroll from "react-infinite-scroller"
import { IOnlineStatus } from "../../models/IOnlineStatus"


const Chat:FC = () => {
    

    const {store} = useContext(ctx)

    const [messages, setMessages] = useState<IMessageResolved[][]>([])
    const [message, setMessage] = useState<string>("")
    const [debugTabActive, setDebugTabActive] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const obs = useRef() as React.MutableRefObject<HTMLDivElement>
    const [chunkLoading, setChunkLoading] = useState<boolean>(false)
    const [canLoadChunks, setCanLoadChunks] = useState<boolean>(false)
    const [cursorLoading, setCursorLoading] = useState<boolean>(true)
    const [isWaitingForMessage, setIsWaitingForMessage] = useState<boolean>(false)
    const [scrollTop, setScrollTop] = useState(0);
    const [cursor, setCursor] = useState<string>("")
    const [statusPool, setStatusPool] = useState<string[]>([])
    const [refers, setRefers] = useState<string[]>([])

    const innerRef = useRef<HTMLDivElement>(null)
    
    const loadChunk = async(page:number) => {
        setChunkLoading(true)
        const response:any = await ChatService.getMessages(page*100, cursor)
        if(!response.data.data.length) {
            setChunkLoading(false)
            setCanLoadChunks(false)
            return;
        }
        const grouppedChunk = groupMessages(response.data.data)
        if(page===0) {
            setMessages(grouppedChunk)
            return setChunkLoading(false)
        }
        backConcatMessageGroups(grouppedChunk)
        setChunkLoading(false)
    }

    const getCursor = async() => {
        const response:any = await ChatService.getCursor()
        setCursor(response.data.data)
        setCursorLoading(false)
        setCanLoadChunks(true)
        const elementScroll = innerRef.current?.scrollHeight
        if(innerRef) innerRef.current!.scrollTop = elementScroll?elementScroll:100000
    }

    const sendMessage = async (e:any) => {
        e.preventDefault()
        socket.emit("message", message)
        setMessage("")
    }

    const backConcatMessageGroups = (grouppedChunk:IMessageResolved[][]) => {
        setMessages(groups => {
            if(!groups.length) return grouppedChunk
            const chunkLastItemCursor = grouppedChunk.length >= 1 ? (grouppedChunk.length - 1) : 1
            const shiftGroup:IMessageResolved[] = groups[0]
            const popChunk:IMessageResolved[] = grouppedChunk[chunkLastItemCursor]
            if(shiftGroup[0].refer.id === popChunk[0].refer.id) {
                grouppedChunk[chunkLastItemCursor] = [...grouppedChunk[chunkLastItemCursor], ...shiftGroup]
                groups.shift()
                return [...grouppedChunk, ...groups]
            }
            return [...grouppedChunk, ...groups]
        })
    }

    const groupMessages = (nongroupped:IMessageResolved[]) => {

        const groups:IMessageResolved[][] = []
        var group:IMessageResolved[] = [nongroupped[0]]
        for(var i=1;i < nongroupped.length;i++) {
            if(nongroupped[i].refer.id === group[0].refer.id) {
                group.push(nongroupped[i])
                continue;
            }
            groups.push(group)
            group = [nongroupped[i]]
        }
        groups.push(group)
        return groups
    }
    
    const groupMessagesQuiet = (message:IMessageResolved) => {
        setMessages(prevMessages => {
            const lastGroup = prevMessages.length ? [...prevMessages[prevMessages.length - 1]] : [];
            if (lastGroup.length && lastGroup[0].refer.id === message.refer.id) {
                lastGroup.push(message);
                return [...prevMessages.slice(0, -1), lastGroup];
            } else {
                return [...prevMessages, [message]];
            }
        });
    }
    
    useEffect(() => {
        if (!socket) return;
    
        const handleMessage = (data: IMessageResolved) => {
            store.addSocketDebugLog({
                action: "MISC",
                error: false,
                message: "handled message payload",
                timestamp: Date.now().toString()
            });
            groupMessagesQuiet(data);
        };
    
        const handleStatusUpdate = (payload: IOnlineStatus) => {
            if (!refers.includes(payload.refer)) return console.log("NOT INCLUDES");
            if (!payload.online) {
                return setStatusPool(prev => {
                    return prev.filter(el => el !== payload.refer);
                });
            }
            setStatusPool(prev => {
                return [...prev, payload.refer];
            });
        };
    
        socket.off("message", handleMessage)
        socket.on("message", handleMessage)
    
        socket.off("triggeridstatusupdate", handleStatusUpdate)
        socket.on("triggeridstatusupdate", handleStatusUpdate)
    
        return () => {
            socket.off("message", handleMessage);
            socket.off("triggeridstatusupdate", handleStatusUpdate);
        };
    }, [socket, refers]);

    useEffect(() => {
        getCursor()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
          if (innerRef.current) {
            const { scrollTop, clientHeight, scrollHeight } = innerRef.current
            const tolerance = 5
            const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - tolerance
            
            if (scrolledToBottom !== isWaitingForMessage) setIsWaitingForMessage(scrolledToBottom)
          }
        }
    
        innerRef.current!.addEventListener('scroll', handleScroll)
        
    
        return () => innerRef.current ? innerRef.current!.removeEventListener('scroll', handleScroll) : console.log("")
      }, [isWaitingForMessage])

    useEffect(() => {
        for(var i=0;i<refers.length;i++) {
            store.addStatusTrigger(refers[i])
        }
    }, [refers])

    useEffect(() => {
        const newRefers:string[] = []
        const onlineRefers:string[] = []
        for(var i=0;i<messages.length;i++) {
            for(var j=0;j < messages[i].length;j++) {
                if(!newRefers.includes(messages[i][j].refer.id)) {
                    newRefers.push(messages[i][j].refer.id)
                    if(messages[i][j].refer.online) onlineRefers.push(messages[i][j].refer.id)
                }
            }
        }
        setRefers(newRefers)
        setStatusPool(onlineRefers)

        const elementScroll = innerRef.current?.scrollHeight
        if(innerRef && isWaitingForMessage) innerRef.current!.scrollTop = elementScroll?elementScroll:100000
    }, [messages])

    return (
        <div className={m.ChatContainer}>
            <div className={m.ChatHeader}>
                <button className={m.StatSegment} onClick={() => setDebugTabActive(!debugTabActive)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g>
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M11 12l-7.071 7.071-1.414-1.414L8.172 12 2.515 6.343 3.929 4.93 11 12zm0 7h10v2H11v-2z"/>
                    </g>
                </svg>
                </button>
                <div className={m.StatSegment}>
                    <div className={m.HeaderStat}>
                        Кол.во подключенных сокетов: {store.socketsg}
                    </div>
                </div>
            </div>
            {
                debugTabActive 
                    &&
                <div className={m.DebugTab}>
                    {
                        store.socketDebugLog.map((el:ISocketDebugLog, i:number) => {
                            return (
                                <div key={i}>
                                    {'> '}{`[${el.action}] ${el.message}`}
                                </div>
                            )
                        })
                    }
                </div>
            }
            <div className={m.ChatBodyCepper}>
                <div className={m.ChatBody} ref={innerRef}>
                    {
                        cursor &&
                        <InfiniteScroll
                            className={m.Scroll}
                            pageStart={-1}
                            loadMore={loadChunk}
                            hasMore={canLoadChunks}
                            loader={<div className="loader" key={0}>Загрузочка</div>}
                            useWindow={false}
                            isReverse={true}
                        >
                            {
                                messages.map((group:IMessageResolved[], i:number) => {
                                    return (
                                        <>
                                            <MessageGroup key={i} group={group} online={
                                                statusPool.includes(group[0].refer.id)
                                            }/>
                                        </>
                                    )
                                })
                            }
                        </InfiniteScroll>
                    }
                </div>
                {
                        !isWaitingForMessage &&                 
                            <button className={m.ScrollBottomNotificator} onClick={() => {
                                const elementScroll = innerRef.current?.scrollHeight
                                if(innerRef && !isWaitingForMessage) innerRef.current!.scrollTop = elementScroll?elementScroll:100000
                            }}> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
                                </svg>
                            </button>
                    }
            </div>
            {
                store.isAuth
                    ?
                    <form className={m.ChatFooter} onSubmit={sendMessage}>
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </button>
                        <input  value={message} required placeholder="Сообщение..." onChange={e => setMessage(e.target.value)}/>
                        <button className={m.SubmitBtn} type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" version="1.1">

                                <title>ic_fluent_send_28_filled</title>
                                <desc>Created with Sketch.</desc>
                                <g id="🔍-Product-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="ic_fluent_send_28_filled" fill="#bdc0c2" fillRule="nonzero">
                                        <path d="M3.78963301,2.77233335 L24.8609339,12.8499121 C25.4837277,13.1477699 25.7471402,13.8941055 25.4492823,14.5168992 C25.326107,14.7744476 25.1184823,14.9820723 24.8609339,15.1052476 L3.78963301,25.1828263 C3.16683929,25.4806842 2.42050372,25.2172716 2.12264586,24.5944779 C1.99321184,24.3238431 1.96542524,24.015685 2.04435886,23.7262618 L4.15190935,15.9983421 C4.204709,15.8047375 4.36814355,15.6614577 4.56699265,15.634447 L14.7775879,14.2474874 C14.8655834,14.2349166 14.938494,14.177091 14.9721837,14.0981464 L14.9897199,14.0353553 C15.0064567,13.9181981 14.9390703,13.8084248 14.8334007,13.7671556 L14.7775879,13.7525126 L4.57894108,12.3655968 C4.38011873,12.3385589 4.21671819,12.1952832 4.16392965,12.0016992 L2.04435886,4.22889788 C1.8627142,3.56286745 2.25538645,2.87569101 2.92141688,2.69404635 C3.21084015,2.61511273 3.51899823,2.64289932 3.78963301,2.77233335 Z" id="🎨-Color">

                            </path>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </form>
                    :
                    <div className={m.ChatUnauth}>
                        Только <Link to="/pf">зарегистрированные</Link> сокеты могут отправлять пакеты
                    </div>
            }
        </div>
    )
}

export default observer(Chat)