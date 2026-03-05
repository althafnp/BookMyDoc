import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../validators/zod-error.validator";
import { LoginUserRequestDTO, SignupUserRequestDTO } from "../../application/dtos/auth";
import { IVerifyEmail } from "../../application/ports/auth/IVerifyEmail";
import { BadRequestError } from "../../shared/errors/HttpError";
import { ILoginUser } from "../../application/ports/auth/ILoginUser";
import { IGoogleAuth } from "../../application/ports/auth/IGoogleAuth";
import { IRefreshToken } from "../../application/ports/auth/IRefreshToken";
import { env } from "../../infrastructure/config/env";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.SignupUser)
        private signupUserUseCase: ISignupUser,

        @inject(TYPES.VerifyEmail)
        private verifyEmailUseCase: IVerifyEmail,

        @inject(TYPES.LoginUser)
        private loginUserUseCase: ILoginUser,

        @inject(TYPES.GoogleAuth)
        private googleAuthUseCase: IGoogleAuth,

        @inject(TYPES.RefreshToken)
        private refreshTokenUseCase: IRefreshToken,
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
}