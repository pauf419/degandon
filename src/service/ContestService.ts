

import $api from "../http";
import {Axios, AxiosResponse} from 'axios';
import { ITask } from "../models/ITask";

export default class ContestService {

    static getCurrentTask(): Promise<AxiosResponse<ITask>> {
        return $api.get<ITask>("/contest/task")
    }
    
    static answerCurrentTask(answer:string): Promise<AxiosResponse<any>> {
        return $api.post<any>("/contest/task", {
            answer
        })
    }

}