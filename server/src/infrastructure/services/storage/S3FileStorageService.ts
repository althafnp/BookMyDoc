import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { IFileStorageService } from "../../../application/interfaces/IFileStorageService";
import { env } from "../../config/env";


export class S3FileStorageService implements IFileStorageService {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.bucket = env.AWS_S3_BUCKET_NAME;
        this.client = new S3Client({
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY
            }
        });
    };


    async upload(buffer: Buffer, mimetype: string, key: string): Promise<void> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: mimetype
            })
        );
    };

    async getSignedUrl(key: string, expiresIn = 60): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key
        });

        return getSignedUrl(this.client, command, { expiresIn });
    }

    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key
            })
        );
    }
}
