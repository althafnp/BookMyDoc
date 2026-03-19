import { ForgotPasswordRequestDTO } from "../../dtos/auth";

export interface IForgotDoctorPassword {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}