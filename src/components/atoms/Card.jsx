import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-sm hover:shadow-md",
    elevated: "bg-white shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-gray-200 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;