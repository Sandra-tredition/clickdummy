import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm text-black [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:w-5 [&>svg]:h-5 [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "bg-background [&>svg]:text-foreground [&>svg]:fill-current",
        destructive:
          "border-destructive/50 dark:border-destructive [&>svg]:text-destructive [&>svg]:fill-current",
        info: "border-blue-200 bg-blue-50 [&>svg]:fill-blue-600 [&>svg]:text-white",
        success:
          "border-green-200 bg-green-50 [&>svg]:fill-green-600 [&>svg]:text-white",
        warning:
          "border-yellow-200 bg-yellow-50 [&>svg]:fill-yellow-600 [&>svg]:text-white",
        error:
          "border-red-200 bg-red-50 [&>svg]:fill-red-600 [&>svg]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
