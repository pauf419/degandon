import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import { HttpResponse } from "../models/response/HttpResponse";
import { IRegsession } from "../models/IRegsession";
import { RegistrationResponse } from "../models/response/RegistrationResponse";
import { TernaryResponse } from "../models/response/TernaryResponse";
import { IUser } from "../models/IUser";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<HttpResponse<AuthResponse>>> {
        return $api.post<HttpResponse>('/auth/login', {email, password})
    }

    static async registration(email: string, password: string, username:string): Promise<AxiosResponse<HttpResponse<RegistrationResponse>>> {
        return $api.post<HttpResponse>('/auth/registration', {email, password, username})
    }

    static destroyRegsession(id:string): Promise<AxiosResponse<HttpResponse<TernaryResponse>>> {
        return $api.post<HttpResponse>('/auth/session/destroy', {id})
    }

    static updateProfile(fd:FormData): Promise<AxiosResponse<HttpResponse<IUser>>> {
        return $api.post<HttpResponse>("/auth/update", fd, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }

    static async verify(id:string, code:string): Promise<AxiosResponse<HttpResponse<AuthResponse>>> {
        return $api.post<HttpResponse>("/auth/verify", {id, code})
    }

}
