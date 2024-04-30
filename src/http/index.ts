import axios from 'axios';

const $api = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_API
})

$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    console.error(error)
    return error
})

export default $api;

