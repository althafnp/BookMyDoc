import { ResetPasswordRequestDTO } from "../../dtos/auth";

export interface IResetDoctorPassword {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
} 