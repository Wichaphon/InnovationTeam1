// src/app/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "@/pages/RegisterPage";
import { LoginPage } from "@/pages/LoginPage";
import { AccountPage } from "@/features/user/hooks/page/AccountPage";
import DashboardLayout from "@/components/layout/DashBoardlayout";
import ProtectedRoute from "@/routes/ProtectedRoutes";

export default function AppRoutes() {
    return (
        <Routes>
            {/* หน้าแรกให้ไป /register ชั่วคราว */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Public routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected area (ต้องผ่าน ProtectedRoute ก่อน) */}
            <Route element={<ProtectedRoute />}>
            {/* <Route> */}
                {/* วาง DashboardLayout ไว้ตรงกลุ่ม dashboard */}
                <Route element={<DashboardLayout />}>
                    <Route path="/account" element={<AccountPage />} />
                    {/* เพิ่มหน้าอื่นใต้แดชบอร์ดได้ เช่น /dashboard/settings */}
                </Route>
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
    );
}
