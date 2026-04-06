import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IForgotDoctorPasswordUseCase {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}