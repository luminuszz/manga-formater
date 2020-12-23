import { Injectable } from '@nestjs/common'
import { IHashProvider } from '../dtos/hashProvider.dto'
import { hash, compare } from 'bcrypt'

@Injectable()
export class BcryptHashProvider implements IHashProvider {
  public async createHash(value: string): Promise<string> {
    const newHash = await hash(value, 15)

    return newHash
  }

  public async compareHash(data: string, dataHash: string): Promise<boolean> {
    const compareHash = await compare(data, dataHash)

    return compareHash
  }
}
