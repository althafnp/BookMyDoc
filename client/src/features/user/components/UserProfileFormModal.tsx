import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import type { ProfileFormValues } from "../schemas/profileSchema";
import { Input } from "@/components/ui/input";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues: {
        name: string;
        profileImage?: string | null;
    };
    onSubmit: (data: FormData) => void;
    isLoading?: boolean;
};

const UserProfileFormModal = ({
    isOpen,
    onClose,
    defaultValues,
    onSubmit,
    isLoading,
}: Props) => {
    const [preview, setPreview] = useState<string | null>(defaultValues.profileImage || null);
    const [removeImage, setRemoveImage] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
    } = useForm<ProfileFormValues>({
        defaultValues: {
            name: defaultValues.name,
        },
    });

    const watchedFile = watch("profileImage");

    // Preview logic
    useEffect(() => {
        if (watchedFile && watchedFile.length > 0) {
            const file = watchedFile[0];
            setPreview(URL.createObjectURL(file));
            setRemoveImage(false);
        }
    }, [watchedFile]);

    useEffect(() => {
        if (isOpen) {
            reset({ name: defaultValues.name });
            setPreview(defaultValues.profileImage || null);
            setRemoveImage(false);
        }
    }, [isOpen, defaultValues, reset]);

    if (!isOpen) return null;

    const submitHandler = (data: ProfileFormValues) => {
        const formData = new FormData();

        formData.append("name", data.name);

        if (removeImage) {
            formData.append("removeImage", "true"); // backend can handle this if needed
        }

        if (data.profileImage?.[0]) {
            formData.append("profileImage", data.profileImage[0]);
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <Card
                className="max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Edit Profile</h3>
                    <button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                <form onSubmit={handleSubmit(submitHandler)}>
                    <CardContent className="space-y-4">

                        {/* Image Preview */}
                        <div className="flex flex-col items-center gap-3">
                            {preview ? (
                                <img
                                    src={preview}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                    No Image
                                </div>
                            )}

                            <Input type="file" accept="image/*" {...register("profileImage")} />

                            {preview && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setPreview(null);
                                        setRemoveImage(true);
                                    }}
                                >
                                    Remove Image
                                </Button>
                            )}
                        </div>

                        {/* Name */}
                        <Input
                            {...register("name")}
                            placeholder="Enter name"
                        />
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 pt-5">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default UserProfileFormModal;