import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IResetDoctorPasswordUseCase {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
} 