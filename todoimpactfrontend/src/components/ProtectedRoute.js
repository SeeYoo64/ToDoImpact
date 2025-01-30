import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ token, children }) {
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;