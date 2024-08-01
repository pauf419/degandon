import m from "../../page/NotFoundPage/NotFoundPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react"
import { ctx } from "../.."

const NotFoundContainer:FC = () => {

    const {store} = useContext(ctx)
    
    return (
        <div className={`${m.NotFoundContainer} ${m.Free}`}>
            <h1 className={m.NFGTitle}>
                404 NOT FOUND
            </h1>
            <hr/>
            <div className={m.NFTitle}>
                Теперь админ знает, что вы роетесь по ресурсу
            </div>
        </div>
    )
}

export default observer(NotFoundContainer)