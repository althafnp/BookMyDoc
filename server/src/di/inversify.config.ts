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


import { ISignupUserUseCase } from "../application/ports/auth/ISignupUserUseCase";
import { SignupUserUseCase } from "../application/use-cases/auth/signup-user.usecase";

import { AuthController } from "../interface-adapters/controllers/AuthController";

import { IVerifyEmailUseCase } from "../application/ports/auth/IVerifyEmailUseCase";
import { VerifyEmailUseCase } from "../application/use-cases/auth/verify-email.usecase";

import { ILoginUserUseCase } from "../application/ports/auth/ILoginUserUseCase";
import { LoginUserUseCase } from "../application/use-cases/auth/login-user.usecase";

import { IGoogleAuthUseCase } from "../application/ports/auth/IGoogleAuthUseCase";
import { GoogleAuthUseCase } from "../application/use-cases/auth/google-auth.usecase";

import { IRefreshTokenUseCase } from "../application/ports/auth/IRefreshTokenUseCase";
import { RefreshTokenUseCase } from "../application/use-cases/auth/refresh-token.usecase";

import { IUserLookupService } from "../application/interfaces/IUserLookupService";
import { UserLookupService } from "../infrastructure/services/UserLookupService";

import { IDoctorRepository } from "../domain/repositories/IDoctorRepository";
import { MongoDoctorRepository } from "../infrastructure/database/mongo/repositories/MongoDoctorRepository";

import { IAdminRepository } from "../domain/repositories/IAdminRepository";
import { MongoAdminRepository } from "../infrastructure/database/mongo/repositories/MongoAdminRepository";

import { ILoginAdminUseCase } from "../application/ports/auth/ILoginAdminUseCase";
import { LoginAdminUseCase } from "../application/use-cases/auth/login-admin.usecase";

import { ILoginDoctorUseCase } from "../application/ports/auth/ILoginDoctorUseCase";
import { LoginDoctorUseCase } from "../application/use-cases/auth/login-doctor.usecase";

import { IPasswordTokenService } from "../application/interfaces/IPasswordTokenService";
import { JwtPasswordTokenService } from "../infrastructure/services/jwt/JwtPasswordTokenService";

import { IForgotDoctorPasswordUseCase } from "../application/ports/auth/IForgotDoctorPasswordUseCase";
import { ForgotDoctorPasswordUseCase } from "../application/use-cases/auth/forgot-doctor-password.usecase";

import { IResetDoctorPasswordUseCase } from "../application/ports/auth/IResetDoctorPasswordUseCase";
import { ResetDoctorPasswordUseCase } from "../application/use-cases/auth/reset-doctor-password.usecase";

import { IWalletRepository } from "../domain/repositories/IWalletRepository";
import { MongoWalletRepository } from "../infrastructure/database/mongo/repositories/MongoWalletRepository";

import { IForgotUserPasswordUseCase } from "../application/ports/auth/IForgotUserPasswordUseCase";
import { ForgotUserPasswordUseCase } from "../application/use-cases/auth/forgot-user-password-usecase";

import { IResetUserPasswordUseCase } from "../application/ports/auth/IResetUserPasswordUseCase";
import { ResetUserPasswordUseCase } from "../application/use-cases/auth/reset-user-password.usecase";

import { ISendVerificationEmailUseCase } from "../application/ports/auth/ISendVerificationEmailUseCase";
import { SendVerificationEmailUseCase } from "../application/use-cases/auth/send-verification-email.usecase";

import { ICategoryRepository } from "../domain/repositories/ICategoryRepository";
import { MongoCategoryRepository } from "../infrastructure/database/mongo/repositories/MongoCategoryRepository";

import { ICreateCategoryUseCase } from "../application/ports/admin/category/ICreateCategoryUseCase";
import { CreateCategoryUseCase } from "../application/use-cases/admin/category/create-category.usecase";

import { IGetAllCategoriesUseCase } from "../application/ports/admin/category/IGetAllCategoriesUseCase";
import { GetAllCategoriesUseCase } from "../application/use-cases/admin/category/get-all-categories.usecase";

import { IUpdateCategoryUseCase } from "../application/ports/admin/category/IUpdateCategoryUseCase";
import { UpdateCategoryUseCase } from "../application/use-cases/admin/category/update-category.usecase";

import { IToggleCategoryStatusUseCase } from "../application/ports/admin/category/IToggleCategoryStatusUseCase";
import { ToggleCategoryStatusUseCase } from "../application/use-cases/admin/category/toggle-category-status.usecase";

import { CategoryController } from "../interface-adapters/controllers/CategoryController";

import { IFileStorageService } from "../application/interfaces/IFileStorageService";
import { S3FileStorageService } from "../infrastructure/services/storage/S3FileStorageService";

import { IDoctorAvailabilityRepository } from "../domain/repositories/IDoctorAvailabiltyRepository";
import { MongoDoctorAvailbilityRepository } from "../infrastructure/database/mongo/repositories/MongoDoctorAvailabilityRepository";

import { ICreateDoctorUseCase } from "../application/ports/admin/doctor/ICreateDoctorUseCase";
import { CreateDoctorUseCase } from "../application/use-cases/admin/doctor/create-doctor.usecase";

import { DoctorController } from "../interface-adapters/controllers/DoctorController";

import { IUpdateDoctorUseCase } from "../application/ports/admin/doctor/IUpdateDoctorUseCase";
import { UpdateDoctorUseCase } from "../application/use-cases/admin/doctor/update-doctor.usecase";

import { IToggleDoctorStatusUseCase } from "../application/ports/admin/doctor/IToggleDoctorStatusUseCase";
import { ToggleDoctorStatusUseCase } from "../application/use-cases/admin/doctor/toggle-doctor-status.usecase";

import { IGetAllDoctorsUseCase } from "../application/ports/admin/doctor/IGetAllDoctorsUseCase";
import { GetAllDoctorsUseCase } from "../application/use-cases/admin/doctor/get-all-doctors.usecase";

import { IGetAllUsersUseCase } from "../application/ports/admin/user/IGetAllUsersUseCase";
import { GetAllUsersUseCase } from "../application/use-cases/admin/user/get-all-users.usecase";

import { UserController } from "../interface-adapters/controllers/UserController";

import { IToggleUserStatusUseCase } from "../application/ports/admin/user/IToggleUserStatusUseCase";
import { ToggleUserStatusUseCase } from "../application/use-cases/admin/user/toggle-user-status.usecase";



const container = new Container();

//services
container.bind<IAuthTokenService>(TYPES.IAuthTokenService).to(JwtAuthTokenService);
container.bind<IEmailVerificationTokenService>(TYPES.IEmailVerificationTokenService).to(JwtEmailVerificationTokenService);
container.bind<IPasswordService>(TYPES.IPasswordService).to(BcryptService);
container.bind<ILogger>(TYPES.ILogger).to(WinstonLogger);
container.bind<IEmailService>(TYPES.IEmailService).to(NodeMailerService);
container.bind<IGoogleAuthService>(TYPES.IGoogleAuthService).to(GoogleOAuthService);
container.bind<IAppConfig>(TYPES.IAppConfig).to(AppConfig);
container.bind<IUserLookupService>(TYPES.IUserLookupService).to(UserLookupService);
container.bind<IPasswordTokenService>(TYPES.IPasswordTokenService).to(JwtPasswordTokenService);
container.bind<IFileStorageService>(TYPES.IFileStorageService).to(S3FileStorageService);



//repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(MongoUserRepository);
container.bind<IDoctorRepository>(TYPES.IDoctorRepository).to(MongoDoctorRepository);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(MongoAdminRepository);
container.bind<IWalletRepository>(TYPES.IWalletRepository).to(MongoWalletRepository);
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(MongoCategoryRepository);
container.bind<IDoctorAvailabilityRepository>(TYPES.IDoctorAvailabilityRepository).to(MongoDoctorAvailbilityRepository);




//use-cases
//auth
container.bind<ISignupUserUseCase>(TYPES.ISignupUserUseCase).to(SignupUserUseCase);
container.bind<IVerifyEmailUseCase>(TYPES.IVerifyEmailUseCase).to(VerifyEmailUseCase);
container.bind<ILoginUserUseCase>(TYPES.ILoginUserUseCase).to(LoginUserUseCase);
container.bind<IGoogleAuthUseCase>(TYPES.IGoogleAuthUseCase).to(GoogleAuthUseCase);
container.bind<ISendVerificationEmailUseCase>(TYPES.ISendVerificationEmailUseCase).to(SendVerificationEmailUseCase);
container.bind<IForgotUserPasswordUseCase>(TYPES.IForgotUserPasswordUseCase).to(ForgotUserPasswordUseCase);
container.bind<IResetUserPasswordUseCase>(TYPES.IResetUserPasswordUseCase).to(ResetUserPasswordUseCase);
container.bind<IRefreshTokenUseCase>(TYPES.IRefreshTokenUseCase).to(RefreshTokenUseCase);

container.bind<ILoginAdminUseCase>(TYPES.ILoginAdminUseCase).to(LoginAdminUseCase);

container.bind<ILoginDoctorUseCase>(TYPES.ILoginDoctorUseCase).to(LoginDoctorUseCase);
container.bind<IForgotDoctorPasswordUseCase>(TYPES.IForgotDoctorPasswordUseCase).to(ForgotDoctorPasswordUseCase);
container.bind<IResetDoctorPasswordUseCase>(TYPES.IResetDoctorPasswordUseCase).to(ResetDoctorPasswordUseCase);


//Admin
//category-management
container.bind<ICreateCategoryUseCase>(TYPES.ICreateCategoryUseCase).to(CreateCategoryUseCase);
container.bind<IGetAllCategoriesUseCase>(TYPES.IGetAllCategoriesUseCase).to(GetAllCategoriesUseCase);
container.bind<IUpdateCategoryUseCase>(TYPES.IUpdateCategoryUseCase).to(UpdateCategoryUseCase);
container.bind<IToggleCategoryStatusUseCase>(TYPES.IToggleCategoryStatusUseCase).to(ToggleCategoryStatusUseCase);

//doctor-management
container.bind<ICreateDoctorUseCase>(TYPES.ICreateDoctorUseCase).to(CreateDoctorUseCase);
container.bind<IGetAllDoctorsUseCase>(TYPES.IGetAllDoctorsUseCase).to(GetAllDoctorsUseCase);
container.bind<IUpdateDoctorUseCase>(TYPES.IUpdateDoctorUseCase).to(UpdateDoctorUseCase);
container.bind<IToggleDoctorStatusUseCase>(TYPES.IToggleDoctorStatusUseCase).to(ToggleDoctorStatusUseCase);

//user-management
container.bind<IGetAllUsersUseCase>(TYPES.IGetAllUsersUseCase).to(GetAllUsersUseCase);
container.bind<IToggleUserStatusUseCase>(TYPES.IToggleUserStatusUseCase).to(ToggleUserStatusUseCase);



//controllers
container.bind(AuthController).toSelf();
container.bind(CategoryController).toSelf();
container.bind(DoctorController).toSelf();
container.bind(UserController).toSelf()

export { container };