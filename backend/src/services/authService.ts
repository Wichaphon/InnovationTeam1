import bcrypt from 'bcryptjs';
import { RoleRepo } from '@/repos/role.repo';
import { UserService } from "@/services/userService";
import { generatedAccessToken, generatedRefreshToken, verifyRefreshToken } from "@/utils/jwt.utils";
import { CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '@/constants/http';
import { RefreshTokenRepo } from '@/repos/refreshToken.repo';
import { UserCreateInput } from '@/repos/user.repo';
import { AppError } from '@/utils/appError';

export interface regisData {
    fname: string;
    lname: string;
    email: string;
    password: string;
}

export interface loginData {
    email: string;
    password: string;
}

export const registerUser = async (
    user: UserCreateInput
) => {
    try {
        const hashed = await bcrypt.hash(user.password, 12);
        const input: UserCreateInput = { ...user, password: hashed };
        const newUser = await UserService.createUser(input);
        console.log(`Success full create`, newUser.fname);
        return newUser;
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            throw new AppError('Email already exists', CONFLICT, 'EMAIL_TAKEN');
        }
        throw error;
    }
};


export const loginUser = async (userdata: loginData) => {
    const user = await UserService.getUserByEmail(userdata.email);

    if (!user) throw new AppError('Invalid credentials', UNAUTHORIZED, 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(userdata.password, user.password);
    if (!valid) throw new AppError('Invalid credentials', UNAUTHORIZED, 'INVALID_CREDENTIALS');

    const payload = { userId: user.id }

    const accessToken = generatedAccessToken(payload);

    const refreshToken = generatedRefreshToken(payload);
    await RefreshTokenRepo.create({ token: refreshToken, userId: payload.userId })

    return { user, accessToken, refreshToken };
}

interface refreshToken {
    userId: string;
    iat: number;
    exp: number;
}

export const refreshSession = async (token: string) => {
    try {
        const claims = verifyRefreshToken(token) as refreshToken;
        const row = await RefreshTokenRepo.find(token);
        if (!row) {
            throw new AppError('Invalid refresh token', UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
        }

        await RefreshTokenRepo.delete(token);

        const newPayload = { userId: claims.userId };
        const newAccess = generatedAccessToken(newPayload);
        const newRefresh = generatedRefreshToken(newPayload);
        await RefreshTokenRepo.create({ token: newRefresh, userId: newPayload.userId });

        return { accessToken: newAccess, refreshToken: newRefresh };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Token verification failed', UNAUTHORIZED, 'TOKEN_VERIFICATION_FAILED');
    }
}

export const logoutSession = async (token?: string) => {
    if (token) await RefreshTokenRepo.delete(token);

}