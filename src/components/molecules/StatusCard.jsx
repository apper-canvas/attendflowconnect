import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatusCard = ({ 
  className, 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  variant = "default" 
}) => {
  const variants = {
    default: "from-primary/5 to-primary-light/5 border-primary/10",
    success: "from-green-50 to-green-100 border-green-200",
    warning: "from-amber-50 to-amber-100 border-amber-200",
    error: "from-red-50 to-red-100 border-red-200",
  };

  const iconColors = {
    default: "text-primary",
    success: "text-green-600",
    warning: "text-amber-600",
    error: "text-red-600",
  };

  return (
    <Card className={cn("p-6 bg-gradient-to-br", variants[variant], className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ApperIcon name={icon} size={16} className={iconColors[variant]} />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold font-display text-gray-900">
          {value}
        </div>
        
        {subtitle && (
          <div className="flex items-center text-sm text-gray-600">
            {trend && (
              <ApperIcon 
                name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={cn(
                  "mr-1",
                  trend.direction === "up" ? "text-green-500" : "text-red-500"
                )}
              />
            )}
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatusCard;