import { toPrivyWalletConnector } from "@privy-io/cross-app-connect/rainbow-kit";
import type { CreateConnectorFn } from "@wagmi/core";
import { createEmitter } from "@wagmi/core/internal";
import type { Chain, EIP1193Provider } from "viem";
import {
  abstract,
  apeChain,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  curtis,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from "viem/chains";
import { fromProvider } from "../../adapters/eip1193/from-eip1193.js";
import {
  GLYPH_APP_ID,
  glyphConnectorDetails,
  STAGING_GLYPH_APP_ID,
} from "../../wallets/glyph/constants.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";

/**
 * Create a wagmi connector for the Glyph Global Wallet.
 *
 * Adapted from wagmi injected connector as a reference implementation:
 * https://github.com/wevm/wagmi/blob/main/packages/core/src/connectors/injected.ts#L94
 *
 * @example
 * import { createConfig, http } from "wagmi";
 * import { apeChain } from "wagmi/chains";
 * import { glyphWalletWagmiConnector } from "thirdweb/wallets/glyph"
 *
 * export const wagmiConfig = createConfig({
 *   chains: [apeChain],
 *   transports: {
 *     [apeChain.id]: http(),
 *   },
 *   connectors: [glyphWalletWagmiConnector()],
 *   ssr: true,
 * });
 */
function glyphWalletWagmiConnector(options?: {
  useStagingTenant?: boolean;
}): CreateConnectorFn {
  const { useStagingTenant } = options ?? {};

  return (params) => {
    const connector = toPrivyWalletConnector({
      iconUrl: glyphConnectorDetails.iconUrl,
      id: useStagingTenant ? STAGING_GLYPH_APP_ID : GLYPH_APP_ID,
      name: glyphConnectorDetails.name,
    })(params);

    const getGlyphProvider = async (
      parameters?: { chainId?: number | undefined } | undefined,
    ) => {
      const chainId =
        parameters?.chainId ?? params.chains?.[0]?.id ?? apeChain.id;

      const provider = await connector.getProvider({
        chainId,
      });

      return provider;
    };

    const glyphConnector = {
      ...connector,
      getProvider: getGlyphProvider,
      type: glyphConnectorDetails.type,
      id: glyphConnectorDetails.id,
    };
    return glyphConnector;
  };
}

/**
 * Create a thirdweb wallet for Glyph Global Wallet
 *
 * @returns A wallet instance wrapping Glyph Global Wallet to be used with the thirdweb Connect SDK
 *
 * @example
 * ```tsx
 * import { createThirdwebClient } from "thirdweb";
 * import { glyphWalletTW } from "thirdweb/wallets/glyph"
 *
 * const client = createThirdwebClient({ clientId });
 *
 * <ConnectButton client={client} wallets=[glyphWalletTW()]>
 * ```
 */
function glyphWalletTW(chains?: [Chain, ...Chain[]]): Wallet {
  const connector = glyphWalletWagmiConnector()({
    chains: chains ?? [
      apeChain,
      curtis,
      mainnet,
      base,
      arbitrum,
      polygon,
      optimism,
      abstract,
      sepolia,
      baseSepolia,
      optimismSepolia,
      arbitrumSepolia,
    ],
    emitter: createEmitter("io.useglyph"),
  });
  return fromProvider({
    provider: connector.getProvider as (
      parameters?: { chainId?: number | undefined } | undefined,
    ) => Promise<EIP1193Provider>,
    walletId: "io.useglyph",
  });
}

export { glyphWalletTW, glyphWalletWagmiConnector };
