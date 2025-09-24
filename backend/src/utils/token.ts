import jwt, {type Secret, type SignOptions} from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export type AccessClaims = {
    sub: string;
    role: 'USER' | 'ADMIN';
    jti: string
}

export type RefreshClaims = {
    sub: string;
    jti: string
}