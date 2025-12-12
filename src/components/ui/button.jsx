import React from "react"
import { cn } from "@/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
        ghost: "hover:bg-slate-100 text-slate-900",
    }
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "h-10 w-10",
    }
    return (
        <button
            className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
