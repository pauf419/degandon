import m from "./NotFoundPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import Container from "../../component/Container/Container"

const NotFoundPage:FC = () => {

    const {store} = useContext(ctx)
    
    return (
        <Container
            body={
                <div className={m.NotFoundContainer}>
                    <h1 className={m.NFGTitle}>
                        404 NOT FOUND
                    </h1>
                    <hr/>
                    <div className={m.NFTitle}>
                        Теперь админ знает, что вы роетесь по ресурсу
                    </div>
                </div>
            }
            footer={
                <div className={m.FooterComments}>
                </div>
            }
        />
    )
}

export default observer(NotFoundPage)