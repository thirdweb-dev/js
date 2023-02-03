import invariant from "tiny-invariant";
import {
  useAccount as useWagmiAccount,
  useClient
} from "wagmi";

/**
 * @internal
 */
export function useAccount() {
  const wagmiContext = useClient();
  invariant(
    wagmiContext,
    `useNetwork() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own network logic.`,
  );
  return useWagmiAccount();
}
