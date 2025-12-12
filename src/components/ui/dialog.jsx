import React from "react"

const DialogContext = React.createContext({})

const Dialog = ({ children, open, onOpenChange }) => {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    )
}

const DialogTrigger = ({ children, asChild }) => {
    const { onOpenChange } = React.useContext(DialogContext)
    return <div onClick={() => onOpenChange(true)}>{children}</div>
}

const DialogContent = ({ children, className }) => {
    const { open, onOpenChange } = React.useContext(DialogContext)
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className={`bg-white p-6 rounded-lg shadow-lg relative ${className}`}>
                <button onClick={() => onOpenChange(false)} className="absolute top-2 right-2">X</button>
                {children}
            </div>
        </div>
    )
}

const DialogHeader = ({ children }) => <div className="flex flex-col space-y-1.5 text-center sm:text-left">{children}</div>
const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>

const DialogDescription = ({ children, className }) => <p className={`text-sm text-slate-500 ${className}`}>{children}</p>
const DialogFooter = ({ children, className }) => <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }
