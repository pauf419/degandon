import { observer } from "mobx-react-lite"
import { FC, useState } from "react"
import m from "./StatusResolver.module.sass"

interface StatusResolverProps {
    status:string
    isP:boolean

}

const StatusResolver:FC<StatusResolverProps> = ({status, isP = false}) => {

    return (
        <div className={`${m.StatusResolverWrapper} ${status} ${!isP ? m.Mini : ""}`}>
            {status}
        </div>
    )
}

export default observer(StatusResolver)