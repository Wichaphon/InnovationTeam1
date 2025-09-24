import bcrypt from 'bcryptjs';
import { RoleRepo } from '@/repos/role.repo';
import { UserService } from "@/services/userService";
import { generatedAccessToken, generatedRefreshToken, verifyRefreshToken } from "@/utils/jwt.utils";
import { CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from '@/constants/http';
import { RefreshTokenRepo } from '@/repos/refreshToken.repo';

import { AppError } from '@/utils/appError';
import { UserCreateInput } from '@/types/user';
import { AuthPayload, refreshToken, role } from '@/constants/type';
import passport, { Profile } from 'passport';
import { AccountRepo } from '@/repos/account.repo';
import prisma from '@/utils/prisma';
import { UserRepo } from '@/repos/user.repo';
import { id } from 'zod/v4/locales';

export interface userData {
    fname: string;
    lname: string;
    email: string;
    password: string;
    roleId?: string;
}

export interface loginData {
    email: string;
    password: string;
}

export const registerUser = async (
    user: UserCreateInput,
) => {
    try {
        const hashed = await bcrypt.hash(user.password, 12);
        user = { ...user, password: hashed };
        const newUser = await UserService.createUser(user, "user");
        console.log(`Success full create`, newUser.fname);
        return newUser;
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            throw new AppError('Email already exists', CONFLICT, 'EMAIL_TAKEN');
        }
        throw error;
    }
};

export const googleLogin = async (userId: string) => {
    const token = { id: userId } as AuthPayload;
    const accessToken = generatedAccessToken(token);
    const refreshToken = generatedRefreshToken(token);

    await RefreshTokenRepo.create({ token: refreshToken, userId: userId });

    return { accessToken, refreshToken };
}

export const loginUser = async (userdata: loginData) => {
    const user = await UserService.getUserByEmail(userdata.email);

    if (!user) throw new AppError('Invalid credentials', UNAUTHORIZED, 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(userdata.password, user.password as string);
    if (!valid) throw new AppError('Invalid credentials', UNAUTHORIZED, 'INVALID_CREDENTIALS');

    const payload = { id: user.id } as AuthPayload;

    const accessToken = generatedAccessToken(payload);

    const refreshToken = generatedRefreshToken(payload);
    await RefreshTokenRepo.create({ token: refreshToken, userId: payload.id })
    
    return { user, accessToken, refreshToken };
}


export const refreshSession = async (token: string) => {
    try {
        const claims = verifyRefreshToken(token) as refreshToken;
        const row = await RefreshTokenRepo.find(token);
        if (!row) {
            throw new AppError('Invalid refresh token', UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
        }

        await RefreshTokenRepo.delete(token);

        const newPayload = { id: claims.id };
        const newAccess = generatedAccessToken(newPayload as AuthPayload);
        const newRefresh = generatedRefreshToken(newPayload);
        await RefreshTokenRepo.create({ token: newRefresh, userId: newPayload.id });

        return { accessToken: newAccess, refreshToken: newRefresh };
    } catch (error: any) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Token verification failed', UNAUTHORIZED, 'TOKEN_VERIFICATION_FAILED');
    }
}

export const findOrCreateUserFromGoogle = async (profile: Profile, accessToken: string, refreshToken?: string) => {
    const email = profile.emails?.[0]?.value;
    const fname = profile.name?.givenName || '';
    const lname = profile.name?.familyName || '';
    const provider = 'google';
    const providerAccountId = profile.id;

    // first check if an account with that providerAccountId exists
    let account = await AccountRepo.findByProviderAccountId(provider, providerAccountId);
    if (account) {
        // maybe update tokens etc.
        await AccountRepo.updateToken(account.id, accessToken, refreshToken);

        const user = await UserRepo.findById(account.userId);
        if (!user) throw new AppError("User Not Found", INTERNAL_SERVER_ERROR, "USER_NOT_FOUND");
        return user;
    }

    // if no account, check if there is a user with same email
    let user = email ? await UserRepo.findByEmail(email) : null;

    if (user) return user;

    // Create new user
    // you have roleId required, so you need some default role, e.g. “user”
    // find role
    const role = await RoleRepo.findByName("user");
    if (!role) throw new Error('Default USER role not found');
    const newuser = await UserRepo.create({
        email: email!,
        fname,
        lname,
        password: '', // or generate random/empty / or mark differently
        roleId: role.id
    });

    // create account
    await AccountRepo.create({
        userId: newuser.id,
        type: 'oauth',
        provider,
        providerAccountId,
        access_token: accessToken,
        refresh_token: refreshToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        // optionally id_token, scope etc. from profile / strategy callback params
    });

    return newuser;
}

export const logoutSession = async (token?: string) => {
    if (token) await RefreshTokenRepo.delete(token);

}