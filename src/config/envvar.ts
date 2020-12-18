export enum nodeEnv {
    production = 'production',
    development = 'development',
}

interface EnvVar {
    port: number
    nodeEnv: keyof nodeEnv
    dbKey: string
    secretSR: string
    iv: string
}

export default (): EnvVar => ({
    nodeEnv: process.env.NODE_ENV as keyof nodeEnv,
    port: Number(process.env.PORT),
    dbKey: process.env.SECRET_DB_KEY,
    secretSR: process.env.SECRET_CR,
    iv: process.env.IV,
})
