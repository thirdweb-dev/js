export const marketplaceV3CompilerMetadata = {
  compiler: {
    version: "0.8.12+commit.f00d7308",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      {
                        internalType: "string",
                        name: "name",
                        type: "string",
                      },
                      {
                        internalType: "string",
                        name: "metadataURI",
                        type: "string",
                      },
                      {
                        internalType: "address",
                        name: "implementation",
                        type: "address",
                      },
                    ],
                    internalType: "struct IExtension.ExtensionMetadata",
                    name: "metadata",
                    type: "tuple",
                  },
                  {
                    components: [
                      {
                        internalType: "bytes4",
                        name: "functionSelector",
                        type: "bytes4",
                      },
                      {
                        internalType: "string",
                        name: "functionSignature",
                        type: "string",
                      },
                    ],
                    internalType: "struct IExtension.ExtensionFunction[]",
                    name: "functions",
                    type: "tuple[]",
                  },
                ],
                internalType: "struct IExtension.Extension[]",
                name: "extensions",
                type: "tuple[]",
              },
              {
                internalType: "address",
                name: "royaltyEngineAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "nativeTokenWrapper",
                type: "address",
              },
            ],
            internalType: "struct MarketplaceV3.MarketplaceConstructorParams",
            name: "_marketplaceV3Params",
            type: "tuple",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_size",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_start",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_end",
            type: "uint256",
          },
        ],
        name: "InvalidCodeAtRange",
        type: "error",
      },
      {
        inputs: [],
        name: "WriteError",
        type: "error",
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
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: true,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.Extension",
            name: "extension",
            type: "tuple",
          },
        ],
        name: "ExtensionAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.Extension",
            name: "extension",
            type: "tuple",
          },
        ],
        name: "ExtensionRemoved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: true,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.Extension",
            name: "extension",
            type: "tuple",
          },
        ],
        name: "ExtensionReplaced",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "platformFeeRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "flatFee",
            type: "uint256",
          },
        ],
        name: "FlatPlatformFeeUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.ExtensionMetadata",
            name: "extMetadata",
            type: "tuple",
          },
        ],
        name: "FunctionDisabled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            components: [
              {
                internalType: "bytes4",
                name: "functionSelector",
                type: "bytes4",
              },
              {
                internalType: "string",
                name: "functionSignature",
                type: "string",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.ExtensionFunction",
            name: "extFunction",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            indexed: false,
            internalType: "struct IExtension.ExtensionMetadata",
            name: "extMetadata",
            type: "tuple",
          },
        ],
        name: "FunctionEnabled",
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
            indexed: false,
            internalType: "enum IPlatformFee.PlatformFeeType",
            name: "feeType",
            type: "uint8",
          },
        ],
        name: "PlatformFeeTypeUpdated",
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
            internalType: "address",
            name: "previousAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newAddress",
            type: "address",
          },
        ],
        name: "RoyaltyEngineUpdated",
        type: "event",
      },
      {
        stateMutability: "payable",
        type: "fallback",
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
            internalType: "string",
            name: "_extensionName",
            type: "string",
          },
          {
            internalType: "bytes4",
            name: "_functionSelector",
            type: "bytes4",
          },
        ],
        name: "_disableFunctionInExtension",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            internalType: "struct IExtension.Extension",
            name: "_extension",
            type: "tuple",
          },
        ],
        name: "addExtension",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "defaultExtensions",
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
            internalType: "string",
            name: "_extensionName",
            type: "string",
          },
          {
            internalType: "bytes4",
            name: "_functionSelector",
            type: "bytes4",
          },
        ],
        name: "disableFunctionInExtension",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_extensionName",
            type: "string",
          },
          {
            components: [
              {
                internalType: "bytes4",
                name: "functionSelector",
                type: "bytes4",
              },
              {
                internalType: "string",
                name: "functionSignature",
                type: "string",
              },
            ],
            internalType: "struct IExtension.ExtensionFunction",
            name: "_function",
            type: "tuple",
          },
        ],
        name: "enableFunctionInExtension",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllExtensions",
        outputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            internalType: "struct IExtension.Extension[]",
            name: "allExtensions",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "extensionName",
            type: "string",
          },
        ],
        name: "getExtension",
        outputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            internalType: "struct IExtension.Extension",
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
            internalType: "bytes4",
            name: "_functionSelector",
            type: "bytes4",
          },
        ],
        name: "getImplementationForFunction",
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
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
        ],
        name: "getMetadataForFunction",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            internalType: "struct IExtension.ExtensionMetadata",
            name: "",
            type: "tuple",
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
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "getRoyalty",
        outputs: [
          {
            internalType: "address payable[]",
            name: "recipients",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getRoyaltyEngineAddress",
        outputs: [
          {
            internalType: "address",
            name: "royaltyEngineAddress",
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
            name: "_platformFeeRecipient",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "_platformFeeBps",
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
            name: "_extensionName",
            type: "string",
          },
        ],
        name: "removeExtension",
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
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "metadataURI",
                    type: "string",
                  },
                  {
                    internalType: "address",
                    name: "implementation",
                    type: "address",
                  },
                ],
                internalType: "struct IExtension.ExtensionMetadata",
                name: "metadata",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "functionSelector",
                    type: "bytes4",
                  },
                  {
                    internalType: "string",
                    name: "functionSignature",
                    type: "string",
                  },
                ],
                internalType: "struct IExtension.ExtensionFunction[]",
                name: "functions",
                type: "tuple[]",
              },
            ],
            internalType: "struct IExtension.Extension",
            name: "_extension",
            type: "tuple",
          },
        ],
        name: "replaceExtension",
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
        name: "revokeRole",
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
            name: "_royaltyEngineAddress",
            type: "address",
          },
        ],
        name: "setRoyaltyEngine",
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
        stateMutability: "payable",
        type: "receive",
      },
    ],
    devdoc: {
      author: "thirdweb.com",
      kind: "dev",
      methods: {
        "_disableFunctionInExtension(string,bytes4)": {
          details: "Disables a single function in an Extension.",
        },
        "addExtension(((string,string,address),(bytes4,string)[]))": {
          params: {
            _extension: "The extension to add.",
          },
        },
        "contractType()": {
          details: "Returns the type of the contract.",
        },
        "contractVersion()": {
          details: "Returns the version of the contract.",
        },
        "disableFunctionInExtension(string,bytes4)": {
          params: {
            _extensionName:
              "The name of the extension to which the function of `functionSelector` belongs.",
            _functionSelector: "The function to disable.",
          },
        },
        "enableFunctionInExtension(string,(bytes4,string))": {
          details: "Makes the given function callable on the router.",
          params: {
            _extensionName:
              "The name of the extension to which `extFunction` belongs.",
            _function: "The function to enable.",
          },
        },
        "getAllExtensions()": {
          returns: {
            allExtensions: "An array of all extensions.",
          },
        },
        "getExtension(string)": {
          params: {
            extensionName:
              "The name of the extension to get the metadata and functions for.",
          },
          returns: {
            _0: "extension The extension metadata and functions for a given extension.",
          },
        },
        "getMetadataForFunction(bytes4)": {
          params: {
            functionSelector:
              "The function selector to get the extension metadata for.",
          },
          returns: {
            _0: "metadata The extension metadata for a given function.",
          },
        },
        "getPlatformFeeInfo()": {
          details: "Returns the platform fee recipient and bps.",
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
        "getRoyalty(address,uint256,uint256)": {
          params: {
            tokenAddress: "- The address of the token",
            tokenId: "- The id of the token",
            value:
              "- The value you wish to get the royalty of returns Two arrays of equal length, royalty recipients and the corresponding amount each recipient should get",
          },
        },
        "getRoyaltyEngineAddress()": {
          details: "Returns original or overridden address for RoyaltyEngineV1",
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
        "initialize(address,string,address[],address,uint16)": {
          details: "Initializes the contract, like a constructor.",
        },
        "multicall(bytes[])": {
          details:
            "Receives and executes a batch of function calls on this contract.",
          params: {
            data: "The bytes data that makes up the batch of function calls to execute.",
          },
          returns: {
            results:
              "The bytes data that makes up the result of the batch of function calls executed.",
          },
        },
        "onERC721Received(address,address,uint256,bytes)": {
          details:
            "See {IERC721Receiver-onERC721Received}. Always returns `IERC721Receiver.onERC721Received.selector`.",
        },
        "removeExtension(string)": {
          params: {
            _extensionName: "The name of the extension to remove.",
          },
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
        "replaceExtension(((string,string,address),(bytes4,string)[]))": {
          details:
            "The extension with name `extension.name` is the extension being replaced.",
          params: {
            _extension: "The extension to replace or overwrite.",
          },
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
        "setContractURI(string)": {
          details:
            "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
          params: {
            _uri: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "setPlatformFeeInfo(address,uint256)": {
          details:
            "Caller should be authorized to set platform fee info.                  See {_canSetPlatformFeeInfo}.                  Emits {PlatformFeeInfoUpdated Event}; See {_setupPlatformFeeInfo}.",
          params: {
            _platformFeeBps: "Updated platformFeeBps.",
            _platformFeeRecipient:
              "Address to be set as new platformFeeRecipient.",
          },
        },
        "setRoyaltyEngine(address)": {
          params: {
            _royaltyEngineAddress: "- RoyaltyEngineV1 address",
          },
        },
      },
      stateVariables: {
        EXTENSION_ROLE: {
          details: "Only EXTENSION_ROLE holders can perform upgrades.",
        },
        nativeTokenWrapper: {
          details: "The address of the native token wrapper contract.",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "addExtension(((string,string,address),(bytes4,string)[]))": {
          notice: "Add a new extension to the router.",
        },
        "contractURI()": {
          notice: "Returns the contract metadata URI.",
        },
        "defaultExtensions()": {
          notice:
            "The address where the router's default extension set is stored.",
        },
        "disableFunctionInExtension(string,bytes4)": {
          notice: "Disables a single function in an Extension.",
        },
        "enableFunctionInExtension(string,(bytes4,string))": {
          notice: "Enables a single function in an existing extension.",
        },
        "getAllExtensions()": {
          notice: "Returns all extensions of the Router.",
        },
        "getExtension(string)": {
          notice:
            "Returns the extension metadata and functions for a given extension.",
        },
        "getImplementationForFunction(bytes4)": {
          notice:
            "Returns the implementation contract address for a given function signature.",
        },
        "getMetadataForFunction(bytes4)": {
          notice: "Returns the extension metadata for a given function.",
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
        "getRoyalty(address,uint256,uint256)": {
          notice:
            "Get the royalty for a given token (address, id) and value amount.  Does not cache the bps/amounts.  Caches the spec for a given token address",
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
        "multicall(bytes[])": {
          notice:
            "Receives and executes a batch of function calls on this contract.",
        },
        "removeExtension(string)": {
          notice: "Remove an existing extension from the router.",
        },
        "renounceRole(bytes32,address)": {
          notice: "Revokes role from the account.",
        },
        "replaceExtension(((string,string,address),(bytes4,string)[]))": {
          notice: "Fully replace an existing extension of the router.",
        },
        "revokeRole(bytes32,address)": {
          notice: "Revokes role from an account.",
        },
        "setContractURI(string)": {
          notice:
            "Lets a contract admin set the URI for contract-level metadata.",
        },
        "setPlatformFeeInfo(address,uint256)": {
          notice: "Updates the platform fee recipient and bps.",
        },
        "setRoyaltyEngine(address)": {
          notice: "Set or override RoyaltyEngine address",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/prebuilts/marketplace/entrypoint/MarketplaceV3.sol":
        "MarketplaceV3",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 20,
    },
    remappings: [
      ":@chainlink/=lib/chainlink/",
      ":@ds-test/=lib/ds-test/src/",
      ":@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",
      ":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
      ":@std/=lib/forge-std/src/",
      ":@thirdweb-dev/dynamic-contracts/=lib/dynamic-contracts/",
      ":ERC721A-Upgradeable/=lib/ERC721A-Upgradeable/contracts/",
      ":ERC721A/=lib/ERC721A/contracts/",
      ":chainlink/=lib/chainlink/",
      ":contracts/=contracts/",
      ":ds-test/=lib/ds-test/src/",
      ":dynamic-contracts/=lib/dynamic-contracts/src/",
      ":erc4626-tests/=lib/chainlink/contracts/foundry-lib/openzeppelin-contracts/lib/erc4626-tests/",
      ":erc721a-upgradeable/=lib/ERC721A-Upgradeable/",
      ":erc721a/=lib/ERC721A/",
      ":forge-std/=lib/forge-std/src/",
      ":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/",
      ":openzeppelin-contracts/=lib/openzeppelin-contracts/",
      ":sstore2/=lib/dynamic-contracts/lib/sstore2/contracts/",
    ],
  },
  sources: {
    "contracts/eip/ERC165.sol": {
      keccak256:
        "0x0ea604ea6ebe99809a2f620009c8dead82d7fb17ab12b734e1e29c8ceb85938b",
      license: "MIT",
      urls: [
        "bzz-raw://d9d109154c913e34d107db2cec5608dd8a55075dee35ae77aa78ebb9ff7d856c",
        "dweb:/ipfs/QmW8QKw4kag1Bv68FjSZiGvPP8WDocjdhLSd3ssUXZ5Kgr",
      ],
    },
    "contracts/eip/interface/IERC165.sol": {
      keccak256:
        "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
      license: "MIT",
      urls: [
        "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
        "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
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
    "contracts/extension/Multicall.sol": {
      keccak256:
        "0x737a71c74307fa360863550d64bbaef599bbcb47829b19c3743ed1ff22b9af55",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://7e82a79ee183dffa3ec01faac0907e04d72a185e55b7c24bff8e8e952b05f4c2",
        "dweb:/ipfs/QmQ9neZqpcgJtGgm84FBzMqFntZ1Sk1KFTWhjCMq8vnKDg",
      ],
    },
    "contracts/extension/interface/IContractMetadata.sol": {
      keccak256:
        "0x41d3f7f43c124e9ff0247cb94f4e8fc8c5a79b1de331c67eb03654154248d7f2",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://fa8d6251cf3a876193cc719b456c02ff23d3f2d5486431e9bdaf290be9a4ce9a",
        "dweb:/ipfs/QmRwnA2q15Vdkc66fz6BAinZM3tjuVNHn5CeGzc7ZFMAzr",
      ],
    },
    "contracts/extension/interface/IERC2771Context.sol": {
      keccak256:
        "0x47c68c2b49d42008eb5fe42cf7cde539c380c37fc58927ca65711f846da28ca1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e8a91fd4dd913f5d26dd9594c8159324efe2a3530e92d8d27753e61db5b1dc41",
        "dweb:/ipfs/QmZUgkaF894U6EK1wnNiLnGmEa7fJoVkhagAiAkxwRdAnp",
      ],
    },
    "contracts/extension/interface/IMulticall.sol": {
      keccak256:
        "0xe2bbd37b8fdb9cc8b933e598512a068ebb214b3f5abc2bc634916def55be4ef3",
      license: "MIT",
      urls: [
        "bzz-raw://012352099c262348ac755a53b082af520babc6c66dc5f1251fc23609728340ca",
        "dweb:/ipfs/QmcXEgzQ53jdJX5ZNy8zivvUjDq7J8WTnR1yAiwTpkQ2ar",
      ],
    },
    "contracts/extension/interface/IPermissions.sol": {
      keccak256:
        "0xc0cd1f87bac474a06f85e2b341b9b57662aee957fc24180d42c872481c2f2ae3",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://7dec3eed451d63867531d693f0be3279fa2c9aef3130f0826c3520c06820fa5d",
        "dweb:/ipfs/QmTYANrcPdd9SCe99DWsKJ19evNRQKQGZeoS1Keew4M2cS",
      ],
    },
    "contracts/extension/interface/IPermissionsEnumerable.sol": {
      keccak256:
        "0x2e742c18a4481bad41d56424cd16c52def2fb415f69e5fb5f67d8d979300ff95",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://d9be33bb865e3e82aca540a3e38cbc2bf2e431f9d1bf39c50d6c757e7b7bf3ee",
        "dweb:/ipfs/Qmdad1Xqj5SQ44Bk4bwD2uA36XnGHtqnVYSomKZQvnUBVG",
      ],
    },
    "contracts/extension/interface/IPlatformFee.sol": {
      keccak256:
        "0x8c23c2a223a3b94ccce125b418e5fabfb631695d927e336512bc8dca61bbc736",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://86dd8c93e75cb3a44d64c873154ee3857b604d1b07a9e52c120870172c2e9a34",
        "dweb:/ipfs/QmWXxEi7ygoRjN8yWYfVGbfhuwVg8bkLoHNzr3xMNa1VRv",
      ],
    },
    "contracts/extension/interface/IRoyaltyEngineV1.sol": {
      keccak256:
        "0xd234744fda99e69a40bcd0771a236d001a178b69c0db8ec7e9ddcf4610304568",
      license: "MIT",
      urls: [
        "bzz-raw://7ab39c118f97caccab6bc70f36a4e85d636dc7b74cf5e57515e73eab52e453b4",
        "dweb:/ipfs/QmQvkmJvnBiUCvPW3fPKnmWwHxLv3YSGKXB6gdtRewN1XN",
      ],
    },
    "contracts/extension/interface/IRoyaltyPayments.sol": {
      keccak256:
        "0x6f3c51588207ca1303cddc9a5c736885d6f4edeabaebffcfaffd763d92333286",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1203d110653ebc01fce2ed2e67f3305c3289c50ba465cef0c8c3a1c5fb531692",
        "dweb:/ipfs/QmRJPkK3srdaapKFVqmj1XxWY97QtUhQ87tJnYFaM29UQK",
      ],
    },
    "contracts/extension/upgradeable/ContractMetadata.sol": {
      keccak256:
        "0xe42f63bdf826446047de0825bc930d8a157cf613cf35b74cd10ade9246ed5907",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://a907ddcadb07f70600753b37b129d7be234f44cd557aaa0a5833b0a796a2a826",
        "dweb:/ipfs/QmdhJ3Y4N6nnQDgLCPVmyRU26sgJfkLxUnqgSt911Eqmms",
      ],
    },
    "contracts/extension/upgradeable/ERC2771ContextUpgradeable.sol": {
      keccak256:
        "0x9000e8ba1978a32b8ffac366f2128806ee89247ed250992c13c1467be9aad2cf",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://e27c3bb411bfd82501a3df7e35aada7dce0583df796ae086aaba38e6b2a5e455",
        "dweb:/ipfs/QmPcv2ccTn1DiQPRdYb6V6SwDiRxVZRYZkrvswYeq8L9sq",
      ],
    },
    "contracts/extension/upgradeable/Initializable.sol": {
      keccak256:
        "0x86a70269e008e05d0ad9deb6f8b3ae64c6502d66d35aabc4a71968c27f2e5541",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://e5d4ee97df8a7d0675e1d07ab394f27a20d45e7bae5d60a440697671f1ab1994",
        "dweb:/ipfs/Qmbpj95U5M3mJVVUno7ne6CgggDv1dRYte8WXe33fztZ7b",
      ],
    },
    "contracts/extension/upgradeable/Permissions.sol": {
      keccak256:
        "0x1ced1057ad0c07677db95c9ea291a8748c5cf14f1cce39423d28fab4413fb7fd",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://aeae206f911e13618737544b287d077f870d60c8d40f599aad20c5ffa5730c6e",
        "dweb:/ipfs/QmQ3yy9o7iWAfLrpEDMMB6uA6cw9HJxKCPGjxaEVG4AQrs",
      ],
    },
    "contracts/extension/upgradeable/PermissionsEnumerable.sol": {
      keccak256:
        "0xd69a09eb5078dc85e9fb3e59f578c267e7694f2bc9f995461225b596af93b07f",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://08fa417baf97ef109876f76a0040e28d9c7b9edafb52189352642790f10a335c",
        "dweb:/ipfs/QmZDMmbLDuG48VUZLvAZnkUuNexyZ3ys1hoqFGn7hvtNyc",
      ],
    },
    "contracts/extension/upgradeable/PlatformFee.sol": {
      keccak256:
        "0x737a1f5b8225ccdc3a14b76121c3fc35779f44a1c19bcadeb2019f338847ba36",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://ab4b5596b075af3d590efeed4686a940a0817844701c82bfa29ddd9c278abb61",
        "dweb:/ipfs/QmWeqM8Y1MB3gRZMKSCXtzkj5HqzVnezZ7zcMaG5scKpA5",
      ],
    },
    "contracts/extension/upgradeable/ReentrancyGuard.sol": {
      keccak256:
        "0x736596906d22abd0e2d0443298dd1b6d1a002a77329f25b55f3dd3a14a183728",
      license: "MIT",
      urls: [
        "bzz-raw://a0efbbf4ffca8ec9b9669f1cbee3960dada7da091c52b5b083e76358a5ee5b6b",
        "dweb:/ipfs/QmaXkMvCeZBQtaG1tpjs9mBQVxKiJSUGEZ6v36iWetvRAR",
      ],
    },
    "contracts/extension/upgradeable/RoyaltyPayments.sol": {
      keccak256:
        "0xaebf5455f6ebb43c84cba5992f9237bfa8df3eab2eda3d77aba6acded7d7064d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://a38ec7d3de90fd36f987e0520b22ac3d06b5911d60bddfad2f7ddace1301fead",
        "dweb:/ipfs/Qme97y9UFKrMT1NZM18mgY2gJHayqbUo7BFjCd7FoyhNhx",
      ],
    },
    "contracts/extension/upgradeable/init/ReentrancyGuardInit.sol": {
      keccak256:
        "0x6dd2cca2447ee1966d61cedad7cf6638939a1bb213a7830d37ee347cd6a2e6db",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://5d88a36446cf1f81abb1a5c2bdb1ebcbed7098b9e9c0bf6204489efffd25000a",
        "dweb:/ipfs/QmQip2CfUUbin1DiEURb6K2FLabiDWBkMg1sZL5XjJwLaj",
      ],
    },
    "contracts/lib/TWAddress.sol": {
      keccak256:
        "0x460f032cf3bf43d586e126ab2ec8be4335767f497ccb699741546a1cfba94a7e",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://28fcbf6dde6c2eeb9864f6ec6f21dcc81ec426877debf4b912f2f3bc5b0fc91e",
        "dweb:/ipfs/QmS1SHrZDfefX8EE7DdvszTY6VPCHydf4HM7NKJ2gP72e6",
      ],
    },
    "contracts/lib/TWStrings.sol": {
      keccak256:
        "0xef7e9954d888f99baffc10db1d9bf6a2beb66c842d81dea90352ddded22cbbf8",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://832415134684f5413f9d0f3f5536aa30848690cfe54769f7730a3807438f3bf9",
        "dweb:/ipfs/QmduTiUdtsnyJVMXpdomohEWDVg46aZhnS9uTURu4x1NYt",
      ],
    },
    "contracts/prebuilts/marketplace/entrypoint/MarketplaceV3.sol": {
      keccak256:
        "0xd5c8a4516bb3ee4e02f6b7635d486e87797334c8fc4a3b2b7d7599bb1098bca9",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://09e5a21a2d0859807749886e9d2631faa66a4d236eb7dce9e392a4e40cc7d82e",
        "dweb:/ipfs/QmdKNjWZ5k9GVHCdDZYqHeZVHBKPLKEbfFmJUYSfuWjvwL",
      ],
    },
    "lib/dynamic-contracts/src/core/Router.sol": {
      keccak256:
        "0x0b8e78a723ff6c6e966cc69ec9f61cec3667819a558b71069739b156098a0fd9",
      license: "MIT",
      urls: [
        "bzz-raw://dcb544b837505f52feb13fab8d0d3bf7544ed217d7c8f418d8a40f9b49c16b94",
        "dweb:/ipfs/Qma6uuc5kMcTxPW7LpNi1wXMtyVrnQ5iEZjiJ5RMFRGYrj",
      ],
    },
    "lib/dynamic-contracts/src/interface/IExtension.sol": {
      keccak256:
        "0x22181c67dd7ec821697d7dfabe778d9ae85dc784aabcbc85e2dd8cc97789939e",
      license: "MIT",
      urls: [
        "bzz-raw://0802dbefa09c672978b95115083da519484bce42c9a7d0ebe756606a7f08ac7b",
        "dweb:/ipfs/QmRsyrkkmR7dTyhY8cF3M389V5eip24Y5gN3X8ok4W8z8M",
      ],
    },
    "lib/dynamic-contracts/src/interface/IExtensionManager.sol": {
      keccak256:
        "0xa728f4254f5feeb38d91f5d5b4d3d88d0d129b9cc66c2abd0a02a54fb790bd29",
      license: "MIT",
      urls: [
        "bzz-raw://78a28da28ae60859d5d9e88bab7bccdb46d0ae7bcc170b0741de8aae7024d2f5",
        "dweb:/ipfs/QmbUDiD3WQzm5x54HW1YqyEp5fLMt1UAdf8wHrcqDoKHiZ",
      ],
    },
    "lib/dynamic-contracts/src/interface/IRouter.sol": {
      keccak256:
        "0xda007810e0416a45e3e6bbaa6c9977029e4e7cccb0c45e324b2dfbda900ee0bf",
      license: "MIT",
      urls: [
        "bzz-raw://d2c7a80cad255c4f6928391272209d724a9d044801bca1b873bbf998363e0c55",
        "dweb:/ipfs/Qme9cCYBPw28uLq3N688jAS6jAV8yVhhBCXNgxMQeHeDxJ",
      ],
    },
    "lib/dynamic-contracts/src/interface/IRouterState.sol": {
      keccak256:
        "0x675677235369c260e7b867d14e33fda5806320803061ea90d1e0441be5cc3d04",
      license: "MIT",
      urls: [
        "bzz-raw://ad3a3a31d042d10d9a5860fdac76a78ac3538d2fc59ae96551b24f28490026e9",
        "dweb:/ipfs/QmTGSS1HR3yLUSQJfGF5tZYCzvpz1HweZWWm3NNVuv4x7M",
      ],
    },
    "lib/dynamic-contracts/src/interface/IRouterStateGetters.sol": {
      keccak256:
        "0x4d1d6f562583d102a2cbc4c86500aea7e7c2c07e022ceb42c01f10b6144d28a1",
      license: "MIT",
      urls: [
        "bzz-raw://c5a3ebb605ba72213781ce143ea39517a2bcafe81516cfeeaa3c383f8cba8099",
        "dweb:/ipfs/QmSFTMTHVGVN6u6wn7iDFKjf8afpK3tPgMXEFyQRmo3R5o",
      ],
    },
    "lib/dynamic-contracts/src/lib/BaseRouterStorage.sol": {
      keccak256:
        "0x08a812f419f3b33e7c9f5e15667f9e7a0586e9282353cbb09068689a003dbbc4",
      license: "MIT",
      urls: [
        "bzz-raw://b5709a425a0c07f833e416bf6c96184cabf3f414d275f0f76105bca38ace84fd",
        "dweb:/ipfs/QmahKaYfWwefaPcJZzmy1BLkCcqiNPg6dpMrFRhb2UoqRB",
      ],
    },
    "lib/dynamic-contracts/src/lib/ExtensionManagerStorage.sol": {
      keccak256:
        "0x9680ed59ae74b26255d88691a48486baa539410deb045127ee7f40c9b23a8abb",
      license: "MIT",
      urls: [
        "bzz-raw://5a23b0f5b4e263b62bb8755fb033d2eca374022cf2cadc496516086106cf76b3",
        "dweb:/ipfs/QmRYNz6GcqnMkxYo62ZSmThNKNatgDFU1vMkT2aAP7iuCa",
      ],
    },
    "lib/dynamic-contracts/src/lib/StringSet.sol": {
      keccak256:
        "0x3cfe09c207edb70d6aec054f80ba6559a01bb17f95796765b9a98cc59e7ffafc",
      license: "MIT",
      urls: [
        "bzz-raw://43383086cbc953cb6fbd18e677f13e72c83081c095611c0608d7a66f55071ff3",
        "dweb:/ipfs/QmfMxmNAhPZZgsopXDXJ5PviMpcahsvYoiN3GEkLnaXiDf",
      ],
    },
    "lib/dynamic-contracts/src/presets/BaseRouter.sol": {
      keccak256:
        "0x95ea34cf3972fbcb981ad98aca3c31c18f62daa48dfd744574883f2030008fa9",
      license: "MIT",
      urls: [
        "bzz-raw://338a4f606afcc1b085def5ec58af412f985495592af7a1449b9e4c2e17cc36cb",
        "dweb:/ipfs/QmXpCuZDHE5WnSuoipDiDZVycwPE917ZsLB15zDxhtJdtC",
      ],
    },
    "lib/dynamic-contracts/src/presets/ExtensionManager.sol": {
      keccak256:
        "0x87f5cf4c680c83d6da817bb00f9adc4aaf0f479ca06622459789a91b9668ee18",
      license: "MIT",
      urls: [
        "bzz-raw://25a785d81a053b0f1b0e6235487f7102c7ecd7d4eeaee4a75b2f7afa2261b7a7",
        "dweb:/ipfs/QmSD8RMbwE7T8ghFLrF5WPwsMgfxJHz7bTUwrknovLKc3w",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol": {
      keccak256:
        "0xeb373f1fdc7b755c6a750123a9b9e3a8a02c1470042fd6505d875000a80bde0b",
      license: "MIT",
      urls: [
        "bzz-raw://0e28648f994abf1d6bc345644a361cc0b7efa544f8bc0c8ec26011fed85a91ec",
        "dweb:/ipfs/QmVVE7AiRjKaQYYji7TkjmTeVzGpNmms5eoxqTCfvvpj6D",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol":
      {
        keccak256:
          "0x2e024ca51ce5abe16c0d34e6992a1104f356e2244eb4ccbec970435e8b3405e3",
        license: "MIT",
        urls: [
          "bzz-raw://a74009db3c6fc8db851ba69ddb6795b5c1ef1120c5a00fd1a8dc3a717dd9d519",
          "dweb:/ipfs/QmZMk8Yh2X3gPS51ckUVLEXjZUhMSEeGApnA53WtjvLb9h",
        ],
      },
    "lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Receiver.sol":
      {
        keccak256:
          "0x3dd5e1a66a56f30302108a1da97d677a42b1daa60e503696b2bcbbf3e4c95bcb",
        license: "MIT",
        urls: [
          "bzz-raw://0808de0ae4918c664643c885ca7fa6503e8ef2bd75609dfc85152c0128a3422d",
          "dweb:/ipfs/QmNrhFC1XgBKuuxfahFeiwi1MCdu3FLNpHj2uStgmf4iJj",
        ],
      },
    "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol": {
      keccak256:
        "0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da",
      license: "MIT",
      urls: [
        "bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708",
        "dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol":
      {
        keccak256:
          "0x0108bf6a6ebd5f96678bed33a35947537263f96766131ee91461fb6485805028",
        license: "MIT",
        urls: [
          "bzz-raw://ae2d274bf3d56a6d49a9bbd0a4871c54997a82551eb3eb1c0c39dc98698ff8bf",
          "dweb:/ipfs/QmTT7ty5DPGAmRnx94Xu3TUDYGSPDVLN2bppJAjjedrg1e",
        ],
      },
    "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol": {
      keccak256:
        "0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b",
      license: "MIT",
      urls: [
        "bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d",
        "dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43",
      ],
    },
    "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol": {
      keccak256:
        "0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1",
      license: "MIT",
      urls: [
        "bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f",
        "dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy",
      ],
    },
    "lib/sstore2/contracts/SSTORE2.sol": {
      keccak256:
        "0x79e6f5c7bb6b22d142ad0ec37e00930cdbef28ab405214f7c0f94cbd58255383",
      license: "MIT",
      urls: [
        "bzz-raw://fc67d6b9ff44cd2dc7ac3b1430a8a15c3eb1b00be941b8deac20eb42077917a8",
        "dweb:/ipfs/QmVwJ65VVakiNeS2VyRFKQueL1cibfwjmLeQpgLi9BWZ1K",
      ],
    },
    "lib/sstore2/contracts/utils/Bytecode.sol": {
      keccak256:
        "0x40ef4ee5697507566574eda36358a76b523b3dfe7cb65da1630004fe6c5a7a45",
      license: "MIT",
      urls: [
        "bzz-raw://95059c34a2fe249bede85fb523ff53eddf61e45fe76436201237f2eae73bc14c",
        "dweb:/ipfs/QmT6qbZsBzUS6Mpc9yAmhourUFC8TNpaF6vzxysyAKEcpN",
      ],
    },
  },
  version: 1,
};

export const marketplaceV3Bytecode =
  "0x60e06040523480156200001157600080fd5b506040516200673938038062006739833981016040819052620000349162000992565b602081015181518051600090156200008b576200005182620001a4565b620000888260405160200162000068919062000c06565b6040516020818303038152906040526200025960201b6200198b1760201c565b90505b6001600160a01b039081166080528216159050806200011757506040516301ffc9a760e01b8152636591fc0b60e11b60048201526001600160a01b038216906301ffc9a790602401602060405180830381865afa158015620000f1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000117919062000d29565b6200017c5760405162461bcd60e51b815260206004820152602a60248201527f446f65736e277420737570706f72742049526f79616c7479456e67696e65563160448201526920696e7465726661636560b01b60648201526084015b60405180910390fd5b6001600160a01b0390811660a05260408201511660c0526200019d620002ce565b5062000e63565b8051600160005b828110156200020457620001e1848281518110620001cd57620001cd62000d54565b6020026020010151620003b560201b60201c565b915081620001ef5762000204565b620001fc60018262000d80565b9050620001ab565b5080620002545760405162461bcd60e51b815260206004820152601e60248201527f42617365526f757465723a20696e76616c696420657874656e73696f6e2e0000604482015260640162000173565b505050565b600080620002938360405160200162000273919062000d9b565b6040516020818303038152906040526200064860201b620019ea1760201c565b90508051602082016000f091506001600160a01b038216620002c85760405163046a55db60e11b815260040160405180910390fd5b50919050565b6000620002da62000676565b5460ff1690506000620002ec62000676565b54610100900460ff1690508015620003575760405162461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b606482015260840162000173565b60ff8281161015620003b15760ff6200036f62000676565b805460ff191660ff9283161790556040519081527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b80515151600090158015906200040b5750620003db6200069260201b62001a161760201c565b600101826000015160000151604051620003f6919062000dc3565b9081526040519081900360200190205460ff16155b80156200042557508151604001516001600160a01b031615155b905060016200043e6200069260201b62001a161760201c565b60010183600001516000015160405162000459919062000dc3565b908152604051908190036020019020805491151560ff19909216919091179055806200048757506000919050565b60208201515160005b81811015620006415782620004a55762000641565b600084602001518281518110620004c057620004c062000d54565b602090810291909101015180519091506000906001600160e01b0319166200055d57604051602001620005109060208082526009908201526872656365697665282960b81b604082015260600190565b6040516020818303038152906040528051906020012082602001516040516020016200053d919062000de1565b6040516020818303038152906040528051906020012014159050620005a6565b60208083015160405162000572920162000dc3565b604051602081830303815290604052805190602001206001600160e01b03191682600001516001600160e01b031916141590505b80158015620005e65750620005c56200069260201b62001a161760201c565b82516001600160e01b0319166000908152602091909152604090205460ff16155b94506001620005ff6200069260201b62001a161760201c565b92516001600160e01b03191660009081526020939093526040909220805460ff191692151592909217909155506200063960018262000d80565b905062000490565b5050919050565b60608151826040516020016200066092919062000df6565b6040516020818303038152906040529050919050565b60006200068d620006f360201b62001a741760201c565b905090565b600080620006c260017f11c19c8d567686e9e4073585fe511ac02fcfc0ce76ceba4592185bf5bec3cd1f62000e49565b604051602001620006d591815260200190565b60408051601f19818403018152919052805160209091012092915050565b7f322cf19c484104d3b1a9c2982ebae869ede3fa5f6c4703ca41b9a48c76ee030090565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b038111828210171562000752576200075262000717565b60405290565b604051606081016001600160401b038111828210171562000752576200075262000717565b604051601f8201601f191681016001600160401b0381118282101715620007a857620007a862000717565b604052919050565b60006001600160401b03821115620007cc57620007cc62000717565b5060051b60200190565b60005b83811015620007f3578181015183820152602001620007d9565b8381111562000803576000848401525b50505050565b600082601f8301126200081b57600080fd5b81516001600160401b0381111562000837576200083762000717565b6200084c601f8201601f19166020016200077d565b8181528460208386010111156200086257600080fd5b62000875826020830160208701620007d6565b949350505050565b80516001600160a01b03811681146200089557600080fd5b919050565b600082601f830112620008ac57600080fd5b81516020620008c5620008bf83620007b0565b6200077d565b82815260059290921b84018101918181019086841115620008e557600080fd5b8286015b84811015620009875780516001600160401b03808211156200090b5760008081fd5b908801906040828b03601f1901811315620009265760008081fd5b620009306200072d565b838801516001600160e01b0319811681146200094c5760008081fd5b8152908301519082821115620009625760008081fd5b620009728c898487010162000809565b818901528652505050918301918301620008e9565b509695505050505050565b600060208284031215620009a557600080fd5b81516001600160401b03811115620009bc57600080fd5b606081840185031215620009cf57600080fd5b620009d962000758565b838201516001600160401b03811115620009f257600080fd5b85601f8285880101011262000a0657600080fd5b80838601015162000a1b620008bf82620007b0565b808282526020820191508860208460051b86898c01010101111562000a3f57600080fd5b602084878a0101015b60208460051b86898c0101010181101562000b9f5780516001600160401b0381111562000a7457600080fd5b8988018601016040818c03601f1901121562000a8f57600080fd5b62000a996200072d565b60208201516001600160401b0381111562000ab357600080fd5b60608382018e03601f1901121562000aca57600080fd5b62000ad462000758565b838201602001516001600160401b0381111562000af057600080fd5b62000b038f602083868901010162000809565b825250838201604001516001600160401b0381111562000b2257600080fd5b62000b358f602083868901010162000809565b60208301525062000b4b6060838601016200087d565b60408281019190915290835283015190506001600160401b0381111562000b7157600080fd5b62000b828d6020838601016200089a565b602083015250808552505060208301925060208101905062000a48565b5084525062000bb69150508483016020016200087d565b602082015262000bcb6040838601016200087d565b6040820152949350505050565b6000815180845262000bf2816020860160208601620007d6565b601f01601f19169290920160200192915050565b60006020808301818452808551808352604092508286019150828160051b8701018488016000805b8481101562000d1a57603f19808b86030187528351805189875280516060808c8a015262000c6060a08a018362000bd8565b91508c830151858a840301828b015262000c7b838262000bd8565b938d01516001600160a01b031660808b0152505050908a01518682038b88015280518083529192508a01908a830190600581901b84018c01865b8281101562000d0257858203601f19018452845180516001600160e01b03191683528e01518e83018e905262000cee8e84018262000bd8565b958f0195948f019492505060010162000cb5565b50998c01999750505093890193505060010162000c2e565b50919998505050505050505050565b60006020828403121562000d3c57600080fd5b8151801515811462000d4d57600080fd5b9392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000821982111562000d965762000d9662000d6a565b500190565b600081526000825162000db6816001850160208701620007d6565b9190910160010192915050565b6000825162000dd7818460208701620007d6565b9190910192915050565b60208152600062000d4d602083018462000bd8565b606360f81b815260e083901b6001600160e01b03191660018201526880600e6000396000f360b81b6005820152815160009062000e3b81600e850160208701620007d6565b91909101600e019392505050565b60008282101562000e5e5762000e5e62000d6a565b500390565b60805160a05160c05161589862000ea160003960006101c301526000610eb20152600081816103bf0152818161276e01526127a301526158986000f3fe6080604052600436106101b35760003560e01c8063a0dbaefd116100e8578063a0dbaefd1461050c578063a217fddf14610539578063a32fa5b31461054e578063aaae56331461056e578063ac9650d81461058e578063bc197c81146105bb578063c0562f6d146105e7578063c22707ee14610607578063ca15c87314610634578063cb2ef6f714610654578063ce0b601314610677578063d45573f614610697578063d547741f146106ce578063e05688fe146106ee578063e8a3d4851461070e578063ee7d2adf14610730578063f23a6e6114610750578063f533b8021461077c576101f2565b806301ffc9a714610272578063150b7a02146102a75780631e7ac488146102df57806321ede032146102ff578063248a9ca31461031f5780632f2ff15d1461034d57806336568abe1461036d578063429eed801461038d578063463c4864146103ad5780634a00cc48146103f9578063512cf9141461041b578063572b6c051461043b5780635a9ad2311461045b5780638856a113146104705780639010d07c1461049057806391d14854146104b0578063938e3d7b146104d0578063a0a8e460146104f0576101f2565b366101f257336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146101f0576101f061447c565b005b60006102096000356001600160e01b0319166107aa565b90506001600160a01b0381166102665760405162461bcd60e51b815260206004820181905260248201527f526f757465723a2066756e6374696f6e20646f6573206e6f742065786973742e60448201526064015b60405180910390fd5b61026f816107bf565b50005b34801561027e57600080fd5b5061029261028d3660046144a8565b6107e8565b60405190151581526020015b60405180910390f35b3480156102b357600080fd5b506102d26102c23660046145f7565b630a85bd0160e11b949350505050565b60405161029e9190614662565b3480156102eb57600080fd5b506101f06102fa366004614677565b610870565b34801561030b57600080fd5b506101f061031a3660046146a3565b6108a2565b34801561032b57600080fd5b5061033f61033a3660046146c0565b6109b8565b60405190815260200161029e565b34801561035957600080fd5b506101f06103683660046146d9565b6109d6565b34801561037957600080fd5b506101f06103883660046146d9565b610a83565b34801561039957600080fd5b506101f06103a8366004614709565b610af2565b3480156103b957600080fd5b506103e17f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161029e565b34801561040557600080fd5b5061040e610d69565b60405161029e91906148a2565b34801561042757600080fd5b506101f0610436366004614709565b610e38565b34801561044757600080fd5b506102926104563660046146a3565b610e66565b34801561046757600080fd5b506103e1610e92565b34801561047c57600080fd5b506101f061048b36600461495e565b610edf565b34801561049c57600080fd5b506103e16104ab3660046149c1565b610f0d565b3480156104bc57600080fd5b506102926104cb3660046146d9565b61101c565b3480156104dc57600080fd5b506101f06104eb3660046149e3565b611050565b3480156104fc57600080fd5b506040516003815260200161029e565b34801561051857600080fd5b5061052c6105273660046144a8565b61107d565b60405161029e9190614a17565b34801561054557600080fd5b5061033f600081565b34801561055a57600080fd5b506102926105693660046146d9565b6111f3565b34801561057a57600080fd5b506101f0610589366004614a5f565b611256565b34801561059a57600080fd5b506105ae6105a9366004614b55565b611490565b60405161029e9190614bc9565b3480156105c757600080fd5b506102d26105d6366004614c84565b63bc197c8160e01b95945050505050565b3480156105f357600080fd5b506101f0610602366004614db0565b611584565b34801561061357600080fd5b506106276106223660046149e3565b6115b1565b60405161029e9190614ea7565b34801561064057600080fd5b5061033f61064f3660046146c0565b6115c2565b34801561066057600080fd5b506c4d61726b6574706c616365563360981b61033f565b34801561068357600080fd5b506103e16106923660046144a8565b6107aa565b3480156106a357600080fd5b506106ac61165f565b604080516001600160a01b03909316835261ffff90911660208301520161029e565b3480156106da57600080fd5b506101f06106e93660046146d9565b611691565b3480156106fa57600080fd5b506101f0610709366004614db0565b61169c565b34801561071a57600080fd5b506107236116c9565b60405161029e9190614eba565b34801561073c57600080fd5b506101f061074b3660046149e3565b611761565b34801561075c57600080fd5b506102d261076b366004614ecd565b63f23a6e6160e01b95945050505050565b34801561078857600080fd5b5061079c610797366004614f35565b61178e565b60405161029e929190614f6a565b60006107b58261107d565b6040015192915050565b3660008037600080366000845af43d6000803e8080156107de573d6000f35b3d6000fd5b505050565b60006001600160e01b03198216630271189760e51b148061081957506001600160e01b03198216630a85bd0160e11b145b8061083457506001600160e01b0319821663ce0b601360e01b145b8061084f57506001600160e01b03198216630940198960e31b145b8061086a57506301ffc9a760e01b6001600160e01b03198316145b92915050565b610878611a98565b6108945760405162461bcd60e51b815260040161025d90614fee565b61089e8282611ab0565b5050565b6108aa611a98565b6108c65760405162461bcd60e51b815260040161025d90614fee565b6001600160a01b0381161580159061094d57506040516301ffc9a760e01b81526001600160a01b038216906301ffc9a79061090c90636591fc0b60e11b90600401614662565b602060405180830381865afa158015610929573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094d9190615016565b6109ac5760405162461bcd60e51b815260206004820152602a60248201527f446f65736e277420737570706f72742049526f79616c7479456e67696e65563160448201526920696e7465726661636560b01b606482015260840161025d565b6109b581611bc5565b50565b60006109c2611c21565b600092835260010160205250604090205490565b610a016109e1611c21565b600084815260019190910160205260409020546109fc611c2b565b611c35565b610a09611c21565b6000838152602091825260408082206001600160a01b0385168352909252205460ff1615610a795760405162461bcd60e51b815260206004820152601d60248201527f43616e206f6e6c79206772616e7420746f206e6f6e20686f6c64657273000000604482015260640161025d565b61089e8282611cba565b806001600160a01b0316610a95611c2b565b6001600160a01b031614610ae85760405162461bcd60e51b815260206004820152601a60248201527921b0b71037b7363c903932b737bab731b2903337b91039b2b63360311b604482015260640161025d565b61089e8282611cce565b610afa611ce2565b610b165760405162461bcd60e51b815260040161025d90615038565b610b208282611cfc565b610b8d5760405162461bcd60e51b815260206004820152603860248201527f457874656e73696f6e4d616e616765723a2063616e6e6f742072656d6f766520604482015277333ab731ba34b7b710333937b69032bc3a32b739b4b7b71760411b606482015260840161025d565b6000610b97611dfb565b6001600160e01b031983166000908152600391909101602052604090819020815160608101909252805482908290610bce9061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054610bfa9061506f565b8015610c475780601f10610c1c57610100808354040283529160200191610c47565b820191906000526020600020905b815481529060010190602001808311610c2a57829003601f168201915b50505050508152602001600182018054610c609061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054610c8c9061506f565b8015610cd95780601f10610cae57610100808354040283529160200191610cd9565b820191906000526020600020905b815481529060010190602001808311610cbc57829003601f168201915b5050509183525050600291909101546001600160a01b03166020909101529050610d038383611e05565b610d0c826120e0565b816001600160e01b03191683604051610d2591906150a4565b60405180910390207fbb931a9651175c9c82f86afbf6ad37a9141aa8d1d42bf798739be245a12e4e8883604051610d5c9190614a17565b60405180910390a3505050565b60606000610d7d610d78611dfb565b612133565b8051909150806001600160401b03811115610d9a57610d9a6144ea565b604051908082528060200260200182016040528015610dd357816020015b610dc0614298565b815260200190600190039081610db85790505b50925060005b81811015610e3257610e03838281518110610df657610df66150c0565b602002602001015161213e565b848281518110610e1557610e156150c0565b6020908102919091010152610e2b6001826150ec565b9050610dd9565b50505090565b610e40611ce2565b610e5c5760405162461bcd60e51b815260040161025d90615038565b61089e8282610af2565b6000610e706123c7565b6001600160a01b03909216600090815260209290925250604090205460ff1690565b600080610e9d6123eb565b80549091506001600160a01b031680610ed6577f0000000000000000000000000000000000000000000000000000000000000000610ed8565b805b9250505090565b610ee7611ce2565b610f035760405162461bcd60e51b815260040161025d90615038565b61089e828261240f565b600080610f1861265e565b600085815260209190915260408120549150805b82811015611013576000610f3e61265e565b60008881526020918252604080822085835260010190925220546001600160a01b031614610fb75784821415610fa557610f7661265e565b600087815260209182526040808220938252600190930190915220546001600160a01b0316925061086a915050565b610fb06001836150ec565b9150611001565b610fc286600061101c565b8015610fee5750610fd161265e565b600087815260209182526040808220828052600201909252205481145b1561100157610ffe6001836150ec565b91505b61100c6001826150ec565b9050610f2c565b50505092915050565b6000611026611c21565b6000938452602090815260408085206001600160a01b039490941685529290525090205460ff1690565b611058611a98565b6110745760405162461bcd60e51b815260040161025d90614fee565b6109b581612668565b6110856142b8565b61108d611dfb565b6001600160e01b0319831660009081526003919091016020526040908190208151606081019092528054829082906110c49061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546110f09061506f565b801561113d5780601f106111125761010080835404028352916020019161113d565b820191906000526020600020905b81548152906001019060200180831161112057829003601f168201915b505050505081526020016001820180546111569061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546111829061506f565b80156111cf5780601f106111a4576101008083540402835291602001916111cf565b820191906000526020600020905b8154815290600101906020018083116111b257829003601f168201915b5050509183525050600291909101546001600160a01b031660209091015292915050565b60006111fd611c21565b600084815260209182526040808220828052909252205460ff1661124d57611223611c21565b6000848152602091825260408082206001600160a01b0386168352909252205460ff16905061086a565b50600192915050565b6000611260612753565b5460ff1690506000611270612753565b54610100900460ff169050801580801561128d575060018360ff16105b806112ac575061129c3061275d565b1580156112ac57508260ff166001145b61130f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161025d565b6001611319612753565b805460ff191660ff92909216919091179055801561135257600161133b612753565b80549115156101000261ff00199092169190911790555b61135a61276c565b6113626127ea565b61136b86612821565b61137487612668565b611382858561ffff16611ab0565b61138d600089611cba565b6113a560008051602061584383398151915289611cba565b6113d07ff94103142c1baabe9ac2b5d1487bf783de9e69cfeea9a72f5c9c94afd7877b8c6000611cba565b6113fb7f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae66000611cba565b61141360008051602061584383398151915289611cba565b61142b60008051602061584383398151915280612857565b801561148657600061143b612753565b80549115156101000261ff0019909216919091179055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050505050565b6060816001600160401b038111156114aa576114aa6144ea565b6040519080825280602002602001820160405280156114dd57816020015b60608152602001906001900390816114c85790505b50905060005b8281101561157d5761154d30858584818110611501576115016150c0565b90506020028101906115139190615104565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506128c692505050565b82828151811061155f5761155f6150c0565b6020026020010181905250808061157590615151565b9150506114e3565b5092915050565b61158c611ce2565b6115a85760405162461bcd60e51b815260040161025d90615038565b6109b5816128f2565b6115b9614298565b61086a8261213e565b6000806115cd61265e565b6000848152602091909152604081205491505b8181101561163a5760006115f261265e565b60008681526020918252604080822085835260010190925220546001600160a01b031614611628576116256001846150ec565b92505b6116336001826150ec565b90506115e0565b5061164683600061101c565b15611659576116566001836150ec565b91505b50919050565b60008061166a612a5b565b546001600160a01b031661167c612a5b565b549093600160a01b90910461ffff1692509050565b610ae86109e1611c21565b6116a4611ce2565b6116c05760405162461bcd60e51b815260040161025d90615038565b6109b581612a7f565b60606116d3612ba9565b80546116de9061506f565b80601f016020809104026020016040519081016040528092919081815260200182805461170a9061506f565b80156117575780601f1061172c57610100808354040283529160200191611757565b820191906000526020600020905b81548152906001019060200180831161173a57829003601f168201915b5050505050905090565b611769611ce2565b6117855760405162461bcd60e51b815260040161025d90615038565b6109b581612bcd565b606080600061179b610e92565b90506001600160a01b0381166118fe5760405163152a902d60e11b815260048101869052602481018590526001600160a01b03871690632a55205a906044016040805180830381865afa925050508015611812575060408051601f3d908101601f1916820190925261180f9181019061516c565b60015b61181b57611982565b8581106118635760405162461bcd60e51b8152602060048201526016602482015275125b9d985b1a59081c9bde585b1d1e48185b5bdd5b9d60521b604482015260640161025d565b6040805160018082528183019092529060208083019080368337505060408051600180825281830190925292975090506020808301908036833701905050935081856000815181106118b7576118b76150c0565b60200260200101906001600160a01b031690816001600160a01b03168152505080846000815181106118eb576118eb6150c0565b6020026020010181815250505050611982565b604051637a99dc0160e11b81526001600160a01b038781166004830152602482018790526044820186905282169063f533b802906064016000604051808303816000875af1158015611954573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261197c91908101906151f5565b90935091505b50935093915050565b6000806119b6836040516020016119a291906152af565b6040516020818303038152906040526119ea565b90508051602082016000f091506001600160a01b0382166116595760405163046a55db60e11b815260040160405180910390fd5b6060815182604051602001611a009291906152d5565b6040516020818303038152906040529050919050565b600080611a4460017f11c19c8d567686e9e4073585fe511ac02fcfc0ce76ceba4592185bf5bec3cd1f615326565b604051602001611a5691815260200190565b60408051601f19818403018152919052805160209091012092915050565b7f322cf19c484104d3b1a9c2982ebae869ede3fa5f6c4703ca41b9a48c76ee030090565b6000611aab81611aa6611c2b565b612f0b565b905090565b612710811115611af45760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b604482015260640161025d565b6001600160a01b038216611b3e5760405162461bcd60e51b8152602060048201526011602482015270125b9d985b1a59081c9958da5c1a595b9d607a1b604482015260640161025d565b80611b47612a5b565b805461ffff92909216600160a01b0261ffff60a01b1990921691909117905581611b6f612a5b565b80546001600160a01b0319166001600160a01b03928316179055604051828152908316907fe2497bd806ec41a6e0dd992c29a72efc0ef8fec9092d1978fd4a1e00b2f18304906020015b60405180910390a25050565b6000611bcf6123eb565b80546001600160a01b038481166001600160a01b031983168117845560405193945091169182907fdb773077c54b973d26a2973b12d9e7e458768cbf218f12160d3ea5f015820ef990600090a3505050565b6000611aab612f41565b6000611aab612f65565b611c3d611c21565b6000838152602091825260408082206001600160a01b0385168352909252205460ff1661089e57611c78816001600160a01b03166014612f87565b611c83836020612f87565b604051602001611c9492919061533d565b60408051601f198184030181529082905262461bcd60e51b825261025d91600401614eba565b611cc48282613122565b61089e82826131a6565b611cd88282613265565b61089e82826132ea565b6000611aab60008051602061584383398151915233612f0b565b6000611d1083611d0a611dfb565b90613379565b611d2c5760405162461bcd60e51b815260040161025d906153aa565b82604051602001611d3d9190614eba565b60405160208183030381529060405280519060200120611d5b611dfb565b6001600160e01b03198416600090815260039190910160209081526040918290209151611d899291016153f5565b604051602081830303815290604052805190602001201461124d5760405162461bcd60e51b815260206004820152602660248201527f457874656e73696f6e4d616e616765723a20696e636f727265637420657874656044820152653739b4b7b71760d11b606482015260840161025d565b6000611aab613385565b6000611e0f611dfb565b60020183604051611e2091906150a4565b9081526020016040518091039020600301805480602002602001604051908101604052809291908181526020016000905b82821015611f2e5760008481526020908190206040805180820190915260028502909101805460e01b6001600160e01b03191682526001810180549293919291840191611e9d9061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054611ec99061506f565b8015611f165780601f10611eeb57610100808354040283529160200191611f16565b820191906000526020600020905b815481529060010190602001808311611ef957829003601f168201915b50505050508152505081526020019060010190611e51565b5050825192935060009150505b818110156120d957836001600160e01b031916838281518110611f6057611f606150c0565b6020026020010151600001516001600160e01b03191614156120c757611f84611dfb565b60020185604051611f9591906150a4565b908152604051908190036020019020600301611fb2600184615326565b81548110611fc257611fc26150c0565b9060005260206000209060020201611fd8611dfb565b60020186604051611fe991906150a4565b9081526020016040518091039020600301828154811061200b5761200b6150c0565b600091825260209091208254600290920201805463ffffffff191663ffffffff90921691909117815560018083018054918301916120489061506f565b6120539291906142e2565b5090505061205f611dfb565b6002018560405161207091906150a4565b90815260200160405180910390206003018054806120905761209061549d565b600082815260208120600260001990930192830201805463ffffffff19168155906120be600183018261436d565b505090556120d9565b6120d26001826150ec565b9050611f3b565b5050505050565b6120e8611dfb565b6001600160e01b0319821660009081526003919091016020526040812090612110828261436d565b61211e60018301600061436d565b5060020180546001600160a01b031916905550565b606061086a826133b3565b612146614298565b61214e611dfb565b6002018260405161215f91906150a4565b9081526040805191829003602001822060a0830182528054909183919082019083908290829061218e9061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546121ba9061506f565b80156122075780601f106121dc57610100808354040283529160200191612207565b820191906000526020600020905b8154815290600101906020018083116121ea57829003601f168201915b505050505081526020016001820180546122209061506f565b80601f016020809104026020016040519081016040528092919081815260200182805461224c9061506f565b80156122995780601f1061226e57610100808354040283529160200191612299565b820191906000526020600020905b81548152906001019060200180831161227c57829003601f168201915b5050509183525050600291909101546001600160a01b03166020918201529082526003830180546040805182850281018501909152818152938301939260009084015b828210156123b95760008481526020908190206040805180820190915260028502909101805460e01b6001600160e01b031916825260018101805492939192918401916123289061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546123549061506f565b80156123a15780601f10612376576101008083540402835291602001916123a1565b820191906000526020600020905b81548152906001019060200180831161238457829003601f168201915b505050505081525050815260200190600101906122dc565b505050915250909392505050565b7f82aadcdf5bea62fd30615b6c0754b644e71b6c1e8c55b71bb927ad005b504f0090565b7fc802b338f3fb784853cf3c808df5ff08335200e394ea2c687d12571a9104500090565b6124198282613490565b6124855760405162461bcd60e51b815260206004820152603760248201527f457874656e73696f6e4d616e616765723a2063616e6e6f742053746f72653a20604482015276333ab731ba34b7b7103337b91032bc3a32b739b4b7b71760491b606482015260840161025d565b61248f82826134ba565b6000612499611dfb565b600201836040516124aa91906150a4565b90815260408051918290036020018220606083019091528054829082906124d09061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546124fc9061506f565b80156125495780601f1061251e57610100808354040283529160200191612549565b820191906000526020600020905b81548152906001019060200180831161252c57829003601f168201915b505050505081526020016001820180546125629061506f565b80601f016020809104026020016040519081016040528092919081815260200182805461258e9061506f565b80156125db5780601f106125b0576101008083540402835291602001916125db565b820191906000526020600020905b8154815290600101906020018083116125be57829003601f168201915b5050509183525050600291909101546001600160a01b03166020909101528251909150612608908261370d565b81600001516001600160e01b0319168360405161262591906150a4565b60405180910390207f681115194e519bda23de4da5218f3bc38f5585eab7c6b7d5fa66caa4602f574d8484604051610d5c9291906154b3565b6000611aab613792565b6000612672612ba9565b805461267d9061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546126a99061506f565b80156126f65780601f106126cb576101008083540402835291602001916126f6565b820191906000526020600020905b8154815290600101906020018083116126d957829003601f168201915b5050505050905081612706612ba9565b815161271592602001906143a7565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a1681836040516127479291906154e1565b60405180910390a15050565b6000611aab611a74565b6001600160a01b03163b151590565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661279c57565b60006127c77f00000000000000000000000000000000000000000000000000000000000000006137f4565b90506000818060200190518101906127df9190615615565b905061089e81613804565b6127f2612753565b54610100900460ff166128175760405162461bcd60e51b815260040161025d9061579a565b61281f6139a9565b565b612829612753565b54610100900460ff1661284e5760405162461bcd60e51b815260040161025d9061579a565b6109b5816139fc565b6000612861611c21565b6000848152600191909101602052604090205490508161287f611c21565b600085815260019190910160205260408082209290925590518391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff91a4505050565b60606128eb838360405180606001604052806027815260200161581c60279139613a9a565b9392505050565b6128fb81613b75565b61295b5760405162461bcd60e51b815260206004820152602b60248201527f457874656e73696f6e4d616e616765723a2063616e6e6f74207265706c61636560448201526a1032bc3a32b739b4b7b71760a91b606482015260840161025d565b8051805161296891613c29565b80515161297490613c68565b60208101515160005b818110156129f5576129b4836000015160000151846020015183815181106129a7576129a76150c0565b60200260200101516134ba565b6129e3836020015182815181106129cd576129cd6150c0565b602002602001015160000151846000015161370d565b6129ee6001826150ec565b905061297d565b508151604080820151915190516001600160a01b0390921691612a1891906150a4565b60405180910390207f5f1ef2b136db521971a88818ce904a8e310082338afdc100212a31270664215884604051612a4f9190614ea7565b60405180910390a35050565b7fc0c34308b4a2f4c5ee9af8ba82541cfb3c33b076d1fd05c65f9ce7060c64c40090565b612a8881613e11565b612ae45760405162461bcd60e51b815260206004820152602760248201527f457874656e73696f6e4d616e616765723a2063616e6e6f74206164642065787460448201526632b739b4b7b71760c91b606482015260840161025d565b80518051612af191613c29565b60208101515160005b81811015612b4f57612b24836000015160000151846020015183815181106129a7576129a76150c0565b612b3d836020015182815181106129cd576129cd6150c0565b612b486001826150ec565b9050612afa565b508151604080820151915190516001600160a01b0390921691612b7291906150a4565b60405180910390207fbb37a605de78ba6bc667aeaf438d0aae8247e6f48a8fad23730e4fbbb480abf384604051612a4f9190614ea7565b7f4bc804ba64359c0e35e5ed5d90ee596ecaa49a3a930ddcb1470ea0dd625da90090565b612bd681613ed3565b612c355760405162461bcd60e51b815260206004820152602a60248201527f457874656e73696f6e4d616e616765723a2063616e6e6f742072656d6f76652060448201526932bc3a32b739b4b7b71760b11b606482015260840161025d565b6000612c3f611dfb565b60020182604051612c5091906150a4565b9081526040805191829003602001822060a08301825280549091839190820190839082908290612c7f9061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054612cab9061506f565b8015612cf85780601f10612ccd57610100808354040283529160200191612cf8565b820191906000526020600020905b815481529060010190602001808311612cdb57829003601f168201915b50505050508152602001600182018054612d119061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054612d3d9061506f565b8015612d8a5780601f10612d5f57610100808354040283529160200191612d8a565b820191906000526020600020905b815481529060010190602001808311612d6d57829003601f168201915b5050509183525050600291909101546001600160a01b03166020918201529082526003830180546040805182850281018501909152818152938301939260009084015b82821015612eaa5760008481526020908190206040805180820190915260028502909101805460e01b6001600160e01b03191682526001810180549293919291840191612e199061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054612e459061506f565b8015612e925780601f10612e6757610100808354040283529160200191612e92565b820191906000526020600020905b815481529060010190602001808311612e7557829003601f168201915b50505050508152505081526020019060010190612dcd565b50505050815250509050612ebd82613f03565b612ec682613c68565b81604051612ed491906150a4565b60405180910390207f3169a23cec9ad1a25ab59bbe00ecf8973dd840c745775ea8877041ef5ce65bcc82604051611bb99190614ea7565b600080612f16612f41565b6000948552602090815260408086206001600160a01b03959095168652939052505090205460ff1690565b7f0a7b0f5c59907924802379ebe98cdc23e2ee7820f63d30126e10b3752010e50090565b6000612f7033610e66565b15612f82575060131936013560601c90565b503390565b60606000612f968360026157e5565b612fa19060026150ec565b6001600160401b03811115612fb857612fb86144ea565b6040519080825280601f01601f191660200182016040528015612fe2576020820181803683370190505b509050600360fc1b81600081518110612ffd57612ffd6150c0565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061302c5761302c6150c0565b60200101906001600160f81b031916908160001a90535060006130508460026157e5565b61305b9060016150ec565b90505b60018111156130d3576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061308f5761308f6150c0565b1a60f81b8282815181106130a5576130a56150c0565b60200101906001600160f81b031916908160001a90535060049490941c936130cc81615804565b905061305e565b5083156128eb5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161025d565b600161312c611c21565b6000848152602091825260408082206001600160a01b038616835290925220805460ff1916911515919091179055613162611c2b565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006131b061265e565b60008481526020919091526040902054905060016131cc61265e565b60008581526020919091526040812080549091906131eb9084906150ec565b909155508290506131fa61265e565b6000858152602091825260408082208583526001019092522080546001600160a01b0319166001600160a01b03929092169190911790558061323a61265e565b6000948552602090815260408086206001600160a01b03909516865260029094019052919092205550565b61326f8282611c35565b613277611c21565b6000838152602091825260408082206001600160a01b038516835290925220805460ff191690556132a6611c2b565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b60006132f461265e565b6000848152602091825260408082206001600160a01b03861683526002019092522054905061332161265e565b6000848152602091825260408082208483526001019092522080546001600160a01b031916905561335061265e565b6000938452602090815260408085206001600160a01b0390941685526002909301905250812055565b60006128eb8383613f37565b600080611a4460017f775b9fab5634a62bb2a682c067408edbed43efd726183d2e2af744334d47acb7615326565b606081600001805480602002602001604051908101604052809291908181526020016000905b828210156134855783829060005260206000200180546133f89061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546134249061506f565b80156134715780601f1061344657610100808354040283529160200191613471565b820191906000526020600020905b81548152906001019060200180831161345457829003601f168201915b5050505050815260200190600101906133d9565b505050509050919050565b600061349e83611d0a611dfb565b61124d5760405162461bcd60e51b815260040161025d906153aa565b80516000906001600160e01b031916613544576040516020016134fa9060208082526009908201526872656365697665282960b81b604082015260600190565b6040516020818303038152906040528051906020012082602001516040516020016135259190614eba565b604051602081830303815290604052805190602001201415905061358b565b60208083015160405161355792016150a4565b604051602081830303815290604052805190602001206001600160e01b03191682600001516001600160e01b031916141590505b80156135f75760405162461bcd60e51b815260206004820152603560248201527f457874656e73696f6e4d616e616765723a20666e2073656c6563746f7220616e604482015274321039b4b3b730ba3ab9329036b4b9b6b0ba31b41760591b606482015260840161025d565b6000613601611dfb565b83516001600160e01b031916600090815260039190910160205260409020600201546001600160a01b0316146136915760405162461bcd60e51b815260206004820152602f60248201527f457874656e73696f6e4d616e616765723a2066756e6374696f6e20696d706c2060448201526e30b63932b0b23c9032bc34b9ba399760891b606482015260840161025d565b613699611dfb565b600201836040516136aa91906150a4565b908152604051602091819003820190206003018054600180820183556000928352918390208551600290920201805463ffffffff191660e09290921c91909117815584830151805186949293613705939085019201906143a7565b505050505050565b80613716611dfb565b6001600160e01b0319841660009081526003919091016020908152604090912082518051919261374b928492909101906143a7565b50602082810151805161376492600185019201906143a7565b5060409190910151600290910180546001600160a01b0319166001600160a01b039092169190911790555050565b60008060ff196137c360017f0c4ba382c0009cf238e4c1ca1a52f51c61e6248a70bdfb34e5ed49d5578a5c0c615326565b6040516020016137d591815260200190565b60408051601f1981840301815291905280516020909101201692915050565b606061086a826001600019613f64565b60005b815181101561089e576000828281518110613824576138246150c0565b60200260200101519050613848816000015160000151613842611dfb565b90614015565b508051805161385691613c29565b60208101515160005b818110156139325761386f611dfb565b60020183600001516000015160405161388891906150a4565b9081526020016040518091039020600301836020015182815181106138af576138af6150c0565b6020908102919091018101518254600180820185556000948552938390208251600290920201805463ffffffff191660e09290921c9190911781558183015180519294919361390493928501929101906143a7565b505050613920836020015182815181106129cd576129cd6150c0565b61392b6001826150ec565b905061385f565b508151604080820151915190516001600160a01b039092169161395591906150a4565b60405180910390207fbb37a605de78ba6bc667aeaf438d0aae8247e6f48a8fad23730e4fbbb480abf38460405161398c9190614ea7565b60405180910390a3506139a290506001826150ec565b9050613807565b6139b1612753565b54610100900460ff166139d65760405162461bcd60e51b815260040161025d9061579a565b60017f1d281c488dae143b6ea4122e80c65059929950b9c32f17fc57be22089d9c3b0055565b613a04612753565b54610100900460ff16613a295760405162461bcd60e51b815260040161025d9061579a565b60005b815181101561089e576001613a3f6123c7565b6000016000848481518110613a5657613a566150c0565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905580613a9281615151565b915050613a2c565b6060613aa58461275d565b613b005760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b606482015260840161025d565b600080856001600160a01b031685604051613b1b91906150a4565b600060405180830381855af49150503d8060008114613b56576040519150601f19603f3d011682016040523d82523d6000602084013e613b5b565b606091505b5091509150613b6b828286614021565b9695505050505050565b805151600090613b8790611d0a611dfb565b613ba35760405162461bcd60e51b815260040161025d906153aa565b8151604001516001600160a01b0316613c215760405162461bcd60e51b815260206004820152603a60248201527f457874656e73696f6e4d616e616765723a20616464696e6720657874656e736960448201527937b7103bb4ba3437baba1034b6b83632b6b2b73a30ba34b7b71760311b606482015260840161025d565b506001919050565b80613c32611dfb565b60020183604051613c4391906150a4565b9081526040516020918190038201902082518051919261374b928492909101906143a7565b6000613c72611dfb565b60020182604051613c8391906150a4565b9081526020016040518091039020600301805480602002602001604051908101604052809291908181526020016000905b82821015613d915760008481526020908190206040805180820190915260028502909101805460e01b6001600160e01b03191682526001810180549293919291840191613d009061506f565b80601f0160208091040260200160405190810160405280929190818152602001828054613d2c9061506f565b8015613d795780601f10613d4e57610100808354040283529160200191613d79565b820191906000526020600020905b815481529060010190602001808311613d5c57829003601f168201915b50505050508152505081526020019060010190613cb4565b505050509050613d9f611dfb565b60020182604051613db091906150a4565b90815260200160405180910390206003016000613dcd919061441b565b60005b81518110156107e357613dff828281518110613dee57613dee6150c0565b6020026020010151600001516120e0565b613e0a6001826150ec565b9050613dd0565b80515151600090613e645760405162461bcd60e51b815260206004820152601d60248201527f457874656e73696f6e4d616e616765723a20656d707479206e616d652e000000604482015260640161025d565b815151613e7390613842611dfb565b613ba35760405162461bcd60e51b815260206004820152602b60248201527f457874656e73696f6e4d616e616765723a20657874656e73696f6e20616c726560448201526a30b23c9032bc34b9ba399760a91b606482015260840161025d565b6000613ee782613ee1611dfb565b9061405a565b613c215760405162461bcd60e51b815260040161025d906153aa565b613f0b611dfb565b60020181604051613f1c91906150a4565b9081526040519081900360200190206000612110828261436d565b60008260010182604051613f4b91906150a4565b9081526040519081900360200190205415159392505050565b6060833b80613f835750506040805160208101909152600081526128eb565b80841115613fa15750506040805160208101909152600081526128eb565b83831015613fd35760405163162544fd60e11b815260048101829052602481018590526044810184905260640161025d565b8383038482036000828210613fe85782613fea565b815b60408051603f8301601f19168101909152818152955090508087602087018a3c505050509392505050565b60006128eb8383614066565b606083156140305750816128eb565b8251156140405782518084602001fd5b8160405162461bcd60e51b815260040161025d9190614eba565b60006128eb83836140d2565b60006140728383613f37565b6140ca5782546001810184556000848152602090819020845161409c9391909101918501906143a7565b50825460405160018501906140b29085906150a4565b9081526040519081900360200190205550600161086a565b50600061086a565b60008083600101836040516140e791906150a4565b90815260200160405180910390205490508060001461428e57600061410d600183615326565b855490915060009061412190600190615326565b905081811461422f576000866000018281548110614141576141416150c0565b9060005260206000200180546141569061506f565b80601f01602080910402602001604051908101604052809291908181526020018280546141829061506f565b80156141cf5780601f106141a4576101008083540402835291602001916141cf565b820191906000526020600020905b8154815290600101906020018083116141b257829003601f168201915b50505050509050808760000184815481106141ec576141ec6150c0565b9060005260206000200190805190602001906142099291906143a7565b5083876001018260405161421d91906150a4565b90815260405190819003602001902055505b85548690806142405761424061549d565b60019003818190600052602060002001600061425c919061436d565b9055856001018560405161427091906150a4565b9081526020016040518091039020600090556001935050505061086a565b600091505061086a565b60405180604001604052806142ab6142b8565b8152602001606081525090565b6040518060600160405280606081526020016060815260200160006001600160a01b031681525090565b8280546142ee9061506f565b90600052602060002090601f016020900481019282614310576000855561435d565b82601f10614321578054855561435d565b8280016001018555821561435d57600052602060002091601f016020900482015b8281111561435d578254825591600101919060010190614342565b5061436992915061443c565b5090565b5080546143799061506f565b6000825580601f10614389575050565b601f0160209004906000526020600020908101906109b5919061443c565b8280546143b39061506f565b90600052602060002090601f0160209004810192826143d5576000855561435d565b82601f106143ee57805160ff191683800117855561435d565b8280016001018555821561435d579182015b8281111561435d578251825591602001919060010190614400565b50805460008255600202906000526020600020908101906109b59190614451565b5b80821115614369576000815560010161443d565b8082111561436957805463ffffffff191681556000614473600183018261436d565b50600201614451565b634e487b7160e01b600052600160045260246000fd5b6001600160e01b0319811681146109b557600080fd5b6000602082840312156144ba57600080fd5b81356128eb81614492565b6001600160a01b03811681146109b557600080fd5b80356144e5816144c5565b919050565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b0381118282101715614522576145226144ea565b60405290565b604051606081016001600160401b0381118282101715614522576145226144ea565b604051601f8201601f191681016001600160401b0381118282101715614572576145726144ea565b604052919050565b60006001600160401b03821115614593576145936144ea565b50601f01601f191660200190565b600082601f8301126145b257600080fd5b81356145c56145c08261457a565b61454a565b8181528460208386010111156145da57600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561460d57600080fd5b8435614618816144c5565b93506020850135614628816144c5565b92506040850135915060608501356001600160401b0381111561464a57600080fd5b614656878288016145a1565b91505092959194509250565b6001600160e01b031991909116815260200190565b6000806040838503121561468a57600080fd5b8235614695816144c5565b946020939093013593505050565b6000602082840312156146b557600080fd5b81356128eb816144c5565b6000602082840312156146d257600080fd5b5035919050565b600080604083850312156146ec57600080fd5b8235915060208301356146fe816144c5565b809150509250929050565b6000806040838503121561471c57600080fd5b82356001600160401b0381111561473257600080fd5b61473e858286016145a1565b92505060208301356146fe81614492565b60005b8381101561476a578181015183820152602001614752565b83811115614779576000848401525b50505050565b6000815180845261479781602086016020860161474f565b601f01601f19169290920160200192915050565b60008151606084526147c0606085018261477f565b9050602083015184820360208601526147d9828261477f565b6040948501516001600160a01b03169590940194909452509092915050565b63ffffffff60e01b81511682526000602082015160406020850152614820604085018261477f565b949350505050565b600081516040845261483d60408501826147ab565b9050602080840151858303828701528281518085528385019150838160051b860101848401935060005b8281101561489557601f198783030184526148838286516147f8565b94860194938601939150600101614867565b5098975050505050505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156148f757603f198886030184526148e5858351614828565b945092850192908501906001016148c9565b5092979650505050505050565b60006040828403121561491657600080fd5b61491e614500565b9050813561492b81614492565b815260208201356001600160401b0381111561494657600080fd5b614952848285016145a1565b60208301525092915050565b6000806040838503121561497157600080fd5b82356001600160401b038082111561498857600080fd5b614994868387016145a1565b935060208501359150808211156149aa57600080fd5b506149b785828601614904565b9150509250929050565b600080604083850312156149d457600080fd5b50508035926020909101359150565b6000602082840312156149f557600080fd5b81356001600160401b03811115614a0b57600080fd5b614820848285016145a1565b6020815260006128eb60208301846147ab565b60006001600160401b03821115614a4357614a436144ea565b5060051b60200190565b803561ffff811681146144e557600080fd5b600080600080600060a08688031215614a7757600080fd5b8535614a82816144c5565b94506020868101356001600160401b0380821115614a9f57600080fd5b614aab8a838b016145a1565b96506040890135915080821115614ac157600080fd5b508701601f81018913614ad357600080fd5b8035614ae16145c082614a2a565b81815260059190911b8201830190838101908b831115614b0057600080fd5b928401925b82841015614b27578335614b18816144c5565b82529284019290840190614b05565b8097505050505050614b3b606087016144da565b9150614b4960808701614a4d565b90509295509295909350565b60008060208385031215614b6857600080fd5b82356001600160401b0380821115614b7f57600080fd5b818501915085601f830112614b9357600080fd5b813581811115614ba257600080fd5b8660208260051b8501011115614bb757600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b828110156148f757603f19888603018452614c0c85835161477f565b94509285019290850190600101614bf0565b600082601f830112614c2f57600080fd5b81356020614c3f6145c083614a2a565b82815260059290921b84018101918181019086841115614c5e57600080fd5b8286015b84811015614c795780358352918301918301614c62565b509695505050505050565b600080600080600060a08688031215614c9c57600080fd5b8535614ca7816144c5565b94506020860135614cb7816144c5565b935060408601356001600160401b0380821115614cd357600080fd5b614cdf89838a01614c1e565b94506060880135915080821115614cf557600080fd5b614d0189838a01614c1e565b93506080880135915080821115614d1757600080fd5b50614d24888289016145a1565b9150509295509295909350565b600082601f830112614d4257600080fd5b81356020614d526145c083614a2a565b82815260059290921b84018101918181019086841115614d7157600080fd5b8286015b84811015614c795780356001600160401b03811115614d945760008081fd5b614da28986838b0101614904565b845250918301918301614d75565b600060208284031215614dc257600080fd5b81356001600160401b0380821115614dd957600080fd5b9083019060408286031215614ded57600080fd5b614df5614500565b823582811115614e0457600080fd5b830160608188031215614e1657600080fd5b614e1e614528565b813584811115614e2d57600080fd5b614e39898285016145a1565b825250602082013584811115614e4e57600080fd5b614e5a898285016145a1565b60208301525060408201359150614e70826144c5565b60408101919091528152602083013582811115614e8c57600080fd5b614e9887828601614d31565b60208301525095945050505050565b6020815260006128eb6020830184614828565b6020815260006128eb602083018461477f565b600080600080600060a08688031215614ee557600080fd5b8535614ef0816144c5565b94506020860135614f00816144c5565b9350604086013592506060860135915060808601356001600160401b03811115614f2957600080fd5b614d24888289016145a1565b600080600060608486031215614f4a57600080fd5b8335614f55816144c5565b95602085013595506040909401359392505050565b604080825283519082018190526000906020906060840190828701845b82811015614fac5781516001600160a01b031684529284019290840190600101614f87565b5050508381038285015284518082528583019183019060005b81811015614fe157835183529284019291840191600101614fc5565b5090979650505050505050565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b60006020828403121561502857600080fd5b815180151581146128eb57600080fd5b6020808252601f908201527f457874656e73696f6e4d616e616765723a20756e617574686f72697a65642e00604082015260600190565b600181811c9082168061508357607f821691505b6020821081141561165957634e487b7160e01b600052602260045260246000fd5b600082516150b681846020870161474f565b9190910192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600082198211156150ff576150ff6150d6565b500190565b6000808335601e1984360301811261511b57600080fd5b8301803591506001600160401b0382111561513557600080fd5b60200191503681900382131561514a57600080fd5b9250929050565b6000600019821415615165576151656150d6565b5060010190565b6000806040838503121561517f57600080fd5b825161518a816144c5565b6020939093015192949293505050565b600082601f8301126151ab57600080fd5b815160206151bb6145c083614a2a565b82815260059290921b840181019181810190868411156151da57600080fd5b8286015b84811015614c7957805183529183019183016151de565b6000806040838503121561520857600080fd5b82516001600160401b038082111561521f57600080fd5b818501915085601f83011261523357600080fd5b815160206152436145c083614a2a565b82815260059290921b8401810191818101908984111561526257600080fd5b948201945b8386101561528957855161527a816144c5565b82529482019490820190615267565b918801519196509093505050808211156152a257600080fd5b506149b78582860161519a565b60008152600082516152c881600185016020870161474f565b9190910160010192915050565b606360f81b815260e083901b6001600160e01b03191660018201526880600e6000396000f360b81b6005820152815160009061531881600e85016020870161474f565b91909101600e019392505050565b600082821015615338576153386150d6565b500390565b7402832b936b4b9b9b4b7b7399d1030b1b1b7bab73a1605d1b81526000835161536d81601585016020880161474f565b7001034b99036b4b9b9b4b733903937b6329607d1b601591840191820152835161539e81602684016020880161474f565b01602601949350505050565b6020808252602b908201527f457874656e73696f6e4d616e616765723a20657874656e73696f6e20646f657360408201526a103737ba1032bc34b9ba1760a91b606082015260800190565b600060208083526000845481600182811c91508083168061541757607f831692505b85831081141561543557634e487b7160e01b85526022600452602485fd5b87860183815260200181801561545257600181146154635761548e565b60ff1986168252878201965061548e565b60008b81526020902060005b868110156154885781548482015290850190890161546f565b83019750505b50949998505050505050505050565b634e487b7160e01b600052603160045260246000fd5b6040815260006154c660408301856147f8565b82810360208401526154d881856147ab565b95945050505050565b6040815260006154f4604083018561477f565b82810360208401526154d8818561477f565b600082601f83011261551757600080fd5b81516155256145c08261457a565b81815284602083860101111561553a57600080fd5b61482082602083016020870161474f565b600082601f83011261555c57600080fd5b8151602061556c6145c083614a2a565b82815260059290921b8401810191818101908684111561558b57600080fd5b8286015b84811015614c795780516001600160401b03808211156155af5760008081fd5b908801906040828b03601f19018113156155c95760008081fd5b6155d1614500565b878401516155de81614492565b81529083015190828211156155f35760008081fd5b6156018c8984870101615506565b81890152865250505091830191830161558f565b60006020828403121561562757600080fd5b81516001600160401b038082111561563e57600080fd5b818401915084601f83011261565257600080fd5b81516156606145c082614a2a565b8082825260208201915060208360051b86010192508783111561568257600080fd5b602085015b8381101561578e5780518581111561569e57600080fd5b8601601f196040828c03820112156156b557600080fd5b6156bd614500565b6020830151888111156156cf57600080fd5b83016060818e03840112156156e357600080fd5b6156eb614528565b92506020810151898111156156ff57600080fd5b61570e8e602083850101615506565b84525060408101518981111561572357600080fd5b6157328e602083850101615506565b60208501525060600151615745816144c5565b80604084015250818152604083015191508782111561576357600080fd5b6157728c60208486010161554b565b6020820152808652505050602083019250602081019050615687565b50979650505050505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60008160001904831182151516156157ff576157ff6150d6565b500290565b600081615813576158136150d6565b50600019019056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c656455add213c41f3851b4506717b8af695a4256979dff496dcaae7789f6121331aaa26469706673582212205b598827f4650080ca2706294533e55d5d880930968b755bc6fc18fae638fd6864736f6c634300080c0033";
