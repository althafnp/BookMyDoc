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

    //repositories
    IUserRepository: Symbol.for("IUserRepository"),
    IDoctorRepository: Symbol.for("IDoctorRepository"),
    IAdminRepository: Symbol.for("IAdminRepository"),


    //use-cases
    SignupUser: Symbol.for("SignupUser"),
    VerifyEmail: Symbol.for("VerifyEmail"),
    LoginUser: Symbol.for("LoginUser"),
    GoogleAuth: Symbol.for("GoogleAuth"),
    RefreshToken: Symbol.for("RefreshToken"),

    LoginAdmin: Symbol.for("LoginAdmin"),


    //controllers
    AuthController: Symbol.for("AuthController"),
}