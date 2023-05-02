import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const auth = JSON.parse(sessionStorage.getItem("login"));
  
  const accessToken = auth?.data?.accessToken;
  if (!!accessToken) {
    return true;
  } else if (
    accessToken === null ||
    accessToken === undefined 
  ) {
    return false;
  }
};

const ProtectedRoutes = () => {
  const auth = useAuth();
  return auth ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoutes;
