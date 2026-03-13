import { VerifyEmailRequestDTO } from "../../dtos/auth";

export interface IVerifyEmail {
    execute(dto: VerifyEmailRequestDTO): Promise<void>;
}