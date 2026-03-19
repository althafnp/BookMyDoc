import { ResetPasswordRequestDTO } from "../../dtos/auth";

export interface IResetUserPassword {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
}