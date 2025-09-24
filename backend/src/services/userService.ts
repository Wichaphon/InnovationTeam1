import { UserRepo, UserUpdateInput } from "@/repos/user.repo";
import { UserData } from "@/controller/user.controller";
import bcrypt from "bcryptjs";
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "@/constants/http";
import { RoleRepo } from "@/repos/role.repo";
import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { AppError } from "@/utils/appError";
import { UserCreateInput, UserCreateReturn, UserListResult } from "@/types/user";
import { role } from "@/constants/type";

export const UserService = {
    // CREATE
    async createUser(input: UserCreateInput, role:role):Promise<UserCreateReturn> {
        try {
                const userrole = await RoleRepo.findByName(role);
                if (!userrole?.id) 
                    throw new AppError("ROLE_NOT_FOUND", INTERNAL_SERVER_ERROR, "ROLE_NOT_FOUND");

                const createData: UserCreateInput = {
                    email: input.email,
                    fname: input.fname,
                    lname: input.lname,
                    password: input.password,
                    roleId: userrole.id,
                };

                const user = await UserRepo.create(createData);
                console.log(`From user service`, user.fname);
                return user;
        } catch (e: any) {
            // Prisma unique constraint
            if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
                throw new AppError("EMAIL_TAKEN", CONFLICT, "EMAIL_TAKEN");
            }
            throw e;
        }
    },


    getUserById(id: string) {
        return UserRepo.findById(id);
    },

    getUserByIdwithRole(id:string){
        return UserRepo.findByIdWithRole(id);
    },

    getUserByEmail(email: string) {
        return UserRepo.findByEmail(email);
    },

    async listUsers(page?: number, pageSize?: number):Promise<UserListResult> {
        return await UserRepo.list(page, pageSize);
    },

    // UPDATE
    async updateUser(id: string, data: UserUpdateInput) {
        try {
            const updated = await UserRepo.update(id, data);
            return updated;
        } catch (e: any) {
            if (e?.code === "P2025") {
                // record not found
                throw new AppError("USER_NOT_FOUND", NOT_FOUND, "USER_NOT_FOUND");
            }
            if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
                throw new AppError("EMAIL_TAKEN", CONFLICT, "EMAIL_TAKEN");
            }
            throw e;
        }
    },

    // DELETE (hard delete)
    async deleteUser(id: string) {
        try {
            await UserRepo.remove(id); // ลบสำเร็จไม่ต้องคืนค่า
        } catch (e: any) {
            if (e?.code === "P2025") throw new AppError("USER_NOT_FOUND", 404, "USER_NOT_FOUND");
            throw e;
        }
    },
};
