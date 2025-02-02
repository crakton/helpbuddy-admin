import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        afrunaOutline:
          "font-semibold border border-sky-400 text-sky-500",
        afrunaBlue:
          "font-semibold text-xs bg-sky-500 text-white",
        lightgradientblue:
          "text-white bg-gradient-to-tr to-blue-400 from-[#399878] hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-800 transition duration-500",
        deepgradientblue:
          "text-white bg-gradient-to-t from-blue-500 to-blue-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-800 transition duration-500",

        greenbutton: "text-black bg-green-400 text-sm hover:bg-green-300",
        primary:
          "text-white bg-gradient-to-b from-green-400 to-blue-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-800 transition duration-500",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
