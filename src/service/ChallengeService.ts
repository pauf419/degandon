
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { IComment } from "../interface/IComment";
import { IChallenge } from "../interface/IChallenge";
import { IChallenger } from "../interface/IChallenger";
import { IVote } from "../interface/IVote";

export default class ChallengeService {

    static getChallenge(id:string|null): Promise<AxiosResponse<IChallenge>> {
        return $api.get<IChallenge>("/challenge", {
            params: {
                id
            }
        })
    }

    static getChallengers(challenge:string|null): Promise<AxiosResponse<IChallenger[]>> {
        return $api.get<IChallenger[]>("/challenge/challenger", {
            params: {
                id: challenge
            }
        })
    }

    static createChallenge(title:string, code:string) {
        return $api.post<IChallenge>("/challenge", {
            title,
            code
        })
    }


    static createChallenger(data:any): Promise<AxiosResponse<IChallenger>> {
        return $api.post<IChallenger>("/challenge/challenger", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            } 
        })
    }

    static async vote(id:string, refer:string): Promise<AxiosResponse<IVote>> {
        return $api.post<IVote>("/challenge/vote", {
            id, 
            refer
        })
    }
}