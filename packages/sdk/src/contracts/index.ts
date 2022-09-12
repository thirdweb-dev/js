import { ALL_ROLES } from "../common/role";
import { NetworkOrSignerOrProvider } from "../core/types";
import {
  DropErc1155ContractSchema,
  DropErc721ContractSchema,
  MarketplaceContractSchema,
  PackContractSchema,
  SDKOptions,
  SplitsContractSchema,
  TokenErc1155ContractSchema,
  TokenErc20ContractSchema,
  TokenErc721ContractSchema,
  VoteContractSchema,
} from "../schema";
import { CustomContractSchema } from "../schema/contracts/custom";
import { DropErc20ContractSchema } from "../schema/contracts/drop-erc20";
import { MultiwrapContractSchema } from "../schema/contracts/multiwrap";
import type { IStorage } from "@thirdweb-dev/storage";

type InitalizeParams = [
  network: NetworkOrSignerOrProvider,
  address: string,
  storage: IStorage,
  options?: SDKOptions,
];

export const EditionDrop = {
  name: "DropERC1155" as const,
  contractType: "edition-drop" as const,
  schema: DropErc1155ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      EditionDrop.getAbi(),
      import("./prebuilt-implementations/edition-drop"),
    ]);

    return new contract.EditionDropImpl(
      network,
      address,
      storage,
      options,
      abi,
    );
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC1155.json"))
      .default,
};

export const Edition = {
  name: "TokenERC1155" as const,
  contractType: "edition" as const,
  schema: TokenErc1155ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Edition.getAbi(),
      import("./prebuilt-implementations/edition"),
    ]);

    return new contract.EditionImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC1155.json"))
      .default,
};

export const Marketplace = {
  name: "Marketplace" as const,
  contractType: "marketplace" as const,
  schema: MarketplaceContractSchema,
  roles: ["admin", "lister", "asset"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Marketplace.getAbi(),
      import("./prebuilt-implementations/marketplace"),
    ]);

    return new contract.MarketplaceImpl(
      network,
      address,
      storage,
      options,
      abi,
    );
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/Marketplace.json"))
      .default,
};

export const Multiwrap = {
  name: "Multiwrap" as const,
  contractType: "multiwrap" as const,
  schema: MultiwrapContractSchema,
  roles: ["transfer", "minter", "unwrap", "asset"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Multiwrap.getAbi(),
      import("./prebuilt-implementations/multiwrap"),
    ]);

    return new contract.MultiwrapImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/Multiwrap.json"))
      .default,
};

export const NFTCollection = {
  name: "TokenERC721" as const,
  contractType: "nft-collection" as const,
  schema: TokenErc721ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      NFTCollection.getAbi(),
      import("./prebuilt-implementations/nft-collection"),
    ]);

    return new contract.NFTCollectionImpl(
      network,
      address,
      storage,
      options,
      abi,
    );
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC721.json"))
      .default,
};

export const NFTDrop = {
  name: "DropERC721" as const,
  contractType: "nft-drop" as const,
  schema: DropErc721ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      NFTDrop.getAbi(),
      import("./prebuilt-implementations/nft-drop"),
    ]);

    return new contract.NFTDropImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC721.json"))
      .default,
};

export const Pack = {
  name: "Pack" as const,
  contractType: "pack" as const,
  schema: PackContractSchema,
  roles: ["admin", "minter", "pauser", "transfer"] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Pack.getAbi(),
      import("./prebuilt-implementations/pack"),
    ]);

    return new contract.PackImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/Pack.json")).default,
};

export const SignatureDrop = {
  name: "SignatureDrop" as const,
  contractType: "signature-drop" as const,
  schema: DropErc721ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      SignatureDrop.getAbi(),
      import("./prebuilt-implementations/signature-drop"),
    ]);

    return new contract.SignatureDropImpl(
      network,
      address,
      storage,
      options,
      abi,
    );
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/SignatureDrop.json"))
      .default,
};

export const Split = {
  name: "Split" as const,
  contractType: "split" as const,
  schema: SplitsContractSchema,
  roles: [] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Split.getAbi(),
      import("./prebuilt-implementations/split"),
    ]);

    return new contract.SplitImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/Split.json")).default,
};

export const TokenDrop = {
  name: "DropERC20" as const,
  contractType: "token-drop" as const,
  schema: DropErc20ContractSchema,
  roles: ["admin", "transfer"] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      TokenDrop.getAbi(),
      import("./prebuilt-implementations/token-drop"),
    ]);

    return new contract.TokenDropImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/DropERC20.json"))
      .default,
};

export const Token = {
  name: "TokenERC20" as const,
  contractType: "token" as const,
  schema: TokenErc20ContractSchema,
  roles: ["admin", "minter", "transfer"] as const,
  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Token.getAbi(),
      import("./prebuilt-implementations/token"),
    ]);

    return new contract.TokenImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/TokenERC20.json"))
      .default,
};

export const Vote = {
  name: "VoteERC20" as const,
  contractType: "vote" as const,
  schema: VoteContractSchema,
  roles: [] as const,

  initialize: async (
    ...[network, address, storage, options]: InitalizeParams
  ) => {
    const [abi, contract] = await Promise.all([
      Vote.getAbi(),
      import("./prebuilt-implementations/vote"),
    ]);

    return new contract.VoteImpl(network, address, storage, options, abi);
  },
  getAbi: async () =>
    (await import("@thirdweb-dev/contracts-js/dist/abis/VoteERC20.json"))
      .default,
};

/**
 * a map from contractType -> contract metadata
 * @internal
 */
export const PREBUILT_CONTRACTS_MAP = {
  [EditionDrop.contractType]: EditionDrop,
  [Edition.contractType]: Edition,
  [Marketplace.contractType]: Marketplace,
  [Multiwrap.contractType]: Multiwrap,
  [NFTCollection.contractType]: NFTCollection,
  [NFTDrop.contractType]: NFTDrop,
  [Pack.contractType]: Pack,
  [SignatureDrop.contractType]: SignatureDrop,
  [Split.contractType]: Split,
  [TokenDrop.contractType]: TokenDrop,
  [Token.contractType]: Token,
  [Vote.contractType]: Vote,
} as const;

const SmartContract = {
  name: "SmartContract" as const,
  contractType: "custom" as const,
  schema: CustomContractSchema,
  roles: ALL_ROLES,
};

export const CONTRACTS_MAP = {
  ...PREBUILT_CONTRACTS_MAP,
  [SmartContract.contractType]: SmartContract,
} as const;
