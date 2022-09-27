import { ComponentWithChildren } from "../types/component";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export interface QueryClientProviderProps {
  queryClient?: QueryClient;
}

export const QueryClientProviderWithDefault: ComponentWithChildren<
  QueryClientProviderProps
> = ({ queryClient, children }) => {
  const queryClientWithDefault: QueryClient = useMemo(() => {
    return queryClient ? queryClient : new QueryClient();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClientWithDefault}>
      {children}
    </QueryClientProvider>
  );
};
