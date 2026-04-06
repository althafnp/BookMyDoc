import { ToggleDoctorStatusRequestDTO, ToggleDoctorStatusResponseDTO } from "../../../dtos/admin/doctor.dto";

export interface IToggleDoctorStatusUseCase {
    execute(dto: ToggleDoctorStatusRequestDTO): Promise<ToggleDoctorStatusResponseDTO>;
}