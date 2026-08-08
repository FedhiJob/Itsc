import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Label
// ---------------------------------------------------------------------------

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-900", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// FieldError
// ---------------------------------------------------------------------------

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className={cn("mt-1 text-xs text-error", className)}>
      {message}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Field — wrapper for label + input + error
// Use with React Hook Form:
//   <Field label="Email" htmlFor="email" error={errors.email?.message}>
//     <Input id="email" {...register("email")} />
//   </Field>
// ---------------------------------------------------------------------------

interface FieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, required, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      {label ? (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-error"> *</span> : null}
        </Label>
      ) : null}
      {children}
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}