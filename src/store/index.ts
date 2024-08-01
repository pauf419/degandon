import { makeAutoObservable } from "mobx";
import IMarkdown from "../models/IMarkdown";
import PostService from "../service/PostService";
import { IComment } from "../models/IComment";
import { IUser } from "../models/IUser";
import { IModalLog } from "../models/IModalLog";
import AuthService from "../service/AuthService";
import axios from "axios";
import { HttpResponse } from "../models/response/HttpResponse";
import { AuthResponse } from "../models/response/AuthResponse";
import { updateInstance } from "../websocket/socket";
import UserService from "../service/UserService";
import { ISocketDebugLog } from "../models/ISocketDebugLog";
import { socket, connect, server } from "../websocket/socket"

export default class Store {


    user = {} as IUser;
    isAuth = false;
    loading: boolean = true
    regsessionStatus = false;
    activeLog: IModalLog | null = null;
    username:string = ""
    voted: boolean = false
    socketsg: number = 0
    socketDebugLog: ISocketDebugLog[] = []
    statusTriggerIds: string[] = []
    subscribedTriggerIds: string[] = []

    addStatusTrigger(id:string) {
        if(!this.subscribedTriggerIds.includes(id)) {
            this.subscribedTriggerIds.push(id)
            socket.emit("subscribetriggerid", id)
        } else {
            console.log("already subscribed!")
        }
    }

    removeStatusTrigger(id:string) {

    }

    addSocketDebugLog(payload:ISocketDebugLog) {
        this.socketDebugLog.push(payload)
    }

    setSocketsg(socketsg:number) {
        this.socketsg = socketsg
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setActiveLog(log:IModalLog | null) {
        this.activeLog = log
    }

    setUser(user: IUser) {
        this.user = user;
    }

    updateLog(status:number, message:string) {
        this.activeLog = {
            status,
            message
        }
    }


    setLoading(state:boolean) {
        this.loading = state
    }

    setVoted(state:boolean) {
        this.voted = state
    }

    setUsername(username:string) {
        this.username = username
    }

    async sendComment(comment:string, refer:string = "root", username:string = this.username) {
        this.setLoading(true)
        try {
            if(!this.username && username)  this.setUsername(username)
            const {data} = await PostService.sendComment(this.username, comment, refer)
            this.setLoading(false)
            return data
        } catch(e:any) {
            console.log(e.response)
            this.setLoading(false)
            return e.response
        }
    }

    async getUser(id:string): Promise<IUser> {
        try {
            const {data} = await UserService.getUser(id)
            return data.data as IUser
        } catch(e:any) {
            console.log(e.response)
            throw e.response
        }
    }

    async getComments(refer:string="root"): Promise<IComment[]> {
        try {
            const {data} = await PostService.getComments(refer)
            return data
        } catch(e:any) {
            console.log(e)
            console.log(e.response)
            this.setLoading(false)
            return e.response
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.data.user);
            this.updateLog(response.status, response.data.msg!)
            updateInstance()
        } catch (e) {
            console.error(e);
        }
    }

    async registration(email: string, password: string, username: string): Promise<boolean> {
        try {
            const response = await AuthService.registration(email, password, username);
            localStorage.setItem("regsession", response.data.data.session.id)
            localStorage.setItem("regsession_payload", response.data.data.session.email)
            this.updateLog(response.status, response.data.msg!)
            this.regsessionStatus = true
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    async verify(code:string) {
        try {
            const response = await AuthService.verify(localStorage.getItem("regsession")!, code);
            localStorage.setItem('token', response.data.data.accessToken);
            localStorage.removeItem("regsession")
            localStorage.removeItem("regsession_payload")
            this.regsessionStatus = false
            this.setAuth(true);
            this.setUser(response.data.data.user);
            this.updateLog(response.status, response.data.msg!)
            updateInstance()
        } catch (e) {
            console.error(e);
        }
    }

    async updateProfile(fd:FormData) {
        try {
            const response:any = await AuthService.updateProfile(fd)
            this.updateLog(response.status, response.data.msg!)
            this.setUser(response.data.data.data)
            return this.user
        } catch(e) {
            console.error(e)
            return null
        }
    }

    async destroyRegsession() {
        const response = await AuthService.destroyRegsession(localStorage.getItem("regsession")!)
        localStorage.removeItem("regsession")
        localStorage.removeItem("regsession_payload")
        this.regsessionStatus = false
        this.updateLog(response.status, response.data.msg!)
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
            this.updateLog(200, "Successfully logged out")
            updateInstance()
        } catch (e) {
            console.error(e);
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<HttpResponse<AuthResponse>>(`${process.env.REACT_APP_API}/auth/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.data.user);
        } catch (e) {
            console.error(e)
        } finally {
            this.setLoading(false);
        }
    }

    constructor() {
        makeAutoObservable(this)
    }
}