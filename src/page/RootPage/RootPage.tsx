import m from "./RootPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, FormEvent, FormEventHandler, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import logo from "../../resource/logo.png"
import img1 from "../../resource/photo_2024-04-21_21-48-34.png"
import img2 from "../../resource/photo_2024-04-24_01-01-37.jpg"
import img3 from "../../resource/photo_2024-02-29_00-32-36.jpg"
import img4 from "../../resource/photo_2024-02-29_00-32-35.jpg"
import { send } from "process"
import { IComment } from "../../interface/IComment"
import Comment from "../../component/Comment/Comment"
import { Link } from "react-router-dom"
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

    return (
        <div className={m.RootPageContainer}>
            <div className={m.ToolbarWrapper}>
                <div className={m.ToolbarHeader}>
                    <div className={m.HeaderPromo}>
                        <svg className={m.HeaderLogo} xmlns="http://www.w3.org/2000/svg" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 274.989 274.989">
                            <g>
                                <path d="M179.567,216.044c-5.609,11.237-8.425,16.844-14.02,19.641c-5.609,5.603-16.837,5.603-28.068,5.603   c-14.02,0-22.432,0-28.038-5.603c-5.624-2.797-8.432-8.404-14.03-19.641c0,0-2.816-2.781-2.816-5.611l-11.228,2.83l8.429,28.025   l16.827,14.049c5.598,14.022,16.835,19.652,30.855,19.652c5.609,0,14.039-2.836,16.835-5.63c5.623-2.816,11.232-8.415,14.04-14.022   l16.826-14.049l8.425-28.025l-11.222-2.83C179.567,213.263,179.567,216.044,179.567,216.044L179.567,216.044z M210.458,25.266   C190.794,8.448,168.355,0,137.48,0c-30.855,0-53.295,8.448-72.948,25.266C47.701,39.287,36.493,61.729,36.493,87.009   c0,22.422,2.787,39.249,8.4,47.7c8.426,14.008,14.04,22.428,14.04,28.032l2.797,22.43l39.28,19.663l8.432,16.84   c2.782,0,5.607,0,11.222,2.797c5.613,0,11.222,0,16.817,0c14.039,0,22.459-2.797,30.875-2.797l5.603-16.84l39.291-19.663   l2.796-22.43c2.818-5.604,2.818-8.426,2.818-11.216c14.018-19.648,19.633-42.094,19.633-64.517   C238.496,61.729,230.086,39.287,210.458,25.266L210.458,25.266z M95.412,162.742c-16.845,0-22.44-11.216-22.44-28.032   c0-8.451,0-16.867,5.595-19.652c2.802-5.626,8.434-8.415,16.845-8.415c16.812,0,25.252,8.415,25.252,25.237   C120.664,151.526,112.224,162.742,95.412,162.742L95.412,162.742z M145.921,193.597c-2.831,0-5.633,0-8.44-2.806   c-2.817,2.806-2.817,2.806-5.595,2.806c-2.836,0-5.609,0-8.425-2.806c-2.797,0-2.797-2.791-2.797-5.618   c0-2.776,2.797-8.387,5.613-11.198c5.609-5.621,8.387-11.232,11.204-16.837c2.807,5.604,8.44,11.216,11.231,16.837   c5.604,2.811,5.604,8.422,5.604,11.198C154.316,190.791,151.519,193.597,145.921,193.597L145.921,193.597z M182.385,162.742   c-16.837,0-25.263-11.216-25.263-28.032c0-16.867,8.426-28.068,25.263-28.068c8.409,0,14.018,2.79,16.826,8.415   c5.613,2.785,5.613,8.411,5.613,16.821C204.823,151.526,196.403,162.742,182.385,162.742L182.385,162.742z"/>
                            </g>
                        </svg>
                        <h1>Degandon.online</h1>
                    </div>
                    <div className={m.HeaderData}>
                        <Link className={m.HeaderLink} to="/vote">Проголосовать за следующего педофила</Link>
                        <a className={m.HeaderLink} href="https://cs.pikabu.ru/post_img/2014/01/04/0/1388779332_1974109799.jpg">
                            Отпиздить админа
                        </a>
                    </div>
                </div>
                <div className={m.ToolbarContent}>
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
                </div>
                <div className={m.Footer}>
                    <div className={m.FooterStats}>
                        <div>Количество просмотров: 134</div>
                    </div>
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
                </div>
            </div>
        </div>
    )
}

export default observer(RootPage)