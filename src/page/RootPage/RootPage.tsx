import m from "./RootPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import img1 from "../../resource/photo_2024-04-21_21-48-34.png"
import img2 from "../../resource/photo_2024-04-24_01-01-37.jpg"
import img3 from "../../resource/photo_2024-02-29_00-32-36.jpg"
import { IComment } from "../../models/IComment"
import Comment from "../../component/Comment/Comment"
import Container from "../../component/Container/Container"

const RootPage:FC = () => {

    const {store} = useContext(ctx)

    const [comment, setComment] = useState<string>("")

    const [comments, setComments] = useState<IComment[]>([])
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true)

    const sendComment = async (e: any) => {
        e.preventDefault()
        const data = await store.sendComment(comment)
        if(!data) {
            window.scrollTo({
                behavior: "smooth",
                top: 100
            })
            document.location.href = "#nickname"
            return 0
        }
        setComment("")
        setComments(prev => {
            return [data.data, ...prev]
        })
    }

    const getComments = async() => {
        setCommentsLoading(true)
        const comments:any = await store.getComments()
        setComments(prev => {
            return comments.data
        })
        setCommentsLoading(false)
    }

    useEffect(() => {
        getComments()
    }, [])
    
    return (
        <Container
            body={
                <>
                    <div className={m.Title}>Сегодня у нас педофил, именуемый себя <span style={{color: "#F38C16"}}>"Компьютерным мастером"</span>.</div>
                    <div className={m.Desc}>
                        Фотографии для опознания: 
                    </div>
                    <div className={m.ImgLayout}>
                        <div className={`${m.Column} ${m.Column1}`}>
                            <img src={img1}/>
                            <img src={img2}/>
                        </div>
                        <div className={`${m.Column} ${m.Column2}`}>
                            <img src={img3}/>
                        </div>
                    </div>
                    <div className={m.Paragraph}>
                        Этот "Компьютерный мастер" скрывал от общества правду многие месяца, после чего не вынес душевных терзаний, и сознался в содеянном..
                    </div>
                    <br/>
                    <div className={m.Paragraph}>
                        Этот гнусный подонок выслеживал свою первую и последнюю жертву долгое время, после чего предложил свои якобы "услуги". 
                        <br/>
                        Он втерся в доверие к жертве, предложив бесплатную помощь с настройкой операционной системы на ноутбуке, после чего приступил к манипулятивным действиям.
                        <br/> 
                        Он тщательно спланировал каждое свое действие, и был готов к любой ситуации.
                        <br/>
                        В результате всех вышеописаных действий, жертва начала испытывать симпатию к этому маньяку. 
                    </div>
                    <br/>
                    <div className={m.Desc}>
                        Где его можно встретить, и куда не стоит отпускать своих детей: 
                    </div>
                    <div className={m.Paragraph}>
                        Наша команда провела тщательное расследование, в результате которого мы определили частые точки его дислокации:
                        <br/><br/>
                        <li>Любая детская площадка. Он стоит за забором или сидит на лавочке, и наблюдает за невинными детьми.</li> 
                        <li>Детский сад. Был замечен за неоднократным пребыванием на территории детских садов, где молча наблюдал за спящими детьми.</li>
                        <li>Роддом. Подрабатывает "помочником" старшего окушера.</li>
                    </div>
                    <br/>
                    <div className={m.Paragraph}>
                        Его настоящий возраст - 17 лет. 
                    </div>
                    <div className={m.Paragraph}>
                        Его жертве на момент первого контакта было всего 14...  
                    </div>
                    <br/>
                    <div className={m.Paragraph} style={{color: "#F38C16"}}>
                        Админ сайта не хочет получить по ебалу, следовательно мы не будем выставлять соцсети этого уебка в открытый доступ, однако вы можете связаться с нами для получения данных в индивидуальном порядке: <a href="https://t.me/jerikssss">ТГ</a>
                    </div>
                </>
            }
            footer={
                <div className={m.FooterComments}>
                    <form onSubmit={sendComment}>
                        
                        <input required value={store.username} onChange={e => store.setUsername(e.target.value)} placeholder="Никнейм"/>
                        <input className={m.Comment} value={comment} onChange={e => setComment(e.target.value)} placeholder="Комментарий" required/>
                        <button>Туда</button>
                    </form>
                    <div className={m.UpdateContainer}>
                        <button disabled={commentsLoading} onClick={() => getComments()}>Обновить комментарии{commentsLoading && <div className={m.LoadingActive}>Загрузка...</div>}</button>
                    </div>
                    {
                        comments.length ? comments.map((comment:IComment) => {
                            return <Comment key={comment.id} model={comment} parent={null}/>
                        })
                        :
                        ""
                    }
                </div>
            }
        />
    )
}

export default observer(RootPage)