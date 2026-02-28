import { type LoginFormValues } from '@/features/auth/schemas/loginSchema'
import { useFormContext } from 'react-hook-form'
import FormField from '../FormFields';
import FormPasswordField from '../FormPasswordField';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

type LoginFormProps = {
    onSubmit: (data: LoginFormValues) => void;
    loading?: boolean;
};

const LoginForm = ({onSubmit, loading}: LoginFormProps) => {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useFormContext<LoginFormValues>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='flex flex-col gap-6'>
                {/* 🔴 FORM LEVEL ERROR */}
                {errors.root?.message && (
                    <div className="rounded-md text-center bg-destructive/10 text-destructive p-3 text-sm">
                        {errors.root.message}
                    </div>
                )}

                <FormField<LoginFormValues>
                    name='email'
                    label='Email'
                    register={register}
                    errors={errors}
                />

                <div>
                    <FormPasswordField<LoginFormValues>
                        name='password'
                        label='Password'
                        register={register}
                        errors={errors}
                    />
                    <div className='flex justify-end mt-2'>
                        <Link 
                            to='/auth/forgot-password' 
                            className='text-sm text-muted-foreground hover:underline'
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>

            <Button size={'lg'} className='w-full mt-6' disabled={loading}>
                Login
            </Button>
        </form>
    )
}

export default LoginForm