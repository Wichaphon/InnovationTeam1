import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/features/user/hooks/useUser";
import type { Role } from "@/types/type";

type Props = { role:Role };

export default function RequireRole({role}:Props){
    const {data:user, isLoading, error} = useUser();
    const location = useLocation();

    if (isLoading) return <div>Loading profile...</div>

    if(error || !user) return <Navigate to="/login" replace/>;

    const userRole:string = user.role?.name as string;
    if (userRole !== role) return <Navigate to="/account" replace state={{from : location}}/>;

    return <Outlet/>
}