import { Request, Response } from "express";
import { registerUser, loginUser, regisData, loginData, refreshSession, logoutSession } from "@/services/authService";
import { CREATED, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED, CONFLICT } from "@/constants/http";
import { env } from "@/config/env";
import { UserCreateInput } from "@/repos/user.repo";
import { AppError } from "@/utils/appError";

const cookieOpts = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const register = async (req: Request, res: Response) => {
    const { email, fname, lname, password } = req.body as regisData;
    console.log(`email is :`, email);

    try {
        const newUser = await registerUser({ email, fname, lname, password } as UserCreateInput);

        return res.status(CREATED).json({
            success: true,
            data: {
                id: newUser?.id,
                fname: newUser?.fname,
                lname: newUser?.lname,
                email: newUser?.email
            }
        });

    } catch (error: any) {
        throw error;
    }
}



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as loginData;

    try {
        const result = await loginUser({ email, password });

        if (!result) {
            throw new AppError("Invalid credentials", UNAUTHORIZED, "INVALID_CREDENTIALS");
        }

        const { user, accessToken, refreshToken } = result;

        res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });

        return res.status(OK).json({
            success: true,
            data: { accessToken }
        });

    } catch (error) {
        // Let the error handler middleware handle AppError instances
        throw error;
    }
}

// use communicate with server only
export const refresh = async (req: Request, res: Response) => {
    const raw = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
    if (!raw) {
        throw new AppError("Missing refresh token", UNAUTHORIZED, "MISSING_REFRESH_TOKEN");
    }

    const out = await refreshSession(raw);
    if (!out) {
        throw new AppError("Invalid refresh token", UNAUTHORIZED, "INVALID_REFRESH_TOKEN");
    }

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, out.refreshToken, cookieOpts);
    return res.status(OK).json({
        success: true,
        data: { accessToken: out.accessToken }
    });
};

export const logout = async (req: Request, res: Response) => {
    const raw = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME] as string | undefined;
    await logoutSession(raw);
    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, { ...cookieOpts, maxAge: 0 });
    return res.sendStatus(204);
};