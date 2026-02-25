import { SignupUserRequestDTO } from "../../dtos/auth";

export interface ISignupUser {
    execute(dto: SignupUserRequestDTO): Promise<void>;
}