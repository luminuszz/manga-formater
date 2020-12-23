export abstract class IHashProvider {
    public abstract createHash(value: string): Promise<string>
    public abstract compareHash(
        data: string,
        dataHash: string
    ): Promise<boolean>
}
