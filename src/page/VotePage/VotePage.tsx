
import { Link } from "react-router-dom"
import m from "./VotePage.module.sass"
import Container from "../../component/Container/Container"
import { useEffect, useState } from "react"
import { IChallenger } from "../../models/IChallenger"
import ChallengeService from "../../service/ChallengeService"
import { AxiosError } from "axios"
import Challenger from "../../component/Challenger/Challenger"
import Chat from "../../component/Chat/Chat"

const VotePage = () => {

    const [challengers, setChallengers] = useState<IChallenger[]>([])
    
    const getChallengers = async () => {
        const response:any = await ChallengeService.getChallengers(null)
        if(response instanceof AxiosError) return console.error("ERRORR")
        setChallengers(response.data.data)
    }   

    useEffect(() => {
        getChallengers()
    }, [])

    return (
        <Container
            body={
                <>
                    <h2>Выберите худшего из худших: </h2>
                    <div className={m.ChallengersContainer}>
                        {
                            challengers.map((challenger:IChallenger) => <Challenger key={challenger.id} challenger={challenger} isAdmin={false}/>)
                        }
                    </div>
                    <h2>Статистика:</h2>
                    <div className={m.ChallengerAnalyticsContainer}>
                        {
                            challengers.map((challenger:IChallenger) => {
                                if(challenger.votes <= 0) return ""
                                return (
                                    <div key={challenger.id} className={m.ChallengerAnalyticsStat} style={{
                                        width: `calc((100% / 10) * ${challenger.votes})`
                                    }}>
                                        <div className={m.space}>
                                        <span>{challenger.title}: </span>
                                        <div>
                                            {challenger.votes}
                                        </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="paragraph" style={{color: "#F38C16"}}>
                        Уважаемые участники голосования, если вы хотите предложить еще одного педофила, или подать в суд на этот форум, то пишите модератору, ибо админ ослеп нахуй от кринжа, который вы пишете. ТГ: <a href="https://t.me/martinaskaa">@hotkarrii</a>
                    </div>
                </>
            }
            footer={
                <Chat/>
            }
        />
    )
}

export default VotePage
