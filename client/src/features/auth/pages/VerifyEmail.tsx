import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useVerifyEmail } from '../hooks/useVerifyEmail';


const VerifyEmail = () => {
    const navigate = useNavigate();
    const { token } = useParams();

    const { data, isLoading, isError, error, isSuccess } = useVerifyEmail(token);

    useEffect(() => {
        if(isSuccess && data) {
            toast.success(data.message)
        }

        if(isError) {
            const errMsg = (error as any)?.response?.data?.message || 'Verification link is invalid or expired';
            toast.error(errMsg);
        }
    }, [isSuccess, isError, data, error]);

    if(!token) {
        return (
            <Card className="w-full max-w-sm">
                <CardContent className="text-center py-10">
                    Invalid verification link
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-sm">

            {isLoading && (
                <CardContent className="text-center py-10 animate-pulse">
                    Verifying your email...
                </CardContent>
            )}

            {isSuccess && (
                <>
                    <CardHeader className='gap-6'>
                        <div className="flex justify-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="text-green-500 w-12 h-12" />
                            </div>
                        </div>

                        {/* Title */}
                        <CardTitle className='text-center text-xl'>Email Verified Successfully!</CardTitle>
                    </CardHeader>


                    <CardContent>
                        <p className="text-center text-muted-foreground text-sm sm:text-base">
                            Your email has been verified, Access all the features!
                        </p>
                    </CardContent>
                    

                    <CardFooter>
                        <Button
                            onClick={() => navigate('/auth/login')}
                            size="lg"
                            className="w-full"
                        >
                            Redirect to login
                        </Button>
                    </CardFooter>
                </>
            )}


            {isError && (
                <>
                    <CardHeader className='gap-6'>
                        <div className="flex justify-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-destructive/10 rounded-full flex items-center justify-center">
                                <XCircle className="text-destructive w-12 h-12" />
                            </div>
                        </div>

                    
                        <CardTitle className="text-center text-xl">Verification Failed</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* Instructions */}
                        <p className="text-center text-muted-foreground text-sm sm:text-base">
                            {(error as any)?.response?.data?.message || "We couldn't verify your email address. The link might be expired or invalid."}
                        </p>
                    </CardContent>

                </>
            )}
        </Card>

    )
}

export default VerifyEmail