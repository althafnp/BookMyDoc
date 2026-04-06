import { useEffect, useRef, useState } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDoctorSchema, updateDoctorSchema, type CreateDoctorFormValues, type DoctorFormInput, type UpdateDoctorFormValues } from '../schemas/doctorSchema';
import FormField from '@/components/FormFields';
import { useGetAllCategories } from '../hooks/useCategory';
import { DAYS } from '@/utils/helpers';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DoctorItem } from '../api/doctorApi';


type DoctorFormModalProps = 
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: CreateDoctorFormValues) => void;
      isLoading?: boolean;
      defaultValues?: undefined;
    }
  | {
      isOpen: boolean;
      onClose: () => void;
      onSubmit: (data: UpdateDoctorFormValues) => void;
      isLoading?: boolean;
      defaultValues: DoctorItem;
    };

const DoctorFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    defaultValues
}: DoctorFormModalProps) => {
    const isEditMode = !!defaultValues;


    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch categories for dropdown
    const { data: categoriesData } = useGetAllCategories({
        page: 1,
        limit: 100,
        sortBy: "name",
        sortOrder: "asc",
        status: "ACTIVE"
    });

    const categories: { id: string, name: string }[] = categoriesData?.data.items ?? [];

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<DoctorFormInput>({
        resolver: zodResolver(isEditMode ? updateDoctorSchema : createDoctorSchema) as Resolver<DoctorFormInput>,
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            ...(isEditMode ? {} : { password: '' }),
            categoryId: '',
            qualification: '',
            experience: '',
            consultationFee: undefined,
            availability: {
                startTime: '',
                endTime: '',
                slotDuration: undefined,
                workingDays: [],
            },
        },
    });

    const selectedDays = watch("availability.workingDays") ?? [];

    // Reset & populate on open/close
    useEffect(() => {
        if (isOpen && isEditMode && defaultValues && categories.length > 0) {
            reset({
                name: defaultValues.name,
                email: defaultValues.email,
                categoryId: defaultValues.categoryId,
                qualification: defaultValues.qualification,
                experience: defaultValues.experience,
                consultationFee: defaultValues.consultationFee,
                availability: {
                    startTime: defaultValues.availability.startTime,
                    endTime: defaultValues.availability.endTime,
                    slotDuration: defaultValues.availability.slotDuration,
                    workingDays: defaultValues.availability.workingDays,
                },
            });
            //Show existing image
            setImagePreview(defaultValues.profileImage);
        } else if (isOpen && !isEditMode) {
            reset();
            setImagePreview(null);
        }
    }, [isOpen, defaultValues, isEditMode, reset, categories]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    // ── Handlers ──
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setValue('profileImage', file, { shouldValidate: true });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const toggleDay = (day: number, currentDays: number[]) => {
        const updated = currentDays.includes(day)
            ? currentDays.filter((d) => d !== day)
            : [...currentDays, day];
        setValue('availability.workingDays', updated, { shouldValidate: true });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center z-50 p-4"
            onClick={onClose}
        >
            <Card
                className="max-w-xl w-full my-8 animate-in fade-in zoom-in-95 duration-200 overflow-auto py-0 border-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <CardHeader className="bg-muted/90 flex justify-between items-center py-5">
                    <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Doctor' : 'Add Doctor'}</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                {/* Form */}
                <form onSubmit={handleSubmit((data) => {
                    onSubmit(data as any)
                })}>
                    <CardContent className="pb-6 pt-5 space-y-6">

                        {/* ── Profile Image ── */}
                        <div className="grid gap-2">
                            <Label>
                                Profile Image
                                {isEditMode && (
                                    <span className="text-xs text-muted-foreground ml-1">(optional — leave to keep current)</span>
                                )}
                            </Label>
                            <div
                                className={`
                                    relative w-full h-52 rounded-lg border-2 border-dashed
                                    flex flex-col items-center justify-center cursor-pointer
                                    transition-colors overflow-hidden
                                    ${errors.profileImage
                                        ? 'border-destructive bg-destructive/5'
                                        : 'border-input hover:border-primary/50 bg-muted/30 hover:bg-muted/50'
                                    }
                                `}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-30 h-30 object-cover"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <Upload className="h-6 w-6 text-white" />
                                            <span className="text-sm text-white font-medium">
                                                Change Image
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <div className="p-4 rounded-full bg-muted">
                                            <ImageIcon className="h-7 w-7" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">
                                                Click to upload profile image
                                            </p>
                                            <p className="text-xs mt-1">
                                                JPG, PNG or WEBP · Max 5MB
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    disabled={isLoading}
                                />
                            </div>

                            {errors.profileImage && (
                                <p className="text-sm text-destructive">
                                    {errors.profileImage.message as string}
                                </p>
                            )}
                        </div>

                        {/* ── Basic Info Grid ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField<DoctorFormInput>
                                name="name"
                                label="Full Name"
                                register={register}
                                errors={errors}
                                placeholder="Dr. John Smith"
                                disabled={isLoading}
                            />
                            <FormField<DoctorFormInput>
                                name="email"
                                label="Email Address"
                                register={register}
                                errors={errors}
                                placeholder="doctor@example.com"
                                disabled={isLoading}
                            />
                            {!isEditMode && (
                                <FormField<DoctorFormInput>
                                    name="password"
                                    label="Password"
                                    type="password"
                                    register={register}
                                    errors={errors}
                                    placeholder="Min. 6 characters"
                                    disabled={isLoading}
                                />
                            )}
                            <FormField<DoctorFormInput>
                                name="consultationFee"
                                label="Consultation Fee (₹)"
                                type="number"
                                register={register}
                                errors={errors}
                                placeholder="e.g. 500"
                                disabled={isLoading}
                            />
                            <FormField<DoctorFormInput>
                                name="qualification"
                                label="Qualification"
                                register={register}
                                errors={errors}
                                placeholder="e.g. MBBS, MD"
                                disabled={isLoading}
                            />
                            <FormField<DoctorFormInput>
                                name="experience"
                                label="Experience"
                                register={register}
                                errors={errors}
                                placeholder="e.g. 5 years"
                                disabled={isLoading}
                            />
                        </div>

                        {/* ── Category Dropdown ── */}
                        <div className="grid gap-2">
                            <Label htmlFor='categoryId'>Category</Label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger
                                            id='categoryId'
                                            className={errors.categoryId ? 'border-destructive' : ''}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem value={cat.id} key={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && (
                                <p className="text-sm text-destructive">
                                    {errors.categoryId.message}
                                </p>
                            )}
                        </div>

                        {/* ── Availability Section ── */}
                        <div className='grid gap-4'>
                            <h4 className="text-sm font-semibold border-b border-border pb-2">
                                Availability
                            </h4>

                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                <FormField<DoctorFormInput>
                                    name='availability.startTime'
                                    label='Start Time'
                                    type='time'
                                    register={register}
                                    errors={errors}
                                    disabled={isLoading}
                                />
                                <FormField<DoctorFormInput>
                                    name="availability.endTime"
                                    label="End Time"
                                    type="time"
                                    register={register}
                                    errors={errors}
                                    disabled={isLoading}
                                />
                                <FormField<DoctorFormInput>
                                    name="availability.slotDuration"
                                    label="Slot Duration (min)"
                                    type="number"
                                    register={register}
                                    errors={errors}
                                    placeholder="e.g. 30"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Working Days */}
                            <div className="grid gap-2">
                                <Label>Working Days</Label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS.map((day) => {
                                        const isSelected = selectedDays.includes(day.value);
                                        return (
                                            <button
                                                key={day.value}
                                                type="button"
                                                disabled={isLoading}
                                                onClick={() => toggleDay(day.value, selectedDays as number[])}
                                                className={`
                                                    w-12 h-9 rounded-md text-sm font-medium border
                                                    transition-all duration-150
                                                    disabled:cursor-not-allowed disabled:opacity-50
                                                    ${isSelected
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-background text-muted-foreground border-input hover:border-primary/50 hover:text-foreground'
                                                    }
                                                `}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.availability?.workingDays && (
                                    <p className="text-sm text-destructive">
                                        {errors.availability.workingDays.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    {/* Footer */}
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
                                ? isEditMode ? 'Updating...' : 'Creating...'
                                : isEditMode ? 'Update Doctor' : 'Create Doctor'
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default DoctorFormModal;