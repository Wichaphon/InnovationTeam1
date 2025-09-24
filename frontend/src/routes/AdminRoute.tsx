import { useAuth } from "@/contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {
    const {user} = useAuth();
    return user?.role?.name == "admin" ? <Outlet/> : <Navigate to="/account" replace />;
}