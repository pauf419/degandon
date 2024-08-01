import React, {FC, useContext, useEffect, useState} from 'react';
import {ctx} from "../../index";
import {observer} from "mobx-react-lite";
import { Link, useNavigate, useParams } from 'react-router-dom';
import m from "./ProfilePage.module.sass"
import Container from '../../component/Container/Container';
import StatusResolver from '../../component/StatusResolver/StatusResolver';
import FileInput from '../../component/FileInput/FileInput';
import { IUser } from '../../models/IUser';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import NotFoundContainer from '../../component/NotFoundContainer/NotFoundContainer';
import LoadingContainer from '../../component/LoadingContainer/LoadingContainer';
import ColorThief, { Color } from 'color-thief-react'
import { socket } from '../../websocket/socket';
import { IOnlineStatus } from '../../models/IOnlineStatus';


interface ProfilePageProps {
    edit: boolean
    preview: boolean
}

const ProfilePage: FC<ProfilePageProps> = ({edit, preview}) => {

    const { store } = useContext(ctx);
    const navigate = useNavigate();
    const [preloadedFile, setPreloadedFile] = useState<any>(null);
    const [profileData, setProfileData] = useState<IUser>();
    const [isIdValid, setIsIdValid] = useState<boolean>(true);
    const [pfpColor, setPfpColor] = useState<string>("");
    const { id } = useParams();
    const [localPreview, setLocalPreview] = useState(preview);
    const [online, setOnline] = useState<boolean>(profileData ? profileData.online : false)
    const [profileDataLoading, setProfileDataLoading] = useState<boolean>(true)

    const savePreloadedFile = (url: string, data: string) => {
        setPreloadedFile(data);
    }

    const handleSubmit = async () => {
        const fd: FormData = new FormData();
        fd.append("username", profileData!.username);
        fd.append("description", profileData!.description);
        fd.append("pfp", preloadedFile);
        const data:IUser|null = await store.updateProfile(fd);
        navigate("/pf");
        if(data) setProfileData(data)
    }

    const getUser = async (id: string) => {
        try {
            const userData: IUser = await store.getUser(id);
            setOnline(userData.online)
            setProfileData(userData);
        } catch (e) {
            console.error(e);
            setIsIdValid(false);
        }
        setProfileDataLoading(false)
    }

    useEffect(() => {
        console.log("jere")
        if(id) store.addStatusTrigger(id)
        if (localPreview && id) {
            if (store.isAuth && id === store.user.id) setLocalPreview(false);
            getUser(id);
            return;
        }
        setProfileData(store.user);
        setOnline(true)
        return () => store.removeStatusTrigger(id!)
    }, [id]);

    useEffect(() =>  { 
        if(!socket) return;
        socket.on("triggeridstatusupdate", (payload:IOnlineStatus) => {
            console.log(payload)
            if(payload.refer === id) setOnline(payload.online)
        })
    }, [socket])
    

    if (!isIdValid || !profileData) return profileDataLoading ? <LoadingContainer/> : <NotFoundPage />

    return (
        <Container
            body={
                <div className={m.ProfilePageContainer}>
                    <div className={m.ProfilePageHeader}>
                        <div className={m.HeaderPfp}>
                            {
                                edit 
                                    ?
                                        <FileInput 
                                            key={profileData.pfp}
                                            defaultImg={profileData.pfp} 
                                            onChange={savePreloadedFile}
                                        />
                                    :
                                        <img src={profileData.pfp}/>
                            }
                        </div>
                        <div className={m.HeaderStatus}>
                            <StatusResolver isP={true} status={profileData.status}/>
                            <div className={`${m.OnlineStatus} ${online ? m.Active : m.Inactive}`}>
                                {online ? "в сети" : "не в сети"}
                            </div>
                        </div>
                        <div className={m.HeaderDescription}>
                            {
                                edit
                                    ?
                                    <div className={m.EditInputWrapper}>
                                        <input className={m.EditInput} autoFocus onChange={e => setProfileData({...profileData, description:e.target.value})} defaultValue={profileData.description}/>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg>

                                    </div>
                                    :
                                    profileData.description
                                    
                            }
                        </div>
                        <hr/>
                        <div className={m.HeaderValues}>
                            <div className={m.HeaderValue}>
                                <span className="primary">rating: </span>{profileData.rating}
                            </div>
                            {
                                edit 
                                    ?
                                    <div className={m.HeaderValue}>
                                        <span className="primary">username: </span>
                                        <div className={m.EditInputWrapper}>
                                            <input className={m.EditInput} onChange={e => setProfileData({...profileData, username:e.target.value})} defaultValue={profileData.username}/>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                            </svg>

                                        </div>
                                    </div> 
                                    :
                                    <div className={m.HeaderValue}>
                                        <span className="primary">username: </span>{profileData.username}
                                    </div>
                            }
                            <div className={m.HeaderValue}>
                                <span className="primary">id: </span>{profileData.id}
                            </div>    
                        </div>
                    </div>
                    {
                        (edit || !localPreview) &&
                        <hr/>
                    }
                    <div className={m.ProfilePageAction}>
                        {
                            edit
                                ?
                                <>
                                    <button onClick={() => navigate("/pf")}>
                                        Отменить изменения
                                    </button>
                                    <button onClick={() => handleSubmit()}>
                                        Сохранить
                                    </button>
                                </>
                                :
                                !localPreview
                                    &&
                                    <>
                                        <button onClick={() => navigate("/pf/edit")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                            </svg>
                                        </button>
                                        <button onClick={() => store.logout()}>
                                            Выйти из аккаунта
                                        </button>
                                    </>
                        }
                    </div>
                </div>
            }
            footer={<></>}
        />
    );
};

export default observer(ProfilePage);