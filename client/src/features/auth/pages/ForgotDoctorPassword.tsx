import FormField from '@/components/FormFields'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { forgotPasswordEmailSchema, type ForgotPasswordFormValues } from '../schemas/resetPassword'
import { useForgotDoctorPassword } from '../hooks/useForgotDoctorPassword'
import { toast } from 'sonner'
import axios from 'axios'

const ForgotDoctorPassword = () => {

    const { mutate, isPending } = useForgotDoctorPassword()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordEmailSchema),
        mode: 'onChange'
    });

    const onSubmit = async(data: ForgotPasswordFormValues) => {
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response.message);
            },

            onError: (error) => {
                if(axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
                } else {
                    toast.error('Unexpected error occured');
                }
            }
        });
    };

  return (
    <Card className='w-full max-w-sm'>
        <CardHeader>
            <CardTitle className='text-center text-xl'>Enter your email for resetting password</CardTitle>
        </CardHeader>

        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormField<ForgotPasswordFormValues>
                    name='email'
                    label='Email'
                    register={register}
                    errors={errors}
                />

                <Button size={'lg'} className='w-full mt-6' disabled={isPending}>
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
        </CardContent>
    </Card>
  )
}

export default ForgotDoctorPassword