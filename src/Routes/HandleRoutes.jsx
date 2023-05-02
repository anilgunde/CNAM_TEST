import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { PATHS } from "../utils/constants";
import ProtectedRoutes from "./ProtectedRoute";

const MenuBar = lazy(() => import("../Pages/NavMenu/NavMenu"));
const LoginPage = lazy(() => import("../Pages/LoginPage/Login"));
const OTP = lazy(() => import("../Pages/LoginPage/Otp"));
const LoginTypesPage = lazy(() => import("../Pages/LoginPage/LoginTypes"));
const LoginPasswordPage = lazy(() => import("../Pages/LoginPage/Password"));
const LoginFacePage = lazy(() => import("../Pages/LoginPage/Face.tsx"));
const LoginFingerPage = lazy(() => import("../Pages/LoginPage/Finger.tsx"));

// const LoginPage2 = lazy(() => import("../Pages/LoginPage/Login2"));
// const DashboardPage = lazy(() => import("../Pages/Dashboard/Dashboard"));

const SampleDashboardPage = lazy(() => import("../Pages/Dashboard/Sample"));
const CreateUserPage = lazy(() => import("../Pages/UserManagement/CreateUser"));
const UpdateUserPage = lazy(() => import("../Pages/UserManagement/UpdateUser"));
const UserListPage = lazy(() => import("../Pages/UserManagement/UserLists"));


const EnrollmentsPageee = lazy(() => import("../Pages/Enrollments/Common"));
const CongurationPage = lazy(() => import("../Pages/Configuration/Configuration"));
const NotFound = lazy(() => import("../Pages/Error/NotFound"));
const MetricReportsPage = lazy(() => import("../Pages/Metric/MetricReports"));
const MetricRegistrationsPage = lazy(() =>
  import("../Pages/Metric/Registrations"),
);
const MetricAuditTrailPage = lazy(() => import("../Pages/Metric/AuditTrails"));
const MetricUsersPage = lazy(() => import("../Pages/Metric/UsersPage"));
const AdjudicationPage = lazy(() =>
  import("../Pages/Adjudicator/Adjudications"),
);
const DeviceManagementPage = lazy(() =>
  import("../Pages/DeviceManagement/DeviceList"),
);
const DeviceDetailsPage = lazy(() =>
  import("../Pages/DeviceManagement/DeviceDetails"),
);
const DeviceRegistrationsPage = lazy(() =>
  import("../Pages/DeviceManagement/DeviceRegistrations"),
);
const PasswordChangeRequestPage = lazy(() =>
  import("../Pages/LoginPage/PasswordChangeRequest"),
);

const HandleRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path='/' element={<LoginPage />} />
    <Route path='/otp/verify' element={<OTP />} />
    <Route path='/*' element={<NotFound />} />
    {/* Private Routes */}
    <Route element={<ProtectedRoutes />}>
      
      {/* <Route path={PATHS.password} element={<LoginPasswordPage />} /> */}
      
      {/* <Route path={PATHS.face} element={<LoginFacePage />} />
      <Route path={PATHS.finger} element={<LoginFingerPage />} /> */}
      <Route element={<MenuBar />}>
        <Route path={PATHS.dashboard} element={<SampleDashboardPage />} />
        
        <Route path={PATHS.enrollments.root} element={<EnrollmentsPageee />} />
        <Route
          path={`${PATHS.enrollments.root}/edit/:enrolmentId`}
          element={<UpdateUserPage />}/>
        
        <Route path={PATHS.configuration.root} element={<CongurationPage />} />
        <Route path={PATHS.userManagement.root} element={<UserListPage />} />
        
        <Route
          path={PATHS.userManagement.createUser}
          element={<CreateUserPage />}
        />

        <Route
          path={PATHS.deviceManagement.root}
          element={<DeviceManagementPage />}
        />

        <Route
          path={PATHS.deviceManagement.deviceDetails}
          element={<DeviceDetailsPage />}
        />
        <Route
          path={PATHS.deviceManagement.deviceRequests}
          element={<DeviceRegistrationsPage />}
        />
        {/* <Route
          path={PATHS.metric.adjudication}
          element={<AdjudicationPage />}
        /> */}
        {/* <Route path={PATHS.userManagement.root} element={<UserListPage />} /> */}
        {/* <Route
          path={`${PATHS.userManagement.userLists}/edit/:userNumber/:passwordEnabled/:reportingRole`}
          element={<UpdateUserPage />}
        /> */}
        {/* <Route path={PATHS.metric.root} element={<MetricReportsPage />} /> */}
        {/* <Route
          path={PATHS.metric.registrations}
          element={<MetricRegistrationsPage />}
        /> */}
        {/* <Route
          path={PATHS.datasets.registrations}
          element={<MetricRegistrationsPage />}
        /> */}
        {/* <Route path={PATHS.datasets.users} element={<MetricUsersPage />} /> */}
        {/* <Route
          path={PATHS.datasets.auditTrail}
          element={<MetricAuditTrailPage />}
        /> */}
        

        
      </Route>
    </Route>
  </Routes>
);

export default HandleRoutes;
