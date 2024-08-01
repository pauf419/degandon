
import { FC, useContext, useEffect, useState } from "react"
import m from "./Challenger.module.sass"
import { IChallenger } from "../../models/IChallenger"
import { observer } from "mobx-react-lite"
import { ctx } from "../.."
import ChallengeService from "../../service/ChallengeService"
import { AxiosError } from "axios"
import { socket } from "../../websocket/socket"

interface IChallengerProps {
    challenger:IChallenger
    isAdmin:boolean
}

const Challenger:FC<IChallengerProps> = ({challenger, isAdmin=false}) => {

    const {store} = useContext(ctx)

    const [votes, setVotes] = useState<number>(Number(challenger.votes))

    const [error, setError] = useState<boolean>(false)

    const vote = async () => {
        const response = await ChallengeService.vote(challenger.id, challenger.refer)
        if(response instanceof AxiosError) {
            store.setVoted(true)
            localStorage.setItem("voted", "true")
            return setError(true)
        }
        socket.emit("vote", challenger.id)
        store.setVoted(true)
        localStorage.setItem("voted", "true")
    }

    useEffect(() => {
        socket.on("vote", (data:any) => {
            if(data === challenger.id) setVotes(prev => {
                return prev + 1
            })
            
        })
    }, [socket])

    return (
        <div className={m.ChallengerWrapper}>
            <div className={m.ChallengerPromo}>
                <img src={challenger.preview}/>
                <div className={m.ChallengerTitle}>{challenger.title}</div>
            </div>
            <div className={m.ChallengerContent}>
                {
                    error   
                        && 
                        <div>Голоса своему бате в обезьяннике будешь накручивать.</div>
                }
                <div className={`${m.ContentContainer} ${m.ContentVotes}`}>
                    {votes} голоса(ов)
                </div>
                {
                    !store.voted && <button onClick={() => vote()}> Проголосовать </button>
                }
            </div>
        </div>
    )
}

export default observer(Challenger)