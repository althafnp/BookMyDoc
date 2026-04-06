import { UpdateDoctorRequestDTO, UpdateDoctorResponseDTO } from "../../../dtos/admin/doctor.dto";

export interface IUpdateDoctorUseCase {
    execute(dto: UpdateDoctorRequestDTO): Promise<UpdateDoctorResponseDTO>
}
