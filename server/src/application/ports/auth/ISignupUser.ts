import { SignupUserRequestDTO } from "../../dtos/auth/auth.dto";

export interface ISignupUser {
    execute(dto: SignupUserRequestDTO): Promise<void>;
}