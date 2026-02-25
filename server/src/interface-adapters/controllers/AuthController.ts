import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ISignupUser } from "../../application/ports/auth/ISignupUser";
import { signupSchema } from "../validators/auth.validator";
import { HttpStatus } from "../../shared/constants/httpStatus";
import { ApiResponse } from "../../shared/utils/ApiResponse";
import { ZodError } from "zod";
import { BadRequestError } from "../../shared/errors/HttpError";
import { parseWithZod } from "../../infrastructure/web/express/middlewares/zod-error.middleware";
import { SignupUserRequestDTO } from "../../application/dtos/auth";

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.SignupUser)
        private signupUserUseCase: ISignupUser
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
}