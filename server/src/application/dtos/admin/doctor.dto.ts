import { Status } from "../../../domain/enums/Auth";
import { PaginatedResponseDTO, PaginationRequestDTO } from "../shared/pagination.dto";

export interface DoctorAvailabilityDTO {
    startTime: string;
    endTime: string;
    slotDuration: number;
    workingDays: number[]
}

export interface ProfileImageDTO {
    buffer: Buffer;
    mimetype: string;
}

export interface CreateDoctorRequestDTO {
    name: string;
    email: string;
    password: string;
    categoryId: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    profileImage: ProfileImageDTO
    availability: DoctorAvailabilityDTO
}

export interface CreateDoctorResponseDTO {
    id: string;
    name: string;
    email: string;
    categoryId: string;
    profileImage: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    status: Status;
    availability: DoctorAvailabilityDTO & { id: string };
}


// ── Get All (List) ──
export interface GetAllDoctorsRequestDTO extends PaginationRequestDTO {
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: Status;
    categoryId?: string;
    search?: string;
}

export interface DoctorItemDTO {
    id: string;
    name: string;
    email: string;
    categoryId: string;
    profileImage: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    status: Status;
    availability?: DoctorAvailabilityDTO | null;
}

export type GetAllDoctorsResponseDTO = PaginatedResponseDTO<DoctorItemDTO>;



// ── Update Doctor ──
export interface UpdateDoctorRequestDTO {
    id: string;
    name: string;
    email: string;
    categoryId: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    profileImage?: ProfileImageDTO;
    availability: DoctorAvailabilityDTO;
}

export interface UpdateDoctorResponseDTO {
    id: string;
    name: string;
    email: string;
    categoryId: string;
    profileImage: string;
    qualification: string;
    experience: string;
    consultationFee: number;
    status: Status;
    availability: DoctorAvailabilityDTO & { id: string };
}


export interface ToggleDoctorStatusRequestDTO {
    id: string
};

export interface ToggleDoctorStatusResponseDTO {
    id: string;
    name: string;
    email: string;
    status: Status
}