export const mimeToExtension = (mimetype: string): string => {
    const map: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    };

    return map[mimetype];
}