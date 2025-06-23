// read

export {
  type BurnParams,
  burn,
} from "../../extensions/erc20/__generated__/IBurnableERC20/write/burn.js";
export {
  type BurnFromParams,
  burnFrom,
} from "../../extensions/erc20/__generated__/IBurnableERC20/write/burnFrom.js";
export { claimConditionsUpdatedEvent } from "../../extensions/erc20/__generated__/IDropERC20/events/ClaimConditionsUpdated.js";
export {
  type TokensClaimedEventFilters,
  tokensClaimedEvent,
} from "../../extensions/erc20/__generated__/IDropERC20/events/TokensClaimed.js";
export {
  getActiveClaimConditionId,
  isGetActiveClaimConditionIdSupported,
} from "../../extensions/erc20/__generated__/IDropERC20/read/getActiveClaimConditionId.js";
/**
 * DROPS extension for ERC20
 */
// READ
export {
  getClaimConditionById,
  isGetClaimConditionByIdSupported,
} from "../../extensions/erc20/__generated__/IDropERC20/read/getClaimConditionById.js";
export {
  type ApprovalEventFilters,
  approvalEvent,
} from "../../extensions/erc20/__generated__/IERC20/events/Approval.js";
// EVENTS
export {
  type TransferEventFilters,
  transferEvent,
} from "../../extensions/erc20/__generated__/IERC20/events/Transfer.js";
export {
  type AllowanceParams,
  allowance,
} from "../../extensions/erc20/__generated__/IERC20/read/allowance.js";
export {
  type BalanceOfParams,
  balanceOf,
} from "../../extensions/erc20/__generated__/IERC20/read/balanceOf.js";
export { totalSupply } from "../../extensions/erc20/__generated__/IERC20/read/totalSupply.js";
export {
  type TokensMintedEventFilters,
  tokensMintedEvent,
} from "../../extensions/erc20/__generated__/IMintableERC20/events/TokensMinted.js";
export {
  type TokensMintedWithSignatureEventFilters,
  tokensMintedWithSignatureEvent,
} from "../../extensions/erc20/__generated__/ISignatureMintERC20/events/TokensMintedWithSignature.js";
export {
  type DelegatesParams,
  delegates,
} from "../../extensions/erc20/__generated__/IVotes/read/delegates.js";
export {
  type DelegateParams,
  delegate,
} from "../../extensions/erc20/__generated__/IVotes/write/delegate.js";
export {
  type WithdrawParams,
  withdraw,
} from "../../extensions/erc20/__generated__/IWETH/write/withdraw.js";
export {
  type CanClaimParams,
  type CanClaimResult,
  canClaim,
} from "../../extensions/erc20/drops/read/canClaim.js";
export {
  getActiveClaimCondition,
  isGetActiveClaimConditionSupported,
} from "../../extensions/erc20/drops/read/getActiveClaimCondition.js";
export {
  getClaimConditions,
  isGetClaimConditionsSupported,
} from "../../extensions/erc20/drops/read/getClaimConditions.js";
// WRITE
export {
  type ClaimToParams,
  claimTo,
  isClaimToSupported,
} from "../../extensions/erc20/drops/write/claimTo.js";
export {
  isResetClaimEligibilitySupported,
  resetClaimEligibility,
} from "../../extensions/erc20/drops/write/resetClaimEligibility.js";
export {
  isSetClaimConditionsSupported,
  type SetClaimConditionsParams,
  setClaimConditions,
} from "../../extensions/erc20/drops/write/setClaimConditions.js";
export { decimals } from "../../extensions/erc20/read/decimals.js";
export {
  type GetBalanceParams,
  type GetBalanceResult,
  getBalance,
} from "../../extensions/erc20/read/getBalance.js";
export {
  type GetCurrencyMetadataResult,
  getCurrencyMetadata,
} from "../../extensions/erc20/read/getCurrencyMetadata.js";
export { isERC20 } from "../../extensions/erc20/read/isERC20.js";
export {
  type ApproveParams,
  approve,
} from "../../extensions/erc20/write/approve.js";
// ----------------------------
// WETH
// ----------------------------
export {
  type DepositParams,
  deposit,
} from "../../extensions/erc20/write/deposit.js";
export {
  type GetApprovalForTransactionParams,
  getApprovalForTransaction,
} from "../../extensions/erc20/write/getApprovalForTransaction.js";
// write
export {
  isMintToSupported,
  type MintToParams,
  mintTo,
} from "../../extensions/erc20/write/mintTo.js";
/**
 * SIGNATURE extension for ERC20
 */
export {
  type GenerateMintSignatureOptions,
  generateMintSignature,
  mintWithSignature,
} from "../../extensions/erc20/write/sigMint.js";
export {
  type TransferParams,
  transfer,
} from "../../extensions/erc20/write/transfer.js";
export {
  type TransferBatchParams,
  transferBatch,
} from "../../extensions/erc20/write/transferBatch.js";
export {
  type TransferFromParams,
  transferFrom,
} from "../../extensions/erc20/write/transferFrom.js";
