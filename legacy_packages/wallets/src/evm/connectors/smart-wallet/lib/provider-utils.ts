import { EntryPoint__factory } from "@account-abstraction/contracts";
import { AccountAPI } from "./account";
import { providers } from "ethers";
import { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { ProviderConfig } from "../types";

/**
 * wrap an existing provider to tunnel requests through Account Abstraction.
 * @param originalProvider - The normal provider
 * @param config - see {@link ClientConfig} for more info
 * @param originalSigner - use this signer as the owner. of this wallet. By default, use the provider's signer
 */
export function create4337Provider(
  config: ProviderConfig,
  accountApi: AccountAPI,
  originalProvider: providers.BaseProvider,
  chainId: number,
): ERC4337EthersProvider {
  const entryPoint = EntryPoint__factory.connect(
    config.entryPointAddress,
    originalProvider,
  );

  const httpRpcClient = new HttpRpcClient(
    config.bundlerUrl,
    config.entryPointAddress,
    chainId,
    config.clientId,
    config.secretKey,
  );
  return new ERC4337EthersProvider(
    chainId,
    config,
    config.localSigner,
    originalProvider,
    httpRpcClient,
    entryPoint,
    accountApi,
  );
}
