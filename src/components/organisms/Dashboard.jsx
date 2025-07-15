import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatusCard from "@/components/molecules/StatusCard";
import QuickAction from "@/components/molecules/QuickAction";
import ApperIcon from "@/components/ApperIcon";
import { attendanceService } from "@/services/api/attendanceService";
import { memberService } from "@/services/api/memberService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0
  });
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const today = format(new Date(), "yyyy-MM-dd");
      
      const [attendanceData, membersData] = await Promise.all([
        attendanceService.getByDate(today),
        memberService.getAll()
      ]);
      
      setTodayAttendance(attendanceData);
      setMembers(membersData);
      
      // Calculate stats
      const totalMembers = membersData.length;
      const presentToday = attendanceData.filter(a => a.status === "present").length;
      const absentToday = attendanceData.filter(a => a.status === "absent").length;
      const lateToday = attendanceData.filter(a => a.status === "late").length;
      const attendanceRate = totalMembers > 0 ? Math.round((presentToday / totalMembers) * 100) : 0;
      
      setStats({
        totalMembers,
        presentToday,
        absentToday,
        lateToday,
        attendanceRate
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getQuickCheckInMembers = () => {
    const absentMembers = todayAttendance.filter(a => a.status === "absent");
    return absentMembers.slice(0, 3).map(attendance => {
      const member = members.find(m => m.Id === attendance.memberId);
      return {
        ...attendance,
        memberName: member?.name || "Unknown Member"
      };
    });
  };

  const getRecentActivity = () => {
    const recentActivity = todayAttendance
      .filter(a => a.checkIn)
      .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
      .slice(0, 5);
    
    return recentActivity.map(attendance => {
      const member = members.find(m => m.Id === attendance.memberId);
      return {
        ...attendance,
        memberName: member?.name || "Unknown Member"
      };
    });
  };

  if (loading) {
    return <Loading variant="dashboard" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load dashboard"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold font-display mb-2">
          Welcome to AttendFlow
        </h1>
        <p className="text-primary-100 text-lg">
          {format(new Date(), "EEEE, MMMM dd, yyyy")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Total Members"
          value={stats.totalMembers}
          subtitle="Active employees"
          icon="Users"
          variant="default"
        />
        
        <StatusCard
          title="Present Today"
          value={stats.presentToday}
          subtitle="Currently checked in"
          icon="CheckCircle"
          variant="success"
        />
        
        <StatusCard
          title="Absent Today"
          value={stats.absentToday}
          subtitle="Not checked in"
          icon="XCircle"
          variant="error"
        />
        
        <StatusCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          subtitle="Today's performance"
          icon="TrendingUp"
          variant="default"
          trend={{
            direction: stats.attendanceRate >= 80 ? "up" : "down"
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Check-in */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display">
              Quick Check-in
            </h2>
            <ApperIcon name="Clock" size={20} className="text-primary" />
          </div>
          
          <div className="space-y-3">
            {getQuickCheckInMembers().length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
                </div>
                <p className="text-gray-600">All members are checked in!</p>
              </div>
            ) : (
              getQuickCheckInMembers().map((attendance) => (
                <QuickAction
                  key={attendance.Id}
                  title={attendance.memberName}
                  description="Not checked in yet"
                  icon="User"
                  onClick={() => {
                    // Quick check-in functionality would go here
                    console.log("Quick check-in for", attendance.memberName);
                  }}
                  variant="success"
                />
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display">
              Recent Activity
            </h2>
            <ApperIcon name="Activity" size={20} className="text-primary" />
          </div>
          
          <div className="space-y-3">
            {getRecentActivity().length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Clock" size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-600">No recent activity</p>
              </div>
            ) : (
              getRecentActivity().map((attendance) => (
                <div key={attendance.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{attendance.memberName}</p>
                      <p className="text-sm text-gray-600">
                        Checked in at {format(new Date(attendance.checkIn), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">View Attendance</h3>
              <p className="text-sm text-blue-700">Check today's records</p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
              onClick={() => window.location.href = "/attendance"}
            >
              <ApperIcon name="CheckSquare" size={16} className="mr-2" />
              View
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">Manage Members</h3>
              <p className="text-sm text-green-700">Add or edit team members</p>
            </div>
            <Button 
              variant="outline" 
              className="border-green-300 text-green-700 hover:bg-green-600 hover:text-white"
              onClick={() => window.location.href = "/members"}
            >
              <ApperIcon name="Users" size={16} className="mr-2" />
              Manage
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-purple-900">Generate Reports</h3>
              <p className="text-sm text-purple-700">View detailed analytics</p>
            </div>
            <Button 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-600 hover:text-white"
              onClick={() => window.location.href = "/reports"}
            >
              <ApperIcon name="FileText" size={16} className="mr-2" />
              Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;