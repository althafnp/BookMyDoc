import { SendVerificationEmailRequestDTO } from "../../dtos/auth/auth.dto";

export interface ISendVerificationEmail {
    execute(dto: SendVerificationEmailRequestDTO): Promise<void>
}