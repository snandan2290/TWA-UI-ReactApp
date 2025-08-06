import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom"; // ⬅️ no BrowserRouter here
import { useSelector } from "react-redux";
import Login from "./components/auth/login";
import SupDashboard from "./components/supDashboard/manageWorkOrder";
import AdminDashboard from "./components/adminDashboard/manageAdminDashboard";
import Feedback from "./components/feedBackDashboard/operatorFeedback";
import UserManagement from "./components/userManagementDashboard/userManagement";
import ChangePassword from "./components/auth/changePassword";
import PrivateRoute from "./components/common/privateRoute";
import { API_IMAGE_URL } from "./constants/configValues";
import axios from "axios";
import setAuthToken from "./utils/setAuthToken";
import FeedbackDashboardSupervisor from "./components/feedBackDashboard/feedbackDashboardSupervisor";
import FeedbackDashboardOperator from "./components/feedBackDashboard/feedbackDashboardOperator";

const App = () => {
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // pass the token after page refresh
    setAuthToken(localStorage.getItem("jwt_token"));
    axios.defaults.baseURL = API_IMAGE_URL + "/api";
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  const user = auth.user;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        {user.role === "Supervisor" && user.isAdmin && (
          <>
            <Route path="/manageWorkOrder" element={<SupDashboard />} />
            <Route path="/masterdatamanagement" element={<AdminDashboard />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/feedbackDashboardSupervisor" element={<FeedbackDashboardSupervisor />} />
          </>
        )}

        {user.role === "Supervisor" && !user.isAdmin && (
          <>
            <Route path="/manageWorkOrder" element={<SupDashboard />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/feedbackDashboardSupervisor" element={<FeedbackDashboardSupervisor />} />
          </>
        )}

        {(user.role === "Admin" ||
          (user.role === "Operator" && user.isAdmin)) && (
          <>
            <Route path="/masterdatamanagement" element={<AdminDashboard />} />
            <Route path="/usermanagement" element={<UserManagement />} />
             <Route path="/feedbackDashboardOperator" element={<FeedbackDashboardOperator />} />
          </>
        )}

        <Route path="/changepassword" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
};

export default App;
