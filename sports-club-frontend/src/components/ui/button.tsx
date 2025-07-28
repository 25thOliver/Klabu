import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-sport hover:scale-105 transition-bounce",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-sport transition-bounce",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-energy hover:scale-105 transition-bounce",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-md",
        link: "text-primary underline-offset-4 hover:underline",
        athletic: "bg-gradient-athletic text-white hover:shadow-sport hover:scale-105 transition-bounce",
        energy: "bg-gradient-energy text-white hover:shadow-energy hover:scale-105 transition-bounce",
        accent: "bg-gradient-accent text-accent-foreground hover:shadow-accent hover:scale-105 transition-bounce",
        hero: "bg-gradient-hero text-white hover:shadow-sport hover:scale-110 transition-bounce text-base font-bold",
        sport: "bg-primary text-primary-foreground hover:bg-primary-light hover:shadow-sport transition-athletic",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-14 rounded-xl px-10 text-lg font-bold",
        xl: "h-16 rounded-xl px-12 text-xl font-bold",
        icon: "h-11 w-11",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
