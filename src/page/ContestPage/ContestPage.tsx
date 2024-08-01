import m from "./ContestPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import ContestService from "../../service/ContestService"
import { ITask } from "../../models/ITask"
import LoadingContainer from "../../component/LoadingContainer/LoadingContainer"
import Container from "../../component/Container/Container"

const ContestPage:FC = () => {

    const {store} = useContext(ctx)
    const [answer, setAnswer] = useState<string>("")
    const [task, setTask] = useState<ITask|null>(null)
    const [taskLoading, setTaskLoading] = useState<boolean>(true)

    const loadCurrentTask = async () => {
        setTaskLoading(false)
        const res:any = await ContestService.getCurrentTask()
        setTask(res.data.data)
        setAnswer("")
        setTaskLoading(false)
    }

    const answerCurrentTask = async (e:any) => {
        e.preventDefault()
        const res = await ContestService.answerCurrentTask(answer)
        loadCurrentTask()
    }

    useEffect(() => {
        loadCurrentTask()
    }, [])

    if(taskLoading) return <LoadingContainer/>

    if(!task) return <h1>there are no task left!</h1>
    
    return (
        <Container
            body={
                <div className={`${m.ContestPage} ${m.Free}`}>
                    <div className={m.TaskPageHeader}>
                        <div className={m.TaskTitle}>
                            <h2>{task.title}</h2>
                        </div>
                        <div className={m.TaskPts}>
                            <div>
                                индекс:<span style={{color: "#F38C16"}}> {task.index}/?</span>
                            </div>
                            <div>
                                птс:<span style={{color: "#F38C16"}}> {task.pts}</span>
                            </div>
                            <div>
                                id: <span style={{color: "#F38C16"}}> {task.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className={m.TaskPageDescription}>
                        {task.description}
                    </div>
                    <div className={m.TaskPageContent}>
                        {task.value}
                    </div>
                    <form className={m.TaskPageAction} onSubmit={answerCurrentTask}>
                        <input value={answer} required className={m.AnswerInput} placeholder="Ответ" onChange={e => setAnswer(e.target.value)}/>
                        <button type="submit">Продолжить</button>
                    </form>
                </div>
            }
            footer={
                <></>
            }
        />
    )
}

export default observer(ContestPage)