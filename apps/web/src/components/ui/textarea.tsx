import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "mt-1 block w-full resize-y rounded-md border border-gray-200 bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold",
        className
      )}
      {...props}
    />
  );
}