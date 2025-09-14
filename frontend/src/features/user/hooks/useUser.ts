// hooks/useUser.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService,  } from "@/services/user.services";
import type { User } from "@/types/type";

export function useUser() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: UserService.me,
    staleTime: 60_000,                 // ภายใน 1 นาทีถือว่ายัง “สด” → ไม่ยิงซ้ำ
    retry: (count, err:any) => {
      if (err?.response?.status === 404) {
        return false;
      }
      return count < 2;
    },
    refetchOnWindowFocus: true,
  });
}

export function useInvalidateUser() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["me"] });
}
