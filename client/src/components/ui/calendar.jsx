import React from "react"
import { cn } from "@/utils"

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    // Simple placeholder for calendar
    return (
        <div className={cn("p-3 border rounded-md text-center", className)}>
            [Calendar Component Placeholder]
            <input type="date" className="block w-full mt-2" />
        </div>
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
