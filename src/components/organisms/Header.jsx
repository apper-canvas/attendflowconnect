import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Attendance", href: "/attendance", icon: "CheckSquare" },
    { name: "Members", href: "/members", icon: "Users" },
    { name: "Reports", href: "/reports", icon: "FileText" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ];

  const currentDateTime = format(new Date(), "EEEE, MMMM dd, yyyy • HH:mm");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
              <span className="ml-2 text-xl font-bold font-display text-gray-900">
                AttendFlow
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10 border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )
                }
              >
                <ApperIcon name={item.icon} size={16} className="mr-2" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Date/Time Display */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              {currentDateTime}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    )
                  }
                >
                  <ApperIcon name={item.icon} size={20} className="mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center px-3 py-2 text-sm text-gray-600">
                <ApperIcon name="Calendar" size={16} className="mr-2" />
                {currentDateTime}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;