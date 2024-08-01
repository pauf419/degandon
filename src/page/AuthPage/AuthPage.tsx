import React, {FC, useContext, useEffect, useState} from 'react';
import {ctx} from "../../index";
import {observer} from "mobx-react-lite";
import { Link, useNavigate } from 'react-router-dom';
import cl from "./AuthPage.module.sass"
import Container from '../../component/Container/Container';
import { socket } from '../../websocket/socket';

interface Props {
    login: boolean
}

const AuthPage: FC<Props> = ({login}) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const {store} = useContext(ctx);

    const navigate = useNavigate()

    const onSubmitRegistration = async (): Promise<void> => {
        
        await store.registration(email, password, username)

    }

    const processSubmit = async (e:any): Promise<void> => {
        e.preventDefault()
        if(login) return store.login(email, password)
        onSubmitRegistration()
    }

    useEffect(() => {
        if(store.isAuth) navigate("/pf")
    }, [store.isAuth])

    return (
        <Container
            body={
                <form className={cl.AuthPageWrapper} onSubmit={processSubmit}>
                    <div className={cl.AuthPageFields}>
                        <div className={cl.AuthPageLeft}>
                            {
                                !login ?
                                    <h1>Регистрация</h1>
                                    :
                                    <h1>Вход в аккаунт</h1>
                            }
                            <h4>Готов ли ты присоединиться к обществу <span style={{color: "#F38C16"}}>задротов-фриков</span>, без личной жизни ?</h4>
                        </div>
        
                        <input
                            required
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            type="text"
                            placeholder='Почта'
                            className={cl.AuthPageField}
                        />
                        {
                            !login && <input className={cl.AuthPageField} onChange={e => setUsername(e.target.value)} placeholder="Псевдо"/>
                        }
                        <input
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            required
                            className={cl.AuthPageField}
                            type="password"
                            placeholder='Пароль'
                        />
                    </div>
                    <div className={cl.AuthPageAction}>
                        {
                            login 
                                ?
                                <button type="submit" className="btn">
                                    Войти
                                </button>
                                :
                                <button type="submit"  className="btn">
                                    Зарегистрироваться
                                </button>
                        }
                        <div className={cl.AuthPageSpan}>
                            <div className={cl.AuthPageOr}>ИЛИ</div>
                            {
                                login 
                                    ?
                                    <Link to="/pf">Зарегистрироваться</Link>
                                    :
                                    <Link to="/pf/login">Войти в аккаунт</Link>
                            }
                        </div>
                    </div>
                    <div className={cl.AuthPageBackground}>

                    </div>
                </form>
            }
            footer={<></>}
        />
    );
};

export default observer(AuthPage);