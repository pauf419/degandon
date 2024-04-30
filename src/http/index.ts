import axios from 'axios';
export const API_URL = `/api`
export const WEBSOCKET_URL = `/`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    console.error(error)
    return error
})

export default $api;

