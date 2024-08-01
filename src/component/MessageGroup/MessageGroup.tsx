


import { FC, useContext, useEffect, useState } from "react"
import m from "./MessageGroup.module.sass"
import { IMessageResolved } from "../../models/IMessageResolved"
import StatusResolver from "../StatusResolver/StatusResolver"
import { useNavigate } from "react-router-dom"
import Message from "../Message/Message"
import { socket } from "../../websocket/socket"
import { ctx } from "../.."

interface MessageGroupProps {
    group: IMessageResolved[]
    online:boolean
}

const MessageGroup:FC<MessageGroupProps> = ({group, online}) => {

    const navigate = useNavigate()

    const [localOnline, setLocalOnline] = useState<boolean>(group[0].refer.online)

    useEffect(() => {
        setLocalOnline(online)
    }, [online])

    return (
        <div className={m.MessageGroupContainer}>
            <div className={m.MessageGroupHeader} onClick={() => navigate(`/pf/${group[0].refer.id}`)}>
                <div className={m.Pfp}>
                    <div className={`${m.OnlineStatus} ${localOnline ? m.Active : ""}`}>
                        <img src={group[0].refer.pfp}/>
                    </div>
                </div>
                <div className={m.Stats}>
                    <StatusResolver status={group[0].refer.status} isP={false}/>
                    <span>@{group[0].refer.username}:</span>
                </div>
            </div>
            <div className={m.MessageGroupMessages}>
                {
                    group.map((message:IMessageResolved) => <Message key={message.id} model={message}/>)
                }
            </div>
        </div>
    )
}

export default MessageGroup