export const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; // v0.6
export const ERC6551_REGISTRY = "0x02101dfB77FDE026414827Fdc604ddAF224F0921";
export const MANAGED_ACCOUNT_GAS_BUFFER = 50000;
export const DEFAULT_FACTORY_ADDRESS =
  "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00";

export const ACCOUNT_CORE_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_entrypoint",
        type: "address",
        internalType: "contract IEntryPoint",
      },
      { name: "_factory", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "addDeposit",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "contractURI",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "entryPoint",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IEntryPoint" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      { name: "_target", type: "address", internalType: "address" },
      { name: "_value", type: "uint256", internalType: "uint256" },
      { name: "_calldata", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "executeBatch",
    inputs: [
      { name: "_target", type: "address[]", internalType: "address[]" },
      { name: "_value", type: "uint256[]", internalType: "uint256[]" },
      { name: "_calldata", type: "bytes[]", internalType: "bytes[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "factory",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllActiveSigners",
    inputs: [],
    outputs: [
      {
        name: "signers",
        type: "tuple[]",
        internalType: "struct IAccountPermissions.SignerPermissions[]",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "startTimestamp", type: "uint128", internalType: "uint128" },
          { name: "endTimestamp", type: "uint128", internalType: "uint128" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllAdmins",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllSigners",
    inputs: [],
    outputs: [
      {
        name: "signers",
        type: "tuple[]",
        internalType: "struct IAccountPermissions.SignerPermissions[]",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "startTimestamp", type: "uint128", internalType: "uint128" },
          { name: "endTimestamp", type: "uint128", internalType: "uint128" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMessageHash",
    inputs: [{ name: "_hash", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNonce",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPermissionsForSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IAccountPermissions.SignerPermissions",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "startTimestamp", type: "uint128", internalType: "uint128" },
          { name: "endTimestamp", type: "uint128", internalType: "uint128" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_defaultAdmin", type: "address", internalType: "address" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isActiveSigner",
    inputs: [{ name: "signer", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isAdmin",
    inputs: [{ name: "_account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidSignature",
    inputs: [
      { name: "_hash", type: "bytes32", internalType: "bytes32" },
      { name: "_signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "magicValue", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isValidSigner",
    inputs: [
      { name: "_signer", type: "address", internalType: "address" },
      {
        name: "_userOp",
        type: "tuple",
        internalType: "struct UserOperation",
        components: [
          { name: "sender", type: "address", internalType: "address" },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "initCode", type: "bytes", internalType: "bytes" },
          { name: "callData", type: "bytes", internalType: "bytes" },
          { name: "callGasLimit", type: "uint256", internalType: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "preVerificationGas",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "maxFeePerGas", type: "uint256", internalType: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "paymasterAndData", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "multicall",
    inputs: [{ name: "data", type: "bytes[]", internalType: "bytes[]" }],
    outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC1155BatchReceived",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "uint256[]", internalType: "uint256[]" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC1155Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setContractURI",
    inputs: [{ name: "_uri", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setEntrypointOverride",
    inputs: [
      {
        name: "_entrypointOverride",
        type: "address",
        internalType: "contract IEntryPoint",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPermissionsForSigner",
    inputs: [
      {
        name: "_req",
        type: "tuple",
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "isAdmin", type: "uint8", internalType: "uint8" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "permissionStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "permissionEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "_signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "validateUserOp",
    inputs: [
      {
        name: "userOp",
        type: "tuple",
        internalType: "struct UserOperation",
        components: [
          { name: "sender", type: "address", internalType: "address" },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "initCode", type: "bytes", internalType: "bytes" },
          { name: "callData", type: "bytes", internalType: "bytes" },
          { name: "callGasLimit", type: "uint256", internalType: "uint256" },
          {
            name: "verificationGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "preVerificationGas",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "maxFeePerGas", type: "uint256", internalType: "uint256" },
          {
            name: "maxPriorityFeePerGas",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "paymasterAndData", type: "bytes", internalType: "bytes" },
          { name: "signature", type: "bytes", internalType: "bytes" },
        ],
      },
      { name: "userOpHash", type: "bytes32", internalType: "bytes32" },
      { name: "missingAccountFunds", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "validationData", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifySignerPermissionRequest",
    inputs: [
      {
        name: "req",
        type: "tuple",
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "isAdmin", type: "uint8", internalType: "uint8" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "permissionStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "permissionEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "success", type: "bool", internalType: "bool" },
      { name: "signer", type: "address", internalType: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawDepositTo",
    inputs: [
      {
        name: "withdrawAddress",
        type: "address",
        internalType: "address payable",
      },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AdminUpdated",
    inputs: [
      {
        name: "signer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      { name: "isAdmin", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ContractURIUpdated",
    inputs: [
      {
        name: "prevURI",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "newURI",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      { name: "version", type: "uint8", indexed: false, internalType: "uint8" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SignerPermissionsUpdated",
    inputs: [
      {
        name: "authorizingSigner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "targetSigner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "permissions",
        type: "tuple",
        indexed: false,
        internalType: "struct IAccountPermissions.SignerPermissionRequest",
        components: [
          { name: "signer", type: "address", internalType: "address" },
          { name: "isAdmin", type: "uint8", internalType: "uint8" },
          {
            name: "approvedTargets",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "nativeTokenLimitPerTransaction",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "permissionStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "permissionEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityStartTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "reqValidityEndTimestamp",
            type: "uint128",
            internalType: "uint128",
          },
          { name: "uid", type: "bytes32", internalType: "bytes32" },
        ],
      },
    ],
    anonymous: false,
  },
];
