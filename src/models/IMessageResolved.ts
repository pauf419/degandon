import { IUser } from "./IUser"


export interface IMessageResolved { 
    id:string
    refer:IUser
    timestamp:string 
    payload:string
}