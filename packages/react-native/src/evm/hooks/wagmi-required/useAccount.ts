import invariant from "tiny-invariant";
import { useAccount as useWagmiAccount, useClient } from "wagmi";

/**
 * @internal
 */
export function useAccount(): ReturnType<typeof useWagmiAccount> {
  const wagmiContext = useClient();
  invariant(
    wagmiContext,
    `useAccount() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own account logic.`,
  );
  return useWagmiAccount();
}
