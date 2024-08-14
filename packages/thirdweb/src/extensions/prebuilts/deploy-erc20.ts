import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import {
  getOrDeployInfraContract,
  getOrDeployInfraForPublishedContract,
} from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { initialize as initCoreERC20 } from "../modular/__generated__/ERC20Core/write/initialize.js";
import { initialize as initDropERC20 } from "./__generated__/DropERC20/write/initialize.js";
import { initialize as initTokenERC20 } from "./__generated__/TokenERC20/write/initialize.js";

export type ERC20ContractType =
  | "DropERC20"
  | "TokenERC20"
  | "ModularTokenERC20"
  | "ModularDropERC20";

/**
 * @extension DEPLOY
 */
export type ERC20ContractParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  defaultAdmin?: string;
  saleRecipient?: string;
  platformFeeBps?: bigint;
  platformFeeRecipient?: string;
  trustedForwarders?: string[];
};

/**
 * @extension DEPLOY
 */
export type DeployERC20ContractOptions = Prettify<
  ClientAndChainAndAccount & {
    type: ERC20ContractType;
    params: ERC20ContractParams;
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
 * import { deployERC20Contract } from "thirdweb/deploys";
 * const contractAddress = await deployERC20Contract({
 *  chain,
 *  client,
 *  account,
 *  type: "TokenERC20",
 *  params: {
 *    name: "MyToken",
 *    description: "My Token contract",
 *    symbol: "MT",
 * });
 * ```
 */
export async function deployERC20Contract(options: DeployERC20ContractOptions) {
  const { chain, client, account, type, params, publisher } = options;
  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: type,
      constructorParams: [],
      publisher,
    });
  const initializeTransaction = await getInitializeTransaction({
    client,
    chain,
    account,
    implementationContract,
    type,
    params,
    accountAddress: account.address,
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
  type: ERC20ContractType;
  params: ERC20ContractParams;
  accountAddress: string;
}) {
  const {
    client,
    chain,
    account,
    implementationContract,
    type,
    params,
    accountAddress,
  } = options;
  const contractURI =
    options.params.contractURI ||
    (await upload({
      client,
      files: [
        {
          name: params.name,
          description: params.description,
          symbol: params.symbol,
          image: params.image,
          external_link: params.external_link,
          social_urls: params.social_urls,
        },
      ],
    })) ||
    "";
  switch (type) {
    case "DropERC20":
      return initDropERC20({
        contract: implementationContract,
        name: params.name || "",
        symbol: params.symbol || "",
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        saleRecipient: params.saleRecipient || accountAddress,
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        trustedForwarders: params.trustedForwarders || [],
      });
    case "TokenERC20":
      return initTokenERC20({
        contract: implementationContract,
        name: params.name || "",
        symbol: params.symbol || "",
        contractURI,
        defaultAdmin: params.defaultAdmin || accountAddress,
        primarySaleRecipient: params.saleRecipient || accountAddress,
        platformFeeBps: params.platformFeeBps || 0n,
        platformFeeRecipient: params.platformFeeRecipient || accountAddress,
        trustedForwarders: params.trustedForwarders || [],
      });
    case "ModularTokenERC20":
    case "ModularDropERC20": {
      const { extendedMetadata } = await fetchPublishedContractMetadata({
        client,
        contractId: type,
      });
      const moduleNames =
        extendedMetadata?.defaultModules?.map((e) => e.moduleName) || [];
      // can't promise all this unfortunately, needs to be sequential because of nonces
      const modules: string[] = [];
      const moduleInstallData: Hex[] = [];
      for (const module of moduleNames) {
        const contract = await getOrDeployInfraContract({
          client,
          chain,
          account,
          contractId: module,
          constructorParams: [],
        });
        modules.push(contract.address);
        // TODO (modular) this should be more dynamic
        switch (module) {
          case "MintableERC20": {
            const { encodeBytesOnInstallParams } = await import(
              "../../extensions/modular/__generated__/MintableERC20/encode/encodeBytesOnInstall.js"
            );
            moduleInstallData.push(
              encodeBytesOnInstallParams({
                primarySaleRecipient: params.saleRecipient || accountAddress,
              }),
            );
            break;
          }
          case "ClaimableERC20": {
            const { encodeBytesOnInstallParams } = await import(
              "../../extensions/modular/__generated__/ClaimableERC20/encode/encodeBytesOnInstall.js"
            );
            moduleInstallData.push(
              encodeBytesOnInstallParams({
                primarySaleRecipient: params.saleRecipient || accountAddress,
              }),
            );
            break;
          }
          default: {
            moduleInstallData.push("0x");
          }
        }
      }

      return initCoreERC20({
        contract: implementationContract,
        owner: params.defaultAdmin || accountAddress,
        name: params.name || "",
        symbol: params.symbol || "",
        contractURI,
        modules,
        moduleInstallData,
      });
    }
  }
}
