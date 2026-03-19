import { useMutation } from "@tanstack/react-query"
import { loginUser, loginWithGoogle } from "../api/authApi"

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser
    })
}

export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: loginWithGoogle
    })
}