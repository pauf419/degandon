import { makeAutoObservable } from "mobx";
import IMarkdown from "../interface/IMarkdown";
import PostService from "../service/PostService";
import { IComment } from "../interface/IComment";

export default class Store {

    loading: boolean = false
    username:string = ""

    setLoading(state:boolean) {
        this.loading = state
    }

    setUsername(username:string) {
        this.username = username
    }

    async sendComment(comment:string, refer:string = "root", username:string = this.username) {
        this.setLoading(true)
        try {
            if(!this.username && username)  this.setUsername(username)
            console.log(this.username)
            const {data} = await PostService.sendComment(this.username, comment, refer)
            return data
        } catch(e:any) {
            console.log(e.response)
            this.setLoading(false)
            return e.response
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

    constructor() {
        makeAutoObservable(this)
    }
}