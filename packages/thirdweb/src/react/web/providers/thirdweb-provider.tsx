import { ThirdwebQueryProvider } from "../../core/providers/thirdweb-provider.js";

/**
 * The ThirdwebProvider is component is a provider component that sets up the React Query client.
 * @param props - The props for the ThirdwebProvider
 * @example
 * ```jsx
 * import { createThirdwebClient } from "thirdweb";
 * import { ThirdwebProvider } from "thirdweb/react";
 *
 * const client = createThirdwebClient({
 *  clientId: "<your_client_id>",
 * })
 *
 * function Example() {
 *  return (
 *    <ThirdwebProvider>
 *      <App />
 *    </ThirdwebProvider>
 *   )
 * }
 * ```
 * @component
 */
export function ThirdwebProvider(props: ThirdwebProviderProps) {
  return <ThirdwebQueryProvider>{props.children}</ThirdwebQueryProvider>;
}

export type ThirdwebProviderProps = {
  children: React.ReactNode;
};
