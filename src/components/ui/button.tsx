import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../shared/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E5E7EB] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        outline:
          "border border-input bg-white hover:bg-[#E5E7EB] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        ghost: "hover:bg-[#E5E7EB] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }