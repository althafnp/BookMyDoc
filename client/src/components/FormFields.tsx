import { Input } from './ui/input'
import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
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
} : FormFieldProps<T>) => {

    const error = errors[name];
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

            {error?.message && (
                <p className='text-sm text-destructive'>{String(error.message)}</p>
            )}
        </div>
    )
}

export default FormField