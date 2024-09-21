import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";

// This component will act as a route guard
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" />; 
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />; 
  }

  return children;
};

export default ProtectedRoute;
