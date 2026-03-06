import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormProvider, useForm } from 'react-hook-form'
import LoginAdminForm from '../components/forms/LoginAdminForm'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { setAccessToken } from '@/core/http/authToken'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useLoginAdmin } from '../hooks/useLoginAdmin'

const LoginAdmin = () => {

    const navigate = useNavigate();

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const { setError } = methods;

    const onSuccessLogin = (res: any) => {
        setAccessToken(res.data.accessToken);

        localStorage.setItem('auth:hadSession', 'true');

        toast.success(res.message);

        navigate('/admin/dashboard');
    };

    const loginMutation = useLoginAdmin({
        setError,
        onSuccessLogin
    });

    const handleSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data)
    };

    return (
        <Card className="w-full max-w-sm">

            <CardHeader>
                <CardTitle className="text-center text-xl">
                    Admin Login
                </CardTitle>
            </CardHeader>

            <CardContent>
                <FormProvider {...methods}>
                    <LoginAdminForm
                        onSubmit={handleSubmit}
                        loading={loginMutation.isPending}
                    />
                </FormProvider>
            </CardContent>

        </Card>
    )
}

export default LoginAdmin