
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { IComment } from "../interface/IComment";

export default class PostService {
    static sendComment(username:string, comment:string, refer:string="root"): Promise<AxiosResponse<IComment>> {
        return $api.post<IComment>('/comment', {username, comment, refer})
    }

    static getComments(refer:string="root"): Promise<AxiosResponse<IComment[]>> {
        return $api.get<IComment[]>('/comment', {
            params: {
                refer
            }
        })
    }
}