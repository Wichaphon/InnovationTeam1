// src/app/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "@/pages/RegisterPage";
import { LoginPage } from "@/pages/LoginPage";
import { UserAccountPage } from "@/features/user/hooks/page/userAccountPage";
import DashboardLayout from "@/components/layout/DashBoardlayout";
import ProtectedRoute from "@/routes/ProtectedRoutes";
import RequireRole from "@/routes/RequireRole";
import { AdminPage } from "@/features/user/hooks/page/adminPage";
import AuthCallback from "@/pages/AuthCallback";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected area */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route element={<RequireRole role="admin" />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                    <Route element={<RequireRole role="user" />}>
                        <Route path="/account" element={<UserAccountPage />} />
                        {/* Placeholder for future nested routes, e.g. /account/settings */}
                    </Route>
                </Route>
            </Route>
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
    );
}


