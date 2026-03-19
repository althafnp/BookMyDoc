import { Link, useNavigate } from "react-router-dom";
import { type LoginFormValues, loginSchema } from "../schemas/loginSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { setAccessToken } from "@/core/http/authToken";
import { setUser } from "@/store/reducers/authSlice";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import LoginForm from "@/features/auth/components/forms/LoginForm";
import { useGoogleLogin, useLogin } from "../hooks/useLogin";


const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const { setError } = methods;

    const { mutate, isPending } = useLogin();
    const { mutate: googleMutate } = useGoogleLogin();

    const handleLogin = async (data: LoginFormValues) => {
        mutate(data, {
            onSuccess: (response) => {
                setAccessToken(response.data.accessToken);
                dispatch(setUser(response.data.user));

                localStorage.setItem('auth:hadSesion', 'true');

                toast.success(response.message);

                navigate('/');
            },

            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    const response = error.response?.data;

                    if (response?.errors && Array.isArray(response.errors)) {
                        response.errors.forEach((error: any) => {
                            setError(error.field as keyof LoginFormValues, {
                                type: "server",
                                message: error.message
                            })
                        });
                    }
                    //Form-level error
                    else {
                        setError("root", {
                            type: "server",
                            message: response?.message || "Something went wrong. Please try again."
                        })
                    }
                } else {
                    setError("root", {
                        type: "server",
                        message: "An unexpected error occured"
                    })
                }
            }
        })
    }

    const handleGoogleLogin = async (response: any) => {
        googleMutate(response.credential, {
            onSuccess: (res) => {
                setAccessToken(res.data.accessToken);
                dispatch(setUser(res.data.user));

                localStorage.setItem('auth:hadSession', 'true');

                toast.success(res.message);

                navigate('/')
            },

            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    toast.error(error?.response?.data?.message || 'Google login failed. Please try again.');
                } else {
                    toast.error('An unexpected error occurred');
                }
            }
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
                <CardAction><Link to={'/auth/signup'} className="hover:underline font-bold text-sm text-primary">Sign Up</Link></CardAction>
            </CardHeader>

            <CardContent>
                <FormProvider {...methods}>
                    <LoginForm onSubmit={handleLogin} loading={isPending} />
                </FormProvider>
            </CardContent>

            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center px-2">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>


            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error("Google auth failed")}
                />
            </div>

            <h2 className="text-center text-sm text-muted-foreground">Need to verify your email? <Link to={'/auth/send-verification-email'} className="hover:underline text-primary">Verify email</Link></h2>
        </Card>
    );
};

export default Login;
