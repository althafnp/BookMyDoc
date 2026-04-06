import { Doctor } from "../../../domain/entities/Doctor";
import { LoginDoctorResponseDTO } from "../../dtos/auth/auth.dto";

export class DoctorResponseMapper {
    static toDTO(doctor: Doctor): LoginDoctorResponseDTO["doctor"] {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: doctor.role,
            profileImage: doctor.profileImage,
        };
    }
}