import { injectable } from "inversify";
import { IAppConfig } from "../../application/interfaces/IAppConfig";
import { env } from "./env";


@injectable()
export class AppConfig implements IAppConfig {
    frontendUrl = env.FRONTEND_URL;
    awsS3BucketName = env.AWS_S3_BUCKET_NAME;
    awsRegion = env.AWS_REGION
}