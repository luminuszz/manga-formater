import axios from 'axios'

export const api = axios.create({
    baseURL: `https://api.ilovepdf.com/v1`,
})
