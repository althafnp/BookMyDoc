import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IForgotUserPasswordUseCase {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}