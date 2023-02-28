import IBurnableERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IBurnableERC1155.json";
import IClaimableERC1155 from "@thirdweb-dev/contracts-js/dist/abis/IClaimableERC1155.json";
import DelayedRevealAbi from "@thirdweb-dev/contracts-js/dist/abis/IDelayedReveal.json";
import IDropMultiPhase1155 from "@thirdweb-dev/contracts-js/dist/abis/IDrop1155.json";
import DropERC1155_V2Abi from "@thirdweb-dev/contracts-js/dist/abis/IDropERC1155_V2.json";
import IDropSinglePhase1155 from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase1155.json";
import IDropSinglePhase1155_V1 from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase1155_V1.json";
import Erc1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155.json";
import Erc1155EnumerableAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC1155Enumerable.json";
import ILazyMintAbi from "@thirdweb-dev/contracts-js/dist/abis/ILazyMint.json";
import IMintableERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/IMintableERC1155.json";
import MulticallAbi from "@thirdweb-dev/contracts-js/dist/abis/IMulticall.json";
import ISignatureMintERC1155Abi from "@thirdweb-dev/contracts-js/dist/abis/ISignatureMintERC1155.json";

export const FEATURE_EDITION_BURNABLE = {
  name: "ERC1155Burnable",
  namespace: "edition.burn",
  docLinks: {
    sdk: "sdk.erc1155burnable",
    contracts: "IBurnableERC1155",
  },
  abis: [Erc1155Abi, IBurnableERC1155Abi],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CONDITIONS_V1 = {
  name: "ERC1155ClaimConditionsV1",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "DropSinglePhase1155",
  },
  abis: [Erc1155Abi, ILazyMintAbi, IDropSinglePhase1155_V1],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CONDITIONS_V2 = {
  name: "ERC1155ClaimConditionsV2",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "DropSinglePhase1155",
  },
  abis: [Erc1155Abi, ILazyMintAbi, IDropSinglePhase1155],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_PHASES_V2 = {
  name: "ERC1155ClaimPhasesV2",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "Drop1155",
  },
  abis: [Erc1155Abi, ILazyMintAbi, IDropMultiPhase1155],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_PHASES_V1 = {
  name: "ERC1155ClaimPhasesV1",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "Drop1155",
  },
  abis: [DropERC1155_V2Abi],
  features: {},
} as const;

export const FEATURE_EDITION_CLAIM_CUSTOM = {
  name: "ERC1155ClaimCustom",
  namespace: "edition.drop.claim",
  docLinks: {
    sdk: "sdk.erc1155claimable",
    contracts: "IClaimableERC1155",
  },
  abis: [Erc1155Abi, ILazyMintAbi, IClaimableERC1155],
  features: {},
} as const;

export const FEATURE_EDITION_REVEALABLE = {
  name: "ERC1155Revealable",
  namespace: "edition.drop.revealer",
  docLinks: {
    sdk: "sdk.drop.delayedreveal",
    contracts: "DelayedReveal",
  },
  abis: [Erc1155Abi, ILazyMintAbi, DelayedRevealAbi],
  features: {},
} as const;

export const FEATURE_EDITION_LAZY_MINTABLE_V2 = {
  name: "ERC1155LazyMintableV2",
  namespace: "edition.drop",
  docLinks: {
    sdk: "sdk.erc1155droppable",
    contracts: "LazyMint",
  },
  abis: [Erc1155Abi, ILazyMintAbi],
  features: {
    [FEATURE_EDITION_REVEALABLE.name]: FEATURE_EDITION_REVEALABLE,
    [FEATURE_EDITION_CLAIM_CUSTOM.name]: FEATURE_EDITION_CLAIM_CUSTOM,
    [FEATURE_EDITION_CLAIM_CONDITIONS_V1.name]:
      FEATURE_EDITION_CLAIM_CONDITIONS_V1,
    [FEATURE_EDITION_CLAIM_CONDITIONS_V2.name]:
      FEATURE_EDITION_CLAIM_CONDITIONS_V2,
    [FEATURE_EDITION_CLAIM_PHASES_V2.name]: FEATURE_EDITION_CLAIM_PHASES_V2,
  },
} as const;

export const FEATURE_EDITION_LAZY_MINTABLE_V1 = {
  name: "ERC1155LazyMintableV1",
  namespace: "edition.drop",
  docLinks: {
    sdk: "sdk.erc1155droppable",
    contracts: "LazyMint",
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
    contracts: "ISignatureMintERC1155",
  },
  abis: [Erc1155Abi, ISignatureMintERC1155Abi],
  features: {},
} as const;

export const FEATURE_EDITION_BATCH_TRASNFERABLE = {
  name: "ERC1155BatchTransferable",
  namespace: "",
  docLinks: {
    sdk: "sdk.erc1155",
    contracts: "IMulticall",
  },
  abis: [Erc1155Abi, MulticallAbi],
  features: {},
} as const;

export const FEATURE_EDITION_BATCH_MINTABLE = {
  name: "ERC1155BatchMintable",
  namespace: "edition.mint.batch",
  docLinks: {
    sdk: "sdk.erc1155batchmintable",
    contracts: "IMulticall",
  },
  abis: [Erc1155Abi, IMintableERC1155Abi, MulticallAbi],
  features: {},
} as const;

export const FEATURE_EDITION_MINTABLE = {
  name: "ERC1155Mintable",
  namespace: "edition.mint",
  docLinks: {
    sdk: "sdk.erc1155mintable",
    contracts: "IMintableERC1155",
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
    contracts: "IERC1155",
  },
  abis: [Erc1155Abi, Erc1155EnumerableAbi],
  features: {},
} as const;

export const FEATURE_EDITION = {
  name: "ERC1155",
  namespace: "edition",
  docLinks: {
    sdk: "sdk.erc1155enumerable",
    contracts: "IERC1155Enumerable",
  },
  abis: [Erc1155Abi],
  features: {
    [FEATURE_EDITION_BURNABLE.name]: FEATURE_EDITION_BURNABLE,
    [FEATURE_EDITION_ENUMERABLE.name]: FEATURE_EDITION_ENUMERABLE,
    [FEATURE_EDITION_MINTABLE.name]: FEATURE_EDITION_MINTABLE,
    [FEATURE_EDITION_LAZY_MINTABLE_V1.name]: FEATURE_EDITION_LAZY_MINTABLE_V1,
    [FEATURE_EDITION_LAZY_MINTABLE_V2.name]: FEATURE_EDITION_LAZY_MINTABLE_V2,
    [FEATURE_EDITION_REVEALABLE.name]: FEATURE_EDITION_REVEALABLE,
    [FEATURE_EDITION_SIGNATURE_MINTABLE.name]:
      FEATURE_EDITION_SIGNATURE_MINTABLE,
  },
} as const;
