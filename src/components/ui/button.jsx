import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow hover:from-emerald-600 hover:to-emerald-700": variant === "default",
          "bg-red-500 text-white shadow-sm hover:bg-red-600": variant === "destructive",
          "border-2 border-emerald-500/30 bg-transparent hover:bg-emerald-500/10": variant === "outline",
          "bg-white/10 text-white hover:bg-white/20": variant === "secondary",
          "hover:bg-white/10": variant === "ghost",
        },
        {
          "h-9 px-4 py-2": size === "default",
          "h-8 rounded-md px-3 text-xs": size === "sm",
          "h-10 rounded-md px-8": size === "lg",
          "h-9 w-9": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
