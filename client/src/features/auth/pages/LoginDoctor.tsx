import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginDoctorForm from "../components/forms/LoginDoctorForm";
import { setAccessToken } from "@/core/http/authToken";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/reducers/authSlice";
import { useLoginDoctor } from "../hooks/useLoginDoctor";


const LoginDoctor = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const { setError } = methods;

    const onSuccessLogin = (res: any) => {
        setAccessToken(res.data.accessToken);

        dispatch(setUser(res.data.user))

        localStorage.setItem('auth:hadSession', 'true');

        toast.success(res.message);

        navigate('/doctor/dashboard');
    }

    const loginMutation = useLoginDoctor({
        setError,
        onSuccessLogin
    })
    
    const handleSubmit = (data: LoginFormValues) => {
        loginMutation.mutate(data)
    }

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='text-center text-xl'>Doctor Login</CardTitle>
            </CardHeader>

            <CardContent>
                <FormProvider {...methods}>
                    <LoginDoctorForm onSubmit={handleSubmit} loading={loginMutation.isPending}/>
                </FormProvider>
            </CardContent>
        </Card>
    )
}

export default LoginDoctor