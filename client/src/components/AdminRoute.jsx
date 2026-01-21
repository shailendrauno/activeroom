import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // or loader

  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/rooms" />;

  return children;
};

export default AdminRoute;
