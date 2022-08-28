import {
  GnosisConnectorArguments,
  GnosisSafeConnector,
} from "../../connectors/gnosis-safe";
import { useConnect } from "../useConnect";
import { utils } from "ethers";
import invariant from "tiny-invariant";

/**
 * Hook for connecting to a Gnosis Safe. This enables multisig wallets to connect to your application and sing transactions.
 *
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 * ```
 *
 *
 * @example
 * ```javascript
 * import { useGnosis } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const connectWithGnosis = useGnosis()
 *
 *   return (
 *     <button onClick={() => connectWithGnosis({ safeAddress: "0x...", safeChainId: 1 })}>
 *       Connect Gnosis Safe
 *     </button>
 *   )
 * }
 * ```
 *
 * @public
 */
export function useGnosis() {
  const [connectors, connect] = useConnect();
  if (connectors.loading) {
    return () => Promise.reject("Gnosis connector not ready to be used, yet");
  }
  const connector = connectors.data.connectors.find((c) => c.id === "gnosis");
  invariant(
    connector,
    "Gnosis connector not found, please make sure it is provided to your <ThirdwebProvider />",
  );

  return async (config: GnosisConnectorArguments) => {
    const previousConnector = connectors.data.connector;
    const previousConnectorChain = await previousConnector?.getChainId();
    invariant(
      !!previousConnector,
      "Cannot connect to Gnosis Safe without first being connected to a personal wallet.",
    );
    invariant(
      previousConnectorChain === config.safeChainId,
      "Gnosis safe chain id must match personal wallet chain id.",
    );
    invariant(
      utils.isAddress(config.safeAddress),
      "Gnosis safe address must be a valid address.",
    );
    (connector as GnosisSafeConnector).setConfiguration(
      previousConnector,
      config,
    );
    return connect(connector);
  };
}
