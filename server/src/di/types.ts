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

    //repositories
    IUserRepository: Symbol.for("IUserRepository"),
    IDoctorRepository: Symbol.for("IDoctorRepository"),
    IAdminRepository: Symbol.for("IAdminRepository"),
    IWalletRepository: Symbol.for("IWalletRepository"),


    //use-cases
    ISignupUser: Symbol.for("ISignupUser"),
    IVerifyEmail: Symbol.for("IVerifyEmail"),
    ILoginUser: Symbol.for("ILoginUser"),
    IGoogleAuth: Symbol.for("IGoogleAuth"),
    IRefreshToken: Symbol.for("IRefreshToken"),

    ILoginAdmin: Symbol.for("ILoginAdmin"),

    ILoginDoctor: Symbol.for("ILoginDoctor"),
    IForgotDoctorPassword: Symbol.for("IForgotDoctorPassword"),
    IResetDoctorPassword: Symbol.for("IResetDoctorPassword"),
};