import { FC, useContext, useState } from "react";
import { IComment } from "../../interface/IComment";
import m from "./Comment.module.sass"
import { ctx } from "../..";

interface ICommentProps {
    model: IComment
    parent: IComment|null
}

const Comment: FC<ICommentProps> = ({model, parent}) => {

    const {store} = useContext(ctx)

    const [username, setUsername] = useState<string>(store.username || "")

    const [commentRefer, setCommentRefer] = useState<string>("")

    const [refers, setRefers] = useState<IComment[]>([])

    const [commentTabActive, setCommentTabActive] = useState<boolean>(false)
    
    const sendRefer = async (e: any) => {
        e.preventDefault()
        setCommentRefer("")
        const data = await store.sendComment(commentRefer, model.id, username)
        setCommentTabActive(false)
        model.refers +=1
        setRefers(prev => {
            return [...prev, data.data]
        })
        
    }

    const updateComment = async () => {
        const data:any = await store.getComments(model.id)
        model.refers = data.data.length
        setRefers(prev => {
            return data.data
        })
    }

    const loadRefers = async () => {
        const data:any = await store.getComments(model.id)
        setRefers(prev => {
            return data.data
        })
    }

    const formatted_date = (mill:number) => {
        var result="";
        var d = new Date(mill);
        result += d.getFullYear()+"."+(d.getMonth()+1)+"."+d.getDate() + 
                    " в "+ d.getHours()+":"+d.getMinutes()
        return result;
    }

    return (
        <div className={m.Comment}>
            {
                parent
                    && 
                    <div className={m.Ukazator}>
                    </div>
            }
            <div className={m.CommentHeader}>
                <div className={m.CommentOwner}>
                    от: <span style={model.isadmin ? {color: "#F38C16"} : {}}>@{model.username}</span> 
                    {
                        parent 
                            ? 
                            <span> для: <span style={parent.isadmin ? {color: "#F38C16"} : {}}>@{parent.username}</span></span>
                            :
                            ""
                    }
                </div>
                <div className={m.CommentDisplay}>{formatted_date(Number(model.timestamp))}</div>
            </div>
            <div className={m.CommentContent}>
                {model.comment}
            </div>
            <div className={m.CommentReferField}>
                <div>
                    {
                        model.refers > 0
                            &&
                            <button className={m.RefersBtn} onClick={() => {
                                if(refers.length > 0) return setRefers([])
                                loadRefers()
                            }}>
                                {
                                    refers.length > 0
                                        ?
                                        "Скрыть ответы"
                                        :
                                        `Посмотреть ${model.refers} ответа(ов)`
                                }
                            </button>
                    }
                    <button className={m.RefersBtn} onClick={() => setCommentTabActive(!commentTabActive)}>{
                        commentTabActive
                            ? 
                            "Скрыть"
                            :
                            "Ответить"
                    }</button>
                </div>

                <button onClick={() => updateComment()}>
                    Обновить
                </button>

            </div>
            {
                commentTabActive
                    &&
                    <div className={m.ReferTabContainer}>
                        <form onSubmit={sendRefer}>
                            {
                                !store.username 
                                    ?
                                    <input required onChange={e => setUsername(e.target.value)} placeholder="Никнейм"/>
                                    :
                                    ""
                            }
                            <input required value={commentRefer} onChange={e => setCommentRefer(e.target.value)} placeholder="Комментарий"/>
                            <button type="submit">Ответить</button>
                        </form>
                    </div>
            }
            {
                model.refers > 0 && refers.length > 0
                    &&
                    <div className={m.RefersContainer}>
                        {
                            refers.map((refer:IComment) => <Comment key={refer.id} model={refer} parent={model}/>)
                        }
                    </div>
            }
        </div>
    )
}

export default Comment