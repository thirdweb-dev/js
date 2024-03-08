export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6
export const ERC6551_REGISTRY = "0x02101dfB77FDE026414827Fdc604ddAF224F0921";

export const ACCOUNT_CORE_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAdmin",
        type: "bool",
      },
    ],
    name: "AdminUpdated",
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
        name: "authorizingSigner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "targetSigner",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "isAdmin",
            type: "uint8",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "permissionStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "permissionEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        name: "permissions",
        type: "tuple",
      },
    ],
    name: "SignerPermissionsUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "addDeposit",
    outputs: [],
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
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_target",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_value",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_calldata",
        type: "bytes[]",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllActiveSigners",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
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
        ],
        internalType: "struct IAccountPermissions.SignerPermissions[]",
        name: "signers",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAdmins",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSigners",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
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
        ],
        internalType: "struct IAccountPermissions.SignerPermissions[]",
        name: "signers",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "getMessageHash",
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
        name: "signer",
        type: "address",
      },
    ],
    name: "getPermissionsForSigner",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
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
        ],
        internalType: "struct IAccountPermissions.SignerPermissions",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "isActiveSigner",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "isAdmin",
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
        name: "_message",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "isValidSignature",
    outputs: [
      {
        internalType: "bytes4",
        name: "magicValue",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
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
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "isAdmin",
            type: "uint8",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "permissionStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "permissionEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
        ],
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        name: "_req",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes",
      },
    ],
    name: "setPermissionsForSigner",
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
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "signer",
            type: "address",
          },
          {
            internalType: "uint8",
            name: "isAdmin",
            type: "uint8",
          },
          {
            internalType: "address[]",
            name: "approvedTargets",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
          },
          {
            internalType: "uint128",
            name: "permissionStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "permissionEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityStartTimestamp",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "reqValidityEndTimestamp",
            type: "uint128",
          },
          {
            internalType: "bytes32",
            name: "uid",
            type: "bytes32",
          },
        ],
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        name: "req",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "verifySignerPermissionRequest",
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
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawDepositTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
