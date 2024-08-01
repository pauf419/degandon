import React, {FC, useContext, useEffect, useState} from 'react';
import {ctx} from "../../index";
import {observer} from "mobx-react-lite";
import cl from './VerifyPage.module.sass'
import Container from '../../component/Container/Container';
import { useNavigate } from 'react-router-dom';

const VerifyPage: FC = () => {
    const [code, setCode] = useState<string>('')
    const {store} = useContext(ctx);
    const navigate = useNavigate()

    const handleSubmit = (e:any) => {
        e.preventDefault()
        store.verify(code)
    }

    useEffect(() => {
        if(store.isAuth) navigate("/pf")
    }, [store.isAuth])

    return (
        <Container
            body={
                <form className={cl.VerifyPageWrapper} onSubmit={handleSubmit}>
                    <div className={cl.VerifyPageTitle}>
                        <h1>Подтвердите почтовый адрес</h1>
                        <p>
                            Верификационный код отправлен на <span style={{color: "#F38C16"}} className={cl.TitleEmail}>{localStorage.getItem("regsession_payload")}</span>
                        </p>
                    </div>
                    <input required placeholder="Введите код" onChange={e => setCode(e.target.value)}/>
                    <div className={cl.VerifyPageAction}>
                        <button type="submit" className="btn">Подтвердить</button> 
                        <button type="button" onClick={() => store.destroyRegsession()}>Дроп верификационной сессии</button>
                    </div>
                </form>
            }
            footer={<></>}
        />
    );
};

export default observer(VerifyPage);