import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { HashService } from 'src/shared/providers/hash/hash.service'
import { MongoRepository } from 'typeorm'
import { createUserDTO } from '../dtos/createUser.dto'
import { User, Role } from '../schemas/users.schema'

export interface Field {
    column: keyof User
    value: string
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: MongoRepository<User>,
        private readonly hashService: HashService
    ) {}

    public async createUser(data: createUserDTO): Promise<User> {
        const checkUserExists = await this.usersRepository.findOne({
            where: { email: data.email },
        })

        if (checkUserExists) {
            throw new BadRequestException('User already exists')
        }

        const newUser = this.usersRepository.create(data)

        newUser.password = await this.hashService.createHash(newUser.password)
        newUser.role = Role.user

        await this.usersRepository.save(newUser)

        return newUser
    }

    public async createAdminUser(data: createUserDTO): Promise<User> {
        const checkUserExists = await this.usersRepository.findOne({
            where: { email: data.email },
        })

        if (checkUserExists) {
            throw new BadRequestException('User already exists')
        }

        const newUser = this.usersRepository.create(data)

        newUser.password = await this.hashService.createHash(newUser.password)
        newUser.role = Role.admin

        await this.usersRepository.save(newUser)

        return newUser
    }

    public async findeOneUser({
        column,
        value,
    }: Field): Promise<User | undefined> {
        const user = await this.usersRepository.findOne({
            where: { [column]: value },
        })

        return user
    }
}
