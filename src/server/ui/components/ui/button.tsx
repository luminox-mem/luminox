import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-tech font-medium tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-cyan-500/30 bg-background/50 backdrop-blur-sm shadow-xs hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 dark:bg-input/30 dark:border-cyan-500/30 dark:hover:bg-cyan-500/10",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-cyan-500/10 hover:border-cyan-500/20",
        ghost:
          "hover:bg-cyan-500/10 hover:text-cyan-400 dark:hover:bg-cyan-500/10",
        link: "text-cyan-500 underline-offset-4 hover:underline hover:text-cyan-400",
        cyber:
          "relative bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/50 text-cyan-400 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(34,211,238,0.1)] clip-path-cyber",
        neon:
          "bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.7),inset_0_0_20px_rgba(34,211,238,0.2)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
