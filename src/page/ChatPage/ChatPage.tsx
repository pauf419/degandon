
import m from "./ChatPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import Container from "../../component/Container/Container"
import Chat from "../../component/Chat/Chat"

const ChatPage:FC = () => {

    const {store} = useContext(ctx)
    
    return (
        <Container
            space
            body={
                <Chat/>
            }
            footer={
                <div className={m.FooterComments}>
                </div>
            }
        />
    )
}

export default observer(ChatPage)