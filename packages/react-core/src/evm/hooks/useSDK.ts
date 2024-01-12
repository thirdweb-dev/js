import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useContext } from "react";
import invariant from "tiny-invariant";
import { TWSDKContext, ThirdwebSDKContext } from "../contexts/thirdweb-sdk";

/**
 * @internal
 */
function useSDKContext(): TWSDKContext {
  const ctx = useContext(ThirdwebSDKContext);
  invariant(
    ctx._inProvider,
    "useSDK must be called from within a ThirdwebProvider, did you forget to wrap your app in a <ThirdwebProvider />?",
  );
  return ctx;
}

/**
 * Hook to get the instance of the `ThirdwebSDK` class being used by the `ThirdwebProvider` component.
 *
 * This gives access to all of the functionality of the TypeScript SDK in your React app.
 *
 * - If there is a connected wallet, the SDK is instantiated from the connected wallet’s signer. Meaning all transactions are initiated from the connected wallet.
 * - If there is no connected wallet, the SDK is in read-only mode on the activeChain.
 *
 * @example
 * ```tsx
 * import { useSDK } from "@thirdweb-dev/react";
 *
 * function App() {
 *   const sdk = useSDK();
 *
 *   // Now you use all of the TypeScript SDK functionality
 *   // For example, deploy a new contract from the connected wallet.
 *   async function deployContract() {
 *     sdk?.deployer.deployNFTDrop({
 *       name: "My NFT Drop",
 *       primary_sale_recipient: "{{wallet_address}}",
 *     });
 *   }
 * }
 * ```
 */
export function useSDK(): ThirdwebSDK | undefined {
  const { sdk } = useSDKContext();
  return sdk;
}

/**
 * @internal
 */
export function useSDKChainId(): number | undefined {
  const sdk = useSDK();
  return (sdk as any)?._chainId;
}
