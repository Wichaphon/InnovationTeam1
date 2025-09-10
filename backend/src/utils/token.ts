import jwt, {type Secret, type SignOptions} from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '@/config/env';
import config from '@/config/config';

export type AccessClaims = {
    sub: string;
    role: 'USER' | 'ADMIN';
    jti: string
}

export type RefreshClaims = {
    sub: string;
    jti: string
}