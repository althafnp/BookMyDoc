import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IResetUserPassword {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
}