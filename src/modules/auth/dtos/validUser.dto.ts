import { IsEmail, IsNotEmpty, IsString, isString } from 'class-validator'

export class validUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}
