import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import DatePicker from "@/components/molecules/DatePicker";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { memberService } from "@/services/api/memberService";

const AttendanceGrid = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [filterStatus, setFilterStatus] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceData, membersData] = await Promise.all([
        attendanceService.getByDate(selectedDate),
        memberService.getAll()
      ]);
      
      setAttendanceRecords(attendanceData);
      setMembers(membersData);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleStatusChange = async (recordId, newStatus) => {
    try {
      const record = attendanceRecords.find(r => r.Id === recordId);
      if (!record) return;

      const updatedRecord = {
        ...record,
        status: newStatus,
        checkIn: newStatus === "present" ? new Date().toISOString() : record.checkIn,
        checkOut: newStatus === "absent" ? null : record.checkOut
      };

      await attendanceService.update(recordId, updatedRecord);
      
      setAttendanceRecords(prev => 
        prev.map(r => r.Id === recordId ? updatedRecord : r)
      );
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleBulkAction = async (action) => {
    try {
      const filteredRecords = getFilteredRecords();
      
      for (const record of filteredRecords) {
        if (record.status !== action) {
          await handleStatusChange(record.Id, action);
        }
      }
      
      toast.success(`Bulk action completed: ${action}`);
    } catch (err) {
      toast.error("Failed to complete bulk action");
    }
  };

  const getFilteredRecords = () => {
    return attendanceRecords.filter(record => {
      const member = members.find(m => m.Id === record.memberId);
      const matchesSearch = member?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || record.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.Id === memberId);
    return member?.name || "Unknown Member";
  };

  const getMemberDepartment = (memberId) => {
    const member = members.find(m => m.Id === memberId);
    return member?.department || "Unknown Department";
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "success",
      absent: "error", 
      late: "warning",
      leave: "info"
    };
    return colors[status] || "default";
  };

  const filteredRecords = getFilteredRecords();

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load attendance"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search members..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            className="w-full lg:w-48"
          />
          
          <div className="w-full lg:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="leave">Leave</option>
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => handleBulkAction("present")}
          >
            <ApperIcon name="CheckCircle" size={16} className="mr-2" />
            Mark All Present
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleBulkAction("late")}
          >
            <ApperIcon name="Clock" size={16} className="mr-2" />
            Mark All Late
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleBulkAction("absent")}
          >
            <ApperIcon name="XCircle" size={16} className="mr-2" />
            Mark All Absent
          </Button>
        </div>
      </Card>

      {/* Attendance Grid */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold font-display">
            Attendance for {format(new Date(selectedDate), "MMMM dd, yyyy")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredRecords.length} records found
          </p>
        </div>
        
        {filteredRecords.length === 0 ? (
          <Empty
            title="No attendance records found"
            message="No records match your current filters."
            icon="CheckSquare"
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div key={record.Id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={20} className="text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getMemberName(record.memberId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getMemberDepartment(record.memberId)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {record.checkIn ? format(new Date(record.checkIn), "HH:mm") : "--:--"}
                    </div>
                    <div className="text-xs text-gray-500">Check In</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {record.checkOut ? format(new Date(record.checkOut), "HH:mm") : "--:--"}
                    </div>
                    <div className="text-xs text-gray-500">Check Out</div>
                  </div>
                  
                  <Badge variant={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusChange(record.Id, "present")}
                      disabled={record.status === "present"}
                    >
                      <ApperIcon name="CheckCircle" size={16} />
                    </Button>
                    
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleStatusChange(record.Id, "late")}
                      disabled={record.status === "late"}
                    >
                      <ApperIcon name="Clock" size={16} />
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(record.Id, "absent")}
                      disabled={record.status === "absent"}
                    >
                      <ApperIcon name="XCircle" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AttendanceGrid;