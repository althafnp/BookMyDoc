import { Doctor } from "../../../domain/entities/Doctor";
import { DoctorAvailability } from "../../../domain/entities/DoctorAvailability";
import { CreateDoctorResponseDTO, DoctorItemDTO, GetAllDoctorsResponseDTO, ToggleDoctorStatusResponseDTO } from "../../dtos/admin/doctor.dto";

export class DoctorResponseMapper {
    static toCreateDTO(doctor: Doctor, availability: DoctorAvailability): CreateDoctorResponseDTO {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            categoryId: doctor.categoryId,
            profileImage: doctor.profileImage,
            qualification: doctor.qualification,
            experience: doctor.experience,
            consultationFee: doctor.consultationFee,
            status: doctor.status,
            availability: {
                id: availability.id,
                startTime: availability.startTime,
                endTime: availability.endTime,
                slotDuration: availability.slotDuration,
                workingDays: availability.workingDays,
            }
        };
    }

    static toToggleDTO(doctor: Doctor): ToggleDoctorStatusResponseDTO {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            status: doctor.status
        };
    }

    static  toListDTO(doctor: Doctor, availability?: DoctorAvailability | null): DoctorItemDTO {
        return {
            id: doctor.id,
            name: doctor.name,
            email: doctor.email,
            categoryId: doctor.categoryId,
            consultationFee: doctor.consultationFee,
            profileImage: doctor.profileImage,
            experience: doctor.experience,
            qualification: doctor.qualification,
            status: doctor.status,
            availability: availability
                ? {
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                    slotDuration: availability.slotDuration,
                    workingDays: availability.workingDays
                }
                : null
        }
    }
}