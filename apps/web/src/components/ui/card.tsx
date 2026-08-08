import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border border-gray-200 bg-white shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        featured: "border-t-4 border-t-brand-gold",
        interactive: "transition-shadow duration-200 hover:shadow-md"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-t border-gray-200 px-6 py-4", className)} {...props} />;
}

export { cardVariants };