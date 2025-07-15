import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import DashboardPage from "@/components/pages/DashboardPage";
import AttendancePage from "@/components/pages/AttendancePage";
import MembersPage from "@/components/pages/MembersPage";
import ReportsPage from "@/components/pages/ReportsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import LeaveRequestsPage from "@/components/pages/LeaveRequestsPage";
import LeaveRequestManagerPage from "@/components/pages/LeaveRequestManagerPage";

function App() {
  return (
    <>
      <Routes>
<Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="leave-requests" element={<LeaveRequestsPage />} />
          <Route path="leave-requests/manage" element={<LeaveRequestManagerPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;