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
import axios from "axios";


const LoginDoctor = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const methods = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange'
    });

    const { setError } = methods;

    const { mutate, isPending } = useLoginDoctor();

    const handleSubmit = async (data: LoginFormValues) => {
        mutate(data, {
            onSuccess: (res) => {
                setAccessToken(res.data.accessToken);
                dispatch(setUser(res.data.doctor));
                localStorage.setItem("auth:hadSession", "true");
                toast.success(res.message);
                navigate("/doctor/dashboard");
            },


            onError: (err: any) => {
                console.log(err);
                if (axios.isAxiosError(err)) {
                    const response = err?.response?.data;

                    if (response?.errors && Array.isArray(response.errors)) {
                        response.errors.forEach((error: any) => {
                            setError(error.field as keyof LoginFormValues, {
                                type: 'server',
                                message: error.message
                            })
                        })
                    }
                    //Form-level errors
                    else {
                        setError('root', {
                            type: 'server',
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

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <CardTitle className='text-center text-xl'>Doctor Login</CardTitle>
            </CardHeader>

            <CardContent>
                <FormProvider {...methods}>
                    <LoginDoctorForm onSubmit={handleSubmit} loading={isPending} />
                </FormProvider>
            </CardContent>
        </Card>
    )
}

export default LoginDoctor