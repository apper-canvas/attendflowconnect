import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const DatePicker = ({ 
  className, 
  value, 
  onChange, 
  label,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="pr-10"
          {...props}
        />
        <ApperIcon 
          name="Calendar" 
          size={20} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
    </div>
  );
};

export default DatePicker;