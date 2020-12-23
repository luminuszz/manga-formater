import { Injectable } from '@nestjs/common'
import { IHashProvider } from './dtos/hashProvider.dto'

@Injectable()
export class HashService {
  constructor(private readonly hashProvider: IHashProvider) {}

  public async createHash(data: string): Promise<string> {
    const hash = await this.hashProvider.createHash(data)

    return hash
  }

  public async validateHash(value: string, hash: string): Promise<boolean> {
    const validateHash = await this.hashProvider.compareHash(value, hash)

    return validateHash
  }
}

export enum HashToken {
  hashService = 'HashService',
}
