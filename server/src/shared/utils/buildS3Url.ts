export const buildS3Url = (bucketName: string, region: string, key: string): string => {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}