import { User } from "../entities/User";
import { Status } from "../enums/Auth";

export interface UserFindAllOptions {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: Status;
    search?: string
}

export interface UserFindAllResult {
    users: User[];
    total: number;
}

export interface IUserRepository {
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<User | null>;
    findAll(options: UserFindAllOptions): Promise<UserFindAllResult>
}