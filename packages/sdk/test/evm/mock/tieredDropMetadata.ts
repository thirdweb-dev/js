export const tieredDropCompilerMetadata = {
  compiler: {
    version: "0.8.12+commit.f00d7308",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
        name: "ApprovalCallerNotOwnerNorApproved",
        type: "error",
      },
      {
        inputs: [],
        name: "ApprovalQueryForNonexistentToken",
        type: "error",
      },
      {
        inputs: [],
        name: "ApprovalToCurrentOwner",
        type: "error",
      },
      {
        inputs: [],
        name: "ApproveToCaller",
        type: "error",
      },
      {
        inputs: [],
        name: "BalanceQueryForZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "MintToZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "MintZeroQuantity",
        type: "error",
      },
      {
        inputs: [],
        name: "OwnerQueryForNonexistentToken",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferCallerNotOwnerNorApproved",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferFromIncorrectOwner",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferToNonERC721ReceiverImplementer",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferToZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "URIQueryForNonexistentToken",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "prevURI",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "newURI",
            type: "string",
          },
        ],
        name: "ContractURIUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "newRoyaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newRoyaltyBps",
            type: "uint256",
          },
        ],
        name: "DefaultRoyalty",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
        ],
        name: "Initialized",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "recipient",
            type: "address",
          },
        ],
        name: "PrimarySaleRecipientUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint128",
                name: "validityStartTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "validityEndTimestamp",
                type: "uint128",
              },
              {
                internalType: "bytes32",
                name: "uid",
                type: "bytes32",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            indexed: false,
            internalType: "struct ISignatureAction.GenericRequest",
            name: "_req",
            type: "tuple",
          },
        ],
        name: "RequestExecuted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "royaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "royaltyBps",
            type: "uint256",
          },
        ],
        name: "RoyaltyForToken",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "revealedURI",
            type: "string",
          },
        ],
        name: "TokenURIRevealed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "claimer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "startTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "quantityClaimed",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string[]",
            name: "tiersInPriority",
            type: "string[]",
          },
        ],
        name: "TokensClaimed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "tier",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "startTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "endTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "baseURI",
            type: "string",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "encryptedBaseURI",
            type: "bytes",
          },
        ],
        name: "TokensLazyMinted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: "uint128",
                name: "validityStartTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "validityEndTimestamp",
                type: "uint128",
              },
              {
                internalType: "bytes32",
                name: "uid",
                type: "bytes32",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            internalType: "struct ISignatureAction.GenericRequest",
            name: "_req",
            type: "tuple",
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes",
          },
        ],
        name: "claimWithSignature",
        outputs: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "contractURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "key",
            type: "bytes",
          },
        ],
        name: "encryptDecrypt",
        outputs: [
          {
            internalType: "bytes",
            name: "result",
            type: "bytes",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "encryptedData",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getBaseURICount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_index",
            type: "uint256",
          },
        ],
        name: "getBatchIdAtIndex",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getDefaultRoyaltyInfo",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "",
            type: "uint16",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getMetadataForAllTiers",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "tier",
                type: "string",
              },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "startIdInclusive",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "endIdNonInclusive",
                    type: "uint256",
                  },
                ],
                internalType: "struct LazyMintWithTier.TokenRange[]",
                name: "ranges",
                type: "tuple[]",
              },
              {
                internalType: "string[]",
                name: "baseURIs",
                type: "string[]",
              },
            ],
            internalType: "struct LazyMintWithTier.TierMetadata[]",
            name: "metadataForAllTiers",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_batchId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_key",
            type: "bytes",
          },
        ],
        name: "getRevealURI",
        outputs: [
          {
            internalType: "string",
            name: "revealedURI",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleAdmin",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "getRoleMember",
        outputs: [
          {
            internalType: "address",
            name: "member",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleMemberCount",
        outputs: [
          {
            internalType: "uint256",
            name: "count",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "getRoyaltyInfoForToken",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "",
            type: "uint16",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "getTierForToken",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_tier",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_startIdx",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_endIdx",
            type: "uint256",
          },
        ],
        name: "getTokensInTier",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "startIdInclusive",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "endIdNonInclusive",
                type: "uint256",
              },
            ],
            internalType: "struct LazyMintWithTier.TokenRange[]",
            name: "ranges",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getTokensInTierLen",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRoleWithSwitch",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_defaultAdmin",
            type: "address",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_contractURI",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "_trustedForwarders",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "_saleRecipient",
            type: "address",
          },
          {
            internalType: "address",
            name: "_royaltyRecipient",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "_royaltyBps",
            type: "uint16",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_batchId",
            type: "uint256",
          },
        ],
        name: "isEncryptedBatch",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        name: "isTrustedForwarder",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_baseURIForTokens",
            type: "string",
          },
          {
            internalType: "string",
            name: "_tier",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "lazyMint",
        outputs: [
          {
            internalType: "uint256",
            name: "batchId",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes[]",
            name: "data",
            type: "bytes[]",
          },
        ],
        name: "multicall",
        outputs: [
          {
            internalType: "bytes[]",
            name: "results",
            type: "bytes[]",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nextTokenIdToMint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "primarySaleRecipient",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_index",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_key",
            type: "bytes",
          },
        ],
        name: "reveal",
        outputs: [
          {
            internalType: "string",
            name: "revealedURI",
            type: "string",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salePrice",
            type: "uint256",
          },
        ],
        name: "royaltyInfo",
        outputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "royaltyAmount",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_uri",
            type: "string",
          },
        ],
        name: "setContractURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_royaltyRecipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_royaltyBps",
            type: "uint256",
          },
        ],
        name: "setDefaultRoyaltyInfo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_saleRecipient",
            type: "address",
          },
        ],
        name: "setPrimarySaleRecipient",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_bps",
            type: "uint256",
          },
        ],
        name: "setRoyaltyInfoForToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalMinted",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_tier",
            type: "string",
          },
        ],
        name: "totalMintedInTier",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: "uint128",
                name: "validityStartTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "validityEndTimestamp",
                type: "uint128",
              },
              {
                internalType: "bytes32",
                name: "uid",
                type: "bytes32",
              },
              {
                internalType: "bytes",
                name: "data",
                type: "bytes",
              },
            ],
            internalType: "struct ISignatureAction.GenericRequest",
            name: "_req",
            type: "tuple",
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes",
          },
        ],
        name: "verify",
        outputs: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "approve(address,uint256)": {
          details: "See {IERC721-approve}.",
        },
        "balanceOf(address)": {
          details: "See {IERC721-balanceOf}.",
        },
        "burn(uint256)": {
          details: "Burns `tokenId`. See {ERC721-_burn}.",
        },
        "claimWithSignature((uint128,uint128,bytes32,bytes),bytes)": {
          details: "Claim lazy minted tokens via signature.",
        },
        "encryptDecrypt(bytes,bytes)": {
          details:
            "Encrypt/decrypt given `data` with `key`. Uses inline assembly.                  See: https://ethereum.stackexchange.com/questions/69825/decrypt-message-on-chain",
          params: {
            data: "Bytes of data to encrypt/decrypt.",
            key: "Secure key used by caller for encryption/decryption.",
          },
          returns: {
            result: " Output after encryption/decryption of given data.",
          },
        },
        "getApproved(uint256)": {
          details: "See {IERC721-getApproved}.",
        },
        "getBaseURICount()": {
          details:
            "Each batch of tokens has an in ID and an associated `baseURI`.                  See {batchIds}.",
        },
        "getBatchIdAtIndex(uint256)": {
          details: "See {getBaseURICount}.",
          params: {
            _index: "ID of a token.",
          },
        },
        "getRevealURI(uint256,bytes)": {
          details:
            "Reveal encrypted base URI for `_batchId` with caller/admin's `_key` used for encryption.                      Reverts if there's no encrypted URI for `_batchId`.                      See {encryptDecrypt}.",
          params: {
            _batchId: "ID of the batch for which URI is being revealed.",
            _key: "Secure key used by caller/admin for encryption of baseURI.",
          },
          returns: {
            revealedURI: "Decrypted base URI.",
          },
        },
        "getRoleAdmin(bytes32)": {
          details:
            "See {grantRole} and {revokeRole}.                  To change a role's admin, use {_setRoleAdmin}.",
          params: {
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "getRoleMember(bytes32,uint256)": {
          details:
            "Returns `member` who has `role`, at `index` of role-members list.                  See struct {RoleMembers}, and mapping {roleMembers}",
          params: {
            index: "Index in list of current members for the role.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
          returns: {
            member: " Address of account that has `role`",
          },
        },
        "getRoleMemberCount(bytes32)": {
          details:
            "Returns `count` of accounts that have `role`.                  See struct {RoleMembers}, and mapping {roleMembers}",
          params: {
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
          returns: {
            count: "  Total number of accounts that have `role`",
          },
        },
        "getRoyaltyInfoForToken(uint256)": {
          details: "Returns royalty recipient and bps for `_tokenId`.",
          params: {
            _tokenId: "The tokenID of the NFT for which to query royalty info.",
          },
        },
        "getTierForToken(uint256)": {
          details: "Returns the tier that the given token is associated with.",
        },
        "getTokensInTier(string,uint256,uint256)": {
          details: "Returns all tokenIds that belong to the given tier.",
        },
        "getTokensInTierLen()": {
          details:
            "Returns the max `endIndex` that can be used with getTokensInTier.",
        },
        "grantRole(bytes32,address)": {
          details:
            "Caller must have admin role for the `role`.                  Emits {RoleGranted Event}.",
          params: {
            account:
              "Address of the account to which the role is being granted.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "hasRole(bytes32,address)": {
          details: "Returns `true` if `account` has been granted `role`.",
          params: {
            account:
              "Address of the account for which the role is being checked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "hasRoleWithSwitch(bytes32,address)": {
          details:
            "Returns `true` if `account` has been granted `role`.                  Role restrictions can be swtiched on and off:                      - If address(0) has ROLE, then the ROLE restrictions                        don't apply.                      - If address(0) does not have ROLE, then the ROLE                        restrictions will apply.",
          params: {
            account:
              "Address of the account for which the role is being checked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "initialize(address,string,string,string,address[],address,address,uint16)":
          {
            details: "Initiliazes the contract, like a constructor.",
          },
        "isApprovedForAll(address,address)": {
          details: "See {IERC721-isApprovedForAll}.",
        },
        "isEncryptedBatch(uint256)": {
          details: "Returns `true` if `_batchId`'s base URI is encrypted.",
          params: {
            _batchId: "ID of a batch of NFTs.",
          },
        },
        "lazyMint(uint256,string,string,bytes)": {
          params: {
            _amount: "The number of NFTs to lazy mint.",
            _baseURIForTokens:
              "The base URI for the 'n' number of NFTs being lazy minted, where the metadata for each                           of those NFTs is `${baseURIForTokens}/${tokenId}`.",
            _data:
              "Additional bytes data to be used at the discretion of the consumer of the contract.",
          },
          returns: {
            batchId:
              "         A unique integer identifier for the batch of NFTs lazy minted together.",
          },
        },
        "multicall(bytes[])": {
          details:
            "Receives and executes a batch of function calls on this contract.",
        },
        "name()": {
          details: "See {IERC721Metadata-name}.",
        },
        "nextTokenIdToMint()": {
          details:
            "The tokenId of the next NFT that will be minted / lazy minted.",
        },
        "ownerOf(uint256)": {
          details: "See {IERC721-ownerOf}.",
        },
        "primarySaleRecipient()": {
          details: "Returns primary sale recipient address.",
        },
        "renounceRole(bytes32,address)": {
          details:
            "Caller must have the `role`, with caller being the same as `account`.                  Emits {RoleRevoked Event}.",
          params: {
            account:
              "Address of the account from which the role is being revoked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "reveal(uint256,bytes)": {
          details:
            "Lets an account with `MINTER_ROLE` reveal the URI for a batch of 'delayed-reveal' NFTs.",
        },
        "revokeRole(bytes32,address)": {
          details:
            "Caller must have admin role for the `role`.                  Emits {RoleRevoked Event}.",
          params: {
            account:
              "Address of the account from which the role is being revoked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "royaltyInfo(uint256,uint256)": {
          details:
            "Returns royalty amount and recipient for `tokenId` and `salePrice`.",
          params: {
            salePrice: "Sale price of the token.",
            tokenId: "The tokenID of the NFT for which to query royalty info.",
          },
          returns: {
            receiver: "       Address of royalty recipient account.",
            royaltyAmount:
              "  Royalty amount calculated at current royaltyBps value.",
          },
        },
        "safeTransferFrom(address,address,uint256)": {
          details: "See {IERC721-safeTransferFrom}.",
        },
        "safeTransferFrom(address,address,uint256,bytes)": {
          details: "See {IERC721-safeTransferFrom}.",
        },
        "setApprovalForAll(address,bool)": {
          details: "See {IERC721-setApprovalForAll}.",
        },
        "setContractURI(string)": {
          details:
            "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
          params: {
            _uri: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "setDefaultRoyaltyInfo(address,uint256)": {
          details:
            "Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {DefaultRoyalty Event}; See {_setupDefaultRoyaltyInfo}.",
          params: {
            _royaltyBps: "Updated royalty bps.",
            _royaltyRecipient:
              "Address to be set as default royalty recipient.",
          },
        },
        "setOwner(address)": {
          params: {
            _newOwner: "The address to set as the new owner of the contract.",
          },
        },
        "setPrimarySaleRecipient(address)": {
          details:
            "Caller should be authorized to set primary sales info.                  See {_canSetPrimarySaleRecipient}.                  Emits {PrimarySaleRecipientUpdated Event}; See {_setupPrimarySaleRecipient}.",
          params: {
            _saleRecipient:
              "Address to be set as new recipient of primary sales.",
          },
        },
        "setRoyaltyInfoForToken(uint256,address,uint256)": {
          details:
            "Sets royalty info for `_tokenId`. Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {RoyaltyForToken Event}; See {_setupRoyaltyInfoForToken}.",
          params: {
            _bps: "Updated royalty bps for the token Id.",
            _recipient:
              "Address to be set as royalty recipient for given token Id.",
          },
        },
        "supportsInterface(bytes4)": {
          details: "See ERC 165",
        },
        "symbol()": {
          details: "See {IERC721Metadata-symbol}.",
        },
        "tokenURI(uint256)": {
          details: "Returns the URI for a given tokenId.",
        },
        "totalMinted()": {
          details: "Returns the total amount of tokens minted in the contract.",
        },
        "totalMintedInTier(string)": {
          details:
            "Returns the total number of tokens minted from the given tier.",
        },
        "totalSupply()": {
          details:
            "Burned tokens are calculated here, use _totalMinted() if you want to count just minted tokens.",
        },
        "transferFrom(address,address,uint256)": {
          details: "See {IERC721-transferFrom}.",
        },
        "verify((uint128,uint128,bytes32,bytes),bytes)": {
          details:
            "Verifies that a request is signed by an authorized account.",
        },
      },
      stateVariables: {
        lengthEndIdsAtMint: {
          details:
            "Conceptually, tokens are minted on this contract one-batch-of-a-tier at a time. Each batch is comprised of       a given range of tokenIds [startId, endId).       This array stores each such endId, in chronological order of minting.",
        },
        minterRole: {
          details:
            "Only MINTER_ROLE holders can sign off on `MintRequest`s and lazy mint tokens.",
        },
        nextMetadataIdToMapFromTier: {
          details:
            "Mapping from tier -> the metadata ID up till which metadata IDs have been mapped to minted NFTs' tokenIds.",
        },
        proxyTokenRange: {
          details:
            "This contract lets an admin lazy mint batches of metadata at once, for a given tier. E.g. an admin may lazy mint       the metadata of 5000 tokens that will actually be minted in the future.       Lazy minting of NFT metafata happens from a start metadata ID (inclusive) to an end metadata ID (non-inclusive),       where the lazy minted metadata lives at `providedBaseURI/${metadataId}` for each unit metadata.       At the time of actual minting, the minter specifies the tier of NFTs they're minting. So, the order in which lazy minted       metadata for a tier is assigned integer IDs may differ from the actual tokenIds minted for a tier.       This is a mapping from an actually minted end tokenId -> the range of lazy minted metadata that now belongs       to NFTs of [start tokenId, end tokenid).",
        },
        tierAtEndId: {
          details:
            "Conceptually, tokens are minted on this contract one-batch-of-a-tier at a time. Each batch is comprised of       a given range of tokenIds [startId, endId).       This is a mapping from such an `endId` -> the tier that tokenIds [startId, endId) belong to.       Together with `endIdsAtMint`, this mapping is used to return the tokenIds that belong to a given tier.",
        },
        tokenIdOffset: {
          details: "Mapping from batchId => tokenId offset for that batchId.",
        },
        totalRemainingInTier: {
          details:
            "Mapping from tier -> how many units of lazy minted metadata have not yet been mapped to minted NFTs' tokenIds.",
        },
        totalsForTier: {
          details: 'Mapping from hash(tier, "minted") -> total minted in tier.',
        },
        transferRole: {
          details:
            "Only transfers to or from TRANSFER_ROLE holders are valid, when transfers are restricted.",
        },
      },
      version: 1,
    },
    userdoc: {
      errors: {
        "ApprovalCallerNotOwnerNorApproved()": [
          {
            notice: "The caller must own the token or be an approved operator.",
          },
        ],
        "ApprovalQueryForNonexistentToken()": [
          {
            notice: "The token does not exist.",
          },
        ],
        "ApprovalToCurrentOwner()": [
          {
            notice: "The caller cannot approve to the current owner.",
          },
        ],
        "ApproveToCaller()": [
          {
            notice: "The caller cannot approve to their own address.",
          },
        ],
        "BalanceQueryForZeroAddress()": [
          {
            notice: "Cannot query the balance for the zero address.",
          },
        ],
        "MintToZeroAddress()": [
          {
            notice: "Cannot mint to the zero address.",
          },
        ],
        "MintZeroQuantity()": [
          {
            notice: "The quantity of tokens minted must be more than zero.",
          },
        ],
        "OwnerQueryForNonexistentToken()": [
          {
            notice: "The token does not exist.",
          },
        ],
        "TransferCallerNotOwnerNorApproved()": [
          {
            notice: "The caller must own the token or be an approved operator.",
          },
        ],
        "TransferFromIncorrectOwner()": [
          {
            notice: "The token must be owned by `from`.",
          },
        ],
        "TransferToNonERC721ReceiverImplementer()": [
          {
            notice:
              "Cannot safely transfer to a contract that does not implement the ERC721Receiver interface.",
          },
        ],
        "TransferToZeroAddress()": [
          {
            notice: "Cannot transfer to the zero address.",
          },
        ],
        "URIQueryForNonexistentToken()": [
          {
            notice: "The token does not exist.",
          },
        ],
      },
      events: {
        "RequestExecuted(address,address,(uint128,uint128,bytes32,bytes))": {
          notice: "Emitted when a payload is verified and executed.",
        },
        "TokensClaimed(address,address,uint256,uint256,string[])": {
          notice: "Emitted when tokens are claimed via `claimWithSignature`.",
        },
      },
      kind: "user",
      methods: {
        "contractURI()": {
          notice: "Returns the contract metadata URI.",
        },
        "encryptDecrypt(bytes,bytes)": {
          notice: "Encrypt/decrypt data on chain.",
        },
        "getBaseURICount()": {
          notice: "Returns the count of batches of NFTs.",
        },
        "getBatchIdAtIndex(uint256)": {
          notice:
            "Returns the ID for the batch of tokens the given tokenId belongs to.",
        },
        "getDefaultRoyaltyInfo()": {
          notice:
            "Returns the defualt royalty recipient and BPS for this contract's NFTs.",
        },
        "getMetadataForAllTiers()": {
          notice: "Returns all metadata for all tiers created on the contract.",
        },
        "getRevealURI(uint256,bytes)": {
          notice: "Returns revealed URI for a batch of NFTs.",
        },
        "getRoleAdmin(bytes32)": {
          notice: "Returns the admin role that controls the specified role.",
        },
        "getRoleMember(bytes32,uint256)": {
          notice:
            "Returns the role-member from a list of members for a role,                  at a given index.",
        },
        "getRoleMemberCount(bytes32)": {
          notice: "Returns total number of accounts that have a role.",
        },
        "getRoyaltyInfoForToken(uint256)": {
          notice: "View royalty info for a given token.",
        },
        "grantRole(bytes32,address)": {
          notice: "Grants a role to an account, if not previously granted.",
        },
        "hasRole(bytes32,address)": {
          notice: "Checks whether an account has a particular role.",
        },
        "hasRoleWithSwitch(bytes32,address)": {
          notice:
            "Checks whether an account has a particular role;                  role restrictions can be swtiched on and off.",
        },
        "isEncryptedBatch(uint256)": {
          notice:
            "Returns whether the relvant batch of NFTs is subject to a delayed reveal.",
        },
        "lazyMint(uint256,string,string,bytes)": {
          notice:
            "Lets an authorized address lazy mint a given amount of NFTs.",
        },
        "owner()": {
          notice: "Returns the owner of the contract.",
        },
        "renounceRole(bytes32,address)": {
          notice: "Revokes role from the account.",
        },
        "revokeRole(bytes32,address)": {
          notice: "Revokes role from an account.",
        },
        "royaltyInfo(uint256,uint256)": {
          notice: "View royalty info for a given token and sale price.",
        },
        "setContractURI(string)": {
          notice:
            "Lets a contract admin set the URI for contract-level metadata.",
        },
        "setDefaultRoyaltyInfo(address,uint256)": {
          notice: "Updates default royalty recipient and bps.",
        },
        "setOwner(address)": {
          notice: "Lets an authorized wallet set a new owner for the contract.",
        },
        "setPrimarySaleRecipient(address)": {
          notice: "Updates primary sale recipient.",
        },
        "setRoyaltyInfoForToken(uint256,address,uint256)": {
          notice:
            "Updates default royalty recipient and bps for a particular token.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/tiered-drop/TieredDrop.sol": "TieredDrop",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 490,
    },
    remappings: [
      ":@chainlink/contracts/src/=node_modules/@chainlink/contracts/src/",
      ":@ds-test/=lib/ds-test/src/",
      ":@openzeppelin/=node_modules/@openzeppelin/",
      ":@std/=lib/forge-std/src/",
      ":contracts/=contracts/",
      ":ds-test/=lib/ds-test/src/",
      ":erc721a-upgradeable/=node_modules/erc721a-upgradeable/",
      ":erc721a/=node_modules/erc721a/",
      ":forge-std/=lib/forge-std/src/",
    ],
  },
  sources: {
    "contracts/eip/interface/IERC165.sol": {
      keccak256:
        "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
      license: "MIT",
      urls: [
        "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
        "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
      ],
    },
    "contracts/eip/interface/IERC20.sol": {
      keccak256:
        "0x5bdd9dd97ba7d9d7c9a2953db287e4d9d7fa93a27a96bc2e72a8da4919b6f7ff",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://45527c265ee5de6bbb3ecfc052e7b1175531a82c2ac16172020aee855f7dd592",
        "dweb:/ipfs/QmVZthqbG916qUQSwv1LE8bB58ZGQ1VfQbLbbRV5urfEYA",
      ],
    },
    "contracts/eip/interface/IERC2981.sol": {
      keccak256:
        "0x7886c17b1bc3df885201378fd070d2f00d05fa54f20f7daf10382ec6ff4bd0c9",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://a0802623ba9555f6d186bab5fd139203b643e88ea31d78f4f05cddd4008ac6cf",
        "dweb:/ipfs/QmYbqzSKkKmF2xYeH1zGNewBDNAhukuaZEUVAvYgnKt1He",
      ],
    },
    "contracts/extension/BatchMintMetadata.sol": {
      keccak256:
        "0x1e16c550fa6bdb7b1474e9cf5da55092efd37fab86a264c6316fda3d5eddc446",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://43563dd359dc00458a5ad864c4f534334bfd8a8316dc28ca02781f397f1652df",
        "dweb:/ipfs/Qme4QPEjp69SZjqk3CExhqnqc9TgjTYUduTkucUMPgLoWY",
      ],
    },
    "contracts/extension/ContractMetadata.sol": {
      keccak256:
        "0x86393a27319a054a1cabc9b7b4e97ff0aa33caaa2eb79173858d905e591ad5bc",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://66bd1acd03438412fc1f57c6e86eda9dfcbda354b120c0fe115d0f9e6f26c57a",
        "dweb:/ipfs/QmaykDmYfP1ZtbwpgNRvz4Hqf7KJTQijZXn6ucaYT9xxWQ",
      ],
    },
    "contracts/extension/DelayedReveal.sol": {
      keccak256:
        "0x4b7dd24c2c76dd896d32c22208a7874e2dff0c4b78049c7f1edb4a3a56defc3b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://400dcce2c3c10fec37d75efc2af4c29af186768ab3a3a56884c1a41a1b3392d1",
        "dweb:/ipfs/QmaD7r1JuopWVMz9fPQvAdQfP8jo2WAoU48wMzHpnTJ9nL",
      ],
    },
    "contracts/extension/LazyMintWithTier.sol": {
      keccak256:
        "0xd7cf102e095dd6a38c0cac66df45df35fa54ec83cba1cbc15a661550aa097246",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://c5a067790d46fec6ee4a66e7a65262aa8993a025621b04da91b4d96aa1ab3aca",
        "dweb:/ipfs/QmXcQ9EmQMd3391cqgGFUkz6ix2pP9W8TYxK7gkTj4qsMy",
      ],
    },
    "contracts/extension/Ownable.sol": {
      keccak256:
        "0xc1e91e941998b16e12fe77c28daed6b271de680997bf3a5cf21726934d752adf",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f5e122e7899b77bd7b27b8aa1ce1013160406d1ea493211223cfde7ccfa27d84",
        "dweb:/ipfs/QmbJsbJv3B3bHggGZCfbUB6RubU6sRRUUEhAh2uGU7bt6G",
      ],
    },
    "contracts/extension/Permissions.sol": {
      keccak256:
        "0x82ec79a933c75e39781a1bef5114db63cb5e89a039369c4d92cdd25a00f9b0f1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://fe6ea3a90ac6d5521e85e151bbc7f3e348574ecfca247d1388afc24faa6b4300",
        "dweb:/ipfs/QmVzDwuxCN6y9RJSFoDiuwraHAfj5PZcjN6VGgCVR5otsL",
      ],
    },
    "contracts/extension/PermissionsEnumerable.sol": {
      keccak256:
        "0xfc0a10adf94b475062851dfeeb59e47470e197306d205cd259ab2f28d7a707da",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8b8494a99eae3a3f467f62b303437bd714769a3a712f5a3fd89f70459b9d8ed0",
        "dweb:/ipfs/QmZhXfX7zj8EMEZnuNGS1QWJYwLKTse1PLLsyreuHjkFox",
      ],
    },
    "contracts/extension/PlatformFee.sol": {
      keccak256:
        "0xc51fc886e890dc4a7e3375079dc4fbde5718f6e2d7ff84c3331e7af05da8df04",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://d55fdeaf106e167b0348e4b8353586ebf9781e0676a6bf3a665d218884241374",
        "dweb:/ipfs/QmULQyz41MLT9KjUbqNt8uZrfYUG1bx7QGcSK4wHsAoCNq",
      ],
    },
    "contracts/extension/PrimarySale.sol": {
      keccak256:
        "0x3cae7d75358937abb61a9cb9c4d2fa0267bfa1d48a75bbfd66b973d9f13dfd84",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8aa190f15184aed165f58248b6fac06bffe00dba53ab596482ce674d24a8b790",
        "dweb:/ipfs/QmW56GogjfkrSyN4XLZAeBbtZEeiZdnJTEeZNTxhGW4tqt",
      ],
    },
    "contracts/extension/Royalty.sol": {
      keccak256:
        "0x90df448d415dbf44a0d2ca78159a2925f0e9e82729610daa2b1c29fdebeff63d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8b0a0cff3ad0551857e94d284b71bca92f2e3b1914124be4ceb7b397ac47ab93",
        "dweb:/ipfs/Qme5d8M3oLMYnsmQZjwWqFPbks39M9jUE2iXbmkWDq1CUQ",
      ],
    },
    "contracts/extension/SignatureActionUpgradeable.sol": {
      keccak256:
        "0x19f47707ecdac4f7125b1651777a96e95d9b33280a0062a4af3ddadba1ec387b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://3c48ba60ef27b1d0f1d47d496535a652be0b2193f6762d505b5b24863fc220ca",
        "dweb:/ipfs/Qmcb1kt6s8aErfqwcgq7raQqFzUvEFABGo5su8FxZ47iqr",
      ],
    },
    "contracts/extension/interface/IContractMetadata.sol": {
      keccak256:
        "0x72afb65f99429230a9d6ca7734853cf8c53264d0d013f1bff3a5625396ee1ff1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8de0d8da22da658225705129bde46f3d18dc511dd300906ca457f04806f200b0",
        "dweb:/ipfs/QmWbTpgvQz3mE4RiBBcHhKJENroMD1ACMeKDECcyuanCvC",
      ],
    },
    "contracts/extension/interface/IDelayedReveal.sol": {
      keccak256:
        "0x6fed5a60cec4a0a13edb51e91288880349af4d5f828f15e14a2e3ebcd4db11f4",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6822e62dd573165c9cba6fcec99f2372062261bdfcf4e9fbf984738c433a4b7d",
        "dweb:/ipfs/QmRHBCTYALXq3Y8tWN3jiwxbJ4mMBNJaT6wC129Z9spkKv",
      ],
    },
    "contracts/extension/interface/ILazyMintWithTier.sol": {
      keccak256:
        "0x3f1ff39f45971c624fd9555dd2975892125b6a39eb15e12546d480b5f4d81e53",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://52c1d7bdced42a37026f1caf508c800147408cd55dfd98eeb8a797dd3f1f2b0e",
        "dweb:/ipfs/QmZ5G9MKd94PN5eQNZbiZkDcNJ4fMJD4hGC3u3xQYzcAbd",
      ],
    },
    "contracts/extension/interface/IOwnable.sol": {
      keccak256:
        "0xa1195f8a222f99add4d594e6a1fa4c3ac36b9ef65378dbe1151eec24fa4d2ec0",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://20e7e62207e61848cbeed4439bd6366b72b3f5dad420fe65f777f3618e718294",
        "dweb:/ipfs/QmPRzBPce3FmPCmMDSzCPzNvViAYo9rD182Mkuequt2L5a",
      ],
    },
    "contracts/extension/interface/IPermissions.sol": {
      keccak256:
        "0x2bdf64f091a4e7faf5fbbfa1a19add276549c767b72b7f6544b6708e61cc3976",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4b089593b72bb9c8e8c4f16f9a74bf605bdfcb31826173f6412c711b218ed3da",
        "dweb:/ipfs/QmSQJ5eqKEnupvztW6f9PyVSVaMGSHyjoGU9BGeQxH2TCZ",
      ],
    },
    "contracts/extension/interface/IPermissionsEnumerable.sol": {
      keccak256:
        "0x70f339097515e11de0bec6d5772d3739b9edea336ebb4518da655c5865c676c2",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://2370289a62ae04254cb0b70c99834fffd4878616130a1d985dc83d72e43ec8bb",
        "dweb:/ipfs/QmTNVvHGyoigVhjDSzdkVMHeNcz6bsm6CsLTebLJBPmbYt",
      ],
    },
    "contracts/extension/interface/IPlatformFee.sol": {
      keccak256:
        "0x1261f4920295794ab5606346072cb9ca8d253bd5487abbf90d2e05ea336d73e0",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e71883b3ee969814964b67bd29c5f3b3ebc41b42f8034f8b95a042fe1f1c10ab",
        "dweb:/ipfs/Qmbc9rHV7hfifE1eUT1idHJGvBtswLaspGYgpVP3ucK4Vt",
      ],
    },
    "contracts/extension/interface/IPrimarySale.sol": {
      keccak256:
        "0xb21df96aaf94c030eef15885cfb36a4730e65e8501a842ae1e5b6f665032ed41",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://641693345d76948ad4344507c48446929346a4dec735a4c1d9cb634e5da25a80",
        "dweb:/ipfs/QmPBmNZwNNjnx1nce5Crb8d9WyDFkpBYXFLbB7cYRQG6HX",
      ],
    },
    "contracts/extension/interface/IRoyalty.sol": {
      keccak256:
        "0x82cd77453b9200c541910ac0f72be940dfa96552029550f304ccbf149d950020",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6fc450122af8f6669e2949c3cbfca1a56f5405520c7652dd7f236f172f2a5241",
        "dweb:/ipfs/QmUQaHNahCR9VPF6iwqJ4kFkW9JsHdzWGvBHhpUrqy3Urn",
      ],
    },
    "contracts/extension/interface/ISignatureAction.sol": {
      keccak256:
        "0xcc214513226dafb81d0f1769e71ff5186b7f271a969e46caf2257d9a377ec967",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f4f8e7533bbdb47a67d995fb9aa5e2e61246f6c2e8c81fa8511b6d6ccf175f58",
        "dweb:/ipfs/QmSBgBv2aiMi6Vd9FnV7Efq2MzrNm7n7n7UmaSUS9uimbS",
      ],
    },
    "contracts/interfaces/IWETH.sol": {
      keccak256:
        "0x5c1df76e8c1d9b5c069e4c0e35c3ad3316530c382fe3ddc6c21584f5e56f0a7b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1ff3429e0845d3266dd65ce097e194008511940a6f9fe651578b19737d37f2b1",
        "dweb:/ipfs/QmdnrZ7hr7BezqyhrmKTzTovbTjQYT5EcDYfvRYxxYFVeU",
      ],
    },
    "contracts/lib/CurrencyTransferLib.sol": {
      keccak256:
        "0xb1c357d40b259e214c1822c078c7ccf056301f8d611346b9f84021ae680813f5",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://d0b3718e3edc58472ac523447b95a4b5a15f8512acba2d6d052933385aba6de7",
        "dweb:/ipfs/QmSSmwSByKBSz9aVum117peyt2eh5Zdnx7N3NoE2qCEL9p",
      ],
    },
    "contracts/lib/TWAddress.sol": {
      keccak256:
        "0x4546bc7fd7332d33610063ea1c7e8cde8528ac31fa6f49e25d92777d937def4f",
      license: "MIT",
      urls: [
        "bzz-raw://848840b707dbf66a1e8a383652eee426aff9814f06ef01e82800ed9799b2278a",
        "dweb:/ipfs/QmTeYtUEEsZvCpeqfEpkWqP2Kqb7QWS1tSfzRgeSUeFbAx",
      ],
    },
    "contracts/lib/TWStrings.sol": {
      keccak256:
        "0x7cc7fcf5ab662a5d0b179371ca056e67f4a998c49379ff2cbd7bd91609ebb401",
      license: "MIT",
      urls: [
        "bzz-raw://a679fcdf635a741c27d4e52b1f865bcdc44e54866a89db08239d72dfa48fe7f6",
        "dweb:/ipfs/QmaKKiFma4EpnDt7UmAYRuRmb2cxLBMJ7ik1zsuJHkzmVU",
      ],
    },
    "contracts/openzeppelin-presets/metatx/ERC2771ContextUpgradeable.sol": {
      keccak256:
        "0xdbc96b1264d2e2bd82cb7e697056929325e09d1641321145a8cec53b22b9567d",
      license: "MIT",
      urls: [
        "bzz-raw://7ca7ccf947d21d98878ec18e941b750cd2ae7c563e6d2a707da4f806038d67c8",
        "dweb:/ipfs/QmYVLYUPMD3b95vKrS5yjxcz2MDNNzkWJY9xc9bc9oTZdh",
      ],
    },
    "contracts/openzeppelin-presets/token/ERC20/utils/SafeERC20.sol": {
      keccak256:
        "0x293d8d7a3502950df5b9d6d36fcad85ca758f06dd946cdc8645cac1aa56686c4",
      license: "MIT",
      urls: [
        "bzz-raw://3cd805dbdcf6b7cebcd47201badbd7f7464e49eec51c4e0627b899ece1b04790",
        "dweb:/ipfs/QmRP3JYK4wzDaRrk9so6m433TuqHW9axAXLLnQAjCp2Gs4",
      ],
    },
    "contracts/tiered-drop/TieredDrop.sol": {
      keccak256:
        "0x3d03d5644da8b623a50d73f9752edd7ceac025b056c1ef9c75e7222ed9a0f551",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b9e461d6d01ded35bae30ed8cb47084ec8103053acb9f5a9404d6b6a12fdc5cc",
        "dweb:/ipfs/QmSf1TGVbGh9keBvXLJB1iCcsW8bMyc4iHGTyMScDw2JnF",
      ],
    },
    "node_modules/@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol":
      {
        keccak256:
          "0xa8ff557539dcfed5706eddde2aa929e06bb1764e71aa8c1048a78970bf3ca37d",
        license: "MIT",
        urls: [
          "bzz-raw://6be9c619be5e1c7ecf1c3d13adc5fa81ae602ca3866b739b2f43443a77f5606c",
          "dweb:/ipfs/QmTSxboNCPMfhuvaCfZhEusxZ4BNxwzZoWFys8kzD29EcA",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol":
      {
        keccak256:
          "0x0203dcadc5737d9ef2c211d6fa15d18ebc3b30dfa51903b64870b01a062b0b4e",
        license: "MIT",
        urls: [
          "bzz-raw://6eb2fd1e9894dbe778f4b8131adecebe570689e63cf892f4e21257bfe1252497",
          "dweb:/ipfs/QmXgUGNfZvrn6N2miv3nooSs7Jm34A41qz94fu2GtDFcx8",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol":
      {
        keccak256:
          "0xbb2ed8106d94aeae6858e2551a1e7174df73994b77b13ebd120ccaaef80155f5",
        license: "MIT",
        urls: [
          "bzz-raw://8bc3c6a456dba727d8dd9fd33420febede490abb49a07469f61d2a3ace66a95a",
          "dweb:/ipfs/QmVAWtEVj7K5AbvgJa9Dz22KiDq9eoptCjnVZqsTMtKXyd",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol":
      {
        keccak256:
          "0x016298e66a5810253c6c905e61966bb31c8775c3f3517bf946ff56ee31d6c005",
        license: "MIT",
        urls: [
          "bzz-raw://1723de5ae414f210db039b19e6487c19c2d643483c9be7c445cf481a80c199d2",
          "dweb:/ipfs/QmcBLbmPdZsNngYhA1KDadNUqQZoGACytFWuUH74RC4AXC",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol":
      {
        keccak256:
          "0x95a471796eb5f030fdc438660bebec121ad5d063763e64d92376ffb4b5ce8b70",
        license: "MIT",
        urls: [
          "bzz-raw://4ffbd627e6958983d288801acdedbf3491ee0ebf1a430338bce47c96481ce9e3",
          "dweb:/ipfs/QmUM1vpmNgBV34sYf946SthDJNGhwwqjoRggmj4TUUQmdB",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol":
      {
        keccak256:
          "0x611aa3f23e59cfdd1863c536776407b3e33d695152a266fa7cfb34440a29a8a3",
        license: "MIT",
        urls: [
          "bzz-raw://9b4b2110b7f2b3eb32951bc08046fa90feccffa594e1176cb91cdfb0e94726b4",
          "dweb:/ipfs/QmSxLwYjicf9zWFuieRc8WQwE4FisA1Um5jp1iSa731TGt",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol":
      {
        keccak256:
          "0x963ea7f0b48b032eef72fe3a7582edf78408d6f834115b9feadd673a4d5bd149",
        license: "MIT",
        urls: [
          "bzz-raw://d6520943ea55fdf5f0bafb39ed909f64de17051bc954ff3e88c9e5621412c79c",
          "dweb:/ipfs/QmWZ4rAKTQbNG2HxGs46AcTXShsVytKeLs7CUCdCSv5N7a",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol":
      {
        keccak256:
          "0xb8709268fac307114f6cbb5e3cee798d91cd0adfea4d337c4920f8f0b2414f15",
        license: "MIT",
        urls: [
          "bzz-raw://34975544d7bea644eee9ad6e9034b7bbbc0b165159b77f60d0c6004300ab601d",
          "dweb:/ipfs/QmUW5vLADhvVqSdBe96QFM6gzwtv9pagpaUkzXmaeQTWPQ",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol":
      {
        keccak256:
          "0xea5339a7fff0ed42b45be56a88efdd0b2ddde9fa480dc99fef9a6a4c5b776863",
        license: "MIT",
        urls: [
          "bzz-raw://841619682637df5579b4c396d281d6c55b26f1b1acce1d0ab67bead5e39cf60c",
          "dweb:/ipfs/QmNRtuKp43ZHJwswdyT3GivY4fDMvz3cxBe1FfDthG1JGj",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol":
      {
        keccak256:
          "0xbf5daf926894541a40a64b43c3746aa1940c5a1b3b8d14a06465eea72a9b90cc",
        license: "MIT",
        urls: [
          "bzz-raw://fbdea6be4e36fc5406e81560d8f3f073a61c5d3cb5889b7c896ff5981e2128eb",
          "dweb:/ipfs/QmPpkPNkLEjDf4RZYjiypj9BrNyaXrb2U4pE9aq7sTG9km",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol":
      {
        keccak256:
          "0xaf5a96100f421d61693605349511e43221d3c2e47d4b3efa87af2b936e2567fc",
        license: "MIT",
        urls: [
          "bzz-raw://371fd95bad4416766089d3e621dee1fd86fece2b266ad3f9443fefe567e24e94",
          "dweb:/ipfs/QmNciwwtGev3Q8uVhnoE5PQUSCDpMp6KtVjiDgnGdqLmWX",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol":
      {
        keccak256:
          "0x9a3b990bd56d139df3e454a9edf1c64668530b5a77fc32eb063bc206f958274a",
        license: "MIT",
        urls: [
          "bzz-raw://0895399d170daab2d69b4c43a0202e5a07f2e67a93b26e3354dcbedb062232f7",
          "dweb:/ipfs/QmUM1VH3XDk559Dsgh4QPvupr3YVKjz87HrSyYzzVFZbxw",
        ],
      },
    "node_modules/@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol":
      {
        keccak256:
          "0xc6cef87559d0aeffdf0a99803de655938a7779ec0a3cd5d4383483ad85565a09",
        license: "MIT",
        urls: [
          "bzz-raw://92ad7e572cf44e6b4b37631b44b62f9eb9fb1cf14d9ce51c1504d5dc7ccaf758",
          "dweb:/ipfs/QmcnbqX85tsWnUXPmtuPLE4SczME2sJaTfmqEFkuAJvWhy",
        ],
      },
    "node_modules/erc721a-upgradeable/contracts/ERC721AUpgradeable.sol": {
      keccak256:
        "0x73586b2650e59bdb698c0a2cf965f440f0046456fc0c18e9f122a573355197a2",
      license: "MIT",
      urls: [
        "bzz-raw://9c5c2ae31936f25cb63cbe69902121539dada52dbcc89216f1f23a7c8e0170e4",
        "dweb:/ipfs/QmSUk2vRQoqGPLtTZg9dLKR6j3trFxMjDhveRpJwkm7vkZ",
      ],
    },
    "node_modules/erc721a-upgradeable/contracts/IERC721AUpgradeable.sol": {
      keccak256:
        "0x89447bfc4f1417953e3664234d896b42ebc7d68b3cc27f86f7cdd7addfdd5c1c",
      license: "MIT",
      urls: [
        "bzz-raw://3916917efc838814adb1e459c968d442d26e304f28af181ff35cffb5ca3ec0be",
        "dweb:/ipfs/QmcVwcrhenj31MCbDn6yvaYsFNkyJmA3isWaJiGhgQeEmQ",
      ],
    },
  },
  version: 1,
};

export const tieredDropBytecode =
  "0x608060405234801561001057600080fd5b50615f9e80620000216000396000f3fe6080604052600436106103605760003560e01c80637a70a895116101c6578063a79602ee116100f7578063ca15c87311610095578063e28411ea1161006f578063e28411ea14610a79578063e715032214610a99578063e8a3d48514610ab9578063e985e9c514610ace57600080fd5b8063ca15c87314610a19578063ce80564214610a39578063d547741f14610a5957600080fd5b8063b6d14230116100d1578063b6d142301461097a578063b88d4fde1461099a578063c4376dd7146109ba578063c87b56dd146109f957600080fd5b8063a79602ee14610902578063ac9650d814610922578063b24f2d391461094f57600080fd5b80639d63e4a311610164578063a217fddf1161013e578063a217fddf14610897578063a22cb465146108ac578063a2309ff8146108cc578063a32fa5b3146108e257600080fd5b80639d63e4a3146108415780639fc4d68f14610857578063a05112fc1461087757600080fd5b806391d14854116101a057806391d14854146107a6578063938e3d7b146107ec57806395d89b411461080c5780639bcf7a151461082157600080fd5b80637a70a895146107555780638da5cb5b146107685780639010d07c1461078657600080fd5b80633b1475a7116102a0578063572b6c051161023e5780636352211e116102185780636352211e146106e057806363b45e2d146107005780636f4f28371461071557806370a082311461073557600080fd5b8063572b6c05146106675780635e73ff93146106a0578063600dd5ea146106c057600080fd5b8063492e224b1161027a578063492e224b146105b65780634cc157df146105d6578063502eff711461061857806351c6a0651461063a57600080fd5b80633b1475a71461056157806342842e0e1461057657806342966c681461059657600080fd5b806318160ddd1161030d578063248a9ca3116102e7578063248a9ca3146104b55780632a55205a146104e25780632f2ff15d1461052157806336568abe1461054157600080fd5b806318160ddd1461045057806323b872dd146104755780632419f51b1461049557600080fd5b8063081812fc1161033e578063081812fc146103ee578063095ea7b31461040e57806313af40351461043057600080fd5b806301ffc9a71461036557806306fdde031461039a578063079fe40e146103bc575b600080fd5b34801561037157600080fd5b50610385610380366004614ed8565b610b18565b60405190151581526020015b60405180910390f35b3480156103a657600080fd5b506103af610b44565b6040516103919190614f4d565b3480156103c857600080fd5b506004546001600160a01b03165b6040516001600160a01b039091168152602001610391565b3480156103fa57600080fd5b506103d6610409366004614f60565b610bd7565b34801561041a57600080fd5b5061042e610429366004614f9e565b610c1c565b005b34801561043c57600080fd5b5061042e61044b366004614fca565b610cb5565b34801561045c57600080fd5b5061010d5461010c54035b604051908152602001610391565b34801561048157600080fd5b5061042e610490366004614fe7565b610d0b565b3480156104a157600080fd5b506104676104b0366004614f60565b610d16565b3480156104c157600080fd5b506104676104d0366004614f60565b6000908152600d602052604090205490565b3480156104ee57600080fd5b506105026104fd366004615028565b610d84565b604080516001600160a01b039093168352602083019190915201610391565b34801561052d57600080fd5b5061042e61053c36600461504a565b610dc1565b34801561054d57600080fd5b5061042e61055c36600461504a565b610e5b565b34801561056d57600080fd5b50600954610467565b34801561058257600080fd5b5061042e610591366004614fe7565b610ebd565b3480156105a257600080fd5b5061042e6105b1366004614f60565b610ed8565b3480156105c257600080fd5b506103856105d1366004614f60565b610ee3565b3480156105e257600080fd5b506105f66105f1366004614f60565b610f09565b604080516001600160a01b03909316835261ffff909116602083015201610391565b34801561062457600080fd5b5061062d610f74565b6040516103919190615115565b34801561064657600080fd5b5061065a610655366004615279565b611161565b60405161039191906152c6565b34801561067357600080fd5b50610385610682366004614fca565b6001600160a01b031660009081526076602052604090205460ff1690565b3480156106ac57600080fd5b506103af6106bb366004614f60565b6113e2565b3480156106cc57600080fd5b5061042e6106db366004614f9e565b6114f2565b3480156106ec57600080fd5b506103d66106fb366004614f60565b611541565b34801561070c57600080fd5b50600754610467565b34801561072157600080fd5b5061042e610730366004614fca565b611553565b34801561074157600080fd5b50610467610750366004614fca565b6115a1565b6103d661076336600461531a565b6115f0565b34801561077457600080fd5b506005546001600160a01b03166103d6565b34801561079257600080fd5b506103d66107a1366004615028565b611756565b3480156107b257600080fd5b506103856107c136600461504a565b6000918252600c602090815260408084206001600160a01b0393909316845291905290205460ff1690565b3480156107f857600080fd5b5061042e61080736600461538a565b611857565b34801561081857600080fd5b506103af6118a5565b34801561082d57600080fd5b5061042e61083c3660046153be565b6118b5565b34801561084d57600080fd5b5061014054610467565b34801561086357600080fd5b506103af6108723660046153e5565b611905565b34801561088357600080fd5b506103af610892366004614f60565b611a92565b3480156108a357600080fd5b50610467600081565b3480156108b857600080fd5b5061042e6108c7366004615431565b611b2c565b3480156108d857600080fd5b5061010c54610467565b3480156108ee57600080fd5b506103856108fd36600461504a565b611c00565b34801561090e57600080fd5b5061042e61091d366004615503565b611c56565b34801561092e57600080fd5b5061094261093d3660046155f2565b611e22565b6040516103919190615666565b34801561095b57600080fd5b506002546001600160a01b03811690600160a01b900461ffff166105f6565b34801561098657600080fd5b5061046761099536600461538a565b611f16565b3480156109a657600080fd5b5061042e6109b53660046156c8565b611f5a565b3480156109c657600080fd5b506109da6109d536600461531a565b611fa4565b6040805192151583526001600160a01b03909116602083015201610391565b348015610a0557600080fd5b506103af610a14366004614f60565b611fe5565b348015610a2557600080fd5b50610467610a34366004614f60565b61208f565b348015610a4557600080fd5b506103af610a543660046153e5565b61212a565b348015610a6557600080fd5b5061042e610a7436600461504a565b6121c3565b348015610a8557600080fd5b50610467610a94366004615733565b6121dc565b348015610aa557600080fd5b506103af610ab43660046157d6565b612319565b348015610ac557600080fd5b506103af61238e565b348015610ada57600080fd5b50610385610ae9366004615824565b6001600160a01b0391821660009081526101136020908152604080832093909416825291909152205460ff1690565b6000610b238261239b565b80610b3e575063152a902d60e11b6001600160e01b03198316145b92915050565b606061010e8054610b5490615852565b80601f0160208091040260200160405190810160405280929190818152602001828054610b8090615852565b8015610bcd5780601f10610ba257610100808354040283529160200191610bcd565b820191906000526020600020905b815481529060010190602001808311610bb057829003601f168201915b5050505050905090565b6000610be2826123eb565b610bff576040516333d1c03960e21b815260040160405180910390fd5b50600090815261011260205260409020546001600160a01b031690565b6000610c2782611541565b9050806001600160a01b0316836001600160a01b03161415610c5c5760405163250fdee360e21b815260040160405180910390fd5b806001600160a01b0316610c6e612419565b6001600160a01b031614610ca557610c8881610ae9612419565b610ca5576040516367d9dca160e11b815260040160405180910390fd5b610cb0838383612428565b505050565b610cbd612485565b610cff5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b60448201526064015b60405180910390fd5b610d0881612493565b50565b610cb08383836124e5565b6000610d2160075490565b8210610d5f5760405162461bcd60e51b815260206004820152600d60248201526c092dcecc2d8d2c840d2dcc8caf609b1b6044820152606401610cf6565b60078281548110610d7257610d72615887565b90600052602060002001549050919050565b600080600080610d9386610f09565b90945084925061ffff169050612710610dac82876158b3565b610db691906158e8565b925050509250929050565b6000828152600d6020526040902054610dda9033612704565b6000828152600c602090815260408083206001600160a01b038516845290915290205460ff1615610e4d5760405162461bcd60e51b815260206004820152601d60248201527f43616e206f6e6c79206772616e7420746f206e6f6e20686f6c646572730000006044820152606401610cf6565b610e578282612784565b5050565b336001600160a01b03821614610eb35760405162461bcd60e51b815260206004820152601a60248201527f43616e206f6e6c792072656e6f756e636520666f722073656c660000000000006044820152606401610cf6565b610e578282612798565b610cb083838360405180602001604052806000815250611f5a565b610d088160016127ef565b60008181526006602052604081208054829190610eff90615852565b9050119050919050565b6000818152600360209081526040808320815180830190925280546001600160a01b031680835260019091015492820192909252829115610f505780516020820151610f6a565b6002546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b60606000600b805480602002602001604051908101604052809291908181526020016000905b82821015611046578382906000526020600020018054610fb990615852565b80601f0160208091040260200160405190810160405280929190818152602001828054610fe590615852565b80156110325780601f1061100757610100808354040283529160200191611032565b820191906000526020600020905b81548152906001019060200180831161101557829003601f168201915b505050505081526020019060010190610f9a565b50508251929350829150506001600160401b03811115611068576110686151b6565b6040519080825280602002602001820160405280156110bd57816020015b6110aa60405180606001604052806060815260200160608152602001606081525090565b8152602001906001900390816110865790505b50925060005b8181101561115b576000806110f08584815181106110e3576110e3615887565b60200260200101516129fd565b91509150604051806060016040528086858151811061111157611111615887565b602002602001015181526020018381526020018281525086848151811061113a5761113a615887565b6020026020010181905250505060018161115491906158fc565b90506110c3565b50505090565b6101405460609082841080156111775750808311155b6111c35760405162461bcd60e51b815260206004820152601c60248201527f54696572656444726f703a20696e76616c696420696e64696365732e000000006044820152606401610cf6565b6000845b8481101561126657600081815261014160209081526040808320548352610142825280832090516111f89201615914565b60405160208183030381529060405280519060200120905060008860405160200161122391906159b0565b604051602081830303815290604052805190602001209050808214156112515761124e6001856158fc565b93505b5061125f90506001826158fc565b90506111c7565b50806001600160401b0381111561127f5761127f6151b6565b6040519080825280602002602001820160405280156112c457816020015b604080518082019091526000808252602082015281526020019060019003908161129d5790505b5092506000855b858110156113d757600081815261014160209081526040808320548352610142825280832090516112fc9201615914565b60405160208183030381529060405280519060200120905060008960405160200161132791906159b0565b604051602081830303815290604052805190602001209050808214156113c2576000838152610141602052604081205490841561138057610141600061136e6001886159cc565b81526020019081526020016000205490505b6040518060400160405280828152602001838152508987815181106113a7576113a7615887565b60209081029190910101526113bd6001876158fc565b955050505b506113d090506001826158fc565b90506112cb565b505050509392505050565b6101405460609060005b818110156114c15760008181526101416020526040902054808510156114ae57600081815261014260205260409020805461142690615852565b80601f016020809104026020016040519081016040528092919081815260200182805461145290615852565b801561149f5780601f106114745761010080835404028352916020019161149f565b820191906000526020600020905b81548152906001019060200180831161148257829003601f168201915b50505050509350505050919050565b506114ba6001826158fc565b90506113ec565b5060405162461bcd60e51b815260206004820152600560248201526410aa34b2b960d91b6044820152606401610cf6565b6114fa612485565b6115375760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610cf6565b610e578282612b43565b600061154c82612bf8565b5192915050565b61155b612485565b6115985760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610cf6565b610d0881612d15565b60006001600160a01b0382166115ca576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b0316600090815261011160205260409020546001600160401b031690565b6000808080808080808061160760608d018d6159e3565b8101906116149190615a29565b97509750975097509750975097509750826000141561165d5760405162461bcd60e51b8152602060048201526005602482015264302071747960d81b6044820152606401610cf6565b61010c5460095461166e85836158fc565b11156116a65760405162461bcd60e51b815260206004820152600760248201526621546f6b656e7360c81b6044820152606401610cf6565b6116b18d8d8d612d5f565b99506116be858385612e48565b6001600160a01b038716158015906116d557508515155b156116e5576116e5818888612ee8565b6116f088858b612fb1565b876001600160a01b0316611702612419565b6001600160a01b03167f18b441045a92aafd94c7099dd5e1a429662128cb878689a2ce2ae246fccd19c583878d60405161173e93929190615b2d565b60405180910390a35050505050505050509392505050565b6000828152600e602052604081205481805b8281101561184e576000868152600e602090815260408083208484526001019091529020546001600160a01b0316156117e557848214156117d3576000868152600e602090815260408083209383526001909301905220546001600160a01b03169250610b3e915050565b6117de6001836158fc565b915061183c565b6000868152600c6020908152604080832083805290915290205460ff16801561182957506000868152600e6020908152604080832083805260020190915290205481145b1561183c576118396001836158fc565b91505b6118476001826158fc565b9050611768565b50505092915050565b61185f612485565b61189c5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610cf6565b610d088161312b565b606061010f8054610b5490615852565b6118bd612485565b6118fa5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610cf6565b610cb0838383612ee8565b60008381526006602052604081208054606092919061192390615852565b80601f016020809104026020016040519081016040528092919081815260200182805461194f90615852565b801561199c5780601f106119715761010080835404028352916020019161199c565b820191906000526020600020905b81548152906001019060200180831161197f57829003601f168201915b505050505090508051600014156119f55760405162461bcd60e51b815260206004820152601160248201527f4e6f7468696e6720746f2072657665616c0000000000000000000000000000006044820152606401610cf6565b60008082806020019051810190611a0c9190615b4c565b91509150611a1b828787612319565b93508084878746604051602001611a359493929190615bcc565b6040516020818303038152906040528051906020012014611a885760405162461bcd60e51b815260206004820152600d60248201526c496e636f7272656374206b657960981b6044820152606401610cf6565b5050509392505050565b60066020526000908152604090208054611aab90615852565b80601f0160208091040260200160405190810160405280929190818152602001828054611ad790615852565b8015611b245780601f10611af957610100808354040283529160200191611b24565b820191906000526020600020905b815481529060010190602001808311611b0757829003601f168201915b505050505081565b611b34612419565b6001600160a01b0316826001600160a01b03161415611b665760405163b06307db60e01b815260040160405180910390fd5b806101136000611b74612419565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff191692151592909217909155611bb8612419565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611bf4911515815260200190565b60405180910390a35050565b6000828152600c6020908152604080832083805290915281205460ff16611c4d57506000828152600c602090815260408083206001600160a01b038516845290915290205460ff16610b3e565b50600192915050565b600054610100900460ff1615808015611c765750600054600160ff909116105b80611c905750303b158015611c90575060005460ff166001145b611cf35760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610cf6565b6000805460ff191660011790558015611d16576000805461ff0019166101001790555b7f8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6611d618761320d565b611d6b8a8a613245565b611d73613276565b611d7c8861312b565b611d858b612493565b611d9060008c612784565b611d9a818c612784565b611da4828c612784565b611daf826000612784565b611dbd858561ffff16612b43565b611dc686612d15565b61013e9190915561013f558015611e17576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050505050505050565b6060816001600160401b03811115611e3c57611e3c6151b6565b604051908082528060200260200182016040528015611e6f57816020015b6060815260200190600190039081611e5a5790505b50905060005b82811015611f0f57611edf30858584818110611e9357611e93615887565b9050602002810190611ea591906159e3565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506132f792505050565b828281518110611ef157611ef1615887565b60200260200101819052508080611f0790615bf5565b915050611e75565b5092915050565b6000610147600083604051602001611f2e9190615c10565b604051602081830303815290604052805190602001208152602001908152602001600020549050919050565b611f658484846124e5565b6001600160a01b0383163b15611f9e57611f81848484846133eb565b611f9e576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b600080611fb28585856134da565b60408087013560009081526043602052205490915060ff16158015611fdb5750611fdb81613540565b9150935093915050565b60606000611ff28361356f565b90506000806120008361363f565b91509150600061200f84613752565b905061201a83610ee3565b1561204a57806040516020016120309190615c3a565b604051602081830303815290604052945050505050919050565b600061205785858561382b565b9050816120638261389e565b604051602001612074929190615c5f565b60405160208183030381529060405295505050505050919050565b6000818152600e6020526040812054815b818110156120f3576000848152600e602090815260408083208484526001019091529020546001600160a01b0316156120e1576120de6001846158fc565b92505b6120ec6001826158fc565b90506120a0565b506000838152600c6020908152604080832083805290915290205460ff1615612124576121216001836158fc565b91505b50919050565b606061013f5461213a8133612704565b600061214586610d16565b9050612152818686611905565b925061216d816040518060200160405280600081525061399b565b61217781846139ba565b6121828186866139d9565b857f6df1d8db2a036436ffe0b2d1833f2c5f1e624818dfce2578c0faa4b83ef9998d846040516121b29190614f4d565b60405180910390a250509392505050565b6000828152600d6020526040902054610eb39033612704565b6000811561225d576000806121f384860186615c8e565b91509150815160001415801561220857508015155b1561225a5761225a8a60095461221e91906158fc565b86868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061399b92505050565b50505b876101458686604051612271929190615cd2565b9081526020016040518091039020600082825461228e91906158fc565b9091555050600954604080516020601f88018190048102820181019092528681526122d3918890889081908401838280828437600092019190915250613a2992505050565b156122fd578061014487876040516122ec929190615cd2565b908152604051908190036020019020555b61230c89898989898989613a52565b9998505050505050505050565b8251604080518083016020019091528181529060005b8181101561238557600085858360405160200161234e93929190615ce2565b60408051601f1981840301815291905280516020918201208884018201511885840182015261237e9150826158fc565b905061232f565b50509392505050565b60018054611aab90615852565b60006001600160e01b031982166380ac58cd60e01b14806123cc57506001600160e01b03198216635b5e139f60e01b145b80610b3e57506301ffc9a760e01b6001600160e01b0319831614610b3e565b600061010c5482108015610b3e57505060009081526101106020526040902054600160e01b900460ff161590565b6000612423613c5a565b905090565b6000828152610112602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6000612423816107c1612419565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b60006124f082612bf8565b9050836001600160a01b031681600001516001600160a01b0316146125275760405162a1148160e81b815260040160405180910390fd5b6000846001600160a01b031661253b612419565b6001600160a01b03161480612557575061255785610ae9612419565b806125825750612565612419565b6001600160a01b031661257784610bd7565b6001600160a01b0316145b9050806125a257604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b0384166125c957604051633a954ecd60e21b815260040160405180910390fd5b6125d68585856001613c84565b6125e260008487612428565b6001600160a01b03858116600090815261011160209081526040808320805467ffffffffffffffff198082166001600160401b039283166000190183161790925589861680865283862080549384169383166001908101841694909417905589865261011090945282852080546001600160e01b031916909417600160a01b429092169190910217835587018084529220805491939091166126b95761010c5482146126b957805460208601516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050505050565b6000828152600c602090815260408083206001600160a01b038516845290915290205460ff16610e5757612742816001600160a01b03166014613d6a565b61274d836020613d6a565b60405160200161275e929190615cf4565b60408051601f198184030181529082905262461bcd60e51b8252610cf691600401614f4d565b61278e8282613f12565b610e578282613f6d565b6127a28282613fda565b6000828152600e602090815260408083206001600160a01b03851680855260028201808552838620805487526001909301855292852080546001600160a01b031916905584529152555050565b60006127fa83612bf8565b80519091508215612882576000816001600160a01b0316612819612419565b6001600160a01b03161480612835575061283582610ae9612419565b806128605750612843612419565b6001600160a01b031661285586610bd7565b6001600160a01b0316145b90508061288057604051632ce44b5f60e11b815260040160405180910390fd5b505b612890816000866001613c84565b61289c60008583612428565b6001600160a01b0380821660008181526101116020908152604080832080547001000000000000000000000000000000006000196001600160401b0380841691909101811667ffffffffffffffff19841681178390048216600190810183169093027fffffffffffffffff0000000000000000ffffffffffffffff0000000000000000909416179290921783558b8652610110909452828520805460ff60e01b1942909316600160a01b026001600160e01b03199091169097179690961716600160e01b1785559189018084529220805491949091166129b15761010c5482146129b157805460208701516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038716171781555b5050604051869250600091506001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a4505061010d805460010190555050565b606080600a83604051612a1091906159b0565b9081526020016040518091039020805480602002602001604051908101604052809291908181526020016000905b82821015612a8457838290600052602060002090600202016040518060400160405290816000820154815260200160018201548152505081526020019060010190612a3e565b50508251929450829150506001600160401b03811115612aa657612aa66151b6565b604051908082528060200260200182016040528015612ad957816020015b6060815260200190600190039081612ac45790505b50915060005b81811015612b3c57612b0d848281518110612afc57612afc615887565b602002602001015160000151613752565b838281518110612b1f57612b1f615887565b6020908102919091010152612b356001826158fc565b9050612adf565b5050915091565b612710811115612b875760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610cf6565b600280546001600160a01b03841675ffffffffffffffffffffffffffffffffffffffffffff199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b60408051606081018252600080825260208201819052918101919091528161010c54811015612cfc5760008181526101106020908152604091829020825160608101845290546001600160a01b0381168252600160a01b81046001600160401b031692820192909252600160e01b90910460ff16151591810182905290612cfa5780516001600160a01b031615612c90579392505050565b506000190160008181526101106020908152604091829020825160608101845290546001600160a01b038116808352600160a01b82046001600160401b031693830193909352600160e01b900460ff1615159281019290925215612cf5579392505050565b612c90565b505b604051636f96cda160e11b815260040160405180910390fd5b600480546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b600080612d6d858585611fa4565b9250905080612dac5760405162461bcd60e51b815260206004820152600b60248201526a496e76616c69642072657160a81b6044820152606401610cf6565b42612dba6020870187615d75565b6001600160801b03161180612de65750612dda6040860160208701615d75565b6001600160801b031642115b15612e215760405162461bcd60e51b815260206004820152600b60248201526a14995c48195e1c1a5c995960aa1b6044820152606401610cf6565b506040938401356000908152604360205293909320805460ff191660011790555090919050565b80612e5257505050565b60006001600160a01b03841615612e695783612e76565b6004546001600160a01b03165b90506001600160a01b03831673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1415612ed557813414612ed55760405162461bcd60e51b815260206004820152600660248201526521507269636560d01b6044820152606401610cf6565b611f9e83612ee1612419565b838561403c565b612710811115612f2c5760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610cf6565b6040805180820182526001600160a01b038481168083526020808401868152600089815260038352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910160405180910390a3505050565b61010c54808360005b84518110156130ca576000858281518110612fd757612fd7615887565b602002602001015190506000612fed8285614086565b905080612ffb5750506130b8565b61300581856159cc565b93506130128286836140ba565b806101458360405161302491906159b0565b9081526020016040518091039020600082825461304191906159cc565b925050819055508061014760008460405160200161305f9190615c10565b604051602081830303815290604052805190602001208152602001908152602001600020600082825461309291906158fc565b909155505083156130ae576130a781866158fc565b94506130b5565b50506130ca565b50505b6130c36001826158fc565b9050612fba565b5080156131195760405162461bcd60e51b815260206004820152601d60248201527f496e73756666696369656e7420746f6b656e7320696e2074696572732e0000006044820152606401610cf6565b61312386866141b3565b505050505050565b60006001805461313a90615852565b80601f016020809104026020016040519081016040528092919081815260200182805461316690615852565b80156131b35780601f10613188576101008083540402835291602001916131b3565b820191906000526020600020905b81548152906001019060200180831161319657829003601f168201915b505085519394506131cf93600193506020870192509050614db5565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168183604051613201929190615d9e565b60405180910390a15050565b600054610100900460ff166132345760405162461bcd60e51b8152600401610cf690615dc3565b61323c6141cd565b610d08816141f4565b600054610100900460ff1661326c5760405162461bcd60e51b8152600401610cf690615dc3565b610e578282614283565b600054610100900460ff1661329d5760405162461bcd60e51b8152600401610cf690615dc3565b6132f56040518060400160405280600f81526020017f5369676e6174757265416374696f6e0000000000000000000000000000000000815250604051806040016040528060018152602001603160f81b8152506142de565b565b60606001600160a01b0383163b61335f5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610cf6565b600080846001600160a01b03168460405161337a91906159b0565b600060405180830381855af49150503d80600081146133b5576040519150601f19603f3d011682016040523d82523d6000602084013e6133ba565b606091505b50915091506133e28282604051806060016040528060278152602001615f426027913961430f565b95945050505050565b6000836001600160a01b031663150b7a02613404612419565b8786866040518563ffffffff1660e01b81526004016134269493929190615e0e565b6020604051808303816000875af1925050508015613461575060408051601f3d908101601f1916820190925261345e91810190615e4a565b60015b6134bc573d80801561348f576040519150601f19603f3d011682016040523d82523d6000602084013e613494565b606091505b5080516134b4576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b600061353683838080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061353092506135249150889050614348565b805190602001206143f8565b90614446565b90505b9392505050565b61013f546000908152600c602090815260408083206001600160a01b038516845290915281205460ff16610b3e565b61014054600090815b8181101561360757600081815261014160205260409020548410156135f55760008181526101416020526040812054906135b286836159cc565b6000838152610143602090815260409182902082518084019093528054835260010154908201819052919250906135ea9083906159cc565b979650505050505050565b6136006001826158fc565b9050613578565b5060405162461bcd60e51b815260206004820152600c60248201526b0853595d1859185d184b525160a21b6044820152606401610cf6565b600080600061364d60075490565b90506000600780548060200260200160405190810160405280929190818152602001828054801561369d57602002820191906000526020600020905b815481526020019060010190808311613689575b5050505050905060005b82811015613709578181815181106136c1576136c1615887565b60200260200101518610156136f7578093508181815181106136e5576136e5615887565b60200260200101519450505050915091565b6137026001826158fc565b90506136a7565b5060405162461bcd60e51b815260206004820152600f60248201527f496e76616c696420746f6b656e496400000000000000000000000000000000006044820152606401610cf6565b6060600061375f60075490565b9050600060078054806020026020016040519081016040528092919081815260200182805480156137af57602002820191906000526020600020905b81548152602001906001019080831161379b575b5050505050905060005b82811015613709578181815181106137d3576137d3615887565b602002602001015185101561381957600860008383815181106137f8576137f8615887565b60200260200101518152602001908152602001600020805461142690615852565b6138246001826158fc565b90506137b9565b60008281526101466020526040812054806138495784915050613539565b8060008415613863576138606104b06001876159cc565b90505b600061386f82886159cc565b9050600061387d8285615e67565b90508161388a828b6158fc565b6138949190615e67565b61230c90846158fc565b6060816138c25750506040805180820190915260018152600360fc1b602082015290565b8160005b81156138ec57806138d681615bf5565b91506138e59050600a836158e8565b91506138c6565b6000816001600160401b03811115613906576139066151b6565b6040519080825280601f01601f191660200182016040528015613930576020820181803683370190505b5090505b84156134d2576139456001836159cc565b9150613952600a86615e67565b61395d9060306158fc565b60f81b81838151811061397257613972615887565b60200101906001600160f81b031916908160001a905350613994600a866158e8565b9450613934565b60008281526006602090815260409091208251610cb092840190614db5565b60008281526008602090815260409091208251610cb092840190614db5565b8181426139e76001436159cc565b406040516020016139fb9493929190615e7b565b60408051601f1981840301815291815281516020928301206000958652610146909252909320929092555050565b6000600a82604051613a3b91906159b0565b908152604051908190036020019020541592915050565b6000613a5c61446a565b613a995760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610cf6565b87613ace5760405162461bcd60e51b81526020600482015260056024820152640c08185b5d60da1b6044820152606401610cf6565b60006009549050613b16818a8a8a8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061447b92505050565b600991909155604051909250600090600a90613b359089908990615cd2565b9081526040519081900360200190205411613b8957600b8054600181018255600091909152613b87907f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db9018787614e39565b505b600a8686604051613b9b929190615cd2565b90815260408051602092819003830181208183018352848252838201868152815460018082018455600093845295909220925160029092029092019081559051920191909155518190613bf19088908890615cd2565b6040519081900390207f1c15eb986df6edfe0f8a0432449c7ac55cc9b03dfb9b4c5175dc8fdbf270c6f56001613c278d866158fc565b613c3191906159cc565b8b8b8989604051613c46959493929190615ebe565b60405180910390a350979650505050505050565b3360009081526076602052604081205460ff1615613c7f575060131936013560601c90565b503390565b61013e546000908152600c6020908152604080832083805290915290205460ff16158015613cba57506001600160a01b03841615155b8015613cce57506001600160a01b03831615155b15611f9e5761013e546000908152600c602090815260408083206001600160a01b038816845290915290205460ff16158015613d31575061013e546000908152600c602090815260408083206001600160a01b038716845290915290205460ff16155b15611f9e5760405162461bcd60e51b815260206004820152600960248201526810aa2920a729a322a960b91b6044820152606401610cf6565b60606000613d798360026158b3565b613d849060026158fc565b6001600160401b03811115613d9b57613d9b6151b6565b6040519080825280601f01601f191660200182016040528015613dc5576020820181803683370190505b509050600360fc1b81600081518110613de057613de0615887565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110613e0f57613e0f615887565b60200101906001600160f81b031916908160001a9053506000613e338460026158b3565b613e3e9060016158fc565b90505b6001811115613ec3577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110613e7f57613e7f615887565b1a60f81b828281518110613e9557613e95615887565b60200101906001600160f81b031916908160001a90535060049490941c93613ebc81615ef7565b9050613e41565b5083156135395760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610cf6565b6000828152600c602090815260408083206001600160a01b0385168085529252808320805460ff1916600117905551339285917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d9190a45050565b6000828152600e6020526040812080549160019190613f8c83856158fc565b90915550506000928352600e6020908152604080852083865260018101835281862080546001600160a01b039096166001600160a01b03199096168617905593855260029093019052912055565b613fe48282612704565b6000828152600c602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b8061404657611f9e565b6001600160a01b03841673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee141561407a5761407582826144e8565b611f9e565b611f9e8484848461458b565b6000806101458460405161409a91906159b0565b908152602001604051809103902054905082811061353957829150611f0f565b6000610144846040516140cd91906159b0565b90815260405190819003602001902054905060006140eb83836158fc565b905060006140f984866158fc565b610140805460009081526101416020526040812083905581549293506001926141239084906158fc565b9091555050600081815261014260209081526040909120875161414892890190614db5565b5060408051808201825284815260208082018581526000858152610143909252908390209151825551600190910155518490610144906141899089906159b0565b908152602001604051809103902060008282546141a691906158fc565b9091555050505050505050565b610e578282604051806020016040528060008152506145e4565b600054610100900460ff166132f55760405162461bcd60e51b8152600401610cf690615dc3565b600054610100900460ff1661421b5760405162461bcd60e51b8152600401610cf690615dc3565b60005b8151811015610e575760016076600084848151811061423f5761423f615887565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff19169115159190911790558061427b81615bf5565b91505061421e565b600054610100900460ff166142aa5760405162461bcd60e51b8152600401610cf690615dc3565b81516142be9061010e906020850190614db5565b5080516142d39061010f906020840190614db5565b50600061010c555050565b600054610100900460ff166143055760405162461bcd60e51b8152600401610cf690615dc3565b610e5782826147b9565b6060831561431e575081613539565b82511561432e5782518084602001fd5b8160405162461bcd60e51b8152600401610cf69190614f4d565b60607f242b17107e6aef17754836dd680cb66bbf39e46a5f20952950acbbae68643d026143786020840184615d75565b6143886040850160208601615d75565b604085013561439a60608701876159e3565b6040516143a8929190615cd2565b6040805191829003822060208301969096526001600160801b0394851690820152929091166060830152608082015260a081019190915260c0016040516020818303038152906040529050919050565b6000610b3e6144056147fa565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b60008060006144558585614875565b91509150614462816148bb565b509392505050565b600061242361013f546107c1612419565b60008061448884866158fc565b60078054600181019091557fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801819055600081815260086020908152604090912085519294508493506144df929091860190614db5565b50935093915050565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114614535576040519150601f19603f3d011682016040523d82523d6000602084013e61453a565b606091505b5050905080610cb05760405162461bcd60e51b815260206004820152601c60248201527f6e617469766520746f6b656e207472616e73666572206661696c6564000000006044820152606401610cf6565b816001600160a01b0316836001600160a01b031614156145aa57611f9e565b6001600160a01b0383163014156145cf576140756001600160a01b0385168383614a76565b611f9e6001600160a01b038516848484614aee565b61010c546001600160a01b03841661460e57604051622e076360e81b815260040160405180910390fd5b8261462c5760405163b562e8dd60e01b815260040160405180910390fd5b6146396000858386613c84565b6001600160a01b03841660008181526101116020908152604080832080546fffffffffffffffffffffffffffffffff1981166001600160401b038083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b0181169092021790915585845261011090925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b15614764575b60405182906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a461472c60008784806001019550876133eb565b614749576040516368d2bf6b60e11b815260040160405180910390fd5b8082106146e1578261010c541461475f57600080fd5b6147a9565b5b6040516001830192906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4808210614765575b5061010c55611f9e600085838684565b600054610100900460ff166147e05760405162461bcd60e51b8152600401610cf690615dc3565b815160209283012081519190920120600f91909155601055565b60006124237f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f614829600f5490565b6010546040805160208101859052908101839052606081018290524660808201523060a082015260009060c0016040516020818303038152906040528051906020012090509392505050565b6000808251604114156148ac5760208301516040840151606085015160001a6148a087828585614b26565b945094505050506148b4565b506000905060025b9250929050565b60008160048111156148cf576148cf615f0e565b14156148d85750565b60018160048111156148ec576148ec615f0e565b141561493a5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610cf6565b600281600481111561494e5761494e615f0e565b141561499c5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610cf6565b60038160048111156149b0576149b0615f0e565b1415614a095760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610cf6565b6004816004811115614a1d57614a1d615f0e565b1415610d085760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b6064820152608401610cf6565b6040516001600160a01b038316602482015260448101829052610cb090849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b031990931692909217909152614c13565b6040516001600160a01b0380851660248301528316604482015260648101829052611f9e9085906323b872dd60e01b90608401614aa2565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115614b5d5750600090506003614c0a565b8460ff16601b14158015614b7557508460ff16601c14155b15614b865750600090506004614c0a565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015614bda573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116614c0357600060019250925050614c0a565b9150600090505b94509492505050565b6000614c68826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316614ce59092919063ffffffff16565b805190915015610cb05780806020019051810190614c869190615f24565b610cb05760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610cf6565b60606135368484600085856001600160a01b0385163b614d475760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610cf6565b600080866001600160a01b03168587604051614d6391906159b0565b60006040518083038185875af1925050503d8060008114614da0576040519150601f19603f3d011682016040523d82523d6000602084013e614da5565b606091505b50915091506135ea82828661430f565b828054614dc190615852565b90600052602060002090601f016020900481019282614de35760008555614e29565b82601f10614dfc57805160ff1916838001178555614e29565b82800160010185558215614e29579182015b82811115614e29578251825591602001919060010190614e0e565b50614e35929150614ead565b5090565b828054614e4590615852565b90600052602060002090601f016020900481019282614e675760008555614e29565b82601f10614e805782800160ff19823516178555614e29565b82800160010185558215614e29579182015b82811115614e29578235825591602001919060010190614e92565b5b80821115614e355760008155600101614eae565b6001600160e01b031981168114610d0857600080fd5b600060208284031215614eea57600080fd5b813561353981614ec2565b60005b83811015614f10578181015183820152602001614ef8565b83811115611f9e5750506000910152565b60008151808452614f39816020860160208601614ef5565b601f01601f19169290920160200192915050565b6020815260006135396020830184614f21565b600060208284031215614f7257600080fd5b5035919050565b6001600160a01b0381168114610d0857600080fd5b8035614f9981614f79565b919050565b60008060408385031215614fb157600080fd5b8235614fbc81614f79565b946020939093013593505050565b600060208284031215614fdc57600080fd5b813561353981614f79565b600080600060608486031215614ffc57600080fd5b833561500781614f79565b9250602084013561501781614f79565b929592945050506040919091013590565b6000806040838503121561503b57600080fd5b50508035926020909101359150565b6000806040838503121561505d57600080fd5b82359150602083013561506f81614f79565b809150509250929050565b600081518084526020808501945080840160005b838110156150b557815180518852830151838801526040909601959082019060010161508e565b509495945050505050565b600081518084526020808501808196508360051b8101915082860160005b858110156151085782840389526150f6848351614f21565b988501989350908401906001016150de565b5091979650505050505050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b838110156151a857603f1989840301855281516060815181865261516282870182614f21565b915050888201518582038a87015261517a828261507a565b9150508782015191508481038886015261519481836150c0565b96890196945050509086019060010161513c565b509098975050505050505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156151f4576151f46151b6565b604052919050565b60006001600160401b03821115615215576152156151b6565b50601f01601f191660200190565b600082601f83011261523457600080fd5b8135615247615242826151fc565b6151cc565b81815284602083860101111561525c57600080fd5b816020850160208301376000918101602001919091529392505050565b60008060006060848603121561528e57600080fd5b83356001600160401b038111156152a457600080fd5b6152b086828701615223565b9660208601359650604090950135949350505050565b602081526000613539602083018461507a565b60008083601f8401126152eb57600080fd5b5081356001600160401b0381111561530257600080fd5b6020830191508360208285010111156148b457600080fd5b60008060006040848603121561532f57600080fd5b83356001600160401b038082111561534657600080fd5b908501906080828803121561535a57600080fd5b9093506020850135908082111561537057600080fd5b5061537d868287016152d9565b9497909650939450505050565b60006020828403121561539c57600080fd5b81356001600160401b038111156153b257600080fd5b6134d284828501615223565b6000806000606084860312156153d357600080fd5b83359250602084013561501781614f79565b6000806000604084860312156153fa57600080fd5b8335925060208401356001600160401b0381111561541757600080fd5b61537d868287016152d9565b8015158114610d0857600080fd5b6000806040838503121561544457600080fd5b823561544f81614f79565b9150602083013561506f81615423565b60006001600160401b03821115615478576154786151b6565b5060051b60200190565b600082601f83011261549357600080fd5b813560206154a36152428361545f565b82815260059290921b840181019181810190868411156154c257600080fd5b8286015b848110156154e65780356154d981614f79565b83529183019183016154c6565b509695505050505050565b803561ffff81168114614f9957600080fd5b600080600080600080600080610100898b03121561552057600080fd5b61552989614f8e565b975060208901356001600160401b038082111561554557600080fd5b6155518c838d01615223565b985060408b013591508082111561556757600080fd5b6155738c838d01615223565b975060608b013591508082111561558957600080fd5b6155958c838d01615223565b965060808b01359150808211156155ab57600080fd5b506155b88b828c01615482565b9450506155c760a08a01614f8e565b92506155d560c08a01614f8e565b91506155e360e08a016154f1565b90509295985092959890939650565b6000806020838503121561560557600080fd5b82356001600160401b038082111561561c57600080fd5b818501915085601f83011261563057600080fd5b81358181111561563f57600080fd5b8660208260051b850101111561565457600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156156bb57603f198886030184526156a9858351614f21565b9450928501929085019060010161568d565b5092979650505050505050565b600080600080608085870312156156de57600080fd5b84356156e981614f79565b935060208501356156f981614f79565b92506040850135915060608501356001600160401b0381111561571b57600080fd5b61572787828801615223565b91505092959194509250565b60008060008060008060006080888a03121561574e57600080fd5b8735965060208801356001600160401b038082111561576c57600080fd5b6157788b838c016152d9565b909850965060408a013591508082111561579157600080fd5b61579d8b838c016152d9565b909650945060608a01359150808211156157b657600080fd5b506157c38a828b016152d9565b989b979a50959850939692959293505050565b6000806000604084860312156157eb57600080fd5b83356001600160401b038082111561580257600080fd5b61580e87838801615223565b9450602086013591508082111561537057600080fd5b6000806040838503121561583757600080fd5b823561584281614f79565b9150602083013561506f81614f79565b600181811c9082168061586657607f821691505b6020821081141561212457634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60008160001904831182151516156158cd576158cd61589d565b500290565b634e487b7160e01b600052601260045260246000fd5b6000826158f7576158f76158d2565b500490565b6000821982111561590f5761590f61589d565b500190565b600080835481600182811c91508083168061593057607f831692505b602080841082141561595057634e487b7160e01b86526022600452602486fd5b8180156159645760018114615975576159a2565b60ff198616895284890196506159a2565b60008a81526020902060005b8681101561599a5781548b820152908501908301615981565b505084890196505b509498975050505050505050565b600082516159c2818460208701614ef5565b9190910192915050565b6000828210156159de576159de61589d565b500390565b6000808335601e198436030181126159fa57600080fd5b8301803591506001600160401b03821115615a1457600080fd5b6020019150368190038213156148b457600080fd5b600080600080600080600080610100898b031215615a4657600080fd5b6001600160401b0389351115615a5b57600080fd5b883589018a601f820112615a6e57600080fd5b615a7b615242823561545f565b81358082526020808301929160051b8401018d811115615a9a57600080fd5b602084015b81811015615ada576001600160401b0381351115615abc57600080fd5b615acc8f60208335880101615223565b845260209384019301615a9f565b5050809a50505050615aee60208a01614f8e565b9650615afc60408a01614f8e565b955060608901359450615b1160808a01614f8e565b935060a0890135925060c089013591506155e360e08a01614f8e565b8381528260208201526060604082015260006133e260608301846150c0565b60008060408385031215615b5f57600080fd5b82516001600160401b03811115615b7557600080fd5b8301601f81018513615b8657600080fd5b8051615b94615242826151fc565b818152866020838501011115615ba957600080fd5b615bba826020830160208601614ef5565b60209590950151949694955050505050565b60008551615bde818460208a01614ef5565b820184868237909301918252506020019392505050565b6000600019821415615c0957615c0961589d565b5060010190565b60008251615c22818460208701614ef5565b651b5a5b9d195960d21b920191825250600601919050565b60008251615c4c818460208701614ef5565b600360fc1b920191825250600101919050565b60008351615c71818460208801614ef5565b835190830190615c85818360208801614ef5565b01949350505050565b60008060408385031215615ca157600080fd5b82356001600160401b03811115615cb757600080fd5b615cc385828601615223565b95602094909401359450505050565b8183823760009101908152919050565b82848237909101908152602001919050565b7f5065726d697373696f6e733a206163636f756e74200000000000000000000000815260008351615d2c816015850160208801614ef5565b7f206973206d697373696e6720726f6c65200000000000000000000000000000006015918401918201528351615d69816026840160208801614ef5565b01602601949350505050565b600060208284031215615d8757600080fd5b81356001600160801b038116811461353957600080fd5b604081526000615db16040830185614f21565b82810360208401526133e28185614f21565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60006001600160a01b03808716835280861660208401525083604083015260806060830152615e406080830184614f21565b9695505050505050565b600060208284031215615e5c57600080fd5b815161353981614ec2565b600082615e7657615e766158d2565b500690565b838582379092019081526020810191909152604001919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b858152606060208201526000615ed8606083018688615e95565b8281036040840152615eeb818587615e95565b98975050505050505050565b600081615f0657615f0661589d565b506000190190565b634e487b7160e01b600052602160045260246000fd5b600060208284031215615f3657600080fd5b81516135398161542356fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212208fa5ec563903fb3846da03c010ebcdd25640d568d11dc9954afa8dc4b87189a464736f6c634300080c0033";
