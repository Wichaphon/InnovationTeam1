export interface AuthPayload {
    userId: string;
}

export interface AuthedRequest extends Request{
    user?: AuthPayload & {role  ?:string}
}