import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { type Address, getAddress } from "../../utils/address.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { initialize as initCoreERC20 } from "../modular/__generated__/ERC20Core/write/initialize.js";

export type CoreType = "ERC20";

/**
 * @extension DEPLOY
 */
export type ModularContractParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  defaultAdmin?: string;
};

export type Module = {
  getInstallData: (args: {
    client: ThirdwebClient;
    chain: Chain;
    account: Account;
  }) => Promise<{
    address: Address;
    encodedParams: Hex;
  }>;
};

/**
 * @extension DEPLOY
 */
export type DeployModularContractOptions = Prettify<
  ClientAndChainAndAccount & {
    core: CoreType;
    params: ModularContractParams;
    modules: Module[];
    publisher?: string;
  }
>;

/**
 * Deploys an thirdweb ERC20 contract of the given type.
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @extension DEPLOY
 * @example
 * ```ts
 * import { deployModularContract } from "thirdweb/deploys";
 * const contractAddress = await deployModularContract({
 *  chain,
 *  client,
 *  account,
 *  core: "ERC20",
 *  params: {
 *    name: "MyToken",
 *    description: "My Token contract",
 *    symbol: "MT",
 * },
 * modules: [
 *   claimableERC721Module({
 *     primarySaleRecipient: "0x...",
 *   }),
 *   royaltyModule({
 *     royaltyRecipient: "0x...",
 *     royaltyBps: 500n,
 *   }),
 * ],
 * });
 * ```
 */
export async function deployModularContract(
  options: DeployModularContractOptions,
) {
  const {
    chain,
    client,
    account,
    publisher,
    core,
    params: coreParams,
    modules,
  } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: core,
      constructorParams: [],
      publisher,
    });
  const initializeTransaction = await getInitializeTransaction({
    client,
    chain,
    account,
    implementationContract,
    core,
    coreParams,
    accountAddress: getAddress(account.address),
    modules,
  });
  return deployViaAutoFactory({
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeTransaction,
  });
}

async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  implementationContract: ThirdwebContract;
  core: CoreType;
  coreParams: ModularContractParams;
  accountAddress: Address;
  modules: Module[];
}) {
  const {
    client,
    implementationContract,
    core,
    coreParams,
    modules,
    accountAddress,
    chain,
    account,
  } = options;
  const contractURI =
    coreParams.contractURI ||
    (await upload({
      client,
      files: [
        {
          name: coreParams.name,
          description: coreParams.description,
          symbol: coreParams.symbol,
          image: coreParams.image,
          external_link: coreParams.external_link,
          social_urls: coreParams.social_urls,
        },
      ],
    })) ||
    "";
  switch (core) {
    case "ERC20CoreInitializable": // FIXME: remove
    case "ERC20": {
      // can't promise all this unfortunately, needs to be sequential because of nonces
      const moduleAddresses: Hex[] = [];
      const moduleInstallData: Hex[] = [];
      for (const module of modules) {
        const { address, encodedParams } = await module.getInstallData({
          client,
          chain,
          account,
        });
        moduleAddresses.push(address);
        moduleInstallData.push(encodedParams);
      }
      return initCoreERC20({
        contract: implementationContract,
        owner: coreParams.defaultAdmin
          ? getAddress(coreParams.defaultAdmin)
          : accountAddress,
        name: coreParams.name || "",
        symbol: coreParams.symbol || "",
        contractURI,
        modules: moduleAddresses,
        moduleInstallData,
      });
    }
  }
}
