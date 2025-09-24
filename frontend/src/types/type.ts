export type UserEntity = {
    id: string;
    email: string;
    fname: string;
    lname: string;
    role?: {
        name: Role;
    };
}

export type UserCreateInput = {
    email: string;
    fname: string;
    lname: string;
    password: string;
}

export type Role = "admin"|"user";

