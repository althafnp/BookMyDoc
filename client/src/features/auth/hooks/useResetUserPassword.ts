import { useMutation } from '@tanstack/react-query'
import { resetUserPassword } from '../api/authApi'
import type { ResetPasswordInput } from './useResetDoctorPassword'

export const useResetUserPassword = () => {
    return useMutation({
        mutationFn: ({ token, data }: ResetPasswordInput) =>
            resetUserPassword(token, data)
    })
}