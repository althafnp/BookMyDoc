import { Doctor } from "../entities/Doctor";

export interface IDoctorRepository {
    findById(id: string): Promise<Doctor | null>;
    findByEmail(email: string): Promise<Doctor | null>;
    update(doctor: Doctor): Promise<Doctor | null>;
}