import { SignupUserRequestDTO } from "../../dtos/auth/auth.dto";

export interface ISignupUserUseCase {
    execute(dto: SignupUserRequestDTO): Promise<void>;
}