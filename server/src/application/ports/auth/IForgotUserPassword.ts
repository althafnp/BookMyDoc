import { ForgotPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IForgotUserPassword {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}