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

import { IPasswordTokenService } from "../application/interfaces/IPasswordTokenService";
import { JwtPasswordTokenService } from "../infrastructure/services/jwt/JwtPasswordTokenService";

import { IForgotDoctorPassword } from "../application/ports/auth/IForgotDoctorPassword";
import { ForgotDoctorPasswordUseCase } from "../application/use-cases/auth/forgot-doctor-password.usecase";

import { IResetDoctorPassword } from "../application/ports/auth/IResetDoctorPassword";
import { ResetDoctorPasswordUseCase } from "../application/use-cases/auth/reset-doctor-password.usecase";

import { IWalletRepository } from "../domain/repositories/IWalletRepository";
import { MongoWalletRepository } from "../infrastructure/database/mongo/repositories/MongoWalletRepository";

import { IForgotUserPassword } from "../application/ports/auth/IForgotUserPassword";
import { ForgotUserPasswordUseCase } from "../application/use-cases/auth/forgot-user-password-usecase";

import { IResetUserPassword } from "../application/ports/auth/IResetUserPassword";
import { ResetUserPasswordUseCase } from "../application/use-cases/auth/reset-user-password.usecase";

import { ISendVerificationEmail } from "../application/ports/auth/ISendVerificationEmail";
import { SendVerificationEmailUseCase } from "../application/use-cases/auth/send-verification-email.usecase";
import { ICategoryRepository } from "../domain/repositories/ICategoryRepository";
import { MongoCategoryRepository } from "../infrastructure/database/mongo/repositories/MongoCategoryRepository";
import { ICreateCategory } from "../application/ports/admin/category/ICreateCategory";
import { CreateCategoryUseCase } from "../application/use-cases/admin/category/create-category.usecase";
import { IGetAllCategories } from "../application/ports/admin/category/IGetAllCategories";
import { GetAllCategoriesUseCase } from "../application/use-cases/admin/category/get-all-categories.usecase";
import { IUpdateCategory } from "../application/ports/admin/category/IUpdateCategory";
import { UpdateCategoryUseCase } from "../application/use-cases/admin/category/update-category.usecase";
import { IToggleCategoryStatus } from "../application/ports/admin/category/IToggleCategoryStatus";
import { ToggleCategoryStatusUseCase } from "../application/use-cases/admin/category/toggle-category-status.usecase";
import { CategoryController } from "../interface-adapters/controllers/CategoryController";





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
container.bind<IPasswordTokenService>(TYPES.IPasswordTokenService).to(JwtPasswordTokenService);



//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(MongoUserRepository);
container.bind<IDoctorRepository>(TYPES.IDoctorRepository).to(MongoDoctorRepository);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(MongoAdminRepository);
container.bind<IWalletRepository>(TYPES.IWalletRepository).to(MongoWalletRepository);
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(MongoCategoryRepository);




//use-cases
container.bind<ISignupUser>(TYPES.ISignupUser).toDynamicValue((ctx) => {
    return new SignupUserUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.IWalletRepository),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.IEmailService),
        ctx.get(TYPES.IAppConfig),
        ctx.get(TYPES.ILogger),
    );
});


container.bind<IVerifyEmail>(TYPES.IVerifyEmail).toDynamicValue((ctx) => {
    return new VerifyEmailUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.ILogger),
    );
});

container.bind<ILoginUser>(TYPES.ILoginUser).toDynamicValue((ctx) => {
    return new LoginUserUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger),
    );
});

container.bind<IGoogleAuth>(TYPES.IGoogleAuth).toDynamicValue((ctx) => {
    return new GoogleAuthUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IWalletRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IGoogleAuthService),
        ctx.get(TYPES.ILogger)
    );
});

container.bind<ISendVerificationEmail>(TYPES.ISendVerificationEmail).toDynamicValue((ctx) => {
    return new SendVerificationEmailUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IEmailVerificationTokenService),
        ctx.get(TYPES.IEmailService),
        ctx.get(TYPES.IAppConfig)
    )
});

container.bind<IForgotUserPassword>(TYPES.IForgotUserPassword).toDynamicValue((ctx) => {
    return new ForgotUserPasswordUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IPasswordTokenService),
        ctx.get(TYPES.IAppConfig),
        ctx.get(TYPES.IEmailService)
    )
});

container.bind<IResetUserPassword>(TYPES.IResetUserPassword).toDynamicValue((ctx) => {
    return new ResetUserPasswordUseCase(
        ctx.get(TYPES.IUserRepository),
        ctx.get(TYPES.IPasswordTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger)
    );
});

container.bind<IRefreshToken>(TYPES.IRefreshToken).toDynamicValue((ctx) => {
    return new RefreshTokenUseCase(
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IUserLookupService)
    );
});


container.bind<ILoginAdmin>(TYPES.ILoginAdmin).toDynamicValue((ctx) => {
    return new LoginAdminUseCase(
        ctx.get(TYPES.IAdminRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.ILogger)
    );
});


container.bind<ILoginDoctor>(TYPES.ILoginDoctor).toDynamicValue((ctx) => {
    return new LoginDoctorUseCase(
        ctx.get(TYPES.IDoctorRepository),
        ctx.get(TYPES.IAuthTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger)
    );
});

container.bind<IForgotDoctorPassword>(TYPES.IForgotDoctorPassword).toDynamicValue((ctx) => {
    return new ForgotDoctorPasswordUseCase(
        ctx.get(TYPES.IDoctorRepository),
        ctx.get(TYPES.IPasswordTokenService),
        ctx.get(TYPES.IAppConfig),
        ctx.get(TYPES.IEmailService)
    );
});

container.bind<IResetDoctorPassword>(TYPES.IResetDoctorPassword).toDynamicValue((ctx) => {
    return new ResetDoctorPasswordUseCase(
        ctx.get(TYPES.IDoctorRepository),
        ctx.get(TYPES.IPasswordTokenService),
        ctx.get(TYPES.IPasswordService),
        ctx.get(TYPES.ILogger)
    );
});



container.bind<ICreateCategory>(TYPES.ICreateCategory).toDynamicValue((ctx) => {
    return new CreateCategoryUseCase(
        ctx.get(TYPES.ICategoryRepository),
        ctx.get(TYPES.ILogger)
    )
});

container.bind<IGetAllCategories>(TYPES.IGetAllCategories).toDynamicValue((ctx) => {
    return new GetAllCategoriesUseCase(
        ctx.get(TYPES.ICategoryRepository)
    );
});

container.bind<IUpdateCategory>(TYPES.IUpdateCategory).toDynamicValue((ctx) => {
    return new UpdateCategoryUseCase(
        ctx.get(TYPES.ICategoryRepository),
        ctx.get(TYPES.ILogger)
    );
});

container.bind<IToggleCategoryStatus>(TYPES.IToggleCategoryStatus).toDynamicValue((ctx) => {
    return new ToggleCategoryStatusUseCase(
        ctx.get(TYPES.ICategoryRepository),
        ctx.get(TYPES.ILogger)
    );
});



//controllers
container.bind(AuthController).toSelf();
container.bind(CategoryController).toSelf();

export { container };