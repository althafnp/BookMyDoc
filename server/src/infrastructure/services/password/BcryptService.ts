import { injectable } from "inversify";
import { IPasswordService } from "../../../application/interfaces/IPasswordService";
import bcrypt from "bcrypt";


@injectable()
export class BcryptService implements IPasswordService{
    private readonly _saltRounds = 10;

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this._saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}