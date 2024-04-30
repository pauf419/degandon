
import { FC } from "react"
import { IMessage } from "../../interface/IMessage"
import m from "./Message.module.sass"

interface MessageProps {
    model: IMessage
}

const Message:FC<MessageProps> = ({model}) => {
    return (
        <div className={m.MessageContainer}>
            <div className={m.MessageUsername}>
                <span style={model.isadmin === 'true' ? {color: "#F38C16"} : {}}>@{model.username}</span>:
            </div>
            <div className={m.MessageData}>
                {model.data}
            </div>
        </div>
    )
}

export default Message