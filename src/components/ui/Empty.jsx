import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add New", 
  onAction,
  icon = "Database"
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-primary" />
      </div>
      
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:from-primary-dark hover:to-primary transform hover:scale-102 transition-all duration-200 shadow-lg"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;