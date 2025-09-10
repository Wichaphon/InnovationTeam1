import {rateLimit} from 'express-rate-limit';
import helmet from 'helmet';

export const security = [
    helmet({ contentSecurityPolicy: false}),
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        skipSuccessfulRequests: true
    })
]