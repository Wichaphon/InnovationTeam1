import {z} from 'zod'

const Env = z.object({
    NODE_ENV: z.enum(['development','test','production']).default('development'),
    API_PORT: z.coerce.number().default(5000),
    ACCESS_TOKEN_SECRET: z.string().min(64),
    REFRESH_TOKEN_SECRET: z.string().min(64),
    REFRESH_TOKEN_COOKIE_NAME: z.string().nonempty(),
    DATABASE_URL: z.string().nonempty(),
    FRONT_END_URL: z.string().nonempty(),
    CORS_ORIGIN: z.string().nonempty(),
    // url was deprecated
});

export const env = Env.parse(process.env);

export const isProd = env.NODE_ENV === 'production';

export const REFRESH_COOKIE_NAME = 'refresh'

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/api/auth/refresh',
}

