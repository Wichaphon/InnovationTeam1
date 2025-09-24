import { auth_google, login_local, logout, refreshToken, register } from "@/api/authApi"
import type { UserAuthData } from "@/components/RegisterForm";
import { API_URL } from "@/services/api";

export const AuthService = {
    loginLocal: async (email: string, password: string) => {
        try {
            const { success } = await login_local(email, password);
            return success;
        } catch (error) {
            throw new Error("Login Failed");
        }
    },

    authGoogle: async () => {
        window.location.href = `${API_URL}/auth/google`;
    },

    logout: async () => {
        try {
            await logout();
        } catch (error) {
            throw new Error("Logout Failed");
        }
    },

    register: async (userInput: UserAuthData) => {
        try {
            await register(userInput);
        } catch (error) {
            throw new Error("register Failed");
        }
    },

    refreshToken: async () => {
        await refreshToken();
    }
}