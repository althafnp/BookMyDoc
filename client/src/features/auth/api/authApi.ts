import api from "@/core/http/api"
import type { SignupFormValues } from "../schemas/signupSchema"
import type { LoginFormValues } from "../schemas/loginSchema";
import { clearAccessToken } from "@/core/http/authToken";
import store from "@/store/store";
import { clearUser } from "@/store/reducers/authSlice";

export const signupUser = async (data: SignupFormValues) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
}

export const verifyUser = async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
}


export const loginUser = async(data: LoginFormValues) => {
    const response = await api.post('/auth/login', data);
    return response.data
}

export const loginWithGoogle = async(token: string) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
}



export const logout = async () => {
    try {
        await api.post('auth/logout');
    } finally {
        localStorage.removeItem('auth:hadSession');
        clearAccessToken();
        store.dispatch(clearUser());
    }
}