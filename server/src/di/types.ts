export const TYPES = {
    //services
    IAuthTokenService: Symbol.for("IAuthTokenService"),
    IEmailVerificationTokenService: Symbol.for("IEmailVerificationTokenService"),
    IPasswordService: Symbol.for("IPasswordService"),
    ILogger: Symbol.for("ILogger"),
    IEmailService: Symbol.for("IEmailService"),
    IGoogleAuthService: Symbol.for("IGoogleAuthService"),

    //repositories
    IUserRepository: Symbol.for("IUserRepository"),


    //use-cases
    SignupUser: Symbol.for("SignupUser"),
    VerifyEmail: Symbol.for("VerifyEmail"),
    LoginUser: Symbol.for("LoginUser"),
    GoogleAuth: Symbol.for("GoogleAuth"),


    //controllers
    AuthController: Symbol.for("AuthController"),
}