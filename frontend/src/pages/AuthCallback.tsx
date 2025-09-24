import { useUser } from "@/features/user/hooks/useUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const {data:user, isLoading} = useUser();
  const nav = useNavigate();

  useEffect(() => {
    if(!isLoading){
      if (user) nav(user.role?.name == "admin" ? '/admin' : '/account');
      else{
        nav('/login');
      }
    }

  }, [isLoading, user, nav]);

  return <p>Logging you in...</p>;
}
