import { CreateDoctorRequestDTO, CreateDoctorResponseDTO } from "../../../dtos/admin/doctor.dto";

export interface ICreateDoctorUseCase {
    execute(dto: CreateDoctorRequestDTO): Promise<CreateDoctorResponseDTO>;
}