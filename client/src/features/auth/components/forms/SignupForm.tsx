import { useFormContext } from 'react-hook-form'
import type { SignupFormValues } from '@/features/auth/schemas/signupSchema'
import FormField from '@/components/FormFields';
import FormPasswordField from '@/components/FormPasswordField';
import { Button } from '@/components/ui/button';


type SignupFormProps = {
    onSubmit: (data: SignupFormValues) => void;
    loading?: boolean;
};

const SignupForm = ({ onSubmit, loading }: SignupFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useFormContext<SignupFormValues>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div className='flex flex-col gap-6'>
                {/* 🔴 FORM LEVEL ERROR */}
                {errors.root?.message && (
                    <div className="rounded-md text-center bg-destructive/10 text-destructive p-3 text-sm">
                        {errors.root.message}
                    </div>
                )}

                <FormField
                    name='name'
                    label='Enter your Name'
                    register={register}
                    errors={errors}
                    placeholder='John Doe'
                />

                <FormField
                    name='email'
                    label='Email'
                    register={register}
                    errors={errors}
                    placeholder='me@gmail.com'
                />

                <FormPasswordField
                    name='password'
                    label='Password'
                    register={register}
                    errors={errors}
                />

                <FormPasswordField
                    name='confirmPassword'
                    label='Confirm Password'
                    register={register}
                    errors={errors}
                />
            </div>


            <Button size={'lg'} className='w-full mt-6' disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
            </Button>
        </form>
    )
}

export default SignupForm