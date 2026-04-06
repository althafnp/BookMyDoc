import { DoctorAvailability } from "../entities/DoctorAvailability";

export interface IDoctorAvailabilityRepository {
    create(availability: DoctorAvailability): Promise<DoctorAvailability>;
    findByDoctorId(doctorId: string): Promise<DoctorAvailability | null>;
    findByDoctorIds(doctorIds: string[]): Promise<DoctorAvailability[]>
    update(availability: DoctorAvailability): Promise<DoctorAvailability | null>;
}