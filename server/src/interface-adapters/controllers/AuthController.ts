import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { forgotPasswordSchema, loginSchema, resetPasswordSchema, signupSchema, verifyEmailSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../validators/zod-error.validator";
import { ForgotPasswordRequestDTO, LoginAdminRequestDTO, LoginDoctorRequestDTO, LoginUserRequestDTO, ResetPasswordRequestDTO, SignupUserRequestDTO, VerifyEmailRequestDTO } from "../../application/dtos/auth";
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

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.ISignupUser)
        private signupUserUseCase: ISignupUser,

        @inject(TYPES.IVerifyEmail)
        private verifyEmailUseCase: IVerifyEmail,

        @inject(TYPES.ILoginUser)
        private loginUserUseCase: ILoginUser,

        @inject(TYPES.IGoogleAuth)
        private googleAuthUseCase: IGoogleAuth,

        @inject(TYPES.IRefreshToken)
        private refreshTokenUseCase: IRefreshToken,

        @inject(TYPES.ILoginAdmin)
        private loginAdminUseCase: ILoginAdmin,

        @inject(TYPES.ILoginDoctor)
        private loginDoctorUseCase: ILoginDoctor,

        @inject(TYPES.IForgotDoctorPassword)
        private forgotDoctorPasswordUseCase: IForgotDoctorPassword,

        @inject(TYPES.IResetDoctorPassword)
        private resetDoctorPasswordUseCase: IResetDoctorPassword,
    ) { }

    signupUser = asyncHandler(async (req, res) => {
        const dto = parseWithZod<SignupUserRequestDTO>(signupSchema, req.body);

        await this.signupUserUseCase.execute(dto);

        res.status(HttpStatus.CREATED).json(ApiResponse.success("Registration successfull"));
    })

    verifyEmail = asyncHandler(async (req, res) => {
        const dto = parseWithZod<VerifyEmailRequestDTO>(verifyEmailSchema, req.params);
        
        await this.verifyEmailUseCase.execute(dto);
        
        res.status(HttpStatus.OK).json(ApiResponse.success("Email verified successfully, login to access account"))
    })
        

    loginUser = asyncHandler(async (req, res,) => {
        const dto = parseWithZod<LoginUserRequestDTO>(loginSchema, req.body);

        const { user, accessToken, refreshToken } = await this.loginUserUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const data = {
            user,
            accessToken
        }

        res.status(HttpStatus.OK).json(ApiResponse.success(
            "User logged in successfully",
            data
        ))
    })




    googleAuth = asyncHandler(async (req, res) => {
        const { token } = req.body;
        
        const { user, accessToken, refreshToken } = await this.googleAuthUseCase.execute(token);
        
        
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
            "User logged in with Google",
            data
        ));
    })

    logout = asyncHandler(async (req, res) => {
        res.clearCookie("refreshToken");
        
        res.status(HttpStatus.OK).json(ApiResponse.success("Logged out successfully"));
    })


    refreshToken = asyncHandler(async (req, res) => {
        const token = req.cookies.refreshToken;
        
        const { accessToken, user } = await this.refreshTokenUseCase.execute(token);
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            "Token refreshed",
            { accessToken, user }
        ));
    })


    //Admin
    loginAdmin = asyncHandler(async (req, res) => {
        const dto = parseWithZod<LoginAdminRequestDTO>(loginSchema, req.body);

        const { admin, accessToken, refreshToken } = await this.loginAdminUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const data = {
            admin,
            accessToken
        }

        res.status(HttpStatus.OK).json(ApiResponse.success(
            "Admin logged in",
            data
        ))
    })


    //Doctor
    loginDoctor = asyncHandler(async (req, res) => {
        const dto = parseWithZod<LoginDoctorRequestDTO>(loginSchema, req.body);
        
        const { doctor, accessToken, refreshToken } = await this.loginDoctorUseCase.execute(dto);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const data = {
            doctor,
            accessToken
        }
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            "Doctor logged in",
            data
        ));
    })


    forgotDoctorPassword = asyncHandler(async (req, res) => {
        const dto = parseWithZod<ForgotPasswordRequestDTO>(forgotPasswordSchema, req.body);
        
        await this.forgotDoctorPasswordUseCase.execute(dto);
        
        res.status(HttpStatus.OK).json(ApiResponse.success(
            "Please check your email to reset the password",
        ));
    })

    resetDoctorPassword = asyncHandler(async (req, res) => {
        const parsed = parseWithZod<ResetPasswordRequestDTO>(resetPasswordSchema, {
            token: req.params.token,
            ...req.body
        });
        
        await this.resetDoctorPasswordUseCase.execute({
            token: parsed.token,
            password: parsed.password
        });
        
        res.status(HttpStatus.OK).json(
            ApiResponse.success("Password reset successful")
        );
    })

}