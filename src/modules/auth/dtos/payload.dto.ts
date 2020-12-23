import { ObjectID } from 'typeorm'

export interface payloadDTO {
    name: string
    email: string
    id: ObjectID
    role: string
}
