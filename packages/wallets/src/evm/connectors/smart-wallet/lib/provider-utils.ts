import { EntryPoint__factory } from "@account-abstraction/contracts";
import { getChainProvider } from "@thirdweb-dev/sdk";
import { AccountAPI } from "./account";
import { providers } from "ethers";
import { ERC4337EthersProvider } from "./erc4337-provider";
import { HttpRpcClient } from "./http-rpc-client";
import { ProviderConfig } from "../types";

/**
 * wrap an existing provider to tunnel requests through Account Abstraction.
 * @param originalProvider the normal provider
 * @param config see ClientConfig for more info
 * @param originalSigner use this signer as the owner. of this wallet. By default, use the provider's signer
 */
export async function create4337Provider(
  config: ProviderConfig,
): Promise<ERC4337EthersProvider> {
  const rpcProvider = getChainProvider(config.chain, {
    thirdwebApiKey: config.thirdwebApiKey,
  }) as providers.JsonRpcProvider;
  const entryPoint = EntryPoint__factory.connect(
    config.entryPointAddress,
    rpcProvider,
  );

  const accountApi = new AccountAPI({
    chain: config.chain,
    localSigner: config.localSigner,
    entryPointAddress: config.entryPointAddress,
    factoryAddress: config.factoryAddress,
    paymasterAPI: config.paymasterAPI,
    accountInfo: config.accountInfo,
    factoryInfo: config.factoryInfo,
    accountAddress: config.accountAddress,
  });

  const chainId = await accountApi.getChainId();
  const httpRpcClient = new HttpRpcClient(
    config.bundlerUrl,
    config.entryPointAddress,
    chainId,
    config.thirdwebApiKey,
  );
  return await new ERC4337EthersProvider(
    chainId,
    config,
    config.localSigner,
    rpcProvider,
    httpRpcClient,
    entryPoint,
    accountApi,
  ).init();
}
