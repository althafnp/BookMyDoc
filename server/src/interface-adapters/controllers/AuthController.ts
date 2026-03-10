import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { loginSchema, resetPasswordSchema, signupSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../validators/zod-error.validator";
import { LoginAdminRequestDTO, LoginDoctorRequestDTO, LoginUserRequestDTO, ResetPasswordRequestDTO, SignupUserRequestDTO } from "../../application/dtos/auth";
import { IVerifyEmail } from "../../application/ports/auth/IVerifyEmail";
import { BadRequestError } from "../../shared/errors/HttpError";
import { ILoginUser } from "../../application/ports/auth/ILoginUser";
import { IGoogleAuth } from "../../application/ports/auth/IGoogleAuth";
import { IRefreshToken } from "../../application/ports/auth/IRefreshToken";
import { env } from "../../infrastructure/config/env";
import { ILoginAdmin } from "../../application/ports/auth/ILoginAdmin";
import { ILoginDoctor } from "../../application/ports/auth/ILoginDoctor";
import { IForgotDoctorPassword } from "../../application/ports/auth/IForgotDoctorPassword";
import { IResetDoctorPassword } from "../../application/ports/auth/IResetDoctorPassword";

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

    signupUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = parseWithZod<SignupUserRequestDTO>(signupSchema, req.body);

            await this.signupUserUseCase.execute(dto);

            res.status(HttpStatus.CREATED).json(ApiResponse.success("Registration successfull"));
        } catch (err) {

            next(err)
        }
    }

    verifyEmail = async (req: Request<{ token: string }>, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;

            if (!token) {
                throw new BadRequestError("Token is required");
            }

            await this.verifyEmailUseCase.execute(token);

            res.status(HttpStatus.OK).json(ApiResponse.success("Email verified successfully, login to access account"))
        } catch (err) {
            next(err)
        }
    }

    loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
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

        } catch (err) {
            next(err)
        }
    }

    googleAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
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

        } catch (err) {
            next(err)
        }
    }

    logout = async (req: Request, res: Response) => {
        res.clearCookie("refreshToken");

        res.status(HttpStatus.OK).json(ApiResponse.success("Logged out successfully"));
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.refreshToken;

            const { accessToken, user } = await this.refreshTokenUseCase.execute(token);

            res.status(HttpStatus.OK).json(ApiResponse.success(
                "Token refreshed",
                { accessToken, user }
            ));
        } catch (err) {
            next(err);
        }
    }


    //Admin
    loginAdmin = async(req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (err) {
            next(err)
        }
    }


    //Doctor
    loginDoctor = async(req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (err) {
            next(err)
        }
    }

    forgotDoctorPassword = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            if(!email) {
                throw new BadRequestError('Email is required')
            };

            await this.forgotDoctorPasswordUseCase.execute(email);

            res.status(HttpStatus.OK).json(ApiResponse.success(
                "Please check your email to reset the password",
            ));
        } catch (err) {
            next(err)
        }
    }

    resetDoctorPassword = async(req: Request, res: Response, next: NextFunction) => {
        try {
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

        } catch (err) {
            next(err)
        }
    }
}