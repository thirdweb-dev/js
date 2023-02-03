import invariant from "tiny-invariant";
import {
  useConnect as useWagmiConnect,
  useClient
} from "wagmi";

/**
 * for now just re-exported
 * @internal
 */
export function useConnect() {
  const wagmiContext = useClient();
  invariant(
    wagmiContext,
    `useConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own connection logic.`,
  );
  return useWagmiConnect();
}
