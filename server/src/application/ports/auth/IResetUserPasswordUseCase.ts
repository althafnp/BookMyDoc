import { ResetPasswordRequestDTO } from "../../dtos/auth/auth.dto";

export interface IResetUserPasswordUseCase {
    execute(dto: ResetPasswordRequestDTO): Promise<void>;
}