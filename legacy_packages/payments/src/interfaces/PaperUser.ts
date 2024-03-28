// UNCHANGED

export type PaperUser = {
  /**
   * The user's email address.
   * This address is case-insensitive (i.e. different capitalizations map to the same wallet).
   */
  emailAddress: string;

  /**
   * The Paper Wallet address associated with this user's email address.
   */
  walletAddress: string;

  /**
   * The user's access code. Will only be set if [clientId] was provided. This can be used to query about the user details.
   */
  accessCode?: string;
};
