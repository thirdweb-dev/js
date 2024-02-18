export const mintHookERC721CompilerMetadata = {
  compiler: { version: "0.8.17+commit.8df45f5f" },
  language: "Solidity",
  output: {
    abi: [
      { inputs: [], type: "error", name: "ERC721HookNotImplemented" },
      { inputs: [], type: "error", name: "ERC721UnauthorizedUpgrade" },
      { inputs: [], type: "error", name: "InvalidInitialization" },
      {
        inputs: [
          {
            internalType: "address",
            name: "expectedCurrency",
            type: "address",
          },
          { internalType: "address", name: "actualCurrency", type: "address" },
        ],
        type: "error",
        name: "MintHookInvalidCurrency",
      },
      {
        inputs: [
          { internalType: "uint256", name: "expectedPrice", type: "uint256" },
          { internalType: "uint256", name: "actualPrice", type: "uint256" },
        ],
        type: "error",
        name: "MintHookInvalidPrice",
      },
      {
        inputs: [
          { internalType: "uint256", name: "quantityToMint", type: "uint256" },
        ],
        type: "error",
        name: "MintHookInvalidQuantity",
      },
      { inputs: [], type: "error", name: "MintHookInvalidRecipient" },
      { inputs: [], type: "error", name: "MintHookInvalidSignature" },
      { inputs: [], type: "error", name: "MintHookMaxSupplyClaimed" },
      { inputs: [], type: "error", name: "MintHookMintEnded" },
      { inputs: [], type: "error", name: "MintHookMintNotStarted" },
      { inputs: [], type: "error", name: "MintHookNotInAllowlist" },
      { inputs: [], type: "error", name: "MintHookNotToken" },
      { inputs: [], type: "error", name: "MintHookRequestExpired" },
      { inputs: [], type: "error", name: "MintHookRequestUsed" },
      { inputs: [], type: "error", name: "MintHooksNotAuthorized" },
      { inputs: [], type: "error", name: "NotInitializing" },
      {
        inputs: [
          { internalType: "address", name: "caller", type: "address" },
          { internalType: "uint256", name: "permissionBits", type: "uint256" },
        ],
        type: "error",
        name: "PermissionUnauthorized",
      },
      { inputs: [], type: "error", name: "UnauthorizedCallContext" },
      { inputs: [], type: "error", name: "UpgradeFailed" },
      {
        inputs: [
          {
            internalType: "address",
            name: "token",
            type: "address",
            indexed: true,
          },
          {
            internalType: "struct IClaimCondition.ClaimCondition",
            name: "condition",
            type: "tuple",
            components: [
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "maxClaimableSupply",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyClaimed",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantityLimitPerWallet",
                type: "uint256",
              },
              { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
              {
                internalType: "uint256",
                name: "pricePerToken",
                type: "uint256",
              },
              { internalType: "address", name: "currency", type: "address" },
              { internalType: "string", name: "metadata", type: "string" },
            ],
            indexed: false,
          },
          {
            internalType: "bool",
            name: "resetEligibility",
            type: "bool",
            indexed: false,
          },
        ],
        type: "event",
        name: "ClaimConditionUpdate",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "token",
            type: "address",
            indexed: true,
          },
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "feeConfig",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
            indexed: false,
          },
        ],
        type: "event",
        name: "DefaultFeeConfigUpdate",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "version",
            type: "uint64",
            indexed: false,
          },
        ],
        type: "event",
        name: "Initialized",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "token",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "nextTokenIdToMint",
            type: "uint256",
            indexed: false,
          },
        ],
        type: "event",
        name: "NextTokenIdUpdate",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "permissionBits",
            type: "uint256",
            indexed: false,
          },
        ],
        type: "event",
        name: "PermissionUpdated",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "token",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
            indexed: false,
          },
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "feeConfig",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
            indexed: false,
          },
        ],
        type: "event",
        name: "TokenFeeConfigUpdate",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "implementation",
            type: "address",
            indexed: true,
          },
        ],
        type: "event",
        name: "Upgraded",
        anonymous: false,
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "ADMIN_ROLE_BITS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "BEFORE_APPROVE_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "BEFORE_BURN_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "BEFORE_MINT_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "BEFORE_TRANSFER_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "NATIVE_TOKEN",
        outputs: [{ internalType: "address", name: "", type: "address" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "ROYALTY_INFO_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "TOKEN_URI_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_upgradeAdmin", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "__ERC721Hook_init",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
          { internalType: "bool", name: "_approve", type: "bool" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "beforeApprove",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
          { internalType: "bytes", name: "_encodedArgs", type: "bytes" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "beforeBurn",
      },
      {
        inputs: [
          { internalType: "address", name: "_claimer", type: "address" },
          { internalType: "uint256", name: "_quantity", type: "uint256" },
          { internalType: "bytes", name: "_encodedArgs", type: "bytes" },
        ],
        stateMutability: "payable",
        type: "function",
        name: "beforeMint",
        outputs: [
          { internalType: "uint256", name: "tokenIdToMint", type: "uint256" },
          { internalType: "uint256", name: "quantityToMint", type: "uint256" },
        ],
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "beforeTransfer",
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "eip712Domain",
        outputs: [
          { internalType: "bytes1", name: "fields", type: "bytes1" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "version", type: "string" },
          { internalType: "uint256", name: "chainId", type: "uint256" },
          {
            internalType: "address",
            name: "verifyingContract",
            type: "address",
          },
          { internalType: "bytes32", name: "salt", type: "bytes32" },
          { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
        ],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "getBeforeBurnArgSignature",
        outputs: [
          { internalType: "string", name: "argSignature", type: "string" },
        ],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "getBeforeMintArgSignature",
        outputs: [
          { internalType: "string", name: "argSignature", type: "string" },
        ],
      },
      {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        stateMutability: "view",
        type: "function",
        name: "getClaimCondition",
        outputs: [
          {
            internalType: "struct IClaimCondition.ClaimCondition",
            name: "",
            type: "tuple",
            components: [
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "maxClaimableSupply",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyClaimed",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantityLimitPerWallet",
                type: "uint256",
              },
              { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
              {
                internalType: "uint256",
                name: "pricePerToken",
                type: "uint256",
              },
              { internalType: "address", name: "currency", type: "address" },
              { internalType: "string", name: "metadata", type: "string" },
            ],
          },
        ],
      },
      {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        stateMutability: "view",
        type: "function",
        name: "getDefaultFeeConfig",
        outputs: [
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
          },
        ],
      },
      {
        inputs: [
          { internalType: "address", name: "_token", type: "address" },
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
        name: "getFeeConfigForToken",
        outputs: [
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
          },
        ],
      },
      {
        inputs: [],
        stateMutability: "pure",
        type: "function",
        name: "getHooks",
        outputs: [
          {
            internalType: "uint256",
            name: "hooksImplemented",
            type: "uint256",
          },
        ],
      },
      {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        stateMutability: "view",
        type: "function",
        name: "getNextTokenIdToMint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_token", type: "address" },
          { internalType: "address", name: "_claimer", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
        name: "getSupplyClaimedByWallet",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "grantRole",
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_upgradeAdmin", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "initialize",
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "proxiableUUID",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "revokeRole",
      },
      {
        inputs: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "salePrice", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
        name: "royaltyInfo",
        outputs: [
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint256", name: "royaltyAmount", type: "uint256" },
        ],
      },
      {
        inputs: [
          {
            internalType: "struct IClaimCondition.ClaimCondition",
            name: "_condition",
            type: "tuple",
            components: [
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint256",
                name: "maxClaimableSupply",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "supplyClaimed",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantityLimitPerWallet",
                type: "uint256",
              },
              { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
              {
                internalType: "uint256",
                name: "pricePerToken",
                type: "uint256",
              },
              { internalType: "address", name: "currency", type: "address" },
              { internalType: "string", name: "metadata", type: "string" },
            ],
          },
          {
            internalType: "bool",
            name: "_resetClaimEligibility",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "setClaimCondition",
      },
      {
        inputs: [
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "_config",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "setDefaultFeeConfig",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_id", type: "uint256" },
          {
            internalType: "struct IFeeConfig.FeeConfig",
            name: "_config",
            type: "tuple",
            components: [
              {
                internalType: "address",
                name: "primarySaleRecipient",
                type: "address",
              },
              {
                internalType: "address",
                name: "platformFeeRecipient",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "platformFeeBps",
                type: "uint16",
              },
            ],
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "setFeeConfigForToken",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_nextIdToMint", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "setNextIdToMint",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "metadata", type: "string" }],
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newImplementation",
            type: "address",
          },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        stateMutability: "payable",
        type: "function",
        name: "upgradeToAndCall",
      },
      {
        inputs: [
          { internalType: "address", name: "_token", type: "address" },
          { internalType: "address", name: "_claimer", type: "address" },
          { internalType: "uint256", name: "_quantity", type: "uint256" },
          { internalType: "uint256", name: "_pricePerToken", type: "uint256" },
          { internalType: "address", name: "_currency", type: "address" },
          {
            internalType: "bytes32[]",
            name: "_allowlistProof",
            type: "bytes32[]",
          },
        ],
        stateMutability: "view",
        type: "function",
        name: "verifyClaim",
        outputs: [
          { internalType: "bool", name: "isAllowlisted", type: "bool" },
        ],
      },
      {
        inputs: [
          {
            internalType: "struct IMintRequest.MintRequest",
            name: "_req",
            type: "tuple",
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "tokenId", type: "uint256" },
              { internalType: "address", name: "minter", type: "address" },
              { internalType: "uint256", name: "quantity", type: "uint256" },
              {
                internalType: "uint256",
                name: "pricePerToken",
                type: "uint256",
              },
              { internalType: "address", name: "currency", type: "address" },
              {
                internalType: "bytes32[]",
                name: "allowlistProof",
                type: "bytes32[]",
              },
              {
                internalType: "bytes",
                name: "permissionSignature",
                type: "bytes",
              },
              {
                internalType: "uint128",
                name: "sigValidityStartTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "sigValidityEndTimestamp",
                type: "uint128",
              },
              { internalType: "bytes32", name: "sigUid", type: "bytes32" },
            ],
          },
        ],
        stateMutability: "view",
        type: "function",
        name: "verifyPermissionedClaim",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "beforeApprove(address,address,uint256,bool)": {
          params: {
            _approve: "The approval status to set.",
            _from: "The address that is approving tokens.",
            _to: "The address that is being approved.",
            _tokenId: "The token ID being approved.",
          },
        },
        "beforeBurn(address,uint256,bytes)": {
          params: {
            _encodedArgs: "The encoded arguments for the beforeBurn hook.",
            _from: "The address that is burning tokens.",
            _tokenId: "The token ID being burned.",
          },
        },
        "beforeMint(address,uint256,bytes)": {
          params: {
            _claimer: "The address that is minting tokens.",
            _encodedArgs: "The encoded arguments for the beforeMint hook.",
            _quantity: "The quantity of tokens to mint.",
          },
          returns: {
            quantityToMint: "The quantity of tokens to mint.",
            tokenIdToMint: "The start tokenId to mint.",
          },
        },
        "beforeTransfer(address,address,uint256)": {
          params: {
            _from: "The address that is transferring tokens.",
            _to: "The address that is receiving tokens.",
            _tokenId: "The token ID being transferred.",
          },
        },
        "eip712Domain()": {
          details: "See: https://eips.ethereum.org/EIPS/eip-5267",
        },
        "getSupplyClaimedByWallet(address,address)": {
          params: {
            _claimer: "The address to get the supply claimed for",
            _token: "The token to get the claim condition for.",
          },
        },
        "grantRole(address,uint256)": {
          params: {
            _account: "The account to grant permissions to.",
            _roleBits: "The bits representing the permissions to grant.",
          },
        },
        "hasRole(address,uint256)": {
          params: {
            _account: "The account to check.",
            _roleBits: "The bits representing the permissions to check.",
          },
          returns: {
            _0: "hasPermissions Whether the account has the given permissions.",
          },
        },
        "proxiableUUID()": {
          details:
            "Returns the storage slot used by the implementation, as specified in [ERC1822](https://eips.ethereum.org/EIPS/eip-1822). Note: The `notDelegated` modifier prevents accidental upgrades to an implementation that is a proxy contract.",
        },
        "revokeRole(address,uint256)": {
          params: {
            _account: "The account to revoke permissions from.",
            _roleBits: "The bits representing the permissions to revoke.",
          },
        },
        "royaltyInfo(uint256,uint256)": {
          details: "Meant to be called by a token contract.",
          params: {
            salePrice: "The sale price of the NFT.",
            tokenId: "The token ID of the NFT.",
          },
          returns: {
            receiver: "The royalty recipient address.",
            royaltyAmount:
              "The royalty amount to send to the recipient as part of a sale.",
          },
        },
        "setClaimCondition((uint128,uint128,uint256,uint256,uint256,bytes32,uint256,address,string),bool)":
          {
            details: "Only callable by an admin of the given token.",
            params: {
              _condition: "The claim condition to set.",
              _resetClaimEligibility:
                "Whether to reset the claim eligibility of all wallets.",
            },
          },
        "setDefaultFeeConfig((address,address,uint16))": {
          params: { _config: "The fee config for the token." },
        },
        "setFeeConfigForToken(uint256,(address,address,uint16))": {
          params: { _config: "The fee config for the token." },
        },
        "setNextIdToMint(uint256)": {
          details: "Only callable by an admin of the given token.",
          params: { _nextIdToMint: "The next token ID to mint." },
        },
        "tokenURI(uint256)": {
          details: "Meant to be called by the core token contract.",
          params: { tokenId: "The token ID of the NFT." },
          returns: { metadata: "The URI to fetch token metadata from." },
        },
        "upgradeToAndCall(address,bytes)": {
          details:
            "Upgrades the proxy's implementation to `newImplementation`. Emits a {Upgraded} event. Note: Passing in empty `data` skips the delegatecall to `newImplementation`.",
        },
        "verifyClaim(address,address,uint256,uint256,address,bytes32[])": {
          params: {
            _allowlistProof:
              "The proof of the claimer's inclusion in an allowlist, if any.",
            _claimer: "The address to mint tokens for.",
            _currency: "The currency to pay with.",
            _pricePerToken: "The price per token.",
            _quantity: "The quantity of tokens to mint.",
            _token: "The token to mint.",
          },
          returns: { isAllowlisted: "Whether the claimer is allowlisted." },
        },
        "verifyPermissionedClaim((address,uint256,address,uint256,uint256,address,bytes32[],bytes,uint128,uint128,bytes32))":
          {
            params: { _req: "The mint request to check." },
          },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "ADMIN_ROLE_BITS()": {
          notice: "The bits that represent the admin role.",
        },
        "BEFORE_APPROVE_FLAG()": {
          notice: "Bits representing the before approve hook.",
        },
        "BEFORE_BURN_FLAG()": {
          notice: "Bits representing the before burn hook.",
        },
        "BEFORE_MINT_FLAG()": {
          notice: "Bits representing the before mint hook.",
        },
        "BEFORE_TRANSFER_FLAG()": {
          notice: "Bits representing the before transfer hook.",
        },
        "NATIVE_TOKEN()": { notice: "The address considered as native token." },
        "ROYALTY_INFO_FLAG()": {
          notice: "Bits representing the royalty hook.",
        },
        "TOKEN_URI_FLAG()": { notice: "Bits representing the token URI hook." },
        "__ERC721Hook_init(address)": {
          notice:
            "Initializes the contract. Grants admin role (i.e. upgrade authority) to given `_upgradeAdmin`.",
        },
        "beforeApprove(address,address,uint256,bool)": {
          notice:
            "The beforeApprove hook that is called by a core token before approving a token.",
        },
        "beforeBurn(address,uint256,bytes)": {
          notice:
            "The beforeBurn hook that is called by a core token before burning a token.",
        },
        "beforeMint(address,uint256,bytes)": {
          notice:
            "The beforeMint hook that is called by a core token before minting a token.",
        },
        "beforeTransfer(address,address,uint256)": {
          notice:
            "The beforeTransfer hook that is called by a core token before transferring a token.",
        },
        "getBeforeBurnArgSignature()": {
          notice:
            "Returns the signature of the arguments expected by the beforeBurn hook.",
        },
        "getBeforeMintArgSignature()": {
          notice:
            "Returns the signature of the arguments expected by the beforeMint hook.",
        },
        "getClaimCondition(address)": {
          notice: "Returns the active claim condition.",
        },
        "getDefaultFeeConfig(address)": {
          notice: "Returns the fee config for a token.",
        },
        "getFeeConfigForToken(address,uint256)": {
          notice: "Returns the fee config for a token.",
        },
        "getHooks()": {
          notice:
            "Returns all hook functions implemented by this hook contract.",
        },
        "getNextTokenIdToMint(address)": {
          notice: "Returns the next token ID to mint for a given token.",
        },
        "getSupplyClaimedByWallet(address,address)": {
          notice: "Returns the claim condition for a given token.",
        },
        "grantRole(address,uint256)": {
          notice: "Grants the given permissions to an account.",
        },
        "hasRole(address,uint256)": {
          notice: "Returns whether an account has the given permissions.",
        },
        "revokeRole(address,uint256)": {
          notice: "Revokes the given permissions from an account.",
        },
        "royaltyInfo(uint256,uint256)": {
          notice: "Returns the royalty recipient and amount for a given sale.",
        },
        "setClaimCondition((uint128,uint128,uint256,uint256,uint256,bytes32,uint256,address,string),bool)":
          {
            notice: "Sets the claim condition for a given token.",
          },
        "setDefaultFeeConfig((address,address,uint16))": {
          notice: "Sets the fee config for a given token.",
        },
        "setFeeConfigForToken(uint256,(address,address,uint16))": {
          notice: "Sets the fee config for a given token.",
        },
        "setNextIdToMint(uint256)": {
          notice: "Sets the next token ID to mint for a given token.",
        },
        "tokenURI(uint256)": {
          notice: "Returns the URI to fetch token metadata from.",
        },
        "verifyClaim(address,address,uint256,uint256,address,bytes32[])": {
          notice: "Verifies that a given claim is valid.",
        },
        "verifyPermissionedClaim((address,uint256,address,uint256,uint256,address,bytes32[],bytes,uint128,uint128,bytes32))":
          {
            notice: "Verifies that a given permissioned claim is valid",
          },
      },
      version: 1,
    },
  },
  settings: {
    remappings: [
      "@manifoldxyz/creator-core-solidity/=node_modules/@manifoldxyz/creator-core-solidity/",
      "@manifoldxyz/libraries-solidity/=node_modules/@manifoldxyz/libraries-solidity/",
      "@openzeppelin/contracts-upgradeable/=node_modules/@openzeppelin/contracts-upgradeable/",
      "@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/",
      "@thirdweb-dev/dynamic-contracts/=node_modules/@thirdweb-dev/dynamic-contracts/src/",
      "@zoralabs/protocol-rewards/src/=node_modules/@zoralabs/protocol-rewards/dist/contracts/",
      "ds-test/=lib/forge-std/lib/ds-test/src/",
      "erc721a-upgradeable/=node_modules/erc721a-upgradeable/contracts/",
      "forge-std/=lib/forge-std/src/",
    ],
    optimizer: { enabled: true, runs: 200 },
    metadata: { bytecodeHash: "ipfs" },
    compilationTarget: { "src/hook/mint/MintHookERC721.sol": "MintHookERC721" },
    evmVersion: "london",
    libraries: {},
  },
  sources: {
    "src/common/EIP712.sol": {
      keccak256:
        "0x6b96b279b8d97a02f2bb94671f85f635cecef00ddedf5669541f4d336f481127",
      urls: [
        "bzz-raw://26f74e380a56b18d1cc0d92ae2141ad3baaf3fd58f0920fcc166e5ee2fc6f480",
        "dweb:/ipfs/QmPcM3SRCeizyXB7hhHmCrs73NwkPFeVPHbwNhLUzkbJ2p",
      ],
      license: "MIT",
    },
    "src/common/Initializable.sol": {
      keccak256:
        "0x373c414945f95792f99db41c67bc40dc2aa63d9e3770ef27e398aef73e9c7b3f",
      urls: [
        "bzz-raw://73c9d8c7d928269db7d988c163227d38f374d827a34e4050ca19621fb13ba3d0",
        "dweb:/ipfs/QmVJBYEgzhocAL2ozkWxTk9qun1Zh8kPLH4PStDw53w5D3",
      ],
      license: "MIT",
    },
    "src/common/Permission.sol": {
      keccak256:
        "0xec4a7104910f8acccebe5f8d87bac11b8de47e582bcf64cef89dd09042da65c0",
      urls: [
        "bzz-raw://447278b939a86b508adef2bb1d055a2db1c7141feffcaa8d685594d9184af5d2",
        "dweb:/ipfs/QmPVYzGPwZfHPSWgZVewnroJ5Wu5fQvVzEAC15YXWv98JX",
      ],
      license: "Apache-2.0",
    },
    "src/common/UUPSUpgradeable.sol": {
      keccak256:
        "0x1c91c97a418e8b342896826f7b7af5754af6a386350e79a88d2aea931fdb0b4e",
      urls: [
        "bzz-raw://c0fc0d8c3d068ef4e1162fdbfb29b2f30009f5ff7ec2f78b7483be875557c685",
        "dweb:/ipfs/QmRW3iEtqjA8sEwWw8eH5tk9YaL8Egj9xQHWHFZZ9LRcyx",
      ],
      license: "MIT",
    },
    "src/hook/ERC721Hook.sol": {
      keccak256:
        "0x6f9847ea4dff95b1649563e2933bf4dd36c89a45b8936f3360040a1b5c48c081",
      urls: [
        "bzz-raw://a27ddce6c2f1489a9bd55d993325255b25779d1b3dd9b729ff4c2381b669f344",
        "dweb:/ipfs/QmfFyWbJXP6Mn34z48dxPN6StaGmkRHPLnJ9CmGsWA7ZxY",
      ],
      license: "Apache 2.0",
    },
    "src/hook/mint/MintHookERC721.sol": {
      keccak256:
        "0xbe861387f46b834347e913ac0c3b13273588aa109830cd543eff39914761213d",
      urls: [
        "bzz-raw://d15a6fc736dbafcb5a3c631511d52986ec665ac680ac08b819aa3aaec0e1c2e3",
        "dweb:/ipfs/QmTvYPBmVbybiJTxKdVLbCrNcHGiiPYdBbBDLedFPf7U4J",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IClaimCondition.sol": {
      keccak256:
        "0xd98d4f9d45dc52cc76e12c3a319c071bb60c9c14915c90c2f989ef6dbfc8a1fa",
      urls: [
        "bzz-raw://f01cc70a8076ee6e323eacbf1046e73c7288f94a6a20114dcfeb674c1a670863",
        "dweb:/ipfs/QmRgkSpB1ToJ3wDJtyykiQQBRpd1ewj4asJCdfSu6QHoof",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IFeeConfig.sol": {
      keccak256:
        "0x340df3ffa506e0669c93eda292a30e3372d97e4881d69034ea65ce8a1f50a997",
      urls: [
        "bzz-raw://1673a278b15354e7a8b8c813c09d3618f5915d0f5d43aad1a3b54f201888e1f6",
        "dweb:/ipfs/QmeSvDbWVqJbk1a3ViUVGMPJYDmmLmZJtYL6rVBaKxK4Le",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IMintRequest.sol": {
      keccak256:
        "0xb058d33a2bddc0f19d35e11211f65a81ba7711d9b4554c5550de14a5c3c90a9b",
      urls: [
        "bzz-raw://a1ae8c8feb5b5ebe5db59921122c962c2641de256da9a06ccf40c0a6525bd356",
        "dweb:/ipfs/QmemJ85a84s5Fq9bG7zPcQ9To2eNkUnBD2VBqLgDyqYPjV",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IPermission.sol": {
      keccak256:
        "0x389e9a570881eb488c2ae61dab8c11718d6b263975f259f3798f6fde3eebf4b3",
      urls: [
        "bzz-raw://226d2f2d3aa81e78a7af6eb7b38274736f31345472289e2197f75b702d9c0f15",
        "dweb:/ipfs/QmYkCNpe9wvFKyepauGBopWKyUZXAeVkZqzQsjK28Nynm5",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IERC721Hook.sol": {
      keccak256:
        "0x979c3f2190d04188aa06382f6022b36793b311e11ff74f637f7e1ec29962bba0",
      urls: [
        "bzz-raw://d9b70fbe2b14c8502a6a3f3093f5aad057dabe1e346a041e8d14d3f920fc815b",
        "dweb:/ipfs/QmW189KsKDJU1jCpdr1h3svh8rZYNPCvGB4d9kj1vxHiaQ",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IHook.sol": {
      keccak256:
        "0xbfd99a27d2a9b48ac23931d53c51a7da8f299be51147dea32b07e3b6cf9383d9",
      urls: [
        "bzz-raw://4c5289c146ea2104eb70273f6ebd08647a125366d2dc87707df97c906b328a2d",
        "dweb:/ipfs/QmYgbccLAUJsfKhS6CXgsJi7BY16WuUY1X7LLwhSEYkhMQ",
      ],
      license: "Apache-2.0",
    },
    "src/lib/ECDSA.sol": {
      keccak256:
        "0xc42632b5fc9af6b23747531448ec4bb56acf092dda88747ccd2bae5bac6aca49",
      urls: [
        "bzz-raw://d38bdf56085f4778ad4c9e5a59cce6ed129b1750e70a2fc9b22ed1701d64eec3",
        "dweb:/ipfs/Qmcqk5vodQTHhQTEY5jvcgcwx3xs7PT3BdH9rSvfXvjTMF",
      ],
      license: "MIT",
    },
    "src/lib/MerkleProofLib.sol": {
      keccak256:
        "0xe1e7ccbb59e47d95d9610f1ac12aa2d265632ee9ff2a51d7373844f5a67933ff",
      urls: [
        "bzz-raw://d79e5989098606c00de94d5c324fb38f8a4fecdac02999579a0cb71783771eb7",
        "dweb:/ipfs/QmaXqWVdyJpXCThD9cfysNbLy5vj5Rrv35AbFxCGtYECmL",
      ],
      license: "MIT",
    },
    "src/lib/SafeTransferLib.sol": {
      keccak256:
        "0x88c7be927075302ed98aeadc26cc99f74bf4c0a5ccb462937d8a393410f9b17d",
      urls: [
        "bzz-raw://2b397d236ea5014abe54f9ac2964f250edb1236d1c62f996b4af39e4a6e1d57f",
        "dweb:/ipfs/QmRw3yG4uFDGxq8HzD5si6aXSXCiEoGiKK2hn3gx5mxCwA",
      ],
      license: "MIT",
    },
    "src/storage/common/PermissionStorage.sol": {
      keccak256:
        "0x75c22499878913ccb31356d72e89abec1648a6a059dc7b7228afae47d5391a02",
      urls: [
        "bzz-raw://e173f2eab0d69c2d4ff87174a01f5ab404025f27350c60c6df3b0f444ab82099",
        "dweb:/ipfs/QmWj9HftTyizdWy7k5JHxYoAGFBat2j77cinMpQFbCpVeW",
      ],
      license: "Apache-2.0",
    },
    "src/storage/hook/mint/MintHookERC721Storage.sol": {
      keccak256:
        "0x47411915275812379b2892d321a9de4b736bae13842376ea2a0a69b608dc4441",
      urls: [
        "bzz-raw://f8a052940605b8eeba49639798a053e495f8d4dbee21310ccbb478c45abe1217",
        "dweb:/ipfs/QmTvegDhLXYFETPkVwD1FBt3k25Ak6sAthXdtwrfQJZoZ4",
      ],
      license: "Apache-2.0",
    },
  },
  version: 1,
};

export const mintHookERC721Bytecode =
  "0x60806040526004361061020f5760003560e01c80639625ac1c11610118578063c4d66de8116100a0578063d74128ca1161006f578063d74128ca14610713578063e824bc781461072e578063ec3ff5eb14610742578063ede207d614610763578063fd9d7b2a1461077e57600080fd5b8063c4d66de814610692578063c87b56dd146106b2578063cea1489f146106df578063d2185d21146106f357600080fd5b8063aa02a534116100e7578063aa02a53414610555578063aa9e4f02146105e7578063ab78cee61461062a578063b3e295d81461064a578063b6fb08411461066a57600080fd5b80639625ac1c146105015780639b364a03146105215780639b41fb1314610535578063a89e4dec1461044f57600080fd5b80635571c8f61161019b5780635ea97fa51161016a5780635ea97fa5146104635780636a87fb0314610490578063751d4753146104a457806384b0196e146104b95780638529312d146104e157600080fd5b80635571c8f6146103df57806358f164a11461040f5780635c97f4a21461042f5780635cd2525e1461044f57600080fd5b806331f7d964116101e257806331f7d964146102b85780633c09e2fd146102f85780634b394e19146103185780634f1ef286146103b757806352d1902d146103ca57600080fd5b80630912ed77146102145780631ffb811f1461023657806326d8c4ab146102565780632a55205a14610279575b600080fd5b34801561022057600080fd5b5061023461022f366004611f0b565b610793565b005b34801561024257600080fd5b50610234610251366004611f37565b6107d9565b34801561026257600080fd5b5060405b6040519081526020015b60405180910390f35b34801561028557600080fd5b50610299610294366004611f78565b6107f2565b604080516001600160a01b039093168352602083019190915201610270565b3480156102c457600080fd5b506102e073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee81565b6040516001600160a01b039091168152602001610270565b34801561030457600080fd5b50610234610313366004611f0b565b61080e565b34801561032457600080fd5b506103aa610333366004611f9a565b6040805160608082018352600080835260208084018290529284018190526001600160a01b039485168152600080516020612da4833981519152835283812060001982528352839020835191820184528054851682526001015493841691810191909152600160a01b90920461ffff169082015290565b6040516102709190611fbe565b6102346103c5366004611ff1565b61084a565b3480156103d657600080fd5b5061026661092e565b3480156103eb57600080fd5b506103ff6103fa3660046121ff565b61098d565b6040519015158152602001610270565b34801561041b57600080fd5b5061023461042a366004612394565b610ad3565b34801561043b57600080fd5b506103ff61044a366004611f0b565b610b8b565b34801561045b57600080fd5b506002610266565b34801561046f57600080fd5b5061048361047e366004611f9a565b610bce565b6040516102709190612411565b34801561049c57600080fd5b506010610266565b3480156104b057600080fd5b50610266600281565b3480156104c557600080fd5b506104ce610d7f565b60405161027097969594939291906124b8565b3480156104ed57600080fd5b506102346104fc36600461254e565b610de1565b34801561050d57600080fd5b5061023461051c366004611f9a565b610e98565b34801561052d57600080fd5b506008610266565b34801561054157600080fd5b5061026661055036600461256a565b610eae565b34801561056157600080fd5b506103aa610570366004611f0b565b6040805160608082018352600080835260208084018290529284018190526001600160a01b039586168152600080516020612da4833981519152835283812094815293825292829020825193840183528054851684526001015493841690830152600160a01b90920461ffff169181019190915290565b3480156105f357600080fd5b50610266610602366004611f9a565b6001600160a01b03166000908152600080516020612e1b833981519152602052604090205490565b34801561063657600080fd5b506102346106453660046125a3565b610f3f565b34801561065657600080fd5b506103ff6106653660046125bc565b610f91565b61067d610678366004612642565b6112a4565b60408051928352602083019190915201610270565b34801561069e57600080fd5b506102346106ad366004611f9a565b6114f0565b3480156106be57600080fd5b506106d26106cd3660046125a3565b611568565b604051610270919061269a565b3480156106eb57600080fd5b506020610266565b3480156106ff57600080fd5b5061023461070e3660046126bb565b611583565b34801561071f57600080fd5b50610234610251366004612707565b34801561073a57600080fd5b506004610266565b34801561074e57600080fd5b506040805160208101909152600081526106d2565b34801561076f57600080fd5b50610234610251366004612642565b34801561078a57600080fd5b506106d261183f565b600261079f3382610b8b565b6107ca576040516369d3b0cd60e11b8152336004820152602481018290526044015b60405180910390fd5b6107d4838361185f565b505050565b604051632353bc9760e11b815260040160405180910390fd5b600080604051632353bc9760e11b815260040160405180910390fd5b600261081a3382610b8b565b610840576040516369d3b0cd60e11b8152336004820152602481018290526044016107c1565b6107d483836118dd565b7f000000000000000000000000000000000000000000000000000000000000000030810361088057639f03a0266000526004601cfd5b61088984611950565b8360601b60601c93506352d1902d6001527f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80602060016004601d895afa51146108db576355299b496001526004601dfd5b847fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600038a2849055811561092857604051828482376000388483885af4610926573d6000823e3d81fd5b505b50505050565b60007f000000000000000000000000000000000000000000000000000000000000000030811461096657639f03a0266000526004601cfd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc91505090565b60008161010001516001600160801b03164210806109b95750428261012001516001600160801b031611155b156109d75760405163b55d3c2760e01b815260040160405180910390fd5b61014082015160009081527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f05602052604090205460ff1615610a2c57604051631f3d5df560e31b815260040160405180910390fd5b6000610a3783611978565b8351604051632e4bfa5160e11b81526001600160a01b03808416600483015260026024830152929350911690635c97f4a290604401602060405180830381865afa158015610a89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aad919061275a565b610aca57604051633f4ba69960e01b815260040160405180910390fd5b50600192915050565b336000818152600080516020612da483398151915260209081526040808320868452825291829020845181546001600160a01b039182166001600160a01b031990911617825591850151600190910180548685015161ffff16600160a01b026001600160b01b031990911692909316919091179190911790555181907f5c25a275fb3291c581ad89e64cd0dded3f8e18cd29e3eca5cbb5b6a81aac116d90610b7e9086908690612777565b60405180910390a2505050565b6001600160a01b03821660009081527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d006020526040902054811615155b92915050565b610c3b60405180610120016040528060006001600160801b0316815260200160006001600160801b03168152602001600081526020016000815260200160008152602001600080191681526020016000815260200160006001600160a01b03168152602001606081525090565b6001600160a01b0382811660009081527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f02602090815260409182902082516101208101845281546001600160801b038082168352600160801b90910416928101929092526001810154928201929092526002820154606082015260038201546080820152600482015460a0820152600582015460c0820152600682015490921660e083015260078101805461010084019190610cf6906127b1565b80601f0160208091040260200160405190810160405280929190818152602001828054610d22906127b1565b8015610d6f5780601f10610d4457610100808354040283529160200191610d6f565b820191906000526020600020905b815481529060010190602001808311610d5257829003601f168201915b5050505050815250509050919050565b600f60f81b6060806000808083610dcf604080518082018252600e81526d4d696e74486f6f6b45524337323160901b602080830191909152825180840190935260018352603160f81b9083015291565b97989097965046955030945091925090565b336000818152600080516020612da4833981519152602090815260408083206000198452825291829020845181546001600160a01b039182166001600160a01b031990911617825591850151600190910180548685015161ffff16600160a01b026001600160b01b031990911692909316919091179190911790555181907f6af4cb0d9a43962e4c2d3837f9d0de423a9f6bc41f3a661e6c87612fc5ce23b690610e8c908590611fbe565b60405180910390a25050565b610ea0611a2e565b610eab8160026118dd565b50565b6001600160a01b0391821660009081527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f04602090815260408083205481518084019190915293909416838501528351808403850181526060909301845282519281019290922081527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f03909152205490565b336000818152600080516020612e1b8339815191526020908152604091829020849055905183815282917fdf86ead679a80309b331edd56c3940e9d8d85e78a33bd53c17eaf7b0766b38ab9101610e8c565b6001600160a01b0386811660009081527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f026020908152604080832081516101208101835281546001600160801b038082168352600160801b90910416938101939093526001810154918301919091526002810154606083015260038101546080830152600481015460a0830152600581015460c0830152600681015490931660e0820152600783018054929384939091610100840191611050906127b1565b80601f016020809104026020016040519081016040528092919081815260200182805461107c906127b1565b80156110c95780601f1061109e576101008083540402835291602001916110c9565b820191906000526020600020905b8154815290600101906020018083116110ac57829003601f168201915b50505050508152505090504281600001516001600160801b031611156111025760405163b4e1610d60e01b815260040160405180910390fd5b4281602001516001600160801b03161161112f576040516372d3738760e11b815260040160405180910390fd5b60a08101511561119e5760a08101516040516bffffffffffffffffffffffff1960608a901b16602082015261117e91859160340160405160208183030381529060405280519060200120611a4c565b91508161119e576040516397ce9e4960e01b815260040160405180910390fd5b8060e001516001600160a01b0316846001600160a01b0316146111ed5760e0810151604051631c778fed60e11b81526001600160a01b03918216600482015290851660248201526044016107c1565b8060c0015185146112215760c08101516040516319cc41a760e11b81526004810191909152602481018690526044016107c1565b851580611244575080608001516112388989610eae565b6112429088612801565b115b156112655760405163535c67f760e11b8152600481018790526024016107c1565b806040015186826060015161127a9190612801565b1115611299576040516359caaa3f60e11b815260040160405180910390fd5b509695505050505050565b6000806000838060200190518101906112bd91906128ca565b80519091506001600160a01b031633146112ea5760405163fe5246e760e01b815260040160405180910390fd5b848160600151146113115760405163535c67f760e11b8152600481018690526024016107c1565b856001600160a01b031681604001516001600160a01b031614611347576040516319c9612d60e31b815260040160405180910390fd5b60e081015151600080516020612e1b83398151915290156113925761136b8261098d565b5061014082015160009081526005820160205260409020805460ff19166001179055611476565b6113b882600001518360400151846060015185608001518660a001518760c00151610f91565b50606082015182516001600160a01b031660009081526002808401602052604082200180549091906113eb908490612801565b9091555050606082015182516001600160a01b0316600090815260048301602090815260408083205481870151915160038701949361143d9391019182526001600160a01b0316602082015260400190565b60405160208183030381529060405280519060200120815260200190815260200160002060008282546114709190612801565b90915550505b81516001600160a01b0390811660009081526020839052604080822054606086015186519094168352908220805491975091906114b4908490612801565b90915550506060820151604083015160808401519194506114e69186906114dc9087906129e3565b8560a00151611a8e565b5050935093915050565b63409feecd19805490811561151b5760018260011c14303b1061151b5763f92ee8a96000526004601cfd5b6003905561152882610e98565b6001811661156457600263409feecd195560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050565b6060604051632353bc9760e11b815260040160405180910390fd5b3360008181527f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f0460209081526040808320547f64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f0290925290912060020154600080516020612e1b8339815191529190841561163a57506040516bffffffffffffffffffffffff19606085901b166020820152603481018290526000906054016040516020818303038152906040528051906020012091505b856040013581111561165f576040516359caaa3f60e11b815260040160405180910390fd5b6040805161012081019091528061167960208901896129fa565b6001600160801b0316815260200187602001602081019061169a91906129fa565b6001600160801b0316815260200187604001358152602001828152602001876080013581526020018760a0013581526020018760c0013581526020018760e00160208101906116e99190611f9a565b6001600160a01b03168152602001611705610100890189612a17565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201829052509390945250506001600160a01b038088168252600280880160209081526040938490208651918701516001600160801b03908116600160801b0292169190911781559285015160018401556060850151908301556080840151600383015560a0840151600483015560c0840151600583015560e0840151600683018054919092166001600160a01b031990911617905561010083015190915060078201906117dd9082612ab2565b5050506001600160a01b038416600081815260048501602052604090819020849055517f057fb10a5ada491e770b970ed80f5371b4cc842285ae93b953a8e49bc702be2f9061182f9089908990612bdf565b60405180910390a2505050505050565b6060604051806080016040528060578152602001612dc460579139905090565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d00602081815260409283902080548619169081905592518381529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b91015b60405180910390a250505050565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d006020818152604092839020805486179081905592518581529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b91016118cf565b61195b336002610b8b565b610eab5760405163d562cd0360e01b815260040160405180910390fd5b6000610bc88260e00151611a287ff59480223e497f3dbd0d79cfb3396707ec6dbfda5b10b1323625d605b540662c856000015186602001518760400151886060015189608001518a60a001518b60c0015160405180602001604052806000815250805190602001208d61010001518e61012001518f6101400151604051602001611a0d9c9b9a99989796959493929190612cae565b60405160208183030381529060405280519060200120611ccd565b90611de5565b63409feecd1954600116611a4a5763d7e6bcf86000526004601cfd5b565b6000835115611a875760208401845160051b81015b8151841160051b938452815160209485185260406000209390910190808210611a615750505b5014919050565b813414158015611aba57506001600160a01b03811673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee145b15611ae1576040516319cc41a760e11b8152600481018390523460248201526044016107c1565b6001600160a01b03811673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14801590611b0e5750600034115b15611b35576040516319cc41a760e11b8152600060048201523460248201526044016107c1565b8115610928576000600080516020612e1b833981519152336000818152600180840160209081526040808420600019855280835281852082516060808201855282546001600160a01b039081168352928701548084168388015261ffff600160a01b918290048116848801528f8a5294875297859020855191820186528054841680835297015492831695810195909552959004169082015293945091929091611be75781516001600160a01b031681525b60208101516001600160a01b0316611c1b576020808301516001600160a01b03169082015260408083015161ffff16908201525b6000612710826040015161ffff1688611c3491906129e3565b611c3e9190612d6e565b905073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03871601611c93578015611c7957611c79826020015182611e76565b8151611c8e90611c89838a612d90565b611e76565b611cc2565b8015611ca957611ca9868a846020015184611e92565b8151611cc29087908b90611cbd858c612d90565b611e92565b505050505050505050565b7f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000030147f0000000000000000000000000000000000000000000000000000000000000000461416611dc05750604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81527f000000000000000000000000000000000000000000000000000000000000000060208201527f00000000000000000000000000000000000000000000000000000000000000009181019190915246606082015230608082015260a090205b67190100000000000060005280601a5281603a52604260182090506000603a52919050565b6040516001908360005260208301516040526040835103611e2157604083015160ff81901c601b016020526001600160ff1b0316606052611e47565b6041835103611e4257606083015160001a6020526040830151606052611e47565b600091505b6020600160806000855afa5191503d611e6857638baa579f6000526004601cfd5b600060605260405292915050565b60003860003884865af16115645763b12d13eb6000526004601cfd5b60405181606052826040528360601b602c526323b872dd60601b600c52602060006064601c6000895af13d156001600051141716611ed857637939f4246000526004601cfd5b600060605260405250505050565b6001600160a01b0381168114610eab57600080fd5b8035611f0681611ee6565b919050565b60008060408385031215611f1e57600080fd5b8235611f2981611ee6565b946020939093013593505050565b600080600060608486031215611f4c57600080fd5b8335611f5781611ee6565b92506020840135611f6781611ee6565b929592945050506040919091013590565b60008060408385031215611f8b57600080fd5b50508035926020909101359150565b600060208284031215611fac57600080fd5b8135611fb781611ee6565b9392505050565b81516001600160a01b0390811682526020808401519091169082015260408083015161ffff169082015260608101610bc8565b60008060006040848603121561200657600080fd5b833561201181611ee6565b925060208401356001600160401b038082111561202d57600080fd5b818601915086601f83011261204157600080fd5b81358181111561205057600080fd5b87602082850101111561206257600080fd5b6020830194508093505050509250925092565b634e487b7160e01b600052604160045260246000fd5b60405161016081016001600160401b03811182821017156120ae576120ae612075565b60405290565b604051601f8201601f191681016001600160401b03811182821017156120dc576120dc612075565b604052919050565b60006001600160401b038211156120fd576120fd612075565b5060051b60200190565b600082601f83011261211857600080fd5b8135602061212d612128836120e4565b6120b4565b82815260059290921b8401810191818101908684111561214c57600080fd5b8286015b848110156112995780358352918301918301612150565b60006001600160401b0382111561218057612180612075565b50601f01601f191660200190565b600082601f83011261219f57600080fd5b81356121ad61212882612167565b8181528460208386010111156121c257600080fd5b816020850160208301376000918101602001919091529392505050565b6001600160801b0381168114610eab57600080fd5b8035611f06816121df565b60006020828403121561221157600080fd5b81356001600160401b038082111561222857600080fd5b90830190610160828603121561223d57600080fd5b61224561208b565b61224e83611efb565b81526020830135602082015261226660408401611efb565b6040820152606083013560608201526080830135608082015261228b60a08401611efb565b60a082015260c0830135828111156122a257600080fd5b6122ae87828601612107565b60c08301525060e0830135828111156122c657600080fd5b6122d28782860161218e565b60e08301525061010091506122e88284016121f4565b8282015261012091506122fc8284016121f4565b9181019190915261014091820135918101919091529392505050565b60006060828403121561232a57600080fd5b604051606081018181106001600160401b038211171561234c5761234c612075565b604052905080823561235d81611ee6565b8152602083013561236d81611ee6565b6020820152604083013561ffff8116811461238757600080fd5b6040919091015292915050565b600080608083850312156123a757600080fd5b823591506123b88460208501612318565b90509250929050565b60005b838110156123dc5781810151838201526020016123c4565b50506000910152565b600081518084526123fd8160208601602086016123c1565b601f01601f19169290920160200192915050565b6020815261242b6020820183516001600160801b03169052565b6000602083015161244760408401826001600160801b03169052565b506040830151606083015260608301516080830152608083015160a083015260a083015160c083015260c083015160e083015260e0830151610100612496818501836001600160a01b03169052565b8401516101208481015290506124b06101408401826123e5565b949350505050565b60ff60f81b881681526000602060e0818401526124d860e084018a6123e5565b83810360408501526124ea818a6123e5565b606085018990526001600160a01b038816608086015260a0850187905284810360c0860152855180825283870192509083019060005b8181101561253c57835183529284019291840191600101612520565b50909c9b505050505050505050505050565b60006060828403121561256057600080fd5b611fb78383612318565b6000806040838503121561257d57600080fd5b823561258881611ee6565b9150602083013561259881611ee6565b809150509250929050565b6000602082840312156125b557600080fd5b5035919050565b60008060008060008060c087890312156125d557600080fd5b86356125e081611ee6565b955060208701356125f081611ee6565b94506040870135935060608701359250608087013561260e81611ee6565b915060a08701356001600160401b0381111561262957600080fd5b61263589828a01612107565b9150509295509295509295565b60008060006060848603121561265757600080fd5b833561266281611ee6565b92506020840135915060408401356001600160401b0381111561268457600080fd5b6126908682870161218e565b9150509250925092565b602081526000611fb760208301846123e5565b8015158114610eab57600080fd5b600080604083850312156126ce57600080fd5b82356001600160401b038111156126e457600080fd5b830161012081860312156126f757600080fd5b91506020830135612598816126ad565b6000806000806080858703121561271d57600080fd5b843561272881611ee6565b9350602085013561273881611ee6565b925060408501359150606085013561274f816126ad565b939692955090935050565b60006020828403121561276c57600080fd5b8151611fb7816126ad565b82815260808101611fb7602083018480516001600160a01b0390811683526020808301519091169083015260409081015161ffff16910152565b600181811c908216806127c557607f821691505b6020821081036127e557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b80820180821115610bc857610bc86127eb565b8051611f0681611ee6565b600082601f83011261283057600080fd5b81516020612840612128836120e4565b82815260059290921b8401810191818101908684111561285f57600080fd5b8286015b848110156112995780518352918301918301612863565b600082601f83011261288b57600080fd5b815161289961212882612167565b8181528460208386010111156128ae57600080fd5b6124b08260208301602087016123c1565b8051611f06816121df565b6000602082840312156128dc57600080fd5b81516001600160401b03808211156128f357600080fd5b90830190610160828603121561290857600080fd5b61291061208b565b61291983612814565b81526020830151602082015261293160408401612814565b6040820152606083015160608201526080830151608082015261295660a08401612814565b60a082015260c08301518281111561296d57600080fd5b6129798782860161281f565b60c08301525060e08301518281111561299157600080fd5b61299d8782860161287a565b60e08301525061010091506129b38284016128bf565b8282015261012091506129c78284016128bf565b9181019190915261014091820151918101919091529392505050565b8082028115828204841417610bc857610bc86127eb565b600060208284031215612a0c57600080fd5b8135611fb7816121df565b6000808335601e19843603018112612a2e57600080fd5b8301803591506001600160401b03821115612a4857600080fd5b602001915036819003821315612a5d57600080fd5b9250929050565b601f8211156107d457600081815260208120601f850160051c81016020861015612a8b5750805b601f850160051c820191505b81811015612aaa57828155600101612a97565b505050505050565b81516001600160401b03811115612acb57612acb612075565b612adf81612ad984546127b1565b84612a64565b602080601f831160018114612b145760008415612afc5750858301515b600019600386901b1c1916600185901b178555612aaa565b600085815260208120601f198616915b82811015612b4357888601518255948401946001909101908401612b24565b5085821015612b615787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6000808335601e19843603018112612b8857600080fd5b83016020810192503590506001600160401b03811115612ba757600080fd5b803603821315612a5d57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60408152612c0060408201612bf3856121f4565b6001600160801b03169052565b6000612c0e602085016121f4565b6001600160801b03811660608401525060408401356080830152606084013560a0830152608084013560c083015260a084013560e083015261010060c085013581840152612c5e60e08601611efb565b610120612c75818601836001600160a01b03169052565b612c8183880188612b71565b935091508061014086015250612c9c61016085018383612bb6565b92505050611fb7602083018415159052565b600061018082018e835260018060a01b03808f1660208501528d6040850152808d1660608501528b60808501528a60a0850152808a1660c08501525061018060e08401528088518083526101a08501915060208a01925060005b81811015612d26578351835260209384019390920191600101612d08565b505061010084018890526001600160801b0387166101208501529150612d499050565b6001600160801b039390931661014082015261016001529a9950505050505050505050565b600082612d8b57634e487b7160e01b600052601260045260246000fd5b500490565b81810381811115610bc857610bc86127eb56fe64681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f01616464726573732c75696e743235362c616464726573732c75696e743235362c75696e743235362c616464726573732c627974657333325b5d2c62797465732c75696e743132382c75696e743132382c6279746573333264681a2aca5698455776ff2e19532928238d431a12a25170dbc63b61f6706f00a2646970667358221220078875e990216f9df89742cb6125a8eed279d8e3247c270bb331e3cccdf1dfec64736f6c63430008110033";
