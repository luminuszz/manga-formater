export function transpileHashMap<T>(
    hashKey: string | number,
    values: T[]
): any {
    const hashMap = values.map(item => ({
        [item[hashKey]]: { ...item },
    }))

    return hashMap
}
