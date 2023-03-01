import IBurnableERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IBurnableERC20.json";
import IDrop from "@thirdweb-dev/contracts-js/dist/abis/IDrop.json";
import DropERC20_V2Abi from "@thirdweb-dev/contracts-js/dist/abis/IDropERC20_V2.json";
import IDropSinglePhase from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase.json";
import IDropSinglePhaseV1 from "@thirdweb-dev/contracts-js/dist/abis/IDropSinglePhase_V1.json";
import ERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IERC20.json";
import IERC20PermitAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC20Permit.json";
import IMintableERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/IMintableERC20.json";
import MulticallAbi from "@thirdweb-dev/contracts-js/dist/abis/IMulticall.json";
import ISignatureMintERC20Abi from "@thirdweb-dev/contracts-js/dist/abis/ISignatureMintERC20.json";

export const FEATURE_TOKEN_CLAIM_CONDITIONS_V1 = {
  name: "ERC20ClaimConditionsV1",
  namespace: "token.drop.claim",
  docLinks: {
    sdk: "sdk.erc20dclaimable",
    contracts: "DropSinglePhase_V1",
  },
  abis: [ERC20Abi, IDropSinglePhaseV1],
  features: {},
} as const;

export const FEATURE_TOKEN_CLAIM_CONDITIONS_V2 = {
  name: "ERC20ClaimConditionsV2",
  namespace: "token.drop.claim",
  docLinks: {
    sdk: "sdk.erc20dclaimable",
    contracts: "DropSinglePhase",
  },
  abis: [ERC20Abi, IDropSinglePhase],
  features: {},
} as const;

export const FEATURE_TOKEN_CLAIM_PHASES_V2 = {
  name: "ERC20ClaimPhasesV2",
  namespace: "token.drop.claim",
  docLinks: {
    sdk: "sdk.erc20dclaimable",
    contracts: "Drop",
  },
  abis: [ERC20Abi, IDrop],
  features: {},
} as const;

export const FEATURE_TOKEN_CLAIM_PHASES_V1 = {
  name: "ERC20ClaimPhasesV1",
  namespace: "token.drop.claim",
  docLinks: {
    sdk: "sdk.erc20dclaimable",
    contracts: "Drop",
  },
  abis: [DropERC20_V2Abi],
  features: {},
} as const;

export const FEATURE_TOKEN_BURNABLE = {
  name: "ERC20Burnable",
  namespace: "token.burn",
  docLinks: {
    sdk: "sdk.erc20burnable",
    contracts: "IBurnableERC20",
  },
  abis: [ERC20Abi, IBurnableERC20Abi],
  features: {},
} as const;

export const FEATURE_TOKEN_SIGNATURE_MINTABLE = {
  name: "ERC20SignatureMintable",
  namespace: "token.signature",
  docLinks: {
    sdk: "sdk.erc20signaturemintable",
    contracts: "ISignatureMintERC20",
  },
  abis: [ERC20Abi, ISignatureMintERC20Abi],
  features: {},
} as const;

export const FEATURE_TOKEN_BATCH_MINTABLE = {
  name: "ERC20BatchMintable",
  namespace: "token.mint.batch",
  docLinks: {
    sdk: "sdk.erc20batchmintable",
    contracts: "IMulticall",
  },
  abis: [ERC20Abi, IMintableERC20Abi, MulticallAbi],
  features: {},
} as const;

export const FEATURE_TOKEN_MINTABLE = {
  name: "ERC20Mintable",
  namespace: "token.mint",
  docLinks: {
    sdk: "sdk.erc20mintable",
    contracts: "IMintableERC20",
  },
  abis: [ERC20Abi, IMintableERC20Abi],
  features: {
    [FEATURE_TOKEN_BATCH_MINTABLE.name]: FEATURE_TOKEN_BATCH_MINTABLE,
  },
} as const;

export const FEATURE_TOKEN_PERMIT = {
  name: "ERC20Permit",
  namespace: "token.permit",
  docLinks: {
    sdk: "sdk.erc20permit",
    contracts: "IERC20Permit",
  },
  abis: [ERC20Abi, IERC20PermitAbi],
  features: {},
} as const;

export const FEATURE_TOKEN = {
  name: "ERC20",
  namespace: "token",
  docLinks: {
    sdk: "sdk.erc20",
    contracts: "IERC20",
  },
  abis: [ERC20Abi],
  features: {
    [FEATURE_TOKEN_BURNABLE.name]: FEATURE_TOKEN_BURNABLE,
    [FEATURE_TOKEN_MINTABLE.name]: FEATURE_TOKEN_MINTABLE,
    [FEATURE_TOKEN_CLAIM_CONDITIONS_V1.name]: FEATURE_TOKEN_CLAIM_CONDITIONS_V1,
    [FEATURE_TOKEN_CLAIM_CONDITIONS_V2.name]: FEATURE_TOKEN_CLAIM_CONDITIONS_V2,
    [FEATURE_TOKEN_CLAIM_PHASES_V1.name]: FEATURE_TOKEN_CLAIM_PHASES_V1,
    [FEATURE_TOKEN_CLAIM_PHASES_V2.name]: FEATURE_TOKEN_CLAIM_PHASES_V2,
    [FEATURE_TOKEN_SIGNATURE_MINTABLE.name]: FEATURE_TOKEN_SIGNATURE_MINTABLE,
    [FEATURE_TOKEN_PERMIT.name]: FEATURE_TOKEN_PERMIT,
  },
} as const;
