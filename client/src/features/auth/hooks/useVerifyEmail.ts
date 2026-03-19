import { useQuery } from "@tanstack/react-query"
import { verifyEmail } from "../api/authApi"

export const useVerifyEmail = (token: string | undefined) => {
    return useQuery({
        queryKey: ['verify-email', token],
        queryFn: () => verifyEmail(token!),
        enabled: !!token,
        retry: false
    })
}