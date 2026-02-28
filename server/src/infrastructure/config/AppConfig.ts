import { injectable } from "inversify";
import { IAppConfig } from "../../application/interfaces/IAppConfig";
import { env } from "./env";


@injectable()
export class AppConfig implements IAppConfig {
    frontendUrl = env.FRONTEND_URL;
}