import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { HttpResponse } from "../models/response/HttpResponse";
import { IUser } from "../models/IUser";

export default class UserService {

    static async getUser(id:string): Promise<AxiosResponse<HttpResponse<IUser>>> {
        return $api.get<HttpResponse>('/user/'+id)
    }

}
