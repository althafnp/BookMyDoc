import { SendVerificationEmailRequestDTO } from "../../dtos/auth/auth.dto";

export interface ISendVerificationEmailUseCase {
    execute(dto: SendVerificationEmailRequestDTO): Promise<void>
}