import { FC } from "react"
import m from "./Message.module.sass"
import { IMessageResolved } from "../../models/IMessageResolved"
import StatusResolver from "../StatusResolver/StatusResolver"

interface MessageProps {
    model: IMessageResolved
}

const Message:FC<MessageProps> = ({model}) => {

    return (
        <div className={m.MessageContainer}>
            {model.payload}
        </div>
    )
}

export default Message