import FormField from "@/components/FormFields"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sendVerificationSchema, type SendVerificationFormValues } from "../schemas/sendVerificationSchema"
import { Button } from "@/components/ui/button"
import { useSendVerificationEmail } from "../hooks/useSendVerificationEmail"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"


const SendVerificationEmail = () => {

    const { mutate, isPending } = useSendVerificationEmail();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SendVerificationFormValues>({
        resolver: zodResolver(sendVerificationSchema),
        mode: "onChange"
    });

    const onSubmit = async(data: SendVerificationFormValues) => {
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response.message)
            },

            onError: (error) => {
                if(axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
                } else {
                    toast.error('Unexpected error occured');
                }
            }
        })
    }
  return (
    <Card className='w-full max-w-sm'>
        <CardHeader>
            <CardTitle className='text-center text-xl'>Enter your email for verification</CardTitle>
        </CardHeader>

        <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormField<SendVerificationFormValues>
                    name="email"
                    label="Email"
                    register={register}
                    errors={errors}
                />

                <Button size={"lg"} className="w-full mt-6" disabled={isPending}>
                    Send Verification Link
                </Button>
            </form>
        </CardContent>
    </Card>
  )
}

export default SendVerificationEmail