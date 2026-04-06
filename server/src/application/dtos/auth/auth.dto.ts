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

export interface GoogleAuthRequestDTO {
    token: string
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

export interface SendVerificationEmailRequestDTO {
    email: string
}

export interface VerifyEmailRequestDTO {
    token: string;
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
    admin: {
        id: string;
        name?: string;
        email: string;
        role: string;
        profileImage?: string
    },
    accessToken: string;
    refreshToken: string;
}



//Doctor
export interface LoginDoctorRequestDTO {
    email: string;
    password: string;
}

export interface LoginDoctorResponseDTO {
    doctor: {
        id: string;
        name: string;
        email: string;
        role: string;
        profileImage: string
    }
    accessToken: string;
    refreshToken: string
}


export interface ForgotPasswordRequestDTO {
    email: string
}

export interface ResetPasswordRequestDTO {
    token: string;
    password: string;
}