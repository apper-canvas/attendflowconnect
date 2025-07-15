import { useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  const [settings, setSettings] = useState({
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    lateThreshold: 15,
    autoCheckOut: false,
    notifications: {
      email: true,
      push: false
    },
    organization: {
      name: "My Organization",
      timezone: "America/New_York"
    }
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    // Save settings logic would go here
    toast.success("Settings saved successfully");
  };

  const tabs = [
    { id: "general", name: "General", icon: "Settings" },
    { id: "attendance", name: "Attendance", icon: "Clock" },
    { id: "notifications", name: "Notifications", icon: "Bell" },
    { id: "organization", name: "Organization", icon: "Building" }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-display mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <Input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, start: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <Input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, end: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold font-display mb-4">Late Threshold</h3>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minutes after start time to mark as late
          </label>
          <Input
            type="number"
            value={settings.lateThreshold}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              lateThreshold: parseInt(e.target.value) || 0
            }))}
            min="0"
            max="60"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">Auto Check-Out</h4>
          <p className="text-sm text-gray-600">
            Automatically check out employees at end of working hours
          </p>
        </div>
        <button
          onClick={() => setSettings(prev => ({
            ...prev,
            autoCheckOut: !prev.autoCheckOut
          }))}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            settings.autoCheckOut ? "bg-primary" : "bg-gray-200"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              settings.autoCheckOut ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );

  const renderAttendanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-display mb-4">Attendance Policies</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Grace Period</h4>
            <p className="text-sm text-gray-600 mb-3">
              Allow employees a grace period before marking them as late
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={settings.lateThreshold}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  lateThreshold: parseInt(e.target.value) || 0
                }))}
                min="0"
                max="30"
                className="w-20"
              />
              <span className="text-sm text-gray-600">minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-display mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive email alerts for attendance updates
              </p>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, email: !prev.notifications.email }
              }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                settings.notifications.email ? "bg-primary" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  settings.notifications.email ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive push notifications for real-time updates
              </p>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, push: !prev.notifications.push }
              }))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                settings.notifications.push ? "bg-primary" : "bg-gray-200"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  settings.notifications.push ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold font-display mb-4">Organization Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <Input
              type="text"
              value={settings.organization.name}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                organization: { ...prev.organization, name: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.organization.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                organization: { ...prev.organization, timezone: e.target.value }
              }))}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure your attendance management system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Content */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            {activeTab === "general" && renderGeneralSettings()}
            {activeTab === "attendance" && renderAttendanceSettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "organization" && renderOrganizationSettings()}
            
            <div className="mt-6 pt-6 border-t">
              <Button onClick={handleSave}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;