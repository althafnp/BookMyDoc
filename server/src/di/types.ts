export const TYPES = {
    //services
    IAuthTokenService: Symbol.for("IAuthTokenService"),
    IEmailVerificationTokenService: Symbol.for("IEmailVerificationTokenService"),
    IPasswordService: Symbol.for("IPasswordService"),
    ILogger: Symbol.for("ILogger"),
    IEmailService: Symbol.for("IEmailService"),

    //repositories
    IUserRepository: Symbol.for("IUserRepository"),


    //use-cases
    SignupUser: Symbol.for("SignupUser"),
    VerifyEmail: Symbol.for("VerifyEmail"),


    //controllers
    AuthController: Symbol.for("AuthController"),
}