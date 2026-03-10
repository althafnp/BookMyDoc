import { Doctor } from "../../domain/entities/Doctor";
import { LoginDoctorResponseDTO, LoginUserResponseDTO } from "../dtos/auth";

export class DoctorResponseMapper {
    static toDTO(doctor: Doctor): LoginDoctorResponseDTO["doctor"] {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            role: doctor.role,
            profileImage: doctor.profileImage,
        }
    }
}