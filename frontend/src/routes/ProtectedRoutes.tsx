import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";

export default function ProtectedRoute() {
  const { data:user, isLoading, error } = useUser();

  if (isLoading) return <div>Loading.....</div>;

  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// {
//     // const { data: user, isLoading, error } = useUser(); // จะอ่านจาก cache ก่อน ถ้าไม่มีค่อยยิง /auth/me
//     const {data:user, isLoading} = useUser();
//     if (isLoading) return <div>Loading+...</div>;
//     return user ? <Outlet /> : <Navigate to="/login" replace />;
// }
