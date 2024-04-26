import axios from 'axios';
export const API_URL = `/api`
export const WEBSOCKET_URL = `http://31.202.157.230:8090`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export default $api;

