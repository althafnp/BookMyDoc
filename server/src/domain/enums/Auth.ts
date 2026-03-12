export type Role = "USER" | "DOCTOR" | "ADMIN";


export interface AuthUser {
    id: string,
    role: Role
}

export type AuthProvider = "LOCAL" | "GOOGLE";

export type UserRole = "USER";

export type DoctorRole = "DOCTOR";

export type AdminRole = "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED";

export type DoctorStatus = "ACTIVE" | "BLOCKED";