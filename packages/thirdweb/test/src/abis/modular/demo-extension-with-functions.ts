export const DEMO_EXTENSION_WITH_FUNCTIONS_ABI = [
  {
    type: "function",
    name: "CALLER_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "callbackFunctionOne",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getExtensionConfig",
    inputs: [],
    outputs: [
      {
        name: "config",
        type: "tuple",
        internalType: "struct IExtensionConfig.ExtensionConfig",
        components: [
          {
            name: "requiredInterfaceId",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "registerInstallationCallback",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "supportedInterfaces",
            type: "bytes4[]",
            internalType: "bytes4[]",
          },
          {
            name: "callbackFunctions",
            type: "tuple[]",
            internalType: "struct IExtensionConfig.CallbackFunction[]",
            components: [
              {
                name: "selector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "callType",
                type: "uint8",
                internalType: "enum IExtensionConfig.CallType",
              },
            ],
          },
          {
            name: "fallbackFunctions",
            type: "tuple[]",
            internalType: "struct IExtensionConfig.FallbackFunction[]",
            components: [
              {
                name: "selector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "callType",
                type: "uint8",
                internalType: "enum IExtensionConfig.CallType",
              },
              {
                name: "permissionBits",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getNumber",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "notPermissioned_call",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "notPermissioned_delegatecall",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "notPermissioned_staticcall",
    inputs: [],
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "onInstall",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onUninstall",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "permissioned_call",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "permissioned_delegatecall",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "permissioned_staticcall",
    inputs: [],
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setNumber",
    inputs: [{ name: "_number", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CallbackFunctionOne",
    inputs: [],
    anonymous: false,
  },
  {
    type: "event",
    name: "FallbackFunctionCalled",
    inputs: [],
    anonymous: false,
  },
] as const;
