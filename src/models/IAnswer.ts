import { ITask } from "./ITask"

export interface IAnswer {
    id:string 
    refer:ITask
    value:string 
    timestamp:string 
    urefer:string
    index:number
}