export type Role = "USER" | "DOCTOR" | "ADMIN";


export interface AuthUser {
    id: string,
    role: Role
}