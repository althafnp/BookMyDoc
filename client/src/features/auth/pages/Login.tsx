import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type LoginFormValues, loginSchema } from "../schemas/loginSchema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, loginWithGoogle,} from "../api/authApi";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { setAccessToken } from "@/core/http/authToken";
import { setUser } from "@/store/reducers/authSlice";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import LoginForm from "@/features/auth/components/forms/LoginForm";


const Login = () => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const { setError } = methods;


    const handleLogin = async (data: LoginFormValues) => {
        try {
            setLoading(true)

            const res = await loginUser(data);
            console.log("Login response:", res);

            setAccessToken(res.data.accessToken);
            dispatch(setUser(res.data.user));

            localStorage.setItem('auth:hadSession', 'true')

            toast.success(res?.message)

            navigate('/')

        } catch (err: any) {
            console.log(err);
            if (axios.isAxiosError(err)) {
                const response = err.response?.data;

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
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (response: any) => {
        try {
            console.log('resp:', response)
            const res = await loginWithGoogle(response.credential);
            console.log('Google login response:', res);

            setAccessToken(res.data.accessToken);
            dispatch(setUser(res.data.user));

            localStorage.setItem('auth:hadSession', 'true')

            toast.success(res?.message);

            navigate('/')
        } catch (error) {
            console.error("Google login error", error);
            toast.error("Google login failed. Please try again.");
        }
    };
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>Enter your email below to login to your account</CardDescription>
                <CardAction><Link to={'/auth/signup'} className="hover:underline font-bold text-sm text-primary">Sign Up</Link></CardAction>
            </CardHeader>

            <CardContent>
                <FormProvider {...methods}>
                    <LoginForm onSubmit={handleLogin} loading={loading} />
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
