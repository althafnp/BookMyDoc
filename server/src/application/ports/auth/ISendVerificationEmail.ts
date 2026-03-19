import { SendVerificationEmailRequestDTO } from "../../dtos/auth";

export interface ISendVerificationEmail {
    execute(dto: SendVerificationEmailRequestDTO): Promise<void>
}