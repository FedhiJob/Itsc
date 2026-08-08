import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "mt-1 block w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold",
        className
      )}
      {...props}
    />
  );
}