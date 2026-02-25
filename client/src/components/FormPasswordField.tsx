import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

type FormPasswordFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    disabled?: boolean;
};

const FormPasswordField = <T extends FieldValues>({
    name,
    label,
    register,
    errors,
    disabled,
}: FormPasswordFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const error = errors[name];

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>

            <div className="relative">
                <Input
                    id={name}
                    type={showPassword ? "text" : "password"}
                    disabled={disabled}
                    aria-invalid={!!error}
                    {...register(name)}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            </div>

            {error?.message && (
                <p className="text-sm text-destructive">
                    {String(error.message)}
                </p>
            )}
        </div>
    );
};

export default FormPasswordField;
