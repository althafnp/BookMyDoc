import { Doctor } from "../entities/Doctor";
import { Status } from "../enums/Auth";

export interface DoctorFindAllOptions {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: Status;
    categoryId?: string;
    search?: string;
};

export interface DoctorFindAllResult {
    doctors: Doctor[];
    total: number;
}

export interface IDoctorRepository {
    create(doctor: Doctor): Promise<Doctor>
    findById(id: string): Promise<Doctor | null>;
    findByEmail(email: string): Promise<Doctor | null>;
    update(doctor: Doctor): Promise<Doctor | null>;
    findAll(options: DoctorFindAllOptions): Promise<DoctorFindAllResult>;
}