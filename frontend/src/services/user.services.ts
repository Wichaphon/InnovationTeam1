// services/user.service.ts
import { api } from "@/services/api";
import type { UserEntity } from "@/types/type";

export const UserService = {
    me: async (): Promise<UserEntity> => {
        const res = await api.get('/user/profile');
        return res.data;
    },

    all: async (): Promise<UserEntity[]> => {
        const { data } = await api.get('/user')
        return data;
    }
};
