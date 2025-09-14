// routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";

export default function ProtectedRoute() {
  const { data: user, isLoading, error } = useUser(); // จะอ่านจาก cache ก่อน ถ้าไม่มีค่อยยิง /auth/me
  if (isLoading) return <div>Loading...</div>;
  if (error || !user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
