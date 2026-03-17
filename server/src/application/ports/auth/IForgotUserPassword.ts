import { ForgotPasswordRequestDTO } from "../../dtos/auth";

export interface IForgotUserPassword {
    execute(dto: ForgotPasswordRequestDTO): Promise<void>
}