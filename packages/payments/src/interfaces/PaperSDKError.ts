export type PaperSDKError = {
  /**
   * An enum representing the error encountered.
   * The value is a human-readable, English message describing the error.
   */
  code: PaperSDKErrorCode | PayWithCryptoErrorCode;
  error: Error;
};

export enum PaperSDKErrorCode {
  UserAbandonedCheckout = "User abandoned the checkout",
  UserLoginFailed = "User login failed",
  InvalidProps = "The props you passed in to this component are not valid.",
  InvalidCard = "The card information is invalid. Please double check that the Card, CVC, and Zip code are all correct.",
  EmailNotVerified = "The email was unable to be verified.",
  NotEnoughSupply = "There is not enough supply to claim.",
  AddressNotAllowed = "This address is not on the allowlist.",
  NoActiveClaimPhase = "There is no active claim phase at the moment.",
}

export enum PayWithCryptoErrorCode {
  ErrorConnectingToWallet = "Error connecting to wallet",
  ErrorSendingTransaction = "Something went wrong sending transaction",
  InsufficientBalance = `Insufficient ETH`,
  TransactionCancelled = "Transaction Cancelled",
  WrongChain = `Wrong Chain Detected`,
  ChainSwitchUnderway = "There is a network switch already underway",
  PendingSignature = "Pending Signature",
}
