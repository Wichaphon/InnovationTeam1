import { UserRepo, UserCreateInput, UserUpdateInput } from "@/repos/user.repo";
import bcrypt from "bcryptjs";
import { BAD_REQUEST } from "@/constants/http";
import { RoleRepo } from "@/repos/role.repo";
import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { AppError } from "@/utils/appError";


export const UserService = {
    // CREATE
    async createUser(input: Omit<UserCreateInput, "password"> & { password: string }) {
        try {
            const role = await RoleRepo.findByName('user');
            if (!role?.id) {
                throw new AppError("ROLE_NOT_FOUND", INTERNAL_SERVER_ERROR, "ROLE_NOT_FOUND");
            }

            const createData: UserCreateInput = {
                email: input.email,
                fname: input.fname,
                lname: input.lname,
                password: input.password,
                roleId: role.id,
            };

            const user = await UserRepo.create(createData);
            console.log(`From user service`, user.fname);
            return user;
        } catch (e: any) {
            // Prisma unique constraint
            if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
                throw new AppError("EMAIL_TAKEN", 409, "EMAIL_TAKEN");
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

    listUsers(page?: number, pageSize?: number) {
        return UserRepo.list(page, pageSize);
    },

    // UPDATE
    async updateUser(id: string, data: UserUpdateInput) {
        try {
            const updated = await UserRepo.update(id, data);
            return updated;
        } catch (e: any) {
            if (e?.code === "P2025") {
                // record not found
                throw new AppError("USER_NOT_FOUND", 404, "USER_NOT_FOUND");
            }
            if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
                throw new AppError("EMAIL_TAKEN", 409, "EMAIL_TAKEN");
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
