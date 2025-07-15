import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import Card from "@/components/atoms/Card";
import DatePicker from '@/components/molecules/DatePicker'
import ApperIcon from '@/components/ApperIcon'
import { leaveRequestService } from "@/services/api/leaveRequestService";
import { format } from "date-fns";

const LeaveRequestsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    type: "vacation"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        ...formData,
        employeeId: 1, // Current user ID - would come from auth context
        employeeName: "John Smith", // Current user name - would come from auth context
        requestDate: new Date().toISOString(),
        status: "pending"
      };

      await leaveRequestService.create(requestData);
      toast.success("Leave request submitted successfully");
      
      // Reset form
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
        type: "vacation"
      });
    } catch (error) {
      toast.error("Failed to submit leave request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Leave Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Submit and manage your leave requests
          </p>
        </div>
        <Button
          onClick={() => navigate("/leave-requests/manage")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="Settings" size={16} />
          Manage Requests
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submit Leave Request Form */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Submit Leave Request
              </h2>
              <p className="text-sm text-gray-600">
                Fill in the details for your leave request
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="vacation">Vacation</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  value={formData.startDate}
                  onChange={(value) => handleDateChange("startDate", value)}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  value={formData.endDate}
                  onChange={(value) => handleDateChange("endDate", value)}
                  placeholder="Select end date"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please provide the reason for your leave request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Send" size={16} />
                  Submit Request
                </div>
              )}
            </Button>
          </form>
        </Card>

        {/* Quick Info */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Info" size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Leave Policy
              </h2>
              <p className="text-sm text-gray-600">
                Important information about leave requests
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="CheckCircle" size={16} className="text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Submit in Advance</h3>
                <p className="text-sm text-gray-600">
                  Submit leave requests at least 2 weeks in advance for approval
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ApperIcon name="Clock" size={16} className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Processing Time</h3>
                <p className="text-sm text-gray-600">
                  Requests are typically processed within 2-3 business days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ApperIcon name="Users" size={16} className="text-purple-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Manager Approval</h3>
                <p className="text-sm text-gray-600">
                  All leave requests require manager approval
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ApperIcon name="AlertTriangle" size={16} className="text-orange-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Emergency Leave</h3>
                <p className="text-sm text-gray-600">
                  For urgent situations, contact your manager directly
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeaveRequestsPage;