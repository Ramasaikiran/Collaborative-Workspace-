import React from "react"
import { cn } from "@/utils"

const TabsContext = React.createContext({})

const Tabs = ({ value, onValueChange, children }) => (
    <TabsContext.Provider value={{ value, onValueChange }}>
        <div className="w-full">{children}</div>
    </TabsContext.Provider>
)

const TabsList = ({ className, children }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
        {children}
    </div>
)

const TabsTrigger = ({ value: triggerValue, children, className }) => {
    const { value, onValueChange } = React.useContext(TabsContext)
    const isActive = value === triggerValue
    return (
        <button
            className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", isActive && "bg-white shadow-sm text-slate-900", className)}
            onClick={() => onValueChange(triggerValue)}
        >
            {children}
        </button>
    )
}

const TabsContent = ({ value: contentValue, children, className }) => {
    const { value } = React.useContext(TabsContext)
    if (value !== contentValue) return null
    return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
