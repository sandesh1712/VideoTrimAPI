export class AlreadyExistsError extends Error{
    constructor(msg:string){
        super(msg)
    }
}