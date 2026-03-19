import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { emailSchema, loginSchema, resetPasswordSchema, signupSchema, verifyEmailSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../validators/zod-error.validator";
import { ForgotPasswordRequestDTO, LoginAdminRequestDTO, LoginDoctorRequestDTO, LoginUserRequestDTO, ResetPasswordRequestDTO, SendVerificationEmailRequestDTO, SignupUserRequestDTO, VerifyEmailRequestDTO } from "../../application/dtos/auth";
import { IVerifyEmail } from "../../application/ports/auth/IVerifyEmail";
import { ILoginUser } from "../../application/ports/auth/ILoginUser";
import { IGoogleAuth } from "../../application/ports/auth/IGoogleAuth";
import { IRefreshToken } from "../../application/ports/auth/IRefreshToken";
import { env } from "../../infrastructure/config/env";
import { ILoginAdmin } from "../../application/ports/auth/ILoginAdmin";
import { ILoginDoctor } from "../../application/ports/auth/ILoginDoctor";
import { IForgotDoctorPassword } from "../../application/ports/auth/IForgotDoctorPassword";
import { IResetDoctorPassword } from "../../application/ports/auth/IResetDoctorPassword";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AUTH_SUCCESS } from "../../shared/constants/Messages";
import { IForgotUserPassword } from "../../application/ports/auth/IForgotUserPassword";
import { IResetUserPassword } from "../../application/ports/auth/IResetUserPassword";
import { ISendVerificationEmail } from "../../application/ports/auth/ISendVerificationEmail";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.ISignupUser)
        private _signupUserUseCase: ISignupUser,

        @inject(TYPES.IVerifyEmail)
        private _verifyEmailUseCase: IVerifyEmail,

        @inject(TYPES.ILoginUser)
        private _loginUserUseCase: ILoginUser,

        @inject(TYPES.IGoogleAuth)
        private _googleAuthUseCase: IGoogleAuth,

        @inject(TYPES.ISendVerificationEmail)
        private _sendVerificationEmailUseCase: ISendVerificationEmail,

        @inject(TYPES.IForgotUserPassword)
        private _forgotUserPasswordUseCase: IForgotUserPassword,

        @inject(TYPES.IResetUserPassword)
        private _resetUserPasswordUseCase: IResetUserPassword,

        @inject(TYPES.IRefreshToken)
        private _refreshTokenUseCase: IRefreshToken,

        @inject(TYPES.ILoginAdmin)
        private _loginAdminUseCase: ILoginAdmin,

        @inject(TYPES.ILoginDoctor)
        private _loginDoctorUseCase: ILoginDoctor,

        @inject(TYPES.IForgotDoctorPassword)
        private _forgotDoctorPasswordUseCase: IForgotDoctorPassword,

        @inject(TYPES.IResetDoctorPassword)
        private _resetDoctorPasswordUseCase: IResetDoctorPassword,
    ) { }

    signupUser = asyncHandler(async (req, res) => {
        const dto = parseWithZod<SignupUserRequestDTO>(signupSchema, req.body);

        await this._signupUserUseCase.execute(dto);

        res.status(HttpStatus.CREATED).json(ApiResponse.success(AUTH_SUCCESS.REGISTRATION_SUCCESSFUL));
    });

    verifyEmail = asyncHandler(async (req, res) => {
        const dto = parseWithZod<VerifyEmailRequestDTO>(verifyEmailSchema, req.params);
        
        await this._verifyEmailUseCase.execute(dto);
        
        res.status(HttpStatus.OK).json(ApiResponse.success(AUTH_SUCCESS.EMAIL_VERIFIED));
    });
        

    loginUser = asyncHandler(async (req, res,) => {
        const dto = parseWithZod<LoginUserRequestDTO>(loginSchema, req.body);

        const { user, accessToken, refreshToken } = await this._loginUserUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const data = {
            user,
            accessToken
        };

        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.USER_LOGGED_IN,
            data
        ));
    });


    googleAuth = asyncHandler(async (req, res) => {
        const { token } = req.body;
        
        const { user, accessToken, refreshToken } = await this._googleAuthUseCase.execute({ token });
        
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const data = {
            user,
            accessToken
        };
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.GOOGLE_LOGIN,
            data
        ));
    });

    sendVerificationEmail = asyncHandler(async (req, res) => {
        const dto = parseWithZod<SendVerificationEmailRequestDTO>(emailSchema, req.body);

        await this._sendVerificationEmailUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(AUTH_SUCCESS.VERIFICATION_EMAIL_SENT));
    })

    forgotUserPassword = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ForgotPasswordRequestDTO>(emailSchema, req.body);

        await this._forgotUserPasswordUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(AUTH_SUCCESS.PASSWORD_RESET_EMAIL_SENT))
    });

    resetUserPassword = asyncHandler(async (req, res) => {
        const parsed = parseWithZod<ResetPasswordRequestDTO>(resetPasswordSchema, {
            token: req.params.token,
            ...req.body
        });

        await this._resetUserPasswordUseCase.execute({
            token: parsed.token,
            password: parsed.password
        });

        res.status(HttpStatus.OK).json(
            ApiResponse.success(AUTH_SUCCESS.PASSWORD_RESET_SUCCESSFUL)
        );
    })


    logout = asyncHandler(async (req, res) => {
        res.clearCookie("refreshToken");
        
        res.status(HttpStatus.OK).json(ApiResponse.success(AUTH_SUCCESS.LOGGED_OUT));
    });


    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies.refreshToken;
        
        const { accessToken, user } = await this._refreshTokenUseCase.execute(token);
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.TOKEN_REFRESHED,
            { accessToken, user }
        ));
    });


    //Admin
    loginAdmin = asyncHandler(async (req, res) => {
        const dto = parseWithZod<LoginAdminRequestDTO>(loginSchema, req.body);

        const { admin, accessToken, refreshToken } = await this._loginAdminUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const data = {
            admin,
            accessToken
        };

        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.ADMIN_LOGGED_IN,
            data
        ));
    });


    //Doctor
    loginDoctor = asyncHandler(async (req, res) => {
        const dto = parseWithZod<LoginDoctorRequestDTO>(loginSchema, req.body);
        
        const { doctor, accessToken, refreshToken } = await this._loginDoctorUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const data = {
            doctor,
            accessToken
        };
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.DOCTOR_LOGGED_IN,
            data
        ));
    });


    forgotDoctorPassword = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ForgotPasswordRequestDTO>(emailSchema, req.body);
        
        await this._forgotDoctorPasswordUseCase.execute(dto);
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            AUTH_SUCCESS.PASSWORD_RESET_EMAIL_SENT,
        ));
    });

    resetDoctorPassword = asyncHandler(async (req, res) => {
        const parsed = parseWithZod<ResetPasswordRequestDTO>(resetPasswordSchema, {
            token: req.params.token,
            ...req.body
        });
        
        await this._resetDoctorPasswordUseCase.execute({
            token: parsed.token,
            password: parsed.password
        });
        
        res.status(HttpStatus.OK).json(
            ApiResponse.success(AUTH_SUCCESS.PASSWORD_RESET_SUCCESSFUL)
        );
    });

}