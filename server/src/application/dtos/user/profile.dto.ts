export interface GetProfileResponseDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string
};


export interface UpdateProfileRequestDTO {
    name: string;
    removeImage?: boolean;
    profileImage?: {
        buffer: Buffer;
        mimetype: string;
    };
}