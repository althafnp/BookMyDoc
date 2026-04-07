export const TYPES = {
    //services
    IAuthTokenService: Symbol.for("IAuthTokenService"),
    IEmailVerificationTokenService: Symbol.for("IEmailVerificationTokenService"),
    IPasswordService: Symbol.for("IPasswordService"),
    ILogger: Symbol.for("ILogger"),
    IEmailService: Symbol.for("IEmailService"),
    IGoogleAuthService: Symbol.for("IGoogleAuthService"),
    IAppConfig: Symbol.for("IAppConfig"),
    IUserLookupService: Symbol.for("IUserLookupService"),
    IPasswordTokenService: Symbol.for("IPasswordTokenService"),
    IFileStorageService: Symbol.for("IFileStorageService"),

    //repositories
    IUserRepository: Symbol.for("IUserRepository"),
    IDoctorRepository: Symbol.for("IDoctorRepository"),
    IAdminRepository: Symbol.for("IAdminRepository"),
    IWalletRepository: Symbol.for("IWalletRepository"),
    ICategoryRepository: Symbol.for("ICategoryRepository"),
    IDoctorAvailabilityRepository: Symbol.for("IDoctorAvailabilityRepository"),


    // USER USECASES.
    // auth
    ISignupUserUseCase: Symbol.for("ISignupUserUseCase"),
    IVerifyEmailUseCase: Symbol.for("IVerifyEmailUseCase"),
    ILoginUserUseCase: Symbol.for("ILoginUserUseCase"),
    IGoogleAuthUseCase: Symbol.for("IGoogleAuthUseCase"),
    ISendVerificationEmailUseCase: Symbol.for("ISendVerificationEmailUseCase"),
    IForgotUserPasswordUseCase: Symbol.for("IForgotUserPasswordUseCase"),
    IResetUserPasswordUseCase: Symbol.for("IResetUserPasswordUseCase"),


    IRefreshTokenUseCase: Symbol.for("IRefreshTokenUseCase"),

    // ADMIN USECASES
    // auth
    ILoginAdminUseCase: Symbol.for("ILoginAdminUseCase"),

    // category
    ICreateCategoryUseCase: Symbol.for("ICreateCategoryUseCase"),
    IGetAllCategoriesUseCase: Symbol.for("IGetAllCategoriesUseCase"),
    IUpdateCategoryUseCase: Symbol.for("IUpdateCategoryUseCase"),
    IToggleCategoryStatusUseCase: Symbol.for("IToggleCategoryStatusUseCase"),

    // doctor
    ICreateDoctorUseCase: Symbol.for("ICreateDoctorUseCase"),
    IGetAllDoctorsUseCase: Symbol.for("IGetAllDoctorsUseCase"),
    IUpdateDoctorUseCase: Symbol.for("IUpdateDoctorUseCase"),
    IToggleDoctorStatusUseCase: Symbol.for("IToggleDoctorStatusUseCase"),

    //user
    IGetAllUsersUseCase: Symbol.for("IGetAllUsersUseCase"),
    IToggleUserStatusUseCase: Symbol.for("IToggleUserStatusUseCase"),


    // DOCTOR USECASES
    // auth
    ILoginDoctorUseCase: Symbol.for("ILoginDoctor"),
    IForgotDoctorPasswordUseCase: Symbol.for("IForgotDoctorPasswordUseCase"),
    IResetDoctorPasswordUseCase: Symbol.for("IResetDoctorPasswordUseCase"),       
};