import { useMutation } from "@tanstack/react-query"
import { forgotUserPassword } from "../api/authApi"

export const useForgotUserPassword = () => {
    return useMutation({
        mutationFn: forgotUserPassword
    })
}