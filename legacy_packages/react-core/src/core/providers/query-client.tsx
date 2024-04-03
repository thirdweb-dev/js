import { ComponentWithChildren } from "../types/component";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

export interface QueryClientProviderProps {
  /**
   * If you are using React Query and have your own `QueryClient`, you can pass it as the queryClient prop to use that instead of the SDK's default client.
   */
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
