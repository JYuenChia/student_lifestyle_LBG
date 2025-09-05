import * as React from "react"
import { cn } from "@/lib/utils"

const Toggle = React.forwardRef(({ 
  className, 
  pressed, 
  onPressedChange, 
  variant = "default",
  size = "default",
  children,
  style,
  ...props 
}, ref) => {
  const handleClick = () => {
    if (onPressedChange) {
      onPressedChange(!pressed)
    }
  }

  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variantClasses = {
    default: "bg-transparent hover:bg-gray-100",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-50"
  }
  
  const sizeClasses = {
    default: "h-10 px-3",
    sm: "h-9 px-2.5", 
    lg: "h-11 px-5"
  }

  const pressedClasses = pressed 
    ? "bg-gray-100 text-gray-900" 
    : "text-gray-600"

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pressedClasses,
        className
      )}
      style={style}
      onClick={handleClick}
      data-state={pressed ? "on" : "off"}
      {...props}
    >
      {children}
    </button>
  )
})

Toggle.displayName = "Toggle"

export { Toggle }
