import { env } from "@/config/env";

export default {
    jwt: {
        ACCESS_SECRET: env.ACCESS_TOKEN_SECRET || 'dev-access-secret',
        REFRESH_SECRET: env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret',
    }
}