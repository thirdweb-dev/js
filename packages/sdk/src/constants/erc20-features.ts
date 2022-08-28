import IBurnableERC20Abi from "@thirdweb-dev/contracts-js/abis/IBurnableERC20.json";
import IDropSinglePhase from "@thirdweb-dev/contracts-js/abis/IDropSinglePhase.json";
import ERC20Abi from "@thirdweb-dev/contracts-js/abis/IERC20.json";
import IMintableERC20Abi from "@thirdweb-dev/contracts-js/abis/IMintableERC20.json";
import MulticallAbi from "@thirdweb-dev/contracts-js/abis/IMulticall.json";
import ISignatureMintERC20Abi from "@thirdweb-dev/contracts-js/abis/ISignatureMintERC20.json";

export const FEATURE_TOKEN_DROPPABLE = {
  name: "ERC20Droppable",
  namespace: "token.drop",
  docLinks: {
    sdk: "sdk.erc20droppable",
    contracts: "DropSinglePhase",
  },
  abis: [ERC20Abi, IDropSinglePhase],
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
    [FEATURE_TOKEN_DROPPABLE.name]: FEATURE_TOKEN_DROPPABLE,
    [FEATURE_TOKEN_SIGNATURE_MINTABLE.name]: FEATURE_TOKEN_SIGNATURE_MINTABLE,
  },
} as const;
