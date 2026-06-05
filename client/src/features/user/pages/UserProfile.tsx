import { Pencil, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import { useUpdateProfile } from "../hooks/useProfile"
import { toast } from "sonner"
import UserProfileFormModal from "../components/UserProfileFormModal"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/reducers/authSlice"

const Profile = () => {
    const { user } = useAuth();

    const dispatch = useDispatch();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const updateMutation = useUpdateProfile();

    const handleUpdate = (formData: FormData) => {
        updateMutation.mutate(formData, {
            onSuccess: (res) => {
                toast.success(res.message);
                dispatch(setUser(res.data))
                setIsEditOpen(false);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Update failed");
            },
        });
    };
    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <CardTitle className="text-xl">My Profile</CardTitle>

                    <CardDescription>Manage your personal information</CardDescription>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="relative pt-6">
                    <div className="mb-4">
                        <Button
                            size={"icon"}
                            className="absolute top-0 right-7 rounded-sm"
                            onClick={() => setIsEditOpen(true)}
                            aria-label="Edit profile picture"
                        >
                            <Pencil size={13} />
                        </Button>
                    </div>
                    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">

                        {/* Avatar */}
                        <div className="shrink-0">
                            {user?.profileImage ? (
                                <img
                                    src={user?.profileImage}
                                    alt={user?.name}
                                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"
                                />
                            ) : (
                                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-primary">
                                    <User className="w-10 h-10 text-gray-600 dark:text-gray-300" />
                                </div>
                            )}
                            {/* <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold select-none">
                                {user?.name?.split(" ").map(n => n[0]).join("")}
                            </div> */}
                        </div>

                        {/* Fields */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Full Name
                                </label>
                                <div className="flex items-center p-3 rounded-lg bg-muted/50 border border-border">
                                    <span className="text-sm font-medium text-foreground">{user?.name}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Email Address
                                </label>
                                <div className="flex items-center p-3 rounded-lg bg-muted/50 border border-border">
                                    <span className="text-sm font-medium text-foreground">{user?.email}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>

            <UserProfileFormModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
                defaultValues={{
                    name: user?.name || "",
                    profileImage: user?.profileImage || null,
                }}
            />
        </div>
    )
}

export default Profile