// services/user.service.ts
import { api } from "@/services/api";
import type { User } from "@/types/type";

export const UserService = {
    me: async (): Promise<User> => {
        const {data} = await api.get('/user/profile');
        return data;
    },
};
