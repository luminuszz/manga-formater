import { Exclude } from 'class-transformer'
import {
    Column,
    CreateDateColumn,
    Entity,
    ObjectID,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm'

export enum Role {
    user = 'user',
    admin = 'admin',
}

@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    name: string

    @Column()
    email: string

    @Exclude()
    @Column()
    password: string

    @Column({ enum: Role, default: Role.user })
    role: Role

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
