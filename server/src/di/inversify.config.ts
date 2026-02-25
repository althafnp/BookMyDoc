import { Container } from "inversify";
import { TYPES } from "./types";

import { IAuthTokenService } from "../application/interfaces/IAuthTokenService";
import { JwtAuthTokenService } from "../infrastructure/services/jwt/JwtAuthTokenService";

import { IEmailVerificationTokenService } from "../application/interfaces/IEmailVerificationTokenService";
import { JwtEmailVerificationTokenService } from "../infrastructure/services/jwt/JwtEmailVerificationTokenService";

import { IPasswordService } from "../application/interfaces/IPasswordService";
import { BcryptService } from "../infrastructure/services/password/BcryptService";

import { ILogger } from "../application/interfaces/ILogger";
import { WinstonLogger } from "../infrastructure/services/logger/WinstonLogger";

import { IUserRepository } from "../domain/repositories/IUserRepository";
import { MongoUserRepository } from "../infrastructure/database/mongo/repositories/MongoUserRepository";

import { IEmailService } from "../application/interfaces/IEmailService";
import { NodeMailerService } from "../infrastructure/services/email/NodeMailerService";

import { ISignupUser } from "../application/ports/auth/ISignupUser";
import { SignupUserUseCase } from "../application/use-cases/auth/signup-user.usecase";

import { AuthController } from "../interface-adapters/controllers/AuthController";

import { IVerifyEmail } from "../application/ports/auth/IVerifyEmail";
import { VerifyEmailUseCase } from "../application/use-cases/auth/verify-email.usecase";



const container = new Container();

//Services
container.bind<IAuthTokenService>(TYPES.IAuthTokenService).to(JwtAuthTokenService);
container.bind<IEmailVerificationTokenService>(TYPES.IEmailVerificationTokenService).to(JwtEmailVerificationTokenService);
container.bind<IPasswordService>(TYPES.IPasswordService).to(BcryptService);
container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
container.bind<IEmailService>(TYPES.IEmailService).to(NodeMailerService);



//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(MongoUserRepository);



//use-cases
container.bind<ISignupUser>(TYPES.SignupUser).toDynamicValue((ctx) => {
    return new SignupUserUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.IEmailService),
        ctx.get(TYPES.ILogger),
    )
})


container.bind<IVerifyEmail>(TYPES.VerifyEmail).toDynamicValue((ctx) => {
    return new VerifyEmailUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.ILogger),
    )
})



//controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

export { container };