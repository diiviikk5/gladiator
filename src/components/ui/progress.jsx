import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
      className
    )}
    {...props}
  >
    <div
      className={cn("h-full w-full flex-1 bg-emerald-500 transition-all duration-500", indicatorClassName)}
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
