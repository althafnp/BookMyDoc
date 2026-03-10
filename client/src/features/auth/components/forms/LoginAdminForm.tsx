import { useFormContext } from "react-hook-form";
import type { LoginFormValues } from "../../schemas/loginSchema";
import FormField from "@/components/FormFields";
import { Button } from "@/components/ui/button";
import FormPasswordField from "@/components/FormPasswordField";


type LoginFormProps = {
    onSubmit: (data: LoginFormValues) => void;
    loading?: boolean;
};

const LoginAdminForm = ({ onSubmit, loading }: LoginFormProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useFormContext<LoginFormValues>()

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

                <FormPasswordField<LoginFormValues>
                    name='password'
                    label='Password'
                    register={register}
                    errors={errors}
                />
            </div>

            <Button size={'lg'} className='w-full mt-6' disabled={loading}>
                Login
            </Button>
        </form>
    )
}

export default LoginAdminForm