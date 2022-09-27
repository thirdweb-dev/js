export enum ClaimEligibility {
  NotEnoughSupply = "There is not enough supply to claim.",

  AddressNotAllowed = "This address is not on the allowlist.",

  WaitBeforeNextClaimTransaction = "Not enough time since last claim transaction. Please wait.",

  AlreadyClaimed = "You have already claimed the token.",

  NotEnoughTokens = "There are not enough tokens in the wallet to pay for the claim.",

  NoActiveClaimPhase = "There is no active claim phase at the moment. Please check back in later.",

  NoClaimConditionSet = "There is no claim condition set.",

  NoWallet = "No wallet connected.",

  Unknown = "No claim conditions found.",
}
