import { FC, useState, useContext, useEffect } from "react";
import { IModalLog } from "../../models/IModalLog";
import { observer } from "mobx-react-lite";
import { ctx } from "../..";
import cl from "./LogModal.module.sass"

const LogModal: FC = () => {
    const [active, setActive] = useState<boolean>(false)
    const [lastTimeout, setLastTimeout] = useState<any>(null)

    const {store} = useContext(ctx)

    useEffect(() => {
        if(!store.activeLog) return;
        setActive(true)
        clearTimeout(lastTimeout)
        setLastTimeout(setTimeout(() => {
            store.setActiveLog(null)
            setActive(false)
        }, 8000))
    }, [store.activeLog])

    if(!store.activeLog || !store.activeLog.message) return <></>

    return (
        <div className={`${cl.LogModalWrapper} ${active ? cl.LogModalActive : cl.LogModalInactive}`}>
            <div className={cl.MessageWrapper}>
                <span style={{color: "#F38C16"}}>API Response:</span> {
                    store.activeLog?.message
                }
            </div>
            <div className={cl.IconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A5 5 0 0 0 3 6h10a5 5 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A5 5 0 0 0 8 1a5 5 0 0 0-2.731.811l-.29-.956z"/>
                    <path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975"/>                
                </svg>
            </div>
        </div>
    )
}

export default observer(LogModal)