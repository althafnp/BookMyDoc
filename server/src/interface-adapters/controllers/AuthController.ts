import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { signupSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { parseWithZod } from "../../infrastructure/web/express/middlewares/zod-error.middleware";
import { SignupUserRequestDTO } from "../../application/dtos/auth";
import { IVerifyEmail } from "../../application/ports/auth/IVerifyEmail";
import { BadRequestError } from "../../shared/errors/HttpError";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.SignupUser)
        private signupUserUseCase: ISignupUser,

        @inject(TYPES.VerifyEmail)
        private verifyEmailUseCase: IVerifyEmail
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

            if(!token) {
                throw new BadRequestError("Token is required");
            }

            await this.verifyEmailUseCase.execute(token);

            res.status(HttpStatus.OK).json(ApiResponse.success("Email verified successfully, login to access account"))
        } catch (err) {
            next(err)
        }
    }
}