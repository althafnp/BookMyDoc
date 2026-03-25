import { VerifyEmailRequestDTO } from "../../dtos/auth/auth.dto";

export interface IVerifyEmail {
    execute(dto: VerifyEmailRequestDTO): Promise<void>;
}