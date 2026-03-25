import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IForgotDoctorPassword {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}