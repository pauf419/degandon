
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { IComment } from "../models/IComment";
import { IChallenge } from "../models/IChallenge";
import { IChallenger } from "../models/IChallenger";
import { IVote } from "../models/IVote";
import { IMessage } from "../models/IMessage";

export default class ChatService {

    static getMessages(offset:number, cursor:string): Promise<AxiosResponse<IMessage[]>> {
        return $api.get<IMessage[]>("/chat", {
            params: {
                offset,
                cursor
            }
        })
    }

    static getCursor(): Promise<AxiosResponse<string>> {
        return $api.get<string>("/chat/cursor")
    }
}