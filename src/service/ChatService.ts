
import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { IComment } from "../interface/IComment";
import { IChallenge } from "../interface/IChallenge";
import { IChallenger } from "../interface/IChallenger";
import { IVote } from "../interface/IVote";
import { IMessage } from "../interface/IMessage";

export default class ChatService {

    static getMessages(): Promise<AxiosResponse<IMessage[]>> {
        return $api.get<IMessage[]>("/chat")
    }

    static createMessage(data:string, username:string): Promise<AxiosResponse<IMessage>> {
        return $api.post<IMessage>("/chat", {
            data,
            username
        })
    }
}