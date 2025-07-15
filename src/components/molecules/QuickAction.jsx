import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAction = ({ 
  className, 
  title, 
  description, 
  icon, 
  onClick, 
  variant = "default",
  disabled = false 
}) => {
  return (
    <div className={cn("flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", className)}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={16} className="text-primary" />
          </div>
        )}
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      
      <Button
        variant={variant}
        size="sm"
        onClick={onClick}
        disabled={disabled}
      >
        <ApperIcon name="ChevronRight" size={16} />
      </Button>
    </div>
  );
};

export default QuickAction;