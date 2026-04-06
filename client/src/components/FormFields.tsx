import { Input } from './ui/input'
import { get, type FieldErrors, type FieldValues, type Path, type UseFormRegister } from 'react-hook-form';
import { Label } from './ui/label';


type FormFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    type?: React.HTMLInputTypeAttribute;
    maxLength?: number;
    disabled?: boolean
    placeholder?: string
}

const FormField = <T extends FieldValues>({
    name,
    label,
    register,
    errors,
    type = 'text',
    maxLength,
    disabled,
    placeholder
}: FormFieldProps<T>) => {

    const error = get(errors, name);
    return (
        <div className='grid gap-2'>
            <Label htmlFor={name} >{label}</Label>
            <Input
                id={name}
                type={type}
                maxLength={maxLength}
                {...register(name)}
                aria-invalid={!!error}
                disabled={disabled}
                placeholder={placeholder}
            />

            {error && (
                <p className="text-sm text-destructive">
                    {error.message as string}
                </p>
            )}
        </div>
    )
}

export default FormField