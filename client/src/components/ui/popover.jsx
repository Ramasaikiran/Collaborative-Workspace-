import React from "react"
import { cn } from "@/utils"

const Popover = ({ children }) => <>{children}</>
const PopoverTrigger = ({ children, asChild }) => <>{children}</>
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <div ref={ref} className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className)} {...props} />
))

export { Popover, PopoverTrigger, PopoverContent }
