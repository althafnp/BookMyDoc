import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormValues } from '../schemas/categorySchema';
import FormField from '@/components/FormFields';

type CategoryFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormValues) => void;
    isLoading?: boolean;
    defaultValues?: CategoryFormValues;
};

const CategoryFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    defaultValues,
}: CategoryFormModalProps) => {
    const isEditMode = !!defaultValues;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: defaultValues ?? { name: '' },
    });

    // Reset form when modal opens/closes or defaultValues change
    useEffect(() => {
        if (isOpen) {
            reset(defaultValues ?? { name: '' });
        }
    }, [isOpen, defaultValues, reset]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <Card
                className="max-w-lg w-full animate-in fade-in zoom-in-95 duration-200 overflow-hidden py-0 border-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <CardHeader className="bg-muted/90 flex justify-between items-center py-5">
                    <h3 className="text-lg font-semibold">
                        {isEditMode ? 'Edit Category' : 'Add Category'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="pb-6">
                        <FormField<CategoryFormValues>
                            name="name"
                            label="Category Name"
                            register={register}
                            errors={errors}
                            placeholder="Enter category name"
                            disabled={isLoading}
                        />
                    </CardContent>

                    {/* Footer Actions */}
                    <CardFooter className="bg-muted/30 flex justify-end gap-3 border-t border-border py-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? isEditMode
                                    ? 'Updating...'
                                    : 'Creating...'
                                : isEditMode
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CategoryFormModal;
