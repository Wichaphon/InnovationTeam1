import { api } from "@/services/api";
import type { UserEntity } from "@/types/type";

export const getprofileApi = async (): Promise<UserEntity> => {
    const res = await api.get("/user/profile");
    return res.data;
}