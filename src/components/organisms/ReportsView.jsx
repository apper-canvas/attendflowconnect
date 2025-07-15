import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import DatePicker from "@/components/molecules/DatePicker";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { memberService } from "@/services/api/memberService";

const ReportsView = () => {
  const [reportData, setReportData] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [reportType, setReportType] = useState("monthly");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [membersData, attendanceData] = await Promise.all([
        memberService.getAll(),
        attendanceService.getAll()
      ]);
      
      setMembers(membersData);
      
      // Filter attendance data for selected month
      const monthStart = startOfMonth(new Date(selectedMonth));
      const monthEnd = endOfMonth(new Date(selectedMonth));
      
      const monthlyAttendance = attendanceData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      // Generate report data
      const reportData = generateMonthlyReport(membersData, monthlyAttendance, monthStart, monthEnd);
      setReportData(reportData);
      
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyReport = (members, attendanceData, monthStart, monthEnd) => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const workingDays = daysInMonth.filter(day => {
      const dayOfWeek = day.getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6; // Exclude weekends
    });
    
    return members.map(member => {
      const memberAttendance = attendanceData.filter(record => record.memberId === member.Id);
      
      const presentDays = memberAttendance.filter(record => record.status === "present").length;
      const absentDays = memberAttendance.filter(record => record.status === "absent").length;
      const lateDays = memberAttendance.filter(record => record.status === "late").length;
      const leaveDays = memberAttendance.filter(record => record.status === "leave").length;
      
      const totalWorkingDays = workingDays.length;
      const attendanceRate = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;
      
      return {
        memberId: member.Id,
        memberName: member.name,
        department: member.department,
        presentDays,
        absentDays,
        lateDays,
        leaveDays,
        totalWorkingDays,
        attendanceRate
      };
    });
  };

  useEffect(() => {
    loadReportData();
  }, [selectedMonth]);

  const exportReport = () => {
    const csvContent = [
      ["Member", "Department", "Present Days", "Absent Days", "Late Days", "Leave Days", "Total Working Days", "Attendance Rate"],
      ...reportData.map(row => [
        row.memberName,
        row.department,
        row.presentDays,
        row.absentDays,
        row.lateDays,
        row.leaveDays,
        row.totalWorkingDays,
        `${row.attendanceRate}%`
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-report-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAttendanceRateColor = (rate) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load reports"
        message={error}
        onRetry={loadReportData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">
            Attendance Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Generate and view detailed attendance analytics
          </p>
        </div>
        
        <Button
          onClick={exportReport}
          className="w-full sm:w-auto"
          disabled={reportData.length === 0}
        >
          <ApperIcon name="Download" size={16} className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="monthly">Monthly Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="daily">Daily Report</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-600">Total Members</h3>
              <p className="text-2xl font-bold text-blue-900">{reportData.length}</p>
            </div>
            <ApperIcon name="Users" size={24} className="text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-600">Avg Attendance</h3>
              <p className="text-2xl font-bold text-green-900">
                {reportData.length > 0 
                  ? Math.round(reportData.reduce((sum, item) => sum + item.attendanceRate, 0) / reportData.length)
                  : 0}%
              </p>
            </div>
            <ApperIcon name="TrendingUp" size={24} className="text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-600">Total Present</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {reportData.reduce((sum, item) => sum + item.presentDays, 0)}
              </p>
            </div>
            <ApperIcon name="CheckCircle" size={24} className="text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-600">Total Absent</h3>
              <p className="text-2xl font-bold text-red-900">
                {reportData.reduce((sum, item) => sum + item.absentDays, 0)}
              </p>
            </div>
            <ApperIcon name="XCircle" size={24} className="text-red-600" />
          </div>
        </Card>
      </div>

      {/* Report Table */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold font-display">
            Monthly Attendance Report - {format(new Date(selectedMonth), "MMMM yyyy")}
          </h2>
        </div>
        
        {reportData.length === 0 ? (
          <Empty
            title="No report data available"
            message="No attendance data found for the selected period."
            icon="FileText"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-900">Member</th>
                  <th className="text-left p-4 font-medium text-gray-900">Department</th>
                  <th className="text-center p-4 font-medium text-gray-900">Present</th>
                  <th className="text-center p-4 font-medium text-gray-900">Absent</th>
                  <th className="text-center p-4 font-medium text-gray-900">Late</th>
                  <th className="text-center p-4 font-medium text-gray-900">Leave</th>
                  <th className="text-center p-4 font-medium text-gray-900">Working Days</th>
                  <th className="text-center p-4 font-medium text-gray-900">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row) => (
                  <tr key={row.memberId} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={16} className="text-primary" />
                        </div>
                        <span className="font-medium text-gray-900">{row.memberName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{row.department}</td>
                    <td className="p-4 text-center font-medium text-green-600">{row.presentDays}</td>
                    <td className="p-4 text-center font-medium text-red-600">{row.absentDays}</td>
                    <td className="p-4 text-center font-medium text-yellow-600">{row.lateDays}</td>
                    <td className="p-4 text-center font-medium text-blue-600">{row.leaveDays}</td>
                    <td className="p-4 text-center text-gray-600">{row.totalWorkingDays}</td>
                    <td className="p-4 text-center">
                      <span className={cn("font-bold", getAttendanceRateColor(row.attendanceRate))}>
                        {row.attendanceRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportsView;