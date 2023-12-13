import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { providers } from "ethers";
import {
  THIRDWEB_DEPLOYER,
  fetchPublishedContractFromPolygon,
} from "../common/any-evm-utils/fetchPublishedContractFromPolygon";
import { getPrebuiltInfo } from "../common/legacy";
import { fetchAbiFromAddress } from "../common/metadata-resolver";
import { getCompositeABIfromRelease } from "../common/plugin/getCompositeABIfromRelease";
import { getCompositeABI } from "../common/plugin/getCompositePluginABI";
import { ALL_ROLES } from "../common/role";
import { getSignerAndProvider } from "../constants/urls";
import type { NetworkInput } from "../core/types";
import { Abi, AbiSchema } from "../schema/contracts/custom";
import { DropErc1155ContractSchema } from "../schema/contracts/drop-erc1155";
import { DropErc20ContractSchema } from "../schema/contracts/drop-erc20";
import { DropErc721ContractSchema } from "../schema/contracts/drop-erc721";
import { MarketplaceContractSchema } from "../schema/contracts/marketplace";
import { MultiwrapContractSchema } from "../schema/contracts/multiwrap";
import { PackContractSchema } from "../schema/contracts/packs";
import { SplitsContractSchema } from "../schema/contracts/splits";
import { TokenErc1155ContractSchema } from "../schema/contracts/token-erc1155";
import { TokenErc20ContractSchema } from "../schema/contracts/token-erc20";
import { TokenErc721ContractSchema } from "../schema/contracts/token-erc721";
import { VoteContractSchema } from "../schema/contracts/vote";
import { SDKOptions } from "../schema/sdk-options";
import { Address } from "../schema/shared/Address";
import {
  ADMIN_ROLE,
  MARKETPLACE_CONTRACT_ROLES,
  MULTIWRAP_CONTRACT_ROLES,
  NFT_BASE_CONTRACT_ROLES,
  PACK_CONTRACT_ROLES,
  TOKEN_DROP_CONTRACT_ROLES,
} from "./contractRoles";
import type { SmartContract as SmartContractType } from "./smart-contract";

const prebuiltContractTypes = {
  vote: "vote",
  token: "token",
  "edition-drop": "edition-drop",
  edition: "edition",
  marketplace: "marketplace",
  "marketplace-v3": "marketplace-v3",
  multiwrap: "multiwrap",
  "nft-collection": "nft-collection",
  "nft-drop": "nft-drop",
  pack: "pack",
  "signature-drop": "signature-drop",
  split: "split",
  "token-drop": "token-drop",
} as const;

export type PrebuiltContractType = keyof typeof prebuiltContractTypes;

type InitalizeParams = [
  network: NetworkInput,
  address: Address,
  storage: ThirdwebStorage,
  options?: SDKOptions,
];

/**
 * @internal
 */
export const EditionDropInitializer = {
  name: "DropERC1155" as const,
  contractType: prebuiltContractTypes["edition-drop"],
  schema: DropErc1155ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      EditionDropInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/edition-drop"),
      provider.getNetwork(),
    ]);

    return new contract.EditionDrop(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    const contractInfo = await getContractInfo(address, provider);
    return !contractInfo || contractInfo.version > 2
      ? (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC1155.json"))
          .default
      : (
          await import(
            "@thirdweb-dev/contracts-js/dist/abis/DropERC1155_V2.json"
          )
        ).default;
  },
};

/**
 * @internal
 */
export const EditionInitializer = {
  name: "TokenERC1155" as const,
  contractType: prebuiltContractTypes["edition"],
  schema: TokenErc1155ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      EditionInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/edition"),
      provider.getNetwork(),
    ]);

    return new contract.Edition(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (
      await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC1155.json")
    ).default;
  },
};

/**
 * @internal
 */
export const MarketplaceInitializer = {
  name: "Marketplace" as const,
  contractType: prebuiltContractTypes.marketplace,
  schema: MarketplaceContractSchema,
  roles: MARKETPLACE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      MarketplaceInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/marketplace"),
      provider.getNetwork(),
    ]);

    return new contract.Marketplace(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }

    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (
      await import("@thirdweb-dev/contracts-js/dist/abis/Marketplace.json")
    ).default;
  },
};

/**
 * @internal
 */
export const MarketplaceV3Initializer = {
  name: "MarketplaceV3" as const,
  contractType: prebuiltContractTypes["marketplace-v3"],
  schema: MarketplaceContractSchema,
  roles: MARKETPLACE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      MarketplaceV3Initializer.getAbi(address, provider, storage, options),
      import("./prebuilt-implementations/marketplacev3"),
      provider.getNetwork(),
    ]);

    return new contract.MarketplaceV3(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
    options?: SDKOptions,
  ) => {
    const chainId = (await provider.getNetwork()).chainId;
    const isZkSync = chainId === 280 || chainId === 324;

    // Can't resolve IPFS hash from plugin bytecode on ZkSync
    // Thus, pull the composite ABI from the release page
    if (isZkSync) {
      const publishedContract = await fetchPublishedContractFromPolygon(
        THIRDWEB_DEPLOYER,
        "MarketplaceV3",
        "latest",
        storage,
        options?.clientId,
        options?.secretKey,
      );
      const uri = publishedContract.metadataUri;
      const compositeAbi = await getCompositeABIfromRelease(uri, storage);

      return compositeAbi;
    }

    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return await getCompositeABI(address, abi, provider, {}, storage);
    }

    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    const localAbi = (
      await import("@thirdweb-dev/contracts-js/dist/abis/MarketplaceV3.json")
    ).default;
    return await getCompositeABI(
      address,
      AbiSchema.parse(localAbi || []),
      provider,
      {},
      storage,
    );
  },
};

/**
 * @internal
 */
export const MultiwrapInitializer = {
  name: "Multiwrap" as const,
  contractType: prebuiltContractTypes.multiwrap,
  schema: MultiwrapContractSchema,
  roles: MULTIWRAP_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      MultiwrapInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/multiwrap"),
      provider.getNetwork(),
    ]);

    return new contract.Multiwrap(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (await import("@thirdweb-dev/contracts-js/dist/abis/Multiwrap.json"))
      .default;
  },
};

/**
 * @internal
 */
export const NFTCollectionInitializer = {
  name: "TokenERC721" as const,
  contractType: prebuiltContractTypes["nft-collection"],
  schema: TokenErc721ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      NFTCollectionInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/nft-collection"),
      provider.getNetwork(),
    ]);

    return new contract.NFTCollection(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (
      await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC721.json")
    ).default;
  },
};

/**
 * @internal
 */
export const NFTDropInitializer = {
  name: "DropERC721" as const,
  contractType: prebuiltContractTypes["nft-drop"],
  schema: DropErc721ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      NFTDropInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/nft-drop"),
      provider.getNetwork(),
    ]);

    return new contract.NFTDrop(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    const contractInfo = await getContractInfo(address, provider);
    return !contractInfo || contractInfo.version > 3
      ? (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC721.json"))
          .default
      : (
          await import(
            "@thirdweb-dev/contracts-js/dist/abis/DropERC721_V3.json"
          )
        ).default;
  },
};

/**
 * @internal
 */
export const PackInitializer = {
  name: "Pack" as const,
  contractType: prebuiltContractTypes["pack"],
  schema: PackContractSchema,
  roles: PACK_CONTRACT_ROLES,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      PackInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/pack"),
      provider.getNetwork(),
    ]);

    return new contract.Pack(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ): Promise<Abi> => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return AbiSchema.parse(
      (await import("@thirdweb-dev/contracts-js/dist/abis/Pack.json"))
        .default || [],
    );
  },
};

/**
 * @internal
 */
export const SignatureDropInitializer = {
  name: "SignatureDrop" as const,
  contractType: prebuiltContractTypes["signature-drop"],
  schema: DropErc721ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      SignatureDropInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/signature-drop"),
      provider.getNetwork(),
    ]);

    return new contract.SignatureDrop(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    const contractInfo = await getContractInfo(address, provider);
    return !contractInfo || contractInfo.version > 4
      ? (
          await import(
            "@thirdweb-dev/contracts-js/dist/abis/SignatureDrop.json"
          )
        ).default
      : (
          await import(
            "@thirdweb-dev/contracts-js/dist/abis/SignatureDrop_V4.json"
          )
        ).default;
  },
};

/**
 * @internal
 */
export const SplitInitializer = {
  name: "Split" as const,
  contractType: prebuiltContractTypes["split"],
  schema: SplitsContractSchema,
  roles: ADMIN_ROLE,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      SplitInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/split"),
      provider.getNetwork(),
    ]);

    return new contract.Split(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (await import("@thirdweb-dev/contracts-js/dist/abis/Split.json"))
      .default;
  },
};

/**
 * @internal
 */
export const TokenDropInitializer = {
  name: "DropERC20" as const,
  contractType: prebuiltContractTypes["token-drop"],
  schema: DropErc20ContractSchema,
  roles: TOKEN_DROP_CONTRACT_ROLES,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      TokenDropInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/token-drop"),
      provider.getNetwork(),
    ]);

    return new contract.TokenDrop(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    const contractInfo = await getContractInfo(address, provider);
    return !contractInfo || contractInfo.version > 2
      ? (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC20.json"))
          .default
      : (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC20_V2.json"))
          .default;
  },
};

/**
 * @internal
 */
export const TokenInitializer = {
  name: "TokenERC20" as const,
  contractType: prebuiltContractTypes.token,
  schema: TokenErc20ContractSchema,
  roles: NFT_BASE_CONTRACT_ROLES,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      TokenInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/token"),
      provider.getNetwork(),
    ]);

    return new contract.Token(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (
      await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC20.json")
    ).default;
  },
};

/**
 * @internal
 */
export const VoteInitializer = {
  name: "VoteERC20" as const,
  contractType: prebuiltContractTypes.vote,
  schema: VoteContractSchema,
  roles: [] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [, provider] = getSignerAndProvider(network, options);
    const [abi, contract, _network] = await Promise.all([
      VoteInitializer.getAbi(address, provider, storage),
      import("./prebuilt-implementations/vote"),
      provider.getNetwork(),
    ]);

    return new contract.Vote(
      network,
      address,
      storage,
      options,
      abi,
      _network.chainId,
    );
  },
  getAbi: async (
    address: Address,
    provider: providers.Provider,
    storage: ThirdwebStorage,
  ) => {
    const abi = await fetchAbiFromAddress(address, provider, storage);
    if (abi) {
      return abi;
    }
    // Deprecated - only needed for backwards compatibility with non-published contracts - should remove in v4
    return (await import("@thirdweb-dev/contracts-js/dist/abis/VoteERC20.json"))
      .default;
  },
};

async function getContractInfo(address: Address, provider: providers.Provider) {
  try {
    return await getPrebuiltInfo(address, provider);
  } catch (e) {
    return undefined;
  }
}

/**
 * a map from contractType - contract metadata
 * @internal
 */
export const PREBUILT_CONTRACTS_MAP = /* @__PURE__ */ {
  [prebuiltContractTypes["edition-drop"]]: EditionDropInitializer,
  [prebuiltContractTypes.edition]: EditionInitializer,
  [prebuiltContractTypes.marketplace]: MarketplaceInitializer,
  [prebuiltContractTypes["marketplace-v3"]]: MarketplaceV3Initializer,
  [prebuiltContractTypes.multiwrap]: MultiwrapInitializer,
  [prebuiltContractTypes["nft-collection"]]: NFTCollectionInitializer,
  [prebuiltContractTypes["nft-drop"]]: NFTDropInitializer,
  [prebuiltContractTypes.pack]: PackInitializer,
  [prebuiltContractTypes["signature-drop"]]: SignatureDropInitializer,
  [prebuiltContractTypes.split]: SplitInitializer,
  [prebuiltContractTypes["token-drop"]]: TokenDropInitializer,
  [prebuiltContractTypes.token]: TokenInitializer,
  [prebuiltContractTypes.vote]: VoteInitializer,
} as const;

/**
 * @internal
 */
export const PREBUILT_CONTRACTS_APPURI_MAP = /* @__PURE__ */ {
  [prebuiltContractTypes["edition-drop"]]:
    "ipfs://QmNm3wRzpKYWo1SRtJfgfxtvudp5p2nXD6EttcsQJHwTmk",
  [prebuiltContractTypes.edition]: "",
  [prebuiltContractTypes.marketplace]:
    "ipfs://QmbAgC8YwY36n8H2kuvSWsRisxDZ15QZw3xGZyk9aDvcv7/marketplace.html",
  [prebuiltContractTypes["marketplace-v3"]]:
    "ipfs://QmbAgC8YwY36n8H2kuvSWsRisxDZ15QZw3xGZyk9aDvcv7/marketplace-v3.html",
  [prebuiltContractTypes.multiwrap]: "",
  [prebuiltContractTypes["nft-collection"]]: "",
  [prebuiltContractTypes["nft-drop"]]:
    "ipfs://QmZptmVipc6SGFbKAyXcxGgohzTwYRXZ9LauRX5ite1xDK",
  [prebuiltContractTypes.pack]: "",
  [prebuiltContractTypes["signature-drop"]]:
    "ipfs://QmZptmVipc6SGFbKAyXcxGgohzTwYRXZ9LauRX5ite1xDK",
  [prebuiltContractTypes.split]: "",
  [prebuiltContractTypes["token-drop"]]:
    "ipfs://QmbAgC8YwY36n8H2kuvSWsRisxDZ15QZw3xGZyk9aDvcv7/erc20.html",
  [prebuiltContractTypes.token]: "",
  [prebuiltContractTypes.vote]: "",
} as const;

const SmartContract = {
  name: "SmartContract" as const,
  contractType: "custom" as const,
  schema: {},
  roles: ALL_ROLES,
};

/**
 * @internal
 */
export const CONTRACTS_MAP = /* @__PURE__ */ {
  ...PREBUILT_CONTRACTS_MAP,
  [SmartContract.contractType]: SmartContract,
} as const;

/**
 * @internal
 */
export function getContractTypeForRemoteName(name: string): ContractType {
  return (
    Object.values(CONTRACTS_MAP).find((contract) => contract.name === name)
      ?.contractType || "custom"
  );
}

/**
 * @internal
 */
export function getContractName(
  type: PrebuiltContractType,
): string | undefined {
  return Object.values(CONTRACTS_MAP).find(
    (contract) => contract.contractType === type,
  )?.name;
}

/**
 * @internal
 */
export type PrebuiltContractsMap = typeof PREBUILT_CONTRACTS_MAP;
/**
 * @internal
 */
export type PrebuiltContractsInstances = {
  [K in keyof PrebuiltContractsMap]: Awaited<
    ReturnType<(typeof PREBUILT_CONTRACTS_MAP)[K]["initialize"]>
  >;
};
/**
 * @internal
 */
export type ContractsMap = typeof CONTRACTS_MAP;
/**
 * @internal
 */
export type ValidContractInstance =
  | Awaited<ReturnType<ContractsMap[keyof PrebuiltContractsMap]["initialize"]>>
  | SmartContractType;
/**
 * @internal
 */
export type SchemaForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = PrebuiltContractsMap[TContractType]["schema"];
/**
 * @internal
 */
export type ContractForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = PrebuiltContractsInstances[TContractType];
/**
 * @internal
 */
export type ContractType = keyof ContractsMap;
/**
 * @internal
 */
export type DeploySchemaForPrebuiltContractType<
  TContractType extends PrebuiltContractType,
> = SchemaForPrebuiltContractType<TContractType>["deploy"];
