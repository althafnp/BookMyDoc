import { VerifyEmailRequestDTO } from "../../dtos/auth/auth.dto";

export interface IVerifyEmailUseCase {
    execute(dto: VerifyEmailRequestDTO): Promise<void>;
}