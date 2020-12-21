/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILovePdfSDK {
    createTask: (taskToken: string) => Promise<any>
    addFile: (filePath: string) => Promise<any>
    process: () => Promise<any>
    download: (outDirectory: string) => Promise<any>
}
export interface ProcessParams {
    filesArray: string[]
    path: string
    title: string
    cap: number
}

export interface GetParams {
    title: string
    cap: number
}
