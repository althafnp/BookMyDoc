export interface IFileStorageService {
    upload(
        buffer: Buffer,
        mimetype: string,
        key: string,
    ): Promise<void>

    getSignedUrl(key: string, expiresIn?: number): Promise<string>

    delete(key: string): Promise<void>
}