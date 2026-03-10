import { type RootState } from "@/store/store"
import { useSelector } from "react-redux"

export const useAuth = () => {
    const { user, loading, initialized } = useSelector((state: RootState) => state.auth);

    return {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        loading,
        initialized
    }
}