/* eslint-disable @typescript-eslint/ban-types */
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ClassValidatorPipe implements PipeTransform {
    async transform(
        value: unknown,
        { metatype }: ArgumentMetadata
    ): Promise<unknown> {
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)

        const formattedErrors = this.serializeErrors(errors)

        if (errors.length > 0) {
            throw new BadRequestException(formattedErrors)
        }
        return value
    }

    private serializeErrors(erros: ValidationError[]) {
        const serialize = erros.map(({ property, constraints }) => {
            return { field: property, message: constraints }
        })
        return serialize
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}
