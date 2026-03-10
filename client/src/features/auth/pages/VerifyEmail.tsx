import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { verifyUser } from '../api/authApi';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Status = "loading" | "success" | "error";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>()

    const [status, setStatus] = useState<Status>('loading');
    const [error, setError] = useState('')

    if (!token) {
            setStatus('error');
            toast.error('Invalid verification link');
            return;
        }

    const handleVerifyEmail = async () => {
        try {
            const res = await verifyUser(token);
            console.log('resp', res)
            setStatus('success')
            toast.success(res.message)
        } catch (err: any) {
            setStatus('error');
            setError(err?.response?.data?.message)

            toast.error(err?.response?.data?.message || 'Verification link is invalid or expired1')
        }
    }

    useEffect(() => {
        handleVerifyEmail()
    }, [])

    return (
        <Card className="w-full max-w-sm">
            {status === 'success' && (
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


            {status === 'error' && (
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
                            {error ? error : "We couldn't verify your email address. The link might be expired or invalid."}
                        </p>
                    </CardContent>


                    <CardFooter>
                        <Button
                            size="lg"
                            className="w-full"
                            >
                            Resend verification link
                        </Button>
                    </CardFooter>
                </>
            )}

        </Card>

    )
}

export default VerifyEmail