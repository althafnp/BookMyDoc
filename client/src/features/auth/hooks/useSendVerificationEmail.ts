import { useMutation } from "@tanstack/react-query"
import { sendVerificationEmail } from "../api/authApi"

export const useSendVerificationEmail = () => {
    return useMutation({
        mutationFn: sendVerificationEmail
    })
}