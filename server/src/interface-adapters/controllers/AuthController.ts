import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUserUseCase } from "../../application/ports/auth/ISignupUserUseCase";
import { emailSchema, loginSchema, resetPasswordSchema, signupSchema, verifyEmailSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../validators/zod-error.validator";
import { ForgotPasswordRequestDTO, LoginAdminRequestDTO, LoginDoctorRequestDTO, LoginUserRequestDTO, ResetPasswordRequestDTO, SendVerificationEmailRequestDTO, SignupUserRequestDTO, VerifyEmailRequestDTO } from "../../application/dtos/auth/auth.dto";
import { IVerifyEmailUseCase } from "../../application/ports/auth/IVerifyEmailUseCase";
import { ILoginUserUseCase } from "../../application/ports/auth/ILoginUserUseCase";
import { IGoogleAuthUseCase } from "../../application/ports/auth/IGoogleAuthUseCase";
import { IRefreshTokenUseCase } from "../../application/ports/auth/IRefreshTokenUseCase";
import { env } from "../../infrastructure/config/env";
import { ILoginAdminUseCase } from "../../application/ports/auth/ILoginAdminUseCase";
import { ILoginDoctorUseCase } from "../../application/ports/auth/ILoginDoctorUseCase";
import { IForgotDoctorPasswordUseCase } from "../../application/ports/auth/IForgotDoctorPasswordUseCase";
import { IResetDoctorPasswordUseCase } from "../../application/ports/auth/IResetDoctorPasswordUseCase";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AUTH_SUCCESS } from "../../shared/constants/Messages";
import { IForgotUserPasswordUseCase } from "../../application/ports/auth/IForgotUserPasswordUseCase";
import { IResetUserPasswordUseCase } from "../../application/ports/auth/IResetUserPasswordUseCase";
import { ISendVerificationEmailUseCase } from "../../application/ports/auth/ISendVerificationEmailUseCase";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.ISignupUserUseCase)
        private _signupUserUseCase: ISignupUserUseCase,

        @inject(TYPES.IVerifyEmailUseCase)
        private _verifyEmailUseCase: IVerifyEmailUseCase,

        @inject(TYPES.ILoginUserUseCase)
        private _loginUserUseCase: ILoginUserUseCase,

        @inject(TYPES.IGoogleAuthUseCase)
        private _googleAuthUseCase: IGoogleAuthUseCase,

        @inject(TYPES.ISendVerificationEmailUseCase)
        private _sendVerificationEmailUseCase: ISendVerificationEmailUseCase,

        @inject(TYPES.IForgotUserPasswordUseCase)
        private _forgotUserPasswordUseCase: IForgotUserPasswordUseCase,

        @inject(TYPES.IResetUserPasswordUseCase)
        private _resetUserPasswordUseCase: IResetUserPasswordUseCase,

        @inject(TYPES.IRefreshTokenUseCase)
        private _refreshTokenUseCase: IRefreshTokenUseCase,

        @inject(TYPES.ILoginAdminUseCase)
        private _loginAdminUseCase: ILoginAdminUseCase,

        @inject(TYPES.ILoginDoctorUseCase)
        private _loginDoctorUseCase: ILoginDoctorUseCase,

        @inject(TYPES.IForgotDoctorPasswordUseCase)
        private _forgotDoctorPasswordUseCase: IForgotDoctorPasswordUseCase,

        @inject(TYPES.IResetDoctorPasswordUseCase)
        private _resetDoctorPasswordUseCase: IResetDoctorPasswordUseCase,
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
    });

    forgotUserPassword = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ForgotPasswordRequestDTO>(emailSchema, req.body);

        await this._forgotUserPasswordUseCase.execute(dto);

        res.status(HttpStatus.OK).json(ApiResponse.success(AUTH_SUCCESS.PASSWORD_RESET_EMAIL_SENT));
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
    });


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