import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



export interface DoctorData {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
}

interface AuthState {
    user: DoctorData | UserData | null;
    loading: boolean;
    initialized: boolean
}


const initialState: AuthState = {
    user: null,
    loading: false,
    initialized: false
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserData | DoctorData>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        setInitialized(state, action: PayloadAction<boolean>) {
            state.initialized = action.payload
        }
    }
})


export const { clearUser, setLoading, setUser, setInitialized } = authSlice.actions
export default authSlice.reducer