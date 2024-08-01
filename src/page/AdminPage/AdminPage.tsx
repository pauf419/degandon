import { useEffect, useState } from "react"
import Container from "../../component/Container/Container"
import ChallengeService from "../../service/ChallengeService"
import FileInput from "../../component/FileInput/FileInput"
import { IChallenge } from "../../models/IChallenge"
import { IChallenger } from "../../models/IChallenger"
import m from "./AdminPage.module.sass"
import Challenger from "../../component/Challenger/Challenger"
import { AxiosError } from "axios"


const AdminPage = () => {

    
    const [preloadedFile, setPreloadedFile] = useState<any>(null)
    const [challenge, setChallenge] = useState<IChallenge|null>(null)
    const [challengers, setChallengers] = useState<IChallenger[]>([])
    const [adminCode, setAdminCode] = useState<string>("")
    const [challengeTitle, setChallengeTitle] = useState<string>("")
    const [challengerTitle, setChallengerTitle] = useState<string>("")
    
    const getChallengers = async () => {
        const response:any = await ChallengeService.getChallengers(null)
        if(response instanceof AxiosError) return console.error("ERRORR")
        setChallengers(response.data.data)
    }   

    const getChallenge = async () => {
        const response:any = await ChallengeService.getChallenge(null)
        if(response instanceof AxiosError) return console.error("ERRORR")
        setChallenge(response.data.data)
        setChallengeTitle(response.data.data.title)
    }

    const savePreloadedFile = (url:string, data:string) => {
        setPreloadedFile(data)
    }

    const createChallenge = async () => {
        const response = await ChallengeService.createChallenge(challengeTitle, adminCode)
    }

    const createChallenger = async() => {
        const fd = new FormData() 
        fd.append("title", challengerTitle)
        fd.append("refer", "")
        fd.append("preview", preloadedFile)
        const response = await ChallengeService.createChallenger(fd)
    }

    const setupDashboard = async () => {
        await getChallenge()
        await getChallengers()
    }

    useEffect(() => {
        setupDashboard()
    }, [])

    if(!challenge) return <Container body={
        <div className={m.FirstChallengeContainer}>
            <button onClick={() => createChallenge()}>Create challenge</button>
        </div>
    } footer={<h1></h1>}/>

    return (
        <Container
            body={
                <>
                    <div className={m.ChallengeStatsContainer}>
                        <div className={m.StatTitle}>
                            CCHS:
                        </div>
                        <div className={m.StatContainer}>
                            <div>id: </div>
                            <span>{challenge.id}</span>
                        </div>
                        <div className={m.StatContainer}>
                            <div>tt: </div>
                            <span>{challenge.timestamp}</span>
                        </div>
                        <div className={m.StatContainer}>
                            <div>title: </div>
                            <span>{challenge.title}</span>
                        </div>
                    </div>
                    <h2>Challengers: </h2>
                    <div className={m.ChallengersContainer}>
                        {
                            challengers.map((challenger:IChallenger) => <Challenger challenger={challenger} isAdmin={false}/>)
                        }
                    </div>
                    <FileInput defaultImg="" onChange={savePreloadedFile}/>
                    <input onChange={e => setAdminCode(e.target.value)} placeholder="Ключ доступа"/>
                    <input value={challengeTitle} onChange={e => setChallengeTitle(e.target.value)} placeholder="Тайтл нового голосования"/>
                    <input onChange={e => setChallengerTitle(e.target.value)} placeholder="Тайтл нового участника"/>
                    <button onClick={() => createChallenge()}>Create challenge</button>
                    <button onClick={() => createChallenger()}>Create challenger</button>
                </>
            }
            footer={<h1>Footer</h1>}
        />
    )
}

export default AdminPage