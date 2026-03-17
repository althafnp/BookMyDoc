import FormPasswordField from '@/components/FormPasswordField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/resetPassword'
import { Button } from '@/components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetUserPassword } from '../hooks/useResetUserPassword'
import { toast } from 'sonner'
import axios from 'axios'

const ResetUserPassword = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const { mutate, isPending } = useResetUserPassword();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange"
    });

    const onSubmit = async(data: ResetPasswordFormValues) => {
        if(!token) {
            toast.error("Token is missing");
            return;
        }

        mutate({ token, data }, {
            onSuccess: (response) => {
                toast.success(response.message);
                navigate('/auth/login');
            },

            onError: (error) => {
                if(axios.isAxiosError(error)) {
                    toast.error(error?.response?.data?.message || "Something went wrong");
                } else {
                    toast.error('Unexpected error occured');
                }
            }
        })
    }
    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='text-center text-xl'>Reset your password</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col gap-6'>
                        <FormPasswordField<ResetPasswordFormValues>
                            name='password'
                            label='Password'
                            register={register}
                            errors={errors}
                        />

                        <FormPasswordField<ResetPasswordFormValues>
                            name='confirmPassword'
                            label='ConfirmPassword'
                            register={register}
                            errors={errors}
                        />
                    </div>

                    <Button size={'lg'} className='w-full mt-6' disabled={isPending}>
                        {isPending ? 'Resetting' : 'Reset Password'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default ResetUserPassword