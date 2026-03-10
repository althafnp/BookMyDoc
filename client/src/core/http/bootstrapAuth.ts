import { refreshSession } from "@/features/auth/api/authApi";
import { setInitialized } from "@/store/reducers/authSlice";
import store from "@/store/store";

export const bootstrapAuth = async() => {
    const hadSession = localStorage.getItem('auth:hadSession') === 'true';

    if(!hadSession) {
        store.dispatch(setInitialized(true));
        return;
    }

    await refreshSession();
}