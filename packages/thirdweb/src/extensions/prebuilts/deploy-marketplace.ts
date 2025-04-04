import type { AbiParametersToPrimitiveTypes, Address } from "abitype";
import type { ThirdwebClient } from "../../client/client.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import {
  getOrDeployInfraContract,
  getOrDeployInfraForPublishedContract,
} from "../../contract/deployment/utils/bootstrap.js";
import { upload } from "../../storage/upload.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { getRoyaltyEngineV1ByChainId } from "../../utils/royalty-engine.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { ClientAndChainAndAccount } from "../../utils/types.js";
import { initialize as initMarketplace } from "./__generated__/Marketplace/write/initialize.js";
import { generateExtensionFunctionsFromAbi } from "./get-required-transactions.js";

type Extension = {
  metadata: {
    name: string;
    metadataURI: string;
    implementation: `0x${string}`;
  };
  functions: {
    functionSelector: string;
    functionSignature: string;
  }[];
};

export type MarketplaceContractParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  contractURI?: string;
  social_urls?: Record<string, string>;
  defaultAdmin?: Address;
  platformFeeBps?: number;
  platformFeeRecipient?: string;
  trustedForwarders?: string[];
};

export type DeployMarketplaceContractOptions = Prettify<
  ClientAndChainAndAccount & {
    params: MarketplaceContractParams;
  } & {
    version?: string;
  }
>;

/**
 * Deploys a marketplace contract.
 * @param options - The options for deploying the marketplace contract.
 * 
 * @extension MARKETPLACE
 *
 * @example
 * ```ts
 * import { deployMarketplaceContract } from "thirdweb/deploys";
 *
 * const address = await deployMarketplaceContract({
      client,
      chain,
      account,
      params: {
        name: "MarketplaceV3",
        description: "MarketplaceV3 deployed using thirdweb SDK",
        platformFeeRecipient: "0x21d514c90ee4E4e4Cd16Ce9185BF01F0F1eE4A04",
        platformFeeBps: 1000, 
      },
    });
 * ```
 */
export async function deployMarketplaceContract(
  options: DeployMarketplaceContractOptions,
) {
  const { chain, client, account, params, version } = options;
  const WETH = await getOrDeployInfraContract({
    chain,
    client,
    account,
    contractId: "WETH9",
  });

  let extensions: Extension[] = [];

  if (options.version !== "6.0.0") {
    const isFeeExempt = chain.id === 232 || chain.id === 37111;
    const direct = await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "DirectListingsLogic",
      constructorParams: { _nativeTokenWrapper: WETH.address },
      version: isFeeExempt ? "0.1.2" : "latest",
    });

    const english = await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "EnglishAuctionsLogic",
      constructorParams: { _nativeTokenWrapper: WETH.address },
      version: isFeeExempt ? "0.0.11" : "latest",
    });

    const offers = await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "OffersLogic",
      version: isFeeExempt ? "0.0.8" : "latest",
    });

    const [directFunctions, englishFunctions, offersFunctions] =
      await Promise.all([
        resolveContractAbi(direct.implementationContract).then(
          generateExtensionFunctionsFromAbi,
        ),
        resolveContractAbi(english.implementationContract).then(
          generateExtensionFunctionsFromAbi,
        ),
        resolveContractAbi(offers.implementationContract).then(
          generateExtensionFunctionsFromAbi,
        ),
      ]);
    extensions = [
      {
        metadata: {
          name: "Direct Listings",
          metadataURI: "",
          implementation: direct.implementationContract.address,
        },
        functions: directFunctions,
      },
      {
        metadata: {
          name: "English Auctions",
          metadataURI: "",
          implementation: english.implementationContract.address,
        },
        functions: englishFunctions,
      },
      {
        metadata: {
          name: "Offers",
          metadataURI: "",
          implementation: offers.implementationContract.address,
        },
        functions: offersFunctions,
      },
    ];
  }

  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: "MarketplaceV3",
      constructorParams: {
        _marketplaceV3Params: {
          extensions,
          royaltyEngineAddress: getRoyaltyEngineV1ByChainId(chain.id),
          nativeTokenWrapper: WETH.address,
        } as MarketplaceConstructorParams[number],
      },
      version,
    });

  const initializeTransaction = await getInitializeTransaction({
    client,
    implementationContract,
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
  implementationContract: ThirdwebContract;
  params: MarketplaceContractParams;
  accountAddress: string;
}) {
  const { client, implementationContract, params, accountAddress } = options;
  const contractURI =
    options.params.contractURI ||
    (await upload({
      client,
      files: [
        {
          name: params.name,
          description: params.description,
          image: params.image,
          external_link: params.external_link,
          social_urls: params.social_urls,
        },
      ],
    })) ||
    "";
  return initMarketplace({
    contract: implementationContract,
    contractURI,
    defaultAdmin: params.defaultAdmin || accountAddress,
    platformFeeBps: params.platformFeeBps || 0,
    platformFeeRecipient: params.platformFeeRecipient || accountAddress,
    trustedForwarders: params.trustedForwarders || [],
  });
}

// let's just ... put this down here
type MarketplaceConstructorParams = AbiParametersToPrimitiveTypes<
  [
    {
      name: "_marketplaceV3Params";
      type: "tuple";
      internalType: "struct MarketplaceV3.MarketplaceConstructorParams";
      components: [
        {
          name: "extensions";
          type: "tuple[]";
          internalType: "struct IExtension.Extension[]";
          components: [
            {
              name: "metadata";
              type: "tuple";
              internalType: "struct IExtension.ExtensionMetadata";
              components: [
                {
                  name: "name";
                  type: "string";
                  internalType: "string";
                },
                {
                  name: "metadataURI";
                  type: "string";
                  internalType: "string";
                },
                {
                  name: "implementation";
                  type: "address";
                  internalType: "address";
                },
              ];
            },
            {
              name: "functions";
              type: "tuple[]";
              internalType: "struct IExtension.ExtensionFunction[]";
              components: [
                {
                  name: "functionSelector";
                  type: "bytes4";
                  internalType: "bytes4";
                },
                {
                  name: "functionSignature";
                  type: "string";
                  internalType: "string";
                },
              ];
            },
          ];
        },
        {
          name: "royaltyEngineAddress";
          type: "address";
          internalType: "address";
        },
        {
          name: "nativeTokenWrapper";
          type: "address";
          internalType: "address";
        },
      ];
    },
  ]
>;
