import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { Card } from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leaveRequestService } from "@/services/api/leaveRequestService";
import { format } from "date-fns";

const LeaveRequestManagerPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await leaveRequestService.getAll();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Failed to load leave requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await leaveRequestService.approve(id);
      setRequests(prev => prev.map(req => 
        req.Id === id ? { ...req, status: "approved" } : req
      ));
      toast.success("Leave request approved");
    } catch (error) {
      toast.error("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await leaveRequestService.reject(id);
      setRequests(prev => prev.map(req => 
        req.Id === id ? { ...req, status: "rejected" } : req
      ));
      toast.success("Leave request rejected");
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={`${config.color} border-0`}>
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      vacation: "Sun",
      sick: "Heart",
      personal: "User",
      emergency: "AlertTriangle"
    };
    return typeIcons[type] || "Calendar";
  };

  if (isLoading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load requests"
        message={error}
        onRetry={fetchRequests}
      />
    );
  }

  const pendingRequests = requests.filter(req => req.status === "pending");
  const processedRequests = requests.filter(req => req.status !== "pending");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Manage Leave Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Review and approve team leave requests
          </p>
        </div>
        <Button
          onClick={() => navigate("/leave-requests")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Requests
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(req => req.status === "approved").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="XCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(req => req.status === "rejected").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Requests ({pendingRequests.length})
        </h2>
        
        {pendingRequests.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pending Requests
            </h3>
            <p className="text-gray-600">
              All leave requests have been processed
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.Id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getTypeIcon(request.type)} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {request.employeeName}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 capitalize">
                        {request.type} Leave
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        {format(new Date(request.startDate), "MMM dd, yyyy")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(request.Id)}
                      disabled={processingId === request.Id}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      {processingId === request.Id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ApperIcon name="Check" size={16} />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(request.Id)}
                      disabled={processingId === request.Id}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {processingId === request.Id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ApperIcon name="X" size={16} />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Processed Requests
          </h2>
          <div className="space-y-3">
            {processedRequests.slice(0, 5).map((request) => (
              <Card key={request.Id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getTypeIcon(request.type)} size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.employeeName}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestManagerPage;