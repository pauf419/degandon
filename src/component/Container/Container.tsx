import { FC, ReactNode, useContext, useEffect, useState } from "react";
import m from "./Container.module.sass"
import { Link } from "react-router-dom";
import { ctx } from "../..";
import LogModal from "../LogModal/LogModal";

interface IContainer {
    body: ReactNode
    footer: ReactNode
    space?: boolean
}

const Container: FC<IContainer> = ({body, footer, space=false}) => {

    const [headerActive, setHeaderActive] = useState<boolean>(false)
    const {store} = useContext(ctx)

    useEffect(() => {
        if(headerActive) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto"
    }, [headerActive])

    return (
        <div className={m.RootPageContainer}>
            <div className={`${m.ToolbarWrapper} ${space && m.Space}`}>
                <div className={m.ToolbarHeader}>
                    <div className={m.HeaderPromo}>
                        DEGANDON
                    </div>
                    <div className={m.HeaderData}>
                        <Link className={m.HeaderLink} to="/">Рут</Link>
                        <Link className={m.HeaderLink} to="/vote">Голосование</Link>
                        <Link className={m.HeaderLink} to="/flow">Флоу</Link>
                        <a className={m.HeaderLink} href="https://cs.pikabu.ru/post_img/2014/01/04/0/1388779332_1974109799.jpg">
                            Отпиздить админа
                        </a>
                        <div className={`${m.HeaderAdaptiveContainer} ${headerActive ? m.Active : ""}`}>
                            <Link className={m.AdaptiveHeaderLink} to="/"> {"> "}Рут</Link>
                            <Link className={m.AdaptiveHeaderLink} to="/pf"> {"> "}Аккаунт</Link>
                            <Link className={m.AdaptiveHeaderLink} to="/vote"> {"> "}Голосование</Link>
                            <Link className={m.AdaptiveHeaderLink} to="/flow"> {"> "}Флоу</Link>
                            <Link className={m.AdaptiveHeaderLink} to="/chat"> {"> "}Флудилка</Link>
                            <a className={m.AdaptiveHeaderLink} href="https://cs.pikabu.ru/post_img/2014/01/04/0/1388779332_1974109799.jpg">
                            {"> "}Отпиздить админа
                            </a>
                            <img src={`${process.env.REACT_APP_STATIC}pepe.gif`} className={m.Pepe}/>
                        </div>
                        <div className={`${m.BurgerBtn} ${headerActive ? m.active : ""}`} onClick={() => setHeaderActive(!headerActive)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
                <LogModal/>
                <div className={m.ToolbarContent}>
                    {body}
                </div>
                {
                    !space 
                        &&
                        <div className={m.Footer}>
                            {footer}
                        </div>
                }
            </div>
        </div>
    )
}

export default Container