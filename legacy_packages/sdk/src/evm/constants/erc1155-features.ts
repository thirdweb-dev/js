import IBurnableERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IBurnableERC1155.json";
import IClaimableERC1155 from "@thirdweb-dev/contracts-js/dist/abis/IClaimableERC1155.json";
import DelayedRevealAbi from "@thirdweb-dev/contracts-js/dist/abis/IDelayedReveal.json";
import IDropMultiPhase1155 from "@thirdweb-dev/contracts-js/dist/abis/IDrop1155.json";
import DropERC1155_V2Abi from "@thirdweb-dev/contracts-js/dist/abis/IDropERC1155_V2.json";
import IDropSinglePhase1155 from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase1155.json";
import IDropSinglePhase1155_V1 from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase1155_V1.json";
import Erc1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import Erc1155MetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155Metadata.json";
import Erc1155SupplyAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155Supply.json";
import Erc1155EnumerableAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155Enumerable.json";
import ILazyMintAbi from "@thirdweb-dev/contracts-js/dist/abis/ILazyMint.json";
import IMintableERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IMintableERC1155.json";
import MulticallAbi from "@thirdweb-dev/contracts-js/dist/abis/IMulticall.json";
import ISignatureMintERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/ISignatureMintERC1155.json";
import INFTMetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/INFTMetadata.json";

// TODO could be part of IERC1155Metadata even though its not in the spec
const NAME_SYMBOL_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const FEATURE_EDITION_BURNABLE = {
  name: "ERC1155Burnable",
  namespace: "edition.burn",
  docLinks: {
    sdk: "sdk.erc1155burnable",
    contracts: "erc1155burnable",
  },
  abis: [Erc1155Abi, IBurnableERC1155Abi],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CONDITIONS_V1 = {
  name: "ERC1155ClaimConditionsV1",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "erc1155dropsinglephase",
  },
  abis: [Erc1155Abi, IDropSinglePhase1155_V1],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CONDITIONS_V2 = {
  name: "ERC1155ClaimConditionsV2",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "erc1155claimconditions",
  },
  abis: [Erc1155Abi, IDropSinglePhase1155],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_PHASES_V2 = {
  name: "ERC1155ClaimPhasesV2",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "erc1155claimphases",
  },
  abis: [Erc1155Abi, IDropMultiPhase1155],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_PHASES_V1 = {
  name: "ERC1155ClaimPhasesV1",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "erc1155claimphases",
  },
  abis: [DropERC1155_V2Abi],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CUSTOM = {
  name: "ERC1155ClaimCustom",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "erc1155claimcustom",
  },
  abis: [Erc1155Abi, IClaimableERC1155],
  features: {},
} as const;

export const FEATURE_EDITION_REVEALABLE = {
  name: "ERC1155Revealable",
  namespace: "edition.drop.revealer",
  docLinks: {
    sdk: "sdk.drop.delayedreveal",
    contracts: "erc1155revealable",
  },
  abis: [Erc1155Abi, ILazyMintAbi, DelayedRevealAbi],
  features: {},
} as const;

export const FEATURE_EDITION_LAZY_MINTABLE_V2 = /* @__PURE__ */ {
  name: "ERC1155LazyMintableV2",
  namespace: "edition.drop",
  docLinks: {
    sdk: "sdk.erc1155droppable",
    contracts: "lazymint",
  },
  abis: [Erc1155Abi, ILazyMintAbi],
  features: {
    [FEATURE_EDITION_REVEALABLE.name]: FEATURE_EDITION_REVEALABLE,
  },
} as const;

export const FEATURE_EDITION_LAZY_MINTABLE_V1 = /* @__PURE__ */ {
  name: "ERC1155LazyMintableV1",
  namespace: "edition.drop",
  docLinks: {
    sdk: "sdk.erc1155droppable",
    contracts: "lazymint",
  },
  abis: [DropERC1155_V2Abi],
  features: {
    [FEATURE_EDITION_CLAIM_PHASES_V1.name]: FEATURE_EDITION_CLAIM_PHASES_V1,
  },
} as const;

export const FEATURE_EDITION_SIGNATURE_MINTABLE = {
  name: "ERC1155SignatureMintable",
  namespace: "edition.signature",
  docLinks: {
    sdk: "sdk.erc1155signaturemintable",
    contracts: "erc1155signaturemint",
  },
  abis: [Erc1155Abi, ISignatureMintERC1155Abi],
  features: {},
} as const;

export const FEATURE_EDITION_BATCH_TRASNFERABLE = {
  name: "ERC1155BatchTransferable",
  namespace: "",
  docLinks: {
    sdk: "sdk.erc1155",
    contracts: "multicall",
  },
  abis: [Erc1155Abi, MulticallAbi],
  features: {},
} as const;

export const FEATURE_EDITION_BATCH_MINTABLE = {
  name: "ERC1155BatchMintable",
  namespace: "edition.mint.batch",
  docLinks: {
    sdk: "sdk.erc1155batchmintable",
    contracts: "erc1155batchmintable",
  },
  abis: [Erc1155Abi, IMintableERC1155Abi, MulticallAbi],
  features: {},
} as const;

export const FEATURE_EDITION_MINTABLE = /* @__PURE__ */ {
  name: "ERC1155Mintable",
  namespace: "edition.mint",
  docLinks: {
    sdk: "sdk.erc1155mintable",
    contracts: "erc1155mintable",
  },
  abis: [Erc1155Abi, IMintableERC1155Abi],
  features: {
    [FEATURE_EDITION_BATCH_MINTABLE.name]: FEATURE_EDITION_BATCH_MINTABLE,
  },
} as const;

export const FEATURE_EDITION_ENUMERABLE = {
  name: "ERC1155Enumerable",
  namespace: "edition.query",
  docLinks: {
    sdk: "sdk.erc1155",
    contracts: "erc1155enumerable",
  },
  abis: [Erc1155Abi, Erc1155EnumerableAbi],
  features: {},
} as const;

export const FEATURE_EDITION_UPDATABLE_METADATA = {
  name: "ERC1155UpdatableMetadata",
  namespace: "edition.metadata",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "",
  },
  abis: [Erc1155Abi, INFTMetadataAbi],
  features: {},
} as const;

export const FEATURE_EDITION_SUPPLY = {
  name: "ERC1155Supply",
  namespace: "edition.supply",
  docLinks: {
    sdk: "",
    contracts: "",
  },
  abis: [Erc1155Abi, Erc1155SupplyAbi],
  features: {},
} as const;

export const FEATURE_EDITION = /* @__PURE__ */ {
  name: "ERC1155",
  namespace: "edition",
  docLinks: {
    sdk: "sdk.erc1155enumerable",
    contracts: "erc1155",
  },
  abis: [Erc1155Abi, Erc1155MetadataAbi, NAME_SYMBOL_ABI],
  features: {
    [FEATURE_EDITION_SUPPLY.name]: FEATURE_EDITION_SUPPLY,
    [FEATURE_EDITION_BURNABLE.name]: FEATURE_EDITION_BURNABLE,
    [FEATURE_EDITION_ENUMERABLE.name]: FEATURE_EDITION_ENUMERABLE,
    [FEATURE_EDITION_MINTABLE.name]: FEATURE_EDITION_MINTABLE,
    [FEATURE_EDITION_LAZY_MINTABLE_V1.name]: FEATURE_EDITION_LAZY_MINTABLE_V1,
    [FEATURE_EDITION_LAZY_MINTABLE_V2.name]: FEATURE_EDITION_LAZY_MINTABLE_V2,
    [FEATURE_EDITION_REVEALABLE.name]: FEATURE_EDITION_REVEALABLE,
    [FEATURE_EDITION_SIGNATURE_MINTABLE.name]:
      FEATURE_EDITION_SIGNATURE_MINTABLE,
    [FEATURE_EDITION_CLAIM_CUSTOM.name]: FEATURE_EDITION_CLAIM_CUSTOM,
    [FEATURE_EDITION_CLAIM_CONDITIONS_V1.name]:
      FEATURE_EDITION_CLAIM_CONDITIONS_V1,
    [FEATURE_EDITION_CLAIM_CONDITIONS_V2.name]:
      FEATURE_EDITION_CLAIM_CONDITIONS_V2,
    [FEATURE_EDITION_CLAIM_PHASES_V2.name]: FEATURE_EDITION_CLAIM_PHASES_V2,
    [FEATURE_EDITION_UPDATABLE_METADATA.name]:
      FEATURE_EDITION_UPDATABLE_METADATA,
  },
} as const;
