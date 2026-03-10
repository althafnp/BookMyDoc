import { AuthUser } from "../domain/enums/Auth";

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser
        }
    }
}