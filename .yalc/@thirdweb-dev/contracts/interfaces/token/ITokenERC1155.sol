// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/**
 *  `SignatureMint1155` is an ERC 1155 contract. It lets anyone mint NFTs by producing a mint request
 *  and a signature (produced by an account with MINTER_ROLE, signing the mint request).
 */
interface ITokenERC1155 is IERC1155Upgradeable {
    /**
     *  @notice The body of a request to mint NFTs.
     *
     *  @param to The receiver of the NFTs to mint.
     *  @param royaltyRecipient The recipient of the minted NFT's secondary sales royalties.
     *  @param primarySaleRecipient The recipient of the minted NFT's primary sales proceeds.
     *  @param tokenId Optional: specify only if not first mint.
     *  @param uri The URI of the NFT to mint.
     *  @param quantity The quantity of NFTs to mint.
     *  @param pricePerToken Price to pay for minting with the signature.
     *  @param currency The currency in which the price per token must be paid.
     *  @param validityStartTimestamp The unix timestamp after which the request is valid.
     *  @param validityEndTimestamp The unix timestamp after which the request expires.
     *  @param uid A unique identifier for the request.
     */
    struct MintRequest {
        address to;
        address royaltyRecipient;
        uint256 royaltyBps;
        address primarySaleRecipient;
        uint256 tokenId;
        string uri;
        uint256 quantity;
        uint256 pricePerToken;
        address currency;
        uint128 validityStartTimestamp;
        uint128 validityEndTimestamp;
        bytes32 uid;
    }

    /// @dev Emitted when an account with MINTER_ROLE mints an NFT.
    event TokensMinted(address indexed mintedTo, uint256 indexed tokenIdMinted, string uri, uint256 quantityMinted);

    /// @dev Emitted when tokens are minted.
    event TokensMintedWithSignature(
        address indexed signer,
        address indexed mintedTo,
        uint256 indexed tokenIdMinted,
        MintRequest mintRequest
    );

    /**
     *  @notice Verifies that a mint request is signed by an account holding
     *         MINTER_ROLE (at the time of the function call).
     *
     *  @param req The mint request.
     *  @param signature The signature produced by an account signing the mint request.
     *
     *  returns (success, signer) Result of verification and the recovered address.
     */
    function verify(MintRequest calldata req, bytes calldata signature)
        external
        view
        returns (bool success, address signer);

    /**
     *  @notice Lets an account with MINTER_ROLE mint an NFT.
     *
     *  @param to The address to mint the NFT to.
     *  @param tokenId The tokenId of the NFTs to mint
     *  @param uri The URI to assign to the NFT.
     *  @param amount The number of copies of the NFT to mint.
     *
     */
    function mintTo(
        address to,
        uint256 tokenId,
        string calldata uri,
        uint256 amount
    ) external;

    /**
     *  @notice Mints an NFT according to the provided mint request.
     *
     *  @param req The mint request.
     *  @param signature he signature produced by an account signing the mint request.
     */
    function mintWithSignature(MintRequest calldata req, bytes calldata signature) external payable;
}
