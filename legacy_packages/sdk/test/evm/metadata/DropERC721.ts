// from DropERC721 published at: ipfs://QmPASFEYVvUfXfztAHXNTcCqaJQcyr4RcLcW5F6BZsZvjg

const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "OperatorNotAllowed",
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
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
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
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct IClaimCondition.ClaimCondition[]",
        name: "claimConditions",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "resetEligibility",
        type: "bool",
      },
    ],
    name: "ClaimConditionsUpdated",
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
        indexed: false,
        internalType: "uint256",
        name: "maxTotalSupply",
        type: "uint256",
      },
    ],
    name: "MaxTotalSupplyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "restriction",
        type: "bool",
      },
    ],
    name: "OperatorRestriction",
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
        name: "platformFeeRecipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "platformFeeBps",
        type: "uint256",
      },
    ],
    name: "PlatformFeeInfoUpdated",
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
        internalType: "uint256",
        name: "claimConditionIndex",
        type: "uint256",
      },
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
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
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
        name: "operator",
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
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct IDrop.AllowlistProof",
        name: "_allowlistProof",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimCondition",
    outputs: [
      {
        internalType: "uint256",
        name: "currentStartId",
        type: "uint256",
      },
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
    inputs: [],
    name: "contractType",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
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
    inputs: [],
    name: "contractVersion",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
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
    inputs: [],
    name: "getActiveClaimConditionId",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_conditionId",
        type: "uint256",
      },
    ],
    name: "getClaimConditionById",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
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
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct IClaimCondition.ClaimCondition",
        name: "condition",
        type: "tuple",
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
    name: "getPlatformFeeInfo",
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
        name: "_conditionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_claimer",
        type: "address",
      },
    ],
    name: "getSupplyClaimedByWallet",
    outputs: [
      {
        internalType: "uint256",
        name: "supplyClaimedByWallet",
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
        internalType: "uint128",
        name: "_royaltyBps",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "_platformFeeBps",
        type: "uint128",
      },
      {
        internalType: "address",
        name: "_platformFeeRecipient",
        type: "address",
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
    inputs: [],
    name: "maxTotalSupply",
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
    name: "nextTokenIdToClaim",
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
    name: "operatorRestriction",
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
        name: "data",
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
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
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
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadata",
            type: "string",
          },
        ],
        internalType: "struct IClaimCondition.ClaimCondition[]",
        name: "_conditions",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "_resetClaimEligibility",
        type: "bool",
      },
    ],
    name: "setClaimConditions",
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
        internalType: "uint256",
        name: "_maxTotalSupply",
        type: "uint256",
      },
    ],
    name: "setMaxTotalSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_restriction",
        type: "bool",
      },
    ],
    name: "setOperatorRestriction",
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
        name: "_platformFeeRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_platformFeeBps",
        type: "uint256",
      },
    ],
    name: "setPlatformFeeInfo",
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
        internalType: "address",
        name: "_subscription",
        type: "address",
      },
    ],
    name: "subscribeToRegistry",
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
        internalType: "uint256",
        name: "_conditionId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_claimer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_currency",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerWallet",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct IDrop.AllowlistProof",
        name: "_allowlistProof",
        type: "tuple",
      },
    ],
    name: "verifyClaim",
    outputs: [
      {
        internalType: "bool",
        name: "isOverride",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const bytecode =
  "0x60806040523480156200001157600080fd5b50600054610100900460ff1615808015620000335750600054600160ff909116105b8062000063575062000050306200013d60201b62002a241760201c565b15801562000063575060005460ff166001145b620000cb5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b6000805460ff191660011790558015620000ef576000805461ff0019166101001790555b801562000136576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b506200014c565b6001600160a01b03163b151590565b615ea1806200015c6000396000f3fe6080604052600436106103ce5760003560e01c806374bc7db7116101fd578063acd083f811610118578063ce805642116100ab578063d637ed591161007a578063d637ed5914610bb6578063e159163414610be6578063e715032214610c06578063e8a3d48514610c26578063e985e9c514610c3b57600080fd5b8063ce80564214610b2b578063d37c353b14610b4b578063d45573f614610b6b578063d547741f14610b9657600080fd5b8063c68907de116100e7578063c68907de14610ab6578063c87b56dd14610acb578063ca15c87314610aeb578063cb2ef6f714610b0b57600080fd5b8063acd083f8146109c7578063ad1eefc514610a29578063b24f2d3914610a6b578063b88d4fde14610a9657600080fd5b80639fc4d68f11610190578063a22cb4651161015f578063a22cb465146109a7578063a2309ff8146109c7578063a32fa5b3146109dc578063ac9650d8146109fc57600080fd5b80639fc4d68f14610936578063a05112fc14610956578063a0a8e46014610976578063a217fddf1461099257600080fd5b806391d14854116101cc57806391d14854146108c1578063938e3d7b146108e157806395d89b41146109015780639bcf7a151461091657600080fd5b806374bc7db71461085057806384bb1e42146108705780638da5cb5b146108835780639010d07c146108a157600080fd5b806336568abe116102ed578063572b6c051161028057806363b45e2d1161024f57806363b45e2d146107ce5780636f4f2837146107e35780636f8934f41461080357806370a082311461083057600080fd5b8063572b6c051461073557806357fd84551461076e578063600dd5ea1461078e5780636352211e146107ae57600080fd5b806342966c68116102bc57806342966c6814610699578063492e224b146106b95780634cc157df146106d9578063504c6e011461071b57600080fd5b806336568abe146106245780633b1475a7146106445780633f3e4c111461065957806342842e0e1461067957600080fd5b806323a2902b116103655780632a55205a116103345780632a55205a1461058e5780632ab4d052146105cd5780632f2ff15d146105e457806332f0cd641461060457600080fd5b806323a2902b1461050157806323b872dd146105215780632419f51b14610541578063248a9ca31461056157600080fd5b8063095ea7b3116103a1578063095ea7b31461047c57806313af40351461049e57806318160ddd146104be5780631e7ac488146104e157600080fd5b806301ffc9a7146103d357806306fdde0314610408578063079fe40e1461042a578063081812fc1461045c575b600080fd5b3480156103df57600080fd5b506103f36103ee366004614cbf565b610c84565b60405190151581526020015b60405180910390f35b34801561041457600080fd5b5061041d610cb0565b6040516103ff9190614d34565b34801561043657600080fd5b506005546001600160a01b03165b6040516001600160a01b0390911681526020016103ff565b34801561046857600080fd5b50610444610477366004614d47565b610d42565b34801561048857600080fd5b5061049c610497366004614d85565b610d86565b005b3480156104aa57600080fd5b5061049c6104b9366004614db1565b610e60565b3480156104ca57600080fd5b5060dc5460db54035b6040519081526020016103ff565b3480156104ed57600080fd5b5061049c6104fc366004614d85565b610e90565b34801561050d57600080fd5b506103f361051c366004614de0565b610ec2565b34801561052d57600080fd5b5061049c61053c366004614e5d565b611288565b34801561054d57600080fd5b506104d361055c366004614d47565b61136e565b34801561056d57600080fd5b506104d361057c366004614d47565b6000908152600c602052604090205490565b34801561059a57600080fd5b506105ae6105a9366004614e9e565b6113dc565b604080516001600160a01b0390931683526020830191909152016103ff565b3480156105d957600080fd5b506104d361010f5481565b3480156105f057600080fd5b5061049c6105ff366004614ec0565b611419565b34801561061057600080fd5b5061049c61061f366004614efe565b6114af565b34801561063057600080fd5b5061049c61063f366004614ec0565b611520565b34801561065057600080fd5b50600a546104d3565b34801561066557600080fd5b5061049c610674366004614d47565b611582565b34801561068557600080fd5b5061049c610694366004614e5d565b6115cc565b3480156106a557600080fd5b5061049c6106b4366004614d47565b6116a7565b3480156106c557600080fd5b506103f36106d4366004614d47565b6116b2565b3480156106e557600080fd5b506106f96106f4366004614d47565b6116d8565b604080516001600160a01b03909316835261ffff9091166020830152016103ff565b34801561072757600080fd5b5060a8546103f39060ff1681565b34801561074157600080fd5b506103f3610750366004614db1565b6001600160a01b031660009081526044602052604090205460ff1690565b34801561077a57600080fd5b5061049c610789366004614db1565b611743565b34801561079a57600080fd5b5061049c6107a9366004614d85565b6117b3565b3480156107ba57600080fd5b506104446107c9366004614d47565b6117e1565b3480156107da57600080fd5b506008546104d3565b3480156107ef57600080fd5b5061049c6107fe366004614db1565b6117f3565b34801561080f57600080fd5b5061082361081e366004614d47565b611820565b6040516103ff9190614f1b565b34801561083c57600080fd5b506104d361084b366004614db1565b61197d565b34801561085c57600080fd5b5061049c61086b366004614fd3565b6119cb565b61049c61087e3660046150ec565b611d0f565b34801561088f57600080fd5b506006546001600160a01b0316610444565b3480156108ad57600080fd5b506104446108bc366004614e9e565b611e35565b3480156108cd57600080fd5b506103f36108dc366004614ec0565b611f24565b3480156108ed57600080fd5b5061049c6108fc366004615179565b611f4f565b34801561090d57600080fd5b5061041d611f7c565b34801561092257600080fd5b5061049c6109313660046151ad565b611f8b565b34801561094257600080fd5b5061041d610951366004615215565b611fba565b34801561096257600080fd5b5061041d610971366004614d47565b61213b565b34801561098257600080fd5b50604051600481526020016103ff565b34801561099e57600080fd5b506104d3600081565b3480156109b357600080fd5b5061049c6109c2366004615260565b6121d5565b3480156109d357600080fd5b5060db546104d3565b3480156109e857600080fd5b506103f36109f7366004614ec0565b6122a5565b348015610a0857600080fd5b50610a1c610a1736600461528e565b6122fb565b6040516103ff91906152cf565b348015610a3557600080fd5b506104d3610a44366004614ec0565b60009182526011602090815260408084206001600160a01b03909316845291905290205490565b348015610a7757600080fd5b506003546001600160a01b03811690600160a01b900461ffff166106f9565b348015610aa257600080fd5b5061049c610ab1366004615331565b6123ef565b348015610ac257600080fd5b506104d36124d8565b348015610ad757600080fd5b5061041d610ae6366004614d47565b61257b565b348015610af757600080fd5b506104d3610b06366004614d47565b6125ea565b348015610b1757600080fd5b506944726f7045524337323160b01b6104d3565b348015610b3757600080fd5b5061041d610b46366004615215565b612673565b348015610b5757600080fd5b506104d3610b6636600461539c565b612701565b348015610b7757600080fd5b506002546001600160a01b03811690600160a01b900461ffff166106f9565b348015610ba257600080fd5b5061049c610bb1366004614ec0565b612799565b348015610bc257600080fd5b50600e54600f54610bd1919082565b604080519283526020830191909152016103ff565b348015610bf257600080fd5b5061049c610c013660046154a9565b6127b2565b348015610c1257600080fd5b5061041d610c213660046155bb565b6129a2565b348015610c3257600080fd5b5061041d612a17565b348015610c4757600080fd5b506103f3610c56366004615616565b6001600160a01b03918216600090815260e26020908152604080832093909416825291909152205460ff1690565b6000610c8f82612a33565b80610caa575063152a902d60e11b6001600160e01b03198316145b92915050565b606060dd8054610cbf90615644565b80601f0160208091040260200160405190810160405280929190818152602001828054610ceb90615644565b8015610d385780601f10610d0d57610100808354040283529160200191610d38565b820191906000526020600020905b815481529060010190602001808311610d1b57829003601f168201915b5050505050905090565b6000610d4d82612a83565b610d6a576040516333d1c03960e21b815260040160405180910390fd5b50600090815260e160205260409020546001600160a01b031690565b60a854829060ff1615610e51576daaeb6d7670e522a718067333cd4e3b15610e5157604051633185c44d60e21b81523060048201526001600160a01b03821660248201526daaeb6d7670e522a718067333cd4e9063c617113490604401602060405180830381865afa158015610e00573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e249190615679565b610e5157604051633b79c77360e21b81526001600160a01b03821660048201526024015b60405180910390fd5b610e5b8383612aaf565b505050565b610e68612b43565b610e845760405162461bcd60e51b8152600401610e4890615696565b610e8d81612b56565b50565b610e98612b43565b610eb45760405162461bcd60e51b8152600401610e4890615696565b610ebe8282612ba8565b5050565b6000868152601060209081526040808320815161010081018352815481526001820154938101939093526002810154918301919091526003810154606083015260048101546080830152600581015460a083015260068101546001600160a01b031660c08301526007810180548493929160e0840191610f4190615644565b80601f0160208091040260200160405190810160405280929190818152602001828054610f6d90615644565b8015610fba5780601f10610f8f57610100808354040283529160200191610fba565b820191906000526020600020905b815481529060010190602001808311610f9d57829003601f168201915b50505091909252505050606081015160a082015160c0830151608084015193945091929091901561109f5761109b610ff287806156be565b80806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250505060808088015191508d9060208b01359060408c013590611047908d0160608e01614db1565b6040516bffffffffffffffffffffffff19606095861b811660208301526034820194909452605481019290925290921b16607482015260880160405160208183030381529060405280519060200120612c36565b5094505b84156111245760208601356110b457826110ba565b85602001355b9250600019866040013514156110d057816110d6565b85604001355b9150600019866040013514158015611107575060006110fb6080880160608901614db1565b6001600160a01b031614155b6111115780611121565b6111216080870160608801614db1565b90505b60008b81526011602090815260408083206001600160a01b03808f1685529252909120549089811690831614158061115c5750828814155b1561119c5760405162461bcd60e51b815260206004820152601060248201526f2150726963654f7243757272656e637960801b6044820152606401610e48565b8915806111b15750836111af828c61571d565b115b156111e75760405162461bcd60e51b8152600401610e48906020808252600490820152632151747960e01b604082015260600190565b84602001518a86604001516111fc919061571d565b11156112375760405162461bcd60e51b815260206004820152600a602482015269214d6178537570706c7960b01b6044820152606401610e48565b84514210156112795760405162461bcd60e51b815260206004820152600e60248201526d18d85b9d0818db185a5b481e595d60921b6044820152606401610e48565b50505050509695505050505050565b60a854839060ff161561135d576daaeb6d7670e522a718067333cd4e3b1561135d576001600160a01b0381163314156112cb576112c6848484612d04565b611368565b604051633185c44d60e21b81523060048201523360248201526daaeb6d7670e522a718067333cd4e9063c617113490604401602060405180830381865afa15801561131a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061133e9190615679565b61135d57604051633b79c77360e21b8152336004820152602401610e48565b611368848484612d04565b50505050565b600061137960085490565b82106113b75760405162461bcd60e51b815260206004820152600d60248201526c092dcecc2d8d2c840d2dcc8caf609b1b6044820152606401610e48565b600882815481106113ca576113ca615735565b90600052602060002001549050919050565b6000806000806113eb866116d8565b90945084925061ffff169050612710611404828761574b565b61140e9190615780565b925050509250929050565b6000828152600c60205260409020546114329033612d0f565b6000828152600b602090815260408083206001600160a01b038516845290915290205460ff16156114a55760405162461bcd60e51b815260206004820152601d60248201527f43616e206f6e6c79206772616e7420746f206e6f6e20686f6c646572730000006044820152606401610e48565b610ebe8282612d8f565b6114b7612b43565b6115175760405162461bcd60e51b815260206004820152602b60248201527f4e6f7420617574686f72697a656420746f20736574206f70657261746f72207260448201526a32b9ba3934b1ba34b7b71760a91b6064820152608401610e48565b610e8d81612da3565b336001600160a01b038216146115785760405162461bcd60e51b815260206004820152601a60248201527f43616e206f6e6c792072656e6f756e636520666f722073656c660000000000006044820152606401610e48565b610ebe8282612dea565b600061158e8133612d0f565b61010f8290556040518281527ff2672935fc79f5237559e2e2999dbe743bf65430894ac2b37666890e7c69e1af906020015b60405180910390a15050565b60a854839060ff161561169c576daaeb6d7670e522a718067333cd4e3b1561169c576001600160a01b03811633141561160a576112c6848484612e41565b604051633185c44d60e21b81523060048201523360248201526daaeb6d7670e522a718067333cd4e9063c617113490604401602060405180830381865afa158015611659573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061167d9190615679565b61169c57604051633b79c77360e21b8152336004820152602401610e48565b611368848484612e41565b610e8d816001612e5c565b600081815260076020526040812080548291906116ce90615644565b9050119050919050565b6000818152600460209081526040808320815180830190925280546001600160a01b03168083526001909101549282019290925282911561171f5780516020820151611739565b6003546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b61174b612b43565b6117a85760405162461bcd60e51b815260206004820152602860248201527f4e6f7420617574686f72697a656420746f2073756273637269626520746f207260448201526732b3b4b9ba393c9760c11b6064820152608401610e48565b610e8d816001613040565b6117bb612b43565b6117d75760405162461bcd60e51b8152600401610e4890615696565b610ebe828261314e565b60006117ec826131cb565b5192915050565b6117fb612b43565b6118175760405162461bcd60e51b8152600401610e4890615696565b610e8d816132e5565b61187460405180610100016040528060008152602001600081526020016000815260200160008152602001600080191681526020016000815260200160006001600160a01b03168152602001606081525090565b600082815260106020908152604091829020825161010081018452815481526001820154928101929092526002810154928201929092526003820154606082015260048201546080820152600582015460a082015260068201546001600160a01b031660c082015260078201805491929160e0840191906118f490615644565b80601f016020809104026020016040519081016040528092919081815260200182805461192090615644565b801561196d5780601f106119425761010080835404028352916020019161196d565b820191906000526020600020905b81548152906001019060200180831161195057829003601f168201915b5050505050815250509050919050565b60006001600160a01b0382166119a6576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b0316600090815260e060205260409020546001600160401b031690565b6119d3612b43565b6119ef5760405162461bcd60e51b8152600401610e4890615696565b600e54600f54818315611a0957611a06828461571d565b90505b600f859055600e8190556000805b86811015611bbc57801580611a4f5750878782818110611a3957611a39615735565b9050602002810190611a4b9190615794565b3582105b611a805760405162461bcd60e51b815260206004820152600260248201526114d560f21b6044820152606401610e48565b6000601081611a8f848761571d565b8152602001908152602001600020600201549050888883818110611ab557611ab5615735565b9050602002810190611ac79190615794565b60200135811115611b0f5760405162461bcd60e51b81526020600482015260126024820152711b585e081cdd5c1c1b1e4818db185a5b595960721b6044820152606401610e48565b888883818110611b2157611b21615735565b9050602002810190611b339190615794565b60106000611b41858861571d565b81526020019081526020016000208181611b5b91906158ff565b5081905060106000611b6d858861571d565b8152602081019190915260400160002060020155888883818110611b9357611b93615735565b9050602002810190611ba59190615794565b359250819050611bb48161597d565b915050611a17565b508415611c3c57835b82811015611c3657600081815260106020526040812081815560018101829055600281018290556003810182905560048101829055600581018290556006810180546001600160a01b031916905590611c216007830182614bd6565b50508080611c2e9061597d565b915050611bc5565b50611ccb565b85831115611ccb57855b83811015611cc95760106000611c5c838661571d565b81526020810191909152604001600090812081815560018101829055600281018290556003810182905560048101829055600581018290556006810180546001600160a01b031916905590611cb46007830182614bd6565b50508080611cc19061597d565b915050611c46565b505b7fbf4016fceeaaa4ac5cf4be865b559ff85825ab4ca7aa7b661d16e2f544c03098878787604051611cfe93929190615a06565b60405180910390a150505050505050565b611d1d86868686868661332f565b6000611d276124d8565b9050611d3e81611d356133e4565b88888888610ec2565b5060008181526010602052604081206002018054889290611d6090849061571d565b909155505060008181526011602052604081208791611d7d6133e4565b6001600160a01b03166001600160a01b031681526020019081526020016000206000828254611dac919061571d565b90915550611dbf905060008787876133ee565b6000611dcb88886134f6565b9050876001600160a01b0316611ddf6133e4565b6001600160a01b0316837ffa76a4010d9533e3e964f2930a65fb6042a12fa6ff5b08281837a10b0be7321e848b604051611e23929190918252602082015260400190565b60405180910390a45050505050505050565b6000828152600d602052604081205481805b82811015611f1b576000868152600d602090815260408083208484526001019091529020546001600160a01b031615611ec45784821415611eb2576000868152600d602090815260408083209383526001909301905220546001600160a01b03169250610caa915050565b611ebd60018361571d565b9150611f09565b611ecf866000611f24565b8015611ef657506000868152600d6020908152604080832083805260020190915290205481145b15611f0957611f0660018361571d565b91505b611f1460018261571d565b9050611e47565b50505092915050565b6000918252600b602090815260408084206001600160a01b0393909316845291905290205460ff1690565b611f57612b43565b611f735760405162461bcd60e51b8152600401610e4890615696565b610e8d81613503565b606060de8054610cbf90615644565b611f93612b43565b611faf5760405162461bcd60e51b8152600401610e4890615696565b610e5b8383836135d9565b600083815260076020526040812080546060929190611fd890615644565b80601f016020809104026020016040519081016040528092919081815260200182805461200490615644565b80156120515780601f1061202657610100808354040283529160200191612051565b820191906000526020600020905b81548152906001019060200180831161203457829003601f168201915b5050505050905080516000141561209e5760405162461bcd60e51b8152602060048201526011602482015270139bdd1a1a5b99c81d1bc81c995d99585b607a1b6044820152606401610e48565b600080828060200190518101906120b59190615aee565b915091506120c48287876129a2565b935080848787466040516020016120de9493929190615b6e565b60405160208183030381529060405280519060200120146121315760405162461bcd60e51b815260206004820152600d60248201526c496e636f7272656374206b657960981b6044820152606401610e48565b5050509392505050565b6007602052600090815260409020805461215490615644565b80601f016020809104026020016040519081016040528092919081815260200182805461218090615644565b80156121cd5780601f106121a2576101008083540402835291602001916121cd565b820191906000526020600020905b8154815290600101906020018083116121b057829003601f168201915b505050505081565b60a854829060ff161561229b576daaeb6d7670e522a718067333cd4e3b1561229b57604051633185c44d60e21b81523060048201526001600160a01b03821660248201526daaeb6d7670e522a718067333cd4e9063c617113490604401602060405180830381865afa15801561224f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122739190615679565b61229b57604051633b79c77360e21b81526001600160a01b0382166004820152602401610e48565b610e5b8383613680565b6000828152600b6020908152604080832083805290915281205460ff166122f257506000828152600b602090815260408083206001600160a01b038516845290915290205460ff16610caa565b50600192915050565b6060816001600160401b0381111561231557612315615029565b60405190808252806020026020018201604052801561234857816020015b60608152602001906001900390816123335790505b50905060005b828110156123e8576123b83085858481811061236c5761236c615735565b905060200281019061237e91906157b4565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061375392505050565b8282815181106123ca576123ca615735565b602002602001018190525080806123e09061597d565b91505061234e565b5092915050565b60a854849060ff16156124c5576daaeb6d7670e522a718067333cd4e3b156124c5576001600160a01b0381163314156124335761242e85858585613847565b6124d1565b604051633185c44d60e21b81523060048201523360248201526daaeb6d7670e522a718067333cd4e9063c617113490604401602060405180830381865afa158015612482573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124a69190615679565b6124c557604051633b79c77360e21b8152336004820152602401610e48565b6124d185858585613847565b5050505050565b600f54600e5460009182916124ed919061571d565b90505b600e548111156125445760106000612509600184615b97565b81526020019081526020016000206000015442106125325761252c600182615b97565b91505090565b8061253c81615bae565b9150506124f0565b5060405162461bcd60e51b815260206004820152600b60248201526a10a1a7a72224aa24a7a71760a91b6044820152606401610e48565b606060006125888361388b565b509050600061259684613990565b90506125a1826116b2565b156125cf57806040516020016125b79190615bc5565b60405160208183030381529060405292505050919050565b806125d985613af1565b6040516020016125b7929190615bea565b6000818152600d6020526040812054815b8181101561264e576000848152600d602090815260408083208484526001019091529020546001600160a01b03161561263c5761263960018461571d565b92505b61264760018261571d565b90506125fb565b5061265a836000611f24565b1561266d5761266a60018361571d565b91505b50919050565b606061010e546126838133612d0f565b600061268e8661136e565b905061269b818686611fba565b92506126b68160405180602001604052806000815250613bf6565b6126c08184613c15565b857f6df1d8db2a036436ffe0b2d1833f2c5f1e624818dfce2578c0faa4b83ef9998d846040516126f09190614d34565b60405180910390a250509392505050565b600081156127825760008061271884860186615c19565b91509150815160001415801561272d57508015155b1561277f5761277f88600a54612743919061571d565b86868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250613bf692505050565b50505b61278f8686868686613c34565b9695505050505050565b6000828152600c60205260409020546115789033612d0f565b600054610100900460ff16158080156127d25750600054600160ff909116105b806127ec5750303b1580156127ec575060005460ff166001145b61284f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610e48565b6000805460ff191660011790558015612872576000805461ff0019166101001790555b7f8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a66128bd89613d3e565b6128c78c8c613d76565b6128cf613da7565b6128d88a613503565b6128e18d612b56565b6128eb6001612da3565b6128f660008e612d8f565b612900818e612d8f565b61290a828e612d8f565b612915826000612d8f565b61292884866001600160801b0316612ba8565b61293b87876001600160801b031661314e565b612944886132e5565b61010d9190915561010e558015612995576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050505050565b8251604080518083016020019091528181529060005b81811015612a0e5760008585836040516020016129d793929190615c5d565b60408051601f19818403018152919052805160209182012088840182015118858401820152612a0791508261571d565b90506129b8565b50509392505050565b6001805461215490615644565b6001600160a01b03163b151590565b60006001600160e01b031982166380ac58cd60e01b1480612a6457506001600160e01b03198216635b5e139f60e01b145b80610caa57506301ffc9a760e01b6001600160e01b0319831614610caa565b600060db5482108015610caa575050600090815260df6020526040902054600160e01b900460ff161590565b6000612aba826117e1565b9050806001600160a01b0316836001600160a01b03161415612aef5760405163250fdee360e21b815260040160405180910390fd5b806001600160a01b0316612b01613dc8565b6001600160a01b031614612b3857612b1b81610c56613dc8565b612b38576040516367d9dca160e11b815260040160405180910390fd5b610e5b838383613dd2565b6000612b51816108dc613dc8565b905090565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b612710811115612bca5760405162461bcd60e51b8152600401610e4890615c6f565b600280546001600160b01b031916600160a01b61ffff8416026001600160a01b031916176001600160a01b0384169081179091556040518281527fe2497bd806ec41a6e0dd992c29a72efc0ef8fec9092d1978fd4a1e00b2f18304906020015b60405180910390a25050565b6000808281805b8751811015612cf857612c5160028361574b565b91506000888281518110612c6757612c67615735565b60200260200101519050808411612ca9576040805160208101869052908101829052606001604051602081830303815290604052805190602001209350612ce5565b6040805160208101839052908101859052606001604051602081830303815290604052805190602001209350600183612ce2919061571d565b92505b5080612cf08161597d565b915050612c3d565b50941495939450505050565b610e5b838383613e2e565b6000828152600b602090815260408083206001600160a01b038516845290915290205460ff16610ebe57612d4d816001600160a01b03166014614036565b612d58836020614036565b604051602001612d69929190615c98565b60408051601f198184030181529082905262461bcd60e51b8252610e4891600401614d34565b612d9982826141d8565b610ebe8282614233565b60a8805460ff19168215159081179091556040519081527f38475885990d8dfe9ca01f0ef160a1b5514426eab9ddbc953a3353410ba780969060200160405180910390a150565b612df482826142a0565b6000828152600d602090815260408083206001600160a01b03851680855260028201808552838620805487526001909301855292852080546001600160a01b031916905584529152555050565b610e5b838383604051806020016040528060008152506123ef565b6000612e67836131cb565b80519091508215612eef576000816001600160a01b0316612e86613dc8565b6001600160a01b03161480612ea25750612ea282610c56613dc8565b80612ecd5750612eb0613dc8565b6001600160a01b0316612ec286610d42565b6001600160a01b0316145b905080612eed57604051632ce44b5f60e11b815260040160405180910390fd5b505b612efd816000866001614302565b612f0960008583613dd2565b6001600160a01b03808216600081815260e0602090815260408083208054600160801b6000196001600160401b0380841691909101811667ffffffffffffffff198416811783900482166001908101831690930277ffffffffffffffff0000000000000000ffffffffffffffff19909416179290921783558b865260df909452828520805460ff60e01b1942909316600160a01b026001600160e01b03199091169097179690961716600160e01b1785559189018084529220805491949091166130075760db54821461300757805460208701516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038716171781555b5050604051869250600091506001600160a01b03841690600080516020615e4c833981519152908390a4505060dc805460010190555050565b6daaeb6d7670e522a718067333cd4e3b15610ebe576001600160a01b0382163b1561311d5780156130dd57604051633e9f1edf60e11b81523060048201526001600160a01b03831660248201526daaeb6d7670e522a718067333cd4e90637d3e3dbe906044015b600060405180830381600087803b1580156130c157600080fd5b505af11580156130d5573d6000803e3d6000fd5b505050505050565b60405163a0af290360e01b81523060048201526001600160a01b03831660248201526daaeb6d7670e522a718067333cd4e9063a0af2903906044016130a7565b604051632210724360e11b81523060048201526daaeb6d7670e522a718067333cd4e90634420e486906024016130a7565b6127108111156131705760405162461bcd60e51b8152600401610e4890615c6f565b600380546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb90602001612c2a565b60408051606081018252600080825260208201819052918101919091528160db548110156132cc57600081815260df6020908152604091829020825160608101845290546001600160a01b0381168252600160a01b81046001600160401b031692820192909252600160e01b90910460ff161515918101829052906132ca5780516001600160a01b031615613261579392505050565b5060001901600081815260df6020908152604091829020825160608101845290546001600160a01b038116808352600160a01b82046001600160401b031693830193909352600160e01b900460ff16151592810192909252156132c5579392505050565b613261565b505b604051636f96cda160e11b815260040160405180910390fd5b600580546001600160a01b0319166001600160a01b0383169081179091556040517f299d17e95023f496e0ffc4909cff1a61f74bb5eb18de6f900f4155bfa1b3b33390600090a250565b600a548560db54613340919061571d565b11156133785760405162461bcd60e51b815260206004820152600760248201526621546f6b656e7360c81b6044820152606401610e48565b61010f541580613398575061010f548560db54613395919061571d565b11155b6130d55760405162461bcd60e51b815260206004820152601860248201527f657863656564206d617820746f74616c20737570706c792e00000000000000006044820152606401610e48565b6000612b51613dc8565b806133f857611368565b6002546001600160a01b0380821691600160a01b900461ffff16906000908716156134235786613430565b6005546001600160a01b03165b9050600061343e858861574b565b9050600061271061345361ffff86168461574b565b61345d9190615780565b90506001600160a01b03871673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14156134bc578134146134bc5760405162461bcd60e51b815260206004820152600660248201526521507269636560d01b6044820152606401610e48565b6134cf876134c8613dc8565b87846143a0565b6134eb876134db613dc8565b856134e68587615b97565b6143a0565b505050505050505050565b60db54610caa83836143e5565b60006001805461351290615644565b80601f016020809104026020016040519081016040528092919081815260200182805461353e90615644565b801561358b5780601f106135605761010080835404028352916020019161358b565b820191906000526020600020905b81548152906001019060200180831161356e57829003601f168201915b505085519394506135a793600193506020870192509050614c10565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a1681836040516115c0929190615d05565b6127108111156135fb5760405162461bcd60e51b8152600401610e4890615c6f565b6040805180820182526001600160a01b038481168083526020808401868152600089815260048352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910160405180910390a3505050565b613688613dc8565b6001600160a01b0316826001600160a01b031614156136ba5760405163b06307db60e01b815260040160405180910390fd5b8060e260006136c7613dc8565b6001600160a01b03908116825260208083019390935260409182016000908120918716808252919093529120805460ff19169215159290921790915561370b613dc8565b6001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051613747911515815260200190565b60405180910390a35050565b60606001600160a01b0383163b6137bb5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610e48565b600080846001600160a01b0316846040516137d69190615d2a565b600060405180830381855af49150503d8060008114613811576040519150601f19603f3d011682016040523d82523d6000602084013e613816565b606091505b509150915061383e8282604051806060016040528060278152602001615e25602791396143ff565b95945050505050565b613852848484613e2e565b6001600160a01b0383163b156113685761386e84848484614438565b611368576040516368d2bf6b60e11b815260040160405180910390fd5b600080600061389960085490565b9050600060088054806020026020016040519081016040528092919081815260200182805480156138e957602002820191906000526020600020905b8154815260200190600101908083116138d5575b5050505050905060005b828110156139555781818151811061390d5761390d615735565b60200260200101518610156139435780935081818151811061393157613931615735565b60200260200101519450505050915091565b61394e60018261571d565b90506138f3565b5060405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a59081d1bdad95b9259608a1b6044820152606401610e48565b6060600061399d60085490565b9050600060088054806020026020016040519081016040528092919081815260200182805480156139ed57602002820191906000526020600020905b8154815260200190600101908083116139d9575b5050505050905060005b8281101561395557818181518110613a1157613a11615735565b6020026020010151851015613adf5760096000838381518110613a3657613a36615735565b602002602001015181526020019081526020016000208054613a5790615644565b80601f0160208091040260200160405190810160405280929190818152602001828054613a8390615644565b8015613ad05780601f10613aa557610100808354040283529160200191613ad0565b820191906000526020600020905b815481529060010190602001808311613ab357829003601f168201915b50505050509350505050919050565b613aea60018261571d565b90506139f7565b606081613b155750506040805180820190915260018152600360fc1b602082015290565b8160005b8115613b3f5780613b298161597d565b9150613b389050600a83615780565b9150613b19565b6000816001600160401b03811115613b5957613b59615029565b6040519080825280601f01601f191660200182016040528015613b83576020820181803683370190505b5090505b8415613bee57613b98600183615b97565b9150613ba5600a86615d3c565b613bb090603061571d565b60f81b818381518110613bc557613bc5615735565b60200101906001600160f81b031916908160001a905350613be7600a86615780565b9450613b87565b949350505050565b60008281526007602090815260409091208251610e5b92840190614c10565b60008281526009602090815260409091208251610e5b92840190614c10565b6000613c3e614526565b613c5a5760405162461bcd60e51b8152600401610e4890615696565b85613c8f5760405162461bcd60e51b81526020600482015260056024820152640c08185b5d60da1b6044820152606401610e48565b6000600a549050613cd7818888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061453792505050565b600a919091559150807f2a0365091ef1a40953c670dce28177e37520648a6fdc91506bffac0ab045570d6001613d0d8a8461571d565b613d179190615b97565b88888888604051613d2c959493929190615d50565b60405180910390a25095945050505050565b600054610100900460ff16613d655760405162461bcd60e51b8152600401610e4890615d89565b613d6d6145a4565b610e8d816145cb565b600054610100900460ff16613d9d5760405162461bcd60e51b8152600401610e4890615d89565b610ebe828261465a565b613dc6733cc6cdda760b79bafa08df41ecfa224f810dceb660016146b2565b565b6000612b516146bc565b600082815260e1602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6000613e39826131cb565b9050836001600160a01b031681600001516001600160a01b031614613e705760405162a1148160e81b815260040160405180910390fd5b6000846001600160a01b0316613e84613dc8565b6001600160a01b03161480613ea05750613ea085610c56613dc8565b80613ecb5750613eae613dc8565b6001600160a01b0316613ec084610d42565b6001600160a01b0316145b905080613eeb57604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b038416613f1257604051633a954ecd60e21b815260040160405180910390fd5b613f1f8585856001614302565b613f2b60008487613dd2565b6001600160a01b03858116600090815260e060209081526040808320805467ffffffffffffffff198082166001600160401b039283166000190183161790925589861680865283862080549384169383166001908101841694909417905589865260df90945282852080546001600160e01b031916909417600160a01b42909216919091021783558701808452922080549193909116613fff5760db548214613fff57805460208601516001600160401b0316600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b0316600080516020615e4c83398151915260405160405180910390a46124d1565b6060600061404583600261574b565b61405090600261571d565b6001600160401b0381111561406757614067615029565b6040519080825280601f01601f191660200182016040528015614091576020820181803683370190505b509050600360fc1b816000815181106140ac576140ac615735565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106140db576140db615735565b60200101906001600160f81b031916908160001a90535060006140ff84600261574b565b61410a90600161571d565b90505b6001811115614182576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061413e5761413e615735565b1a60f81b82828151811061415457614154615735565b60200101906001600160f81b031916908160001a90535060049490941c9361417b81615bae565b905061410d565b5083156141d15760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610e48565b9392505050565b6000828152600b602090815260408083206001600160a01b0385168085529252808320805460ff1916600117905551339285917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d9190a45050565b6000828152600d6020526040812080549160019190614252838561571d565b90915550506000928352600d6020908152604080852083865260018101835281862080546001600160a01b039096166001600160a01b03199096168617905593855260029093019052912055565b6142aa8282612d0f565b6000828152600b602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b61431061010d546000611f24565b15801561432557506001600160a01b03841615155b801561433957506001600160a01b03831615155b156113685761434b61010d5485611f24565b158015614362575061436061010d5484611f24565b155b156113685760405162461bcd60e51b815260206004820152600e60248201526d215472616e736665722d526f6c6560901b6044820152606401610e48565b806143aa57611368565b6001600160a01b03841673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14156143d9576112c682826146e6565b61136884848484614789565b610ebe8282604051806020016040528060008152506147e2565b6060831561440e5750816141d1565b82511561441e5782518084602001fd5b8160405162461bcd60e51b8152600401610e489190614d34565b6000836001600160a01b031663150b7a02614451613dc8565b8786866040518563ffffffff1660e01b81526004016144739493929190615dd4565b6020604051808303816000875af19250505080156144ae575060408051601f3d908101601f191682019092526144ab91810190615e07565b60015b614509573d8080156144dc576040519150601f19603f3d011682016040523d82523d6000602084013e6144e1565b606091505b508051614501576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050949350505050565b6000612b5161010e546108dc613dc8565b600080614544848661571d565b60088054600181019091557ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3018190556000818152600960209081526040909120855192945084935061459b929091860190614c10565b50935093915050565b600054610100900460ff16613dc65760405162461bcd60e51b8152600401610e4890615d89565b600054610100900460ff166145f25760405162461bcd60e51b8152600401610e4890615d89565b60005b8151811015610ebe5760016044600084848151811061461657614616615735565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff1916911515919091179055806146528161597d565b9150506145f5565b600054610100900460ff166146815760405162461bcd60e51b8152600401610e4890615d89565b81516146949060dd906020850190614c10565b5080516146a89060de906020840190614c10565b50600060db555050565b610ebe8282613040565b3360009081526044602052604081205460ff16156146e1575060131936013560601c90565b503390565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114614733576040519150601f19603f3d011682016040523d82523d6000602084013e614738565b606091505b5050905080610e5b5760405162461bcd60e51b815260206004820152601c60248201527f6e617469766520746f6b656e207472616e73666572206661696c6564000000006044820152606401610e48565b816001600160a01b0316836001600160a01b031614156147a857611368565b6001600160a01b0383163014156147cd576112c66001600160a01b038516838361498e565b6113686001600160a01b0385168484846149f1565b60db546001600160a01b03841661480b57604051622e076360e81b815260040160405180910390fd5b826148295760405163b562e8dd60e01b815260040160405180910390fd5b6148366000858386614302565b6001600160a01b038416600081815260e06020908152604080832080546fffffffffffffffffffffffffffffffff1981166001600160401b038083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b0181169092021790915585845260df90925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b1561494c575b60405182906001600160a01b03881690600090600080516020615e4c833981519152908290a46149156000878480600101955087614438565b614932576040516368d2bf6b60e11b815260040160405180910390fd5b8082106148dc578260db541461494757600080fd5b61497f565b5b6040516001830192906001600160a01b03881690600090600080516020615e4c833981519152908290a480821061494d575b5060db55611368600085838684565b6040516001600160a01b038316602482015260448101829052610e5b90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152614a29565b6040516001600160a01b03808516602483015283166044820152606481018290526113689085906323b872dd60e01b906084016149ba565b6000614a7e826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316614afb9092919063ffffffff16565b805190915015610e5b5780806020019051810190614a9c9190615679565b610e5b5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610e48565b6060613bee8484600085856001600160a01b0385163b614b5d5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610e48565b600080866001600160a01b03168587604051614b799190615d2a565b60006040518083038185875af1925050503d8060008114614bb6576040519150601f19603f3d011682016040523d82523d6000602084013e614bbb565b606091505b5091509150614bcb8282866143ff565b979650505050505050565b508054614be290615644565b6000825580601f10614bf2575050565b601f016020900490600052602060002090810190610e8d9190614c94565b828054614c1c90615644565b90600052602060002090601f016020900481019282614c3e5760008555614c84565b82601f10614c5757805160ff1916838001178555614c84565b82800160010185558215614c84579182015b82811115614c84578251825591602001919060010190614c69565b50614c90929150614c94565b5090565b5b80821115614c905760008155600101614c95565b6001600160e01b031981168114610e8d57600080fd5b600060208284031215614cd157600080fd5b81356141d181614ca9565b60005b83811015614cf7578181015183820152602001614cdf565b838111156113685750506000910152565b60008151808452614d20816020860160208601614cdc565b601f01601f19169290920160200192915050565b6020815260006141d16020830184614d08565b600060208284031215614d5957600080fd5b5035919050565b6001600160a01b0381168114610e8d57600080fd5b8035614d8081614d60565b919050565b60008060408385031215614d9857600080fd5b8235614da381614d60565b946020939093013593505050565b600060208284031215614dc357600080fd5b81356141d181614d60565b60006080828403121561266d57600080fd5b60008060008060008060c08789031215614df957600080fd5b863595506020870135614e0b81614d60565b9450604087013593506060870135614e2281614d60565b92506080870135915060a08701356001600160401b03811115614e4457600080fd5b614e5089828a01614dce565b9150509295509295509295565b600080600060608486031215614e7257600080fd5b8335614e7d81614d60565b92506020840135614e8d81614d60565b929592945050506040919091013590565b60008060408385031215614eb157600080fd5b50508035926020909101359150565b60008060408385031215614ed357600080fd5b823591506020830135614ee581614d60565b809150509250929050565b8015158114610e8d57600080fd5b600060208284031215614f1057600080fd5b81356141d181614ef0565b6020815281516020820152602082015160408201526040820151606082015260608201516080820152608082015160a082015260a082015160c082015260018060a01b0360c08301511660e0820152600060e0830151610100808185015250613bee610120840182614d08565b60008083601f840112614f9a57600080fd5b5081356001600160401b03811115614fb157600080fd5b6020830191508360208260051b8501011115614fcc57600080fd5b9250929050565b600080600060408486031215614fe857600080fd5b83356001600160401b03811115614ffe57600080fd5b61500a86828701614f88565b909450925050602084013561501e81614ef0565b809150509250925092565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171561506757615067615029565b604052919050565b60006001600160401b0382111561508857615088615029565b50601f01601f191660200190565b600082601f8301126150a757600080fd5b81356150ba6150b58261506f565b61503f565b8181528460208386010111156150cf57600080fd5b816020850160208301376000918101602001919091529392505050565b60008060008060008060c0878903121561510557600080fd5b863561511081614d60565b955060208701359450604087013561512781614d60565b93506060870135925060808701356001600160401b038082111561514a57600080fd5b6151568a838b01614dce565b935060a089013591508082111561516c57600080fd5b50614e5089828a01615096565b60006020828403121561518b57600080fd5b81356001600160401b038111156151a157600080fd5b613bee84828501615096565b6000806000606084860312156151c257600080fd5b833592506020840135614e8d81614d60565b60008083601f8401126151e657600080fd5b5081356001600160401b038111156151fd57600080fd5b602083019150836020828501011115614fcc57600080fd5b60008060006040848603121561522a57600080fd5b8335925060208401356001600160401b0381111561524757600080fd5b615253868287016151d4565b9497909650939450505050565b6000806040838503121561527357600080fd5b823561527e81614d60565b91506020830135614ee581614ef0565b600080602083850312156152a157600080fd5b82356001600160401b038111156152b757600080fd5b6152c385828601614f88565b90969095509350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561532457603f19888603018452615312858351614d08565b945092850192908501906001016152f6565b5092979650505050505050565b6000806000806080858703121561534757600080fd5b843561535281614d60565b9350602085013561536281614d60565b92506040850135915060608501356001600160401b0381111561538457600080fd5b61539087828801615096565b91505092959194509250565b6000806000806000606086880312156153b457600080fd5b8535945060208601356001600160401b03808211156153d257600080fd5b6153de89838a016151d4565b909650945060408801359150808211156153f757600080fd5b50615404888289016151d4565b969995985093965092949392505050565b600082601f83011261542657600080fd5b813560206001600160401b0382111561544157615441615029565b8160051b61545082820161503f565b928352848101820192828101908785111561546a57600080fd5b83870192505b84831015614bcb57823561548381614d60565b82529183019190830190615470565b80356001600160801b0381168114614d8057600080fd5b6000806000806000806000806000806101408b8d0312156154c957600080fd5b6154d28b614d75565b995060208b01356001600160401b03808211156154ee57600080fd5b6154fa8e838f01615096565b9a5060408d013591508082111561551057600080fd5b61551c8e838f01615096565b995060608d013591508082111561553257600080fd5b61553e8e838f01615096565b985060808d013591508082111561555457600080fd5b506155618d828e01615415565b96505061557060a08c01614d75565b945061557e60c08c01614d75565b935061558c60e08c01615492565b925061559b6101008c01615492565b91506155aa6101208c01614d75565b90509295989b9194979a5092959850565b6000806000604084860312156155d057600080fd5b83356001600160401b03808211156155e757600080fd5b6155f387838801615096565b9450602086013591508082111561560957600080fd5b50615253868287016151d4565b6000806040838503121561562957600080fd5b823561563481614d60565b91506020830135614ee581614d60565b600181811c9082168061565857607f821691505b6020821081141561266d57634e487b7160e01b600052602260045260246000fd5b60006020828403121561568b57600080fd5b81516141d181614ef0565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b6000808335601e198436030181126156d557600080fd5b8301803591506001600160401b038211156156ef57600080fd5b6020019150600581901b3603821315614fcc57600080fd5b634e487b7160e01b600052601160045260246000fd5b6000821982111561573057615730615707565b500190565b634e487b7160e01b600052603260045260246000fd5b600081600019048311821515161561576557615765615707565b500290565b634e487b7160e01b600052601260045260246000fd5b60008261578f5761578f61576a565b500490565b6000823560fe198336030181126157aa57600080fd5b9190910192915050565b6000808335601e198436030181126157cb57600080fd5b8301803591506001600160401b038211156157e557600080fd5b602001915036819003821315614fcc57600080fd5b601f821115610e5b57600081815260208120601f850160051c810160208610156158215750805b601f850160051c820191505b818110156130d55782815560010161582d565b6001600160401b0383111561585757615857615029565b61586b836158658354615644565b836157fa565b6000601f84116001811461589f57600085156158875750838201355b600019600387901b1c1916600186901b1783556124d1565b600083815260209020601f19861690835b828110156158d057868501358255602094850194600190920191016158b0565b50868210156158ed5760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b813581556020820135600182015560408201356002820155606082013560038201556080820135600482015560a082013560058201556006810160c083013561594781614d60565b81546001600160a01b0319166001600160a01b039190911617905561596f60e08301836157b4565b611368818360078601615840565b600060001982141561599157615991615707565b5060010190565b6000808335601e198436030181126159af57600080fd5b83016020810192503590506001600160401b038111156159ce57600080fd5b803603831315614fcc57600080fd5b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60408082528181018490526000906060808401600587901b850182018885805b8a811015615ad857888403605f190185528235368d900360fe19018112615a4b578283fd5b8c018035855260208082013581870152888201358987015287820135888701526080808301359087015260a080830135908701526101009060c080840135615a9281614d60565b6001600160a01b03169088015260e0615aad84820185615998565b945083828a0152615ac1848a0186836159dd565b998301999850505094909401935050600101615a26565b50505086151560208701529350613bee92505050565b60008060408385031215615b0157600080fd5b82516001600160401b03811115615b1757600080fd5b8301601f81018513615b2857600080fd5b8051615b366150b58261506f565b818152866020838501011115615b4b57600080fd5b615b5c826020830160208601614cdc565b60209590950151949694955050505050565b60008551615b80818460208a01614cdc565b820184868237909301918252506020019392505050565b600082821015615ba957615ba9615707565b500390565b600081615bbd57615bbd615707565b506000190190565b60008251615bd7818460208701614cdc565b600360fc1b920191825250600101919050565b60008351615bfc818460208801614cdc565b835190830190615c10818360208801614cdc565b01949350505050565b60008060408385031215615c2c57600080fd5b82356001600160401b03811115615c4257600080fd5b615c4e85828601615096565b95602094909401359450505050565b82848237909101908152602001919050565b6020808252600f908201526e45786365656473206d61782062707360881b604082015260600190565b7402832b936b4b9b9b4b7b7399d1030b1b1b7bab73a1605d1b815260008351615cc8816015850160208801614cdc565b7001034b99036b4b9b9b4b733903937b6329607d1b6015918401918201528351615cf9816026840160208801614cdc565b01602601949350505050565b604081526000615d186040830185614d08565b828103602084015261383e8185614d08565b600082516157aa818460208701614cdc565b600082615d4b57615d4b61576a565b500690565b858152606060208201526000615d6a6060830186886159dd565b8281036040840152615d7d8185876159dd565b98975050505050505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061278f90830184614d08565b600060208284031215615e1957600080fd5b81516141d181614ca956fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220c58193ab61f222888809ad6d1848b219fd13b4199baa41e04cc2548248dcd5b364736f6c634300080c0033";

export { abi, bytecode };
