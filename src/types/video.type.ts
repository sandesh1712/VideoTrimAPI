export enum  TrimFrom {
    START="start", 
    END="end"
}
export type TrimParams = {
    from:TrimFrom,
    trimLength:number
}

export type TrimTimeLimit = {
    start:number,
    duration: number
}