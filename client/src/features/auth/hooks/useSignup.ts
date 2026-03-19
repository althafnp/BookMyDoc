import { useMutation } from "@tanstack/react-query"
import { signupUser } from "../api/authApi"

export const useSignup = () => {
    return useMutation({
        mutationFn: signupUser
    })
}