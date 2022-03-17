import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />
};

export default PrivateRoute;
