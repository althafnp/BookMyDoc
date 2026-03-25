import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IResetDoctorPassword {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
} 