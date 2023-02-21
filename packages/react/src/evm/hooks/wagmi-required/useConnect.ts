import invariant from "tiny-invariant";
import {
  useConnect as useWagmiConnect,
  useContext as useWagmiContext,
} from "wagmi";

/**
 * for now just re-exported
 * @internal
 * @deprecated - TODO: remove this
 */
export function useConnect() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useConnect() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own connection logic.`,
  );
  return useWagmiConnect();
}
