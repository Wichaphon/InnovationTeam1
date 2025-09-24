import { Request, Response } from "express";
import { registerUser, loginUser, userData, loginData, refreshSession, logoutSession, googleLogin } from "@/services/authService";
import { CREATED, INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED, CONFLICT } from "@/constants/http";
// import { env } from "@/config/env";
import { UserCreateInput } from "@/types/user";
import { AppError } from "@/utils/appError";
import passport from "passport";
import { jwt, success } from "zod";
import { generatedAccessToken, generatedRefreshToken } from "@/utils/jwt.utils";
import { AuthPayload, returnToken } from "@/constants/type";
import { UserService } from "@/services/userService";

export const frontend_tmp = "http://localhost:3000"

const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const register = async (req: Request, res: Response) => {
    const { email, fname, lname, password } = req.body as UserCreateInput;
    console.log(`email is :`, email);

    try {
        const newUser = await registerUser({ email, fname, lname, password } as UserCreateInput);
        const payload = { id: newUser.id } as AuthPayload;
        const accessToken = generatedAccessToken(payload);
        const refreshToken = generatedRefreshToken(payload);

        const redirectpath = newUser.role.name == 'admin' ? '/admin' : '/account'
        return res.status(CREATED)
        .cookie('access_token', accessToken, {
            httpOnly:true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })
        .cookie('refresh_token', refreshToken, {
            httpOnly:true,
            sameSite:'lax',
            path: '/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        .redirect(`${frontend_tmp}`+ redirectpath);
        // return res.status(CREATED).json({
        //     success: true,
        //     user: {
        //         id: newUser?.id,
        //         fname: newUser?.fname,
        //         lname: newUser?.lname,
        //         email: newUser?.email
        //     }
        // });

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

        const redirectpath = user.role.name == 'admin' ? '/admin' : '/account' ;  

        return res.status(OK)
        .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth/refresh',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
        .cookie('access_token', accessToken, {
            httpOnly:true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        })
        .json({success:true})
        // .redirect(`${frontend_tmp}/account`);

    } catch (error) {
        throw new AppError("Login Failed", INTERNAL_SERVER_ERROR, "LOGIN_FAILED");
    }
}


// use communicate with server only
export const refresh = async (req: Request, res: Response) => {
    const raw = req.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME as string] as string | undefined;
    if (!raw) {
        throw new AppError("Missing refresh token", UNAUTHORIZED, "MISSING_REFRESH_TOKEN");
    }

    const out = await refreshSession(raw);
    if (!out) {
        throw new AppError("Invalid refresh token", UNAUTHORIZED, "INVALID_REFRESH_TOKEN");
    }

    res.status(OK)
        .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, out.refreshToken, cookieOpts)
        .cookie('access_token', out.accessToken, {
            httpOnly:true,
            sameSite: 'lax',
        })
        .json({sucess: true});
};

export const authgoogle = (req: Request, res: Response) => passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(UNAUTHORIZED).redirect('/auth/google/failed');
    }

    const { accessToken, refreshToken } = await googleLogin(user.id);

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60, // 1 hr
        path:"/"
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/auth/refresh',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
    .status(OK)
    .redirect(`${frontend_tmp}/auth/callback`);
}

export const googleFailureHandle = (req: Request, res: Response) => {
    res.status(UNAUTHORIZED).json({ message: "Google Authentication Failed" });
}



export const logout = async (req: Request, res: Response) => {
    const raw = req.cookies?.[process.env.REFRESH_TOKEN_COOKIE_NAME as string] as string | undefined;
    await logoutSession(raw);
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, { ...cookieOpts, maxAge: 0 });
    return res.sendStatus(204);
};