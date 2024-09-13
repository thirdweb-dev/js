import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { getOrDeployInfraForPublishedContract } from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { type Address, getAddress } from "../../utils/address.js";
import type {} from "../../utils/any-evm/deploy-metadata.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import {
  type InitializeParams,
  initialize,
} from "../modules/__generated__/ERC20Core/write/initialize.js";

export type CoreType = "ERC20" | "ERC721" | "ERC1155";

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

export type ModuleInstaller = (args: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
}) => Promise<ModuleInstallData>;

export type ModuleInstallData = {
  module: Address;
  data: Hex;
};

/**
 * @extension DEPLOY
 */
export type DeployModularContractOptions = Prettify<
  ClientAndChainAndAccount & {
    core: CoreType;
    params: ModularContractParams;
    modules?: ModuleInstaller[];
    publisher?: string;
    salt?: string;
  }
>;

/**
 * Deploys an thirdweb ERC20 contract of the given type.
 * On chains where the thirdweb infrastructure contracts are not deployed, this function will deploy them as well.
 * @param options - The deployment options.
 * @returns The deployed contract address.
 * @modules
 * @example
 * ```ts
 * import { deployModularContract } from "thirdweb/modules";
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
 *   ClaimableERC721.module({
 *     primarySaleRecipient: "0x...",
 *   }),
 *   RoyaltyERC721.module({
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
    modules = [],
    salt,
  } = options;
  const contractId = getContractId(core);
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId,
      publisher,
    });
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
  const initializeTransaction =
    await getInitializeTransactionForModularContract({
      client,
      chain,
      account,
      implementationContract,
      contractId,
      initializeParams: {
        name: coreParams.name || "",
        symbol: coreParams.symbol || "",
        contractURI,
        owner: coreParams.defaultAdmin
          ? getAddress(coreParams.defaultAdmin)
          : account.address,
      },
      accountAddress: getAddress(account.address),
      modules,
    });
  return deployViaAutoFactory({
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeTransaction,
    salt,
  });
}

async function getInitializeTransactionForModularContract(options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  implementationContract: ThirdwebContract;
  contractId: string;
  initializeParams: Omit<InitializeParams, "modules" | "moduleInstallData">;
  accountAddress: Address;
  modules: ModuleInstaller[];
}) {
  const {
    client,
    implementationContract,
    contractId,
    initializeParams,
    modules,
    chain,
    account,
  } = options;

  switch (contractId) {
    case "ERC20CoreInitializable":
    case "ERC721CoreInitializable":
    case "ERC1155CoreInitializable": {
      // can't promise all this unfortunately, needs to be sequential because of nonces
      const moduleAddresses: Hex[] = [];
      const moduleInstallData: Hex[] = [];
      for (const installer of modules) {
        // this might deploy the module if not already deployed
        const installData = await installer({
          client,
          chain,
          account,
        });
        moduleAddresses.push(installData.module);
        moduleInstallData.push(installData.data);
      }
      // all 3 cores have the same initializer
      return initialize({
        contract: implementationContract,
        owner: initializeParams.owner,
        name: initializeParams.name,
        symbol: initializeParams.symbol,
        contractURI: initializeParams.contractURI,
        modules: moduleAddresses,
        moduleInstallData,
      });
    }
    default:
      throw new Error(`Unsupported core type: ${contractId}`);
  }
}

function getContractId(core: CoreType) {
  switch (core) {
    case "ERC20":
      return "ERC20CoreInitializable";
    case "ERC721":
      return "ERC721CoreInitializable";
    case "ERC1155":
      return "ERC1155CoreInitializable";
    default:
      throw new Error(`Unsupported core type: ${core}`);
  }
}
