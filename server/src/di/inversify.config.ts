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

import { IGoogleAuthService } from "../application/interfaces/IGoogleAuthService";
import { GoogleOAuthService } from "../infrastructure/services/google/GoogleOAuthService";


import { IAppConfig } from "../application/interfaces/IAppConfig";
import { AppConfig } from "../infrastructure/config/AppConfig";


import { ISignupUser } from "../application/ports/auth/ISignupUser";
import { SignupUserUseCase } from "../application/use-cases/auth/signup-user.usecase";

import { AuthController } from "../interface-adapters/controllers/AuthController";

import { IVerifyEmail } from "../application/ports/auth/IVerifyEmail";
import { VerifyEmailUseCase } from "../application/use-cases/auth/verify-email.usecase";

import { ILoginUser } from "../application/ports/auth/ILoginUser";
import { LoginUserUseCase } from "../application/use-cases/auth/login-user.usecase";

import { IGoogleAuth } from "../application/ports/auth/IGoogleAuth";
import { GoogleAuthUseCase } from "../application/use-cases/auth/google-auth.usecase";

import { IRefreshToken } from "../application/ports/auth/IRefreshToken";
import { RefreshTokenUseCase } from "../application/use-cases/auth/refresh-token.usecase";

import { IUserLookupService } from "../application/interfaces/IUserLookupService";
import { UserLookupService } from "../infrastructure/services/UserLookupService";

import { IDoctorRepository } from "../domain/repositories/IDoctorRepository";
import { MongoDoctorRepository } from "../infrastructure/database/mongo/repositories/MongoDoctorRepository";

import { IAdminRepository } from "../domain/repositories/IAdminRepository";
import { MongoAdminRepository } from "../infrastructure/database/mongo/repositories/MongoAdminRepository";

import { ILoginAdmin } from "../application/ports/auth/ILoginAdmin";
import { LoginAdminUseCase } from "../application/use-cases/auth/login-admin.usecase";
import { ILoginDoctor } from "../application/ports/auth/ILoginDoctor";
import { LoginDoctorUseCase } from "../application/use-cases/auth/login-doctor.usecase";





const container = new Container();

//Services
container.bind<IAuthTokenService>(TYPES.IAuthTokenService).to(JwtAuthTokenService);
container.bind<IEmailVerificationTokenService>(TYPES.IEmailVerificationTokenService).to(JwtEmailVerificationTokenService);
container.bind<IPasswordService>(TYPES.IPasswordService).to(BcryptService);
container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
container.bind<IEmailService>(TYPES.IEmailService).to(NodeMailerService);
container.bind<IGoogleAuthService>(TYPES.IGoogleAuthService).to(GoogleOAuthService);
container.bind<IAppConfig>(TYPES.IAppConfig).to(AppConfig);
container.bind<IUserLookupService>(TYPES.IUserLookupService).to(UserLookupService);



//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(MongoUserRepository);
container.bind<IDoctorRepository>(TYPES.IDoctorRepository).to(MongoDoctorRepository);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(MongoAdminRepository);




//use-cases
container.bind<ISignupUser>(TYPES.SignupUser).toDynamicValue((ctx) => {
    return new SignupUserUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.IEmailService),
        ctx.get(TYPES.IAppConfig),
        ctx.get(TYPES.ILogger),
    )
})


container.bind<IVerifyEmail>(TYPES.VerifyEmail).toDynamicValue((ctx) => {
    return new VerifyEmailUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.ILogger),
    )
});

container.bind<ILoginUser>(TYPES.LoginUser).toDynamicValue((ctx) => {
    return new LoginUserUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger),
    )
})

container.bind<IGoogleAuth>(TYPES.GoogleAuth).toDynamicValue((ctx) => {
    return new GoogleAuthUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IGoogleAuthService),
    )
})

container.bind<IRefreshToken>(TYPES.RefreshToken).toDynamicValue((ctx) => {
    return new RefreshTokenUseCase(
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IUserLookupService)
    )
});


container.bind<ILoginAdmin>(TYPES.LoginAdmin).toDynamicValue((ctx) => {
    return new LoginAdminUseCase(
        ctx.get(TYPES.IAdminRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.ILogger)
    )
})


container.bind<ILoginDoctor>(TYPES.LoginDoctor).toDynamicValue((ctx) => {
    return new LoginDoctorUseCase(
        ctx.get(TYPES.IDoctorRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger)
    )
})


//controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController)

export { container };