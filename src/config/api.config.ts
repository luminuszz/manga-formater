import axios from 'axios'
import { sign } from 'jsonwebtoken'

const token = sign(
    {
        aud: 'https://api.ilovepdf.com',
        iss: 'node-ilovepdf',
        jti: process.env.LOVE_PDF_PROJECT_KEY,
    },
    process.env.LOVE_PDF_SECRET_KEY,
    {
        algorithm: 'HS256',
        expiresIn: '2h',
    }
)

const api = axios.create()

api.defaults.headers.common.Authorization = `Bearer ${token}`

export { api }
