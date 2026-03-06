import api from "@/core/http/api"
import type { SignupFormValues } from "../schemas/signupSchema"
import type { LoginFormValues } from "../schemas/loginSchema";
import { clearAccessToken, setAccessToken } from "@/core/http/authToken";
import store from "@/store/store";
import { clearUser, setInitialized, setLoading, setUser } from "@/store/reducers/authSlice";
import { toast } from "sonner";

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

export const refreshSession = async() => {
    const hadSession = localStorage.getItem('auth:hadSession') === 'true';
    try {
        store.dispatch(setLoading(true));
        const response = await api.post('/auth/refresh');
        console.log('refresh', response);

        const { accessToken, user } = response.data.data;

        setAccessToken(accessToken);
        store.dispatch(setUser(user));

        return accessToken;
    } catch (err: any) {
        store.dispatch(clearUser());

        if (hadSession) {
            const message = err?.response?.data?.message;
            toast.error(message)
            logout();
        }
        return null;
    } finally {
        store.dispatch(setInitialized(true));
        store.dispatch(setLoading(false))
    }
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



//Admin
export const loginAdmin = async (data: LoginFormValues) => {
    const response = await api.post('/admin/auth/login', data);
    return response.data;
}