import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {useState } from "react";
import type{ ReactNode} from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={qc}>
      {children}
    </QueryClientProvider>
  );
}
