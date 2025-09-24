// import { env } from "@/config/env";

export default {
    jwt: {
        ACCESS_SECRET: process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret',
        REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret',
    }
}