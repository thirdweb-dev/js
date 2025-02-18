// read
export { isERC20 } from "../../extensions/erc20/read/isERC20.js";
export {
  getBalance,
  type GetBalanceParams,
  type GetBalanceResult,
} from "../../extensions/erc20/read/getBalance.js";
export {
  balanceOf,
  type BalanceOfParams,
} from "../../extensions/erc20/__generated__/IERC20/read/balanceOf.js";
export { decimals } from "../../extensions/erc20/read/decimals.js";
export {
  delegates,
  type DelegatesParams,
} from "../../extensions/erc20/__generated__/IVotes/read/delegates.js";
export { totalSupply } from "../../extensions/erc20/__generated__/IERC20/read/totalSupply.js";
export {
  allowance,
  type AllowanceParams,
} from "../../extensions/erc20/__generated__/IERC20/read/allowance.js";
export {
  getCurrencyMetadata,
  type GetCurrencyMetadataResult,
} from "../../extensions/erc20/read/getCurrencyMetadata.js";

// write
export {
  isMintToSupported,
  mintTo,
  type MintToParams,
} from "../../extensions/erc20/write/mintTo.js";
export {
  transfer,
  type TransferParams,
} from "../../extensions/erc20/write/transfer.js";
export {
  transferFrom,
  type TransferFromParams,
} from "../../extensions/erc20/write/transferFrom.js";
export {
  transferBatch,
  type TransferBatchParams,
} from "../../extensions/erc20/write/transferBatch.js";
export {
  approve,
  type ApproveParams,
} from "../../extensions/erc20/write/approve.js";
export {
  burn,
  type BurnParams,
} from "../../extensions/erc20/__generated__/IBurnableERC20/write/burn.js";
export {
  burnFrom,
  type BurnFromParams,
} from "../../extensions/erc20/__generated__/IBurnableERC20/write/burnFrom.js";

/**
 * DROPS extension for ERC20
 */
// READ
export {
  getClaimConditionById,
  isGetClaimConditionByIdSupported,
} from "../../extensions/erc20/__generated__/IDropERC20/read/getClaimConditionById.js";
export {
  getActiveClaimConditionId,
  isGetActiveClaimConditionIdSupported,
} from "../../extensions/erc20/__generated__/IDropERC20/read/getActiveClaimConditionId.js";
export {
  getClaimConditions,
  isGetClaimConditionsSupported,
} from "../../extensions/erc20/drops/read/getClaimConditions.js";
export {
  getActiveClaimCondition,
  isGetActiveClaimConditionSupported,
} from "../../extensions/erc20/drops/read/getActiveClaimCondition.js";
export {
  canClaim,
  type CanClaimParams,
  type CanClaimResult,
} from "../../extensions/erc20/drops/read/canClaim.js";

// WRITE
export {
  claimTo,
  type ClaimToParams,
  isClaimToSupported,
} from "../../extensions/erc20/drops/write/claimTo.js";
export {
  setClaimConditions,
  type SetClaimConditionsParams,
  isSetClaimConditionsSupported,
} from "../../extensions/erc20/drops/write/setClaimConditions.js";
export {
  resetClaimEligibility,
  isResetClaimEligibilitySupported,
} from "../../extensions/erc20/drops/write/resetClaimEligibility.js";

/**
 * SIGNATURE extension for ERC20
 */
export {
  mintWithSignature,
  type GenerateMintSignatureOptions,
  generateMintSignature,
} from "../../extensions/erc20/write/sigMint.js";

// ----------------------------
// WETH
// ----------------------------
export {
  deposit,
  type DepositParams,
} from "../../extensions/erc20/write/deposit.js";
export {
  withdraw,
  type WithdrawParams,
} from "../../extensions/erc20/__generated__/IWETH/write/withdraw.js";

// EVENTS
export {
  transferEvent,
  type TransferEventFilters,
} from "../../extensions/erc20/__generated__/IERC20/events/Transfer.js";
export {
  approvalEvent,
  type ApprovalEventFilters,
} from "../../extensions/erc20/__generated__/IERC20/events/Approval.js";
export {
  tokensMintedEvent,
  type TokensMintedEventFilters,
} from "../../extensions/erc20/__generated__/IMintableERC20/events/TokensMinted.js";
export {
  tokensClaimedEvent,
  type TokensClaimedEventFilters,
} from "../../extensions/erc20/__generated__/IDropERC20/events/TokensClaimed.js";
export { claimConditionsUpdatedEvent } from "../../extensions/erc20/__generated__/IDropERC20/events/ClaimConditionsUpdated.js";
export {
  tokensMintedWithSignatureEvent,
  type TokensMintedWithSignatureEventFilters,
} from "../../extensions/erc20/__generated__/ISignatureMintERC20/events/TokensMintedWithSignature.js";

export {
  getApprovalForTransaction,
  type GetApprovalForTransactionParams,
} from "../../extensions/erc20/write/getApprovalForTransaction.js";
export {
  delegate,
  type DelegateParams,
} from "../../extensions/erc20/__generated__/IVotes/write/delegate.js";
