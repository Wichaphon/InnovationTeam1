import type { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";
import { CONFLICT, INTERNAL_SERVER_ERROR } from "@/constants/http";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    logger.error(err);

    // Prisma duplicate email safeguard if not handled upstream
    if (err?.code === 'P2002' && err?.meta?.target?.includes('email')) {
        return res.status(CONFLICT).json({
            success: false,
            error: 'EMAIL_TAKEN',
            message: 'Email already exists'
        });
    }

    // Handle AppError instances
    if (err instanceof Error && 'status' in err && 'code' in err) {
        const status = (err as any).status || INTERNAL_SERVER_ERROR;
        const code = (err as any).code || 'UNKNOWN_ERROR';
        const message = err.message || 'An error occurred';

        return res.status(status).json({
            success: false,
            error: code,
            message
        });
    }

    // Handle other errors
    const status = typeof err?.status === 'number' ? err.status : INTERNAL_SERVER_ERROR;
    const code = err?.code || (status === INTERNAL_SERVER_ERROR ? 'INTERNAL_SERVER_ERROR' : undefined);
    const message = err?.message || 'Internal server error';

    return res.status(status).json({
        success: false,
        error: code,
        message
    });
}