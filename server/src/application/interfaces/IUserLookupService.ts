import { Role } from "../../domain/enums/Auth";

export interface UserInfo {
    id: string;
    name?: string;
    email: string;
    role: Role;
    profileImage?: string | null;
}

export interface IUserLookupService {
    findByIdAndRole(id: string, role: Role): Promise<UserInfo | null>;
}