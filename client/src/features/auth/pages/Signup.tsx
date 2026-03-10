import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { signupSchema, type SignupFormValues } from '../schemas/signupSchema'
import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signupUser } from '../api/authApi'
import SignupForm from '../components/forms/SignupForm'


const Signup = () => {

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);


    const methods = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
    })

    const { getValues, setError } = methods;

    const handleSignup = async (data: SignupFormValues) => {
        try {
            setLoading(true)
        
            const res = await signupUser(data);
            console.log("Signup response:", res);

            toast.success(res?.message)

            setStep(step + 1)
        } catch (err: any) {
            console.error(err)
            if(axios.isAxiosError(err)) {
                const response = err.response?.data;

                if(response?.errors && Array.isArray(response.errors)) {
                    response.errors.forEach((error: any) => {
                        setError(error.field as keyof SignupFormValues, {
                            type: "server",
                            message: error.message
                        })
                    })
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
                    message: "Unexpected error occured"
                });
            }
        } finally {
            setLoading(false)
        }

    }
    return (
        <Card className="w-full max-w-sm">

            {  
                step === 1 && (
                    <>
                        <CardHeader>
                            <CardTitle>Create an account</CardTitle>
                            <CardDescription>Enter your information below to create your account</CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                            <FormProvider {...methods}>
                                <SignupForm onSubmit={handleSignup} loading={loading} />
                            </FormProvider>
                        </CardContent>
                        

                        <h2 className="text-center text-sm text-muted-foreground">Already have an account? <Link to={'/auth/login'} className="hover:underline">Sign in</Link></h2>
                    </>
                )
            }



            {
                step === 2 && (
                    <>
                        <CardHeader className='space-y-0 pb-3'>
                            {/* Back button */}
                            <button
                                onClick={() => setStep(step - 1)}
                                className="mb-4 p-1 hover:bg-accent rounded-lg transition-colors w-fit"
                                >
                                <ArrowLeft />
                            </button>

                            {/* Email icon */}
                            <div className="flex justify-center mb-2">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Mail className="text-primary w-12 h-12" />
                                </div>
                            </div>

                            {/* Title */}
                            <CardTitle className="text-center">Verify your email address</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* Email notification box */}
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-5">
                                <p className="text-center text-sm sm:text-base">
                                    <span className="text-muted-foreground">We've sent a verification link to:</span>
                                    <br />
                                    <span className="font-semibold text-primary">{getValues('email')}</span>
                                </p>
                            </div>

                            {/* Instructions */}
                            <p className="text-center text-muted-foreground text-sm sm:text-base mb-2">
                                Please click on the link in the email to confirm your email address.
                            </p>

                            <p className="text-center text-muted-foreground text-xs sm:text-sm mb-6">
                                If you don't see the email, check your spam folder.
                            </p>
                        </CardContent>

                        <CardFooter>
                            <Button
                                size="lg"
                                className="w-full"
                            >
                                Resend Email
                            </Button>
                        </CardFooter>
                        
                    </>
                )
            }

        </Card>
    )
}

export default Signup