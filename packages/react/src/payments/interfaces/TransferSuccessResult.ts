export type TransferSuccessResult = {
  /**
   * A unique ID for this purchase.
   */
  id: string;

  /**
   * A list of tokens claimed.
   */
  claimedTokens: ClaimedToken[];
};

export type ClaimedToken = {
  /**
   * The address of the NFT contract.
   */
  contractAddress: string;

  /**
   * The title of the collection.
   */
  collectionTitle: string;

  /**
   * The ID of the token in the collection that was claimed.
   * For ERC-721 collections, this ID is unique for each claim.
   * For ERC-1155 collections, this ID is identical for all buyers of this NFT token.
   */
  tokenId: string;

  transactions: {
    /**
     * The transaction hash for the claim transaction.
     */
    claimHash: string;

    /**
     * The blockchain explorer URL for the claim transaction.
     */
    claimExplorerUrl: string;

    /**
     * The transaction hash for the transfer transaction.
     * This hash is undefined if the claim directly sent the token to the buyer's wallet.
     */
    transferHash: string | undefined;

    /**
     * The blockchain explorer URL for the transfer transaction.
     * This hash is undefined if the claim directly sent the token to the buyer's wallet.
     */
    transferExplorerUrl: string | undefined;
  };

  metadata: {
    /**
     * The title of the NFT in the collection.
     */
    name: string;

    /**
     * The description of the NFT
     */
    description: string | undefined;

    /**
     * An image representing the NFT.
     */
    image: string | undefined;

    /**
     * Arbitrary properties (i.e. traits) describing the NFT.
     */
    properties: object | undefined;
  };
};
