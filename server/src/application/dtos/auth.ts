export interface SignupUserRequestDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}


export interface LoginUserRequestDTO {
    email: string;
    password: string;
}

export interface LoginUserResponseDTO {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        profileImage?: string
    },
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponseDTO {
    accessToken: string;
    user: {
        id: string;
        name?: string;
        email: string;
        role: string;
        profileImage?: string
    },
}



//Admin
export interface LoginAdminRequestDTO {
    email: string;
    password: string;
}

export interface LoginAdminResponseDTO {
    accessToken: string;
    refreshToken: string;
}