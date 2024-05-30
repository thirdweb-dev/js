export const mockCoreCompilerMetadata = {
  compiler: {
    version: "0.8.25+commit.b61c2a91",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
        name: "AlreadyInitialized",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackExecutionReverted",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackFunctionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackFunctionNotSupported",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackFunctionRequired",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackFunctionUnauthorizedCall",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "requiredInterfaceId",
            type: "bytes4",
          },
        ],
        name: "ExtensionInterfaceNotCompatible",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionNotInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionOutOfSync",
        type: "error",
      },
      {
        inputs: [],
        name: "FallbackFunctionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "FallbackFunctionNotInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "IndexOutOfBounds",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidInitialization",
        type: "error",
      },
      {
        inputs: [],
        name: "NewOwnerIsZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "NoHandoverRequest",
        type: "error",
      },
      {
        inputs: [],
        name: "NotInitializing",
        type: "error",
      },
      {
        inputs: [],
        name: "Unauthorized",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "installedExtension",
            type: "address",
          },
        ],
        name: "ExtensionInstalled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "installedExtension",
            type: "address",
          },
        ],
        name: "ExtensionUninstalled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint64",
            name: "version",
            type: "uint64",
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
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "oldOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
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
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "RolesUpdated",
        type: "event",
      },
      {
        stateMutability: "payable",
        type: "fallback",
      },
      {
        inputs: [],
        name: "callbackFunctionOne",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getInstalledExtensions",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
              {
                components: [
                  {
                    internalType: "bytes4",
                    name: "requiredInterfaceId",
                    type: "bytes4",
                  },
                  {
                    internalType: "bool",
                    name: "registerInstallationCallback",
                    type: "bool",
                  },
                  {
                    internalType: "bytes4[]",
                    name: "supportedInterfaces",
                    type: "bytes4[]",
                  },
                  {
                    components: [
                      {
                        internalType: "bytes4",
                        name: "selector",
                        type: "bytes4",
                      },
                    ],
                    internalType: "struct IExtensionConfig.CallbackFunction[]",
                    name: "callbackFunctions",
                    type: "tuple[]",
                  },
                  {
                    components: [
                      {
                        internalType: "bytes4",
                        name: "selector",
                        type: "bytes4",
                      },
                      {
                        internalType: "uint256",
                        name: "permissionBits",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct IExtensionConfig.FallbackFunction[]",
                    name: "fallbackFunctions",
                    type: "tuple[]",
                  },
                ],
                internalType: "struct IExtensionConfig.ExtensionConfig",
                name: "config",
                type: "tuple",
              },
            ],
            internalType: "struct IModularCore.InstalledExtension[]",
            name: "_installedExtensions",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getSupportedCallbackFunctions",
        outputs: [
          {
            components: [
              {
                internalType: "bytes4",
                name: "selector",
                type: "bytes4",
              },
              {
                internalType: "enum IModularCore.CallbackMode",
                name: "mode",
                type: "uint8",
              },
            ],
            internalType: "struct IModularCore.SupportedCallbackFunction[]",
            name: "supportedCallbackFunctions",
            type: "tuple[]",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "grantRoles",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "hasAllRoles",
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
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "hasAnyRole",
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
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "extensions",
            type: "address[]",
          },
          {
            internalType: "bytes[]",
            name: "extensionInstallData",
            type: "bytes[]",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_extension",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "installExtension",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "result",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "renounceRoles",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        name: "revokeRoles",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "rolesOf",
        outputs: [
          {
            internalType: "uint256",
            name: "roles",
            type: "uint256",
          },
        ],
        stateMutability: "view",
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
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_extension",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "uninstallExtension",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ],
    devdoc: {
      errors: {
        "AlreadyInitialized()": [
          {
            details: "Cannot double-initialize.",
          },
        ],
        "IndexOutOfBounds()": [
          {
            details: "The index must be less than the length.",
          },
        ],
        "InvalidInitialization()": [
          {
            details: "The contract is already initialized.",
          },
        ],
        "NewOwnerIsZeroAddress()": [
          {
            details: "The `newOwner` cannot be the zero address.",
          },
        ],
        "NoHandoverRequest()": [
          {
            details:
              "The `pendingOwner` does not have a valid handover request.",
          },
        ],
        "NotInitializing()": [
          {
            details: "The contract is not initializing.",
          },
        ],
        "Unauthorized()": [
          {
            details: "The caller is not authorized to call the function.",
          },
        ],
      },
      events: {
        "Initialized(uint64)": {
          details: "Triggered when the contract has been initialized.",
        },
        "OwnershipHandoverCanceled(address)": {
          details:
            "The ownership handover to `pendingOwner` has been canceled.",
        },
        "OwnershipHandoverRequested(address)": {
          details:
            "An ownership handover to `pendingOwner` has been requested.",
        },
        "OwnershipTransferred(address,address)": {
          details:
            "The ownership is transferred from `oldOwner` to `newOwner`. This event is intentionally kept the same as OpenZeppelin's Ownable to be compatible with indexers and [EIP-173](https://eips.ethereum.org/EIPS/eip-173), despite it not being as lightweight as a single argument event.",
        },
        "RolesUpdated(address,uint256)": {
          details:
            "The `user`'s roles is updated to `roles`. Each bit of `roles` represents whether the role is set.",
        },
      },
      kind: "dev",
      methods: {
        "cancelOwnershipHandover()": {
          details:
            "Cancels the two-step ownership handover to the caller, if any.",
        },
        "completeOwnershipHandover(address)": {
          details:
            "Allows the owner to complete the two-step ownership handover to `pendingOwner`. Reverts if there is no existing ownership handover requested by `pendingOwner`.",
        },
        "grantRoles(address,uint256)": {
          details:
            "Allows the owner to grant `user` `roles`. If the `user` already has a role, then it will be an no-op for the role.",
        },
        "hasAllRoles(address,uint256)": {
          details: "Returns whether `user` has all of `roles`.",
        },
        "hasAnyRole(address,uint256)": {
          details: "Returns whether `user` has any of `roles`.",
        },
        "owner()": {
          details: "Returns the owner of the contract.",
        },
        "ownershipHandoverExpiresAt(address)": {
          details:
            "Returns the expiry timestamp for the two-step ownership handover to `pendingOwner`.",
        },
        "renounceOwnership()": {
          details: "Allows the owner to renounce their ownership.",
        },
        "renounceRoles(uint256)": {
          details:
            "Allow the caller to remove their own roles. If the caller does not have a role, then it will be an no-op for the role.",
        },
        "requestOwnershipHandover()": {
          details:
            "Request a two-step ownership handover to the caller. The request will automatically expire in 48 hours (172800 seconds) by default.",
        },
        "revokeRoles(address,uint256)": {
          details:
            "Allows the owner to remove `user` `roles`. If the `user` does not have a role, then it will be an no-op for the role.",
        },
        "rolesOf(address)": {
          details: "Returns the roles of `user`.",
        },
        "transferOwnership(address)": {
          details: "Allows the owner to transfer the ownership to `newOwner`.",
        },
      },
      version: 1,
    },
    userdoc: {
      events: {
        "ExtensionInstalled(address,address,address)": {
          notice: "Emitted when an extension is installed.",
        },
        "ExtensionUninstalled(address,address,address)": {
          notice: "Emitted when an extension is uninstalled.",
        },
      },
      kind: "user",
      methods: {
        "getInstalledExtensions()": {
          notice:
            "Returns a list of addresess and respective extension configs of all installed extensions.",
        },
        "getSupportedCallbackFunctions()": {
          notice:
            "Returns the list of all callback functions called on some extension contract.",
        },
        "installExtension(address,bytes)": {
          notice: "Installs an extension contract.",
        },
        "supportsInterface(bytes4)": {
          notice:
            "Returns whether a given interface is implemented by the contract.",
        },
        "uninstallExtension(address,bytes)": {
          notice: "Uninstalls an extension contract.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/Demo.sol": "DemoCore",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 10000,
    },
    remappings: [
      ":@erc721a-upgradeable/=lib/ERC721A-Upgradeable/contracts/",
      ":@erc721a/=lib/erc721a/contracts/",
      ":@solady/=lib/solady/src/",
      ":ERC721A-Upgradeable/=lib/ERC721A-Upgradeable/contracts/",
      ":ds-test/=lib/forge-std/lib/ds-test/src/",
      ":erc721a/=lib/erc721a/contracts/",
      ":forge-std/=lib/forge-std/src/",
      ":solady/=lib/solady/src/",
    ],
  },
  sources: {
    "lib/solady/src/auth/Ownable.sol": {
      keccak256:
        "0xc208cdd9de02bbf4b5edad18b88e23a2be7ff56d2287d5649329dc7cda64b9a3",
      license: "MIT",
      urls: [
        "bzz-raw://e8fba079cc7230c617f7493a2e97873f88e59a53a5018fcb2e2b6ac42d8aa5a3",
        "dweb:/ipfs/QmTXg8GSt8hsK2cZhbPFrund1mrwVdkLQmEPoQaFy4fhjs",
      ],
    },
    "lib/solady/src/auth/OwnableRoles.sol": {
      keccak256:
        "0xd797b6f74f6421d77d74cda55d494470495264ab100cff82a71ff2297d4870e3",
      license: "MIT",
      urls: [
        "bzz-raw://b7504f97d8d3a908802f40fabbb4dcfcbf8e008b627be57f14ee84b67e0d9f3c",
        "dweb:/ipfs/QmXYrdhsYTGDqBdSvvyXQNVpZRAPYXdCcERG8DDPXZY67L",
      ],
    },
    "lib/solady/src/utils/EnumerableSetLib.sol": {
      keccak256:
        "0x6809f4f8e7c82c59e679694d73d5dfb2ca3a70202171baf24cffddc88475492f",
      license: "MIT",
      urls: [
        "bzz-raw://1ec4af64d282e86df4157c9936e53187a119560c9d6206a2977560e093baefcf",
        "dweb:/ipfs/QmQ3UGs8RDtA6mZCEeqE2S9tpdxDBBoK58XrULfRkMCbwP",
      ],
    },
    "lib/solady/src/utils/Initializable.sol": {
      keccak256:
        "0x039ac865df50f874528619e58f2bfaa665b6cec82647c711e515cb252a45a2ec",
      license: "MIT",
      urls: [
        "bzz-raw://1886c0e71f4861a23113f9d3eb5f6f00397c1d1bf0191f92534c177a79ac8559",
        "dweb:/ipfs/QmPLWU427MN9KHFg6DFkrYNutCDLdtNSQLaqmPqKcoPRLy",
      ],
    },
    "src/Demo.sol": {
      keccak256:
        "0x26cf27d0b9d42b068e9dca594243ff062573575fecac42637139f853d73077c5",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://0bfa558e69642ebbceff09535c2c0851a58d0530b30a631ad2b9bc61db48874a",
        "dweb:/ipfs/QmcoAAQ6R7XBzM7GRjPemBJA8qUGAJr3v8wt4fE6zDBjap",
      ],
    },
    "src/ModularCore.sol": {
      keccak256:
        "0x6354cf9f0c1015094afebea097483a51ae992fe5cce0863f1d91a6cb8af3d800",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://18bbaab05ed7d5a9be785ca7622496d654e452f5084a320acc02eeb529290b3c",
        "dweb:/ipfs/QmRuPztqbGnRrgHQjMcMt2c9p7posqBMZKjtbNfRciswQg",
      ],
    },
    "src/ModularExtension.sol": {
      keccak256:
        "0x120eb58c0831e92c2d2fe9bebe665e8b24e8beb9bae4879f557e0732931ad645",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://2962dce5204f30a08ad0eed7072fb167c585ce77b4a6b1c89eb55e14020812d8",
        "dweb:/ipfs/QmRK6RUWWuvDCFC9KhAnvpGSZPR6FKDYjaTwSsjQpEkduq",
      ],
    },
    "src/Role.sol": {
      keccak256:
        "0xafc9a9efc8a061ba0cdfa1d8f67c6a0465e3fa5575d884b56b1f78ff0e9da6d1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://eca0dfa2bb454c50c71e8522cf22afca4e72187dec78a005b8ecbb813b9e1d1f",
        "dweb:/ipfs/QmR5JK7xHuhTk56LYXFHL3dD89gaLUNWAfstKSXhe2ZsuR",
      ],
    },
    "src/interface/IERC165.sol": {
      keccak256:
        "0xedb23845bbd16950c2dd587776ee5752e7fb54f314a41f7250c2b0ce79209d31",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://bf4c874ad60ae5a5bdaeef490e0cbfba68eba0c5b8f7dde6c35cca0e2a17134a",
        "dweb:/ipfs/QmVxsnGzJoLb18NZBRSzmRomCzth9nkZB6DuFzCBQreUct",
      ],
    },
    "src/interface/IExtensionConfig.sol": {
      keccak256:
        "0xa7953888a74c3e8000fc89008cf09b5adb9cbb0f02bfbbadbf9ea0d74dd18bc0",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://dff641cb3d124bfdc10dcc0acd7240da9bb68dc208875f89b4eecfd15904433c",
        "dweb:/ipfs/Qme3u2APb21RdyFA73NPgudV2C4cPkHZqcLD2hoLBkjQ8X",
      ],
    },
    "src/interface/IInstallationCallback.sol": {
      keccak256:
        "0x23806729fd4c7a45fcf0cc9b8ce153030d5fa5345c6158641b6694219ce682c7",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://9720f94ba431ebcb89055eb2822c94df6e5668453a9ebfb50d86c2f29c67e794",
        "dweb:/ipfs/QmWXnCwV8PWW9PMdwXPhuHE6knyMHQhChEPiDs6g72gM16",
      ],
    },
    "src/interface/IModularCore.sol": {
      keccak256:
        "0xf3edc012602480d2be841eeea6d65fc26603b2ab5be9cf430dff40c755612ac8",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://054fb78914d07b87626a626c698afdcec02d5b9314e2c7f7447196e9ba1fa672",
        "dweb:/ipfs/QmfQvFE6t8tGBpmJYii56uaduPpZnksGvswUe6RGLoYHrM",
      ],
    },
    "src/interface/IModularExtension.sol": {
      keccak256:
        "0x3558cfd513788fa869387d88fd5a6e43d0656779649181b61489f5f69e3c11dd",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://2be10ae19d798164f4afd81dc183e1c3b0e912d9eba69feadf6279db96edf614",
        "dweb:/ipfs/QmZSBwJn68oxxskwGMajZPP4np93YSZfBBhtc4ftWxbK2v",
      ],
    },
  },
  version: 1,
};

export const mockCoreBytecode =
  "0x6080604052348015600f57600080fd5b50612c548061001f6000396000f3fe6080604052600436106101635760003560e01c806354d1f13d116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104e9578063f2fde38b1461050b578063fee81cf41461051e5761016a565b8063edf8bf05146104c1578063f04e283e146104d65761016a565b80638da5cb5b116100a55780638da5cb5b14610447578063aca696f51461049b578063d561e489146104ae5761016a565b806354d1f13d14610437578063715018a61461043f5761016a565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103cb578063514e62fc146103de5780635357aa5e146104155761016a565b80632de948071461037757806342b7d0c8146103b85761016a565b80631c10893f116101485780631c10893f1461033c5780631cd64df41461034f578063256929621461036f5761016a565b806301ffc9a7146102f4578063183a4f6e146103295761016a565b3661016a57005b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101ec576101ec61218c565b60018111156101fd576101fd61218c565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610251576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000816040015160018111156102695761026961218c565b036102ac573330146102a7576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102e7565b6001816040015160018111156102c4576102c461218c565b1480156102d5575060008160200151115b156102e7576102e78160200151610551565b80516102f2906105a2565b005b34801561030057600080fd5b5061031461030f3660046121e9565b6105dd565b60405190151581526020015b60405180910390f35b6102f261033736600461220d565b610658565b6102f261034a36600461224f565b610662565b34801561035b57600080fd5b5061031461036a36600461224f565b610678565b6102f2610697565b34801561038357600080fd5b506103aa610392366004612279565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610320565b6102f26103c6366004612294565b6106e7565b6102f26103d936600461224f565b610757565b3480156103ea57600080fd5b506103146103f936600461224f565b638b78c6d8600c90815260009290925260209091205416151590565b34801561042157600080fd5b5061042a610769565b60405161032091906123d4565b6102f26108af565b6102f26108eb565b34801561045357600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610320565b6102f26104a9366004612294565b6108ff565b6102f26104bc3660046126ea565b610969565b3480156104cd57600080fd5b506102f2610a50565b6102f26104e4366004612279565b610ad6565b3480156104f557600080fd5b506104fe610b13565b60405161032091906127bc565b6102f2610519366004612279565b610b22565b34801561052a57600080fd5b506103aa610539366004612279565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059f57638b78c6d8600c5233600052806020600c20541661059f576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105cb3d60408051918201905290565b3d6000823e816105d9573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361061157506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561065057506001919050565b506000919050565b61059f3382610b49565b61066a610b55565b6106748282610b8b565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b7f800000000000000000000000000000000000000000000000000000000000000061071181610551565b6107518484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610b9792505050565b50505050565b61075f610b55565b6106748282610b49565b606060006107776000610ff0565b90508067ffffffffffffffff81111561079257610792612530565b6040519080825280602002602001820160405280156107cb57816020015b6107b861210c565b8152602001906001900390816107b05790505b50915060005b818110156108aa5760006107e58183611042565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610859573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108819190810190612a18565b81525084838151811061089657610896612aef565b6020908102919091010152506001016107d1565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b6108f3610b55565b6108fd60006110b5565b565b7f800000000000000000000000000000000000000000000000000000000000000061092981610551565b6107518484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061111b92505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109bb5760018160011c14303b106109b25763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109c584611974565b60005b8351811015610a1557610a0d8482815181106109e6576109e6612aef565b6020026020010151848381518110610a0057610a00612aef565b602002602001015161111b565b6001016109c8565b508015610751576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610674907fffffffff0000000000000000000000000000000000000000000000000000000060003516906119d8565b610ade610b55565b63389a75e1600c52806000526020600c208054421115610b0657636f5e88186000526004601cfd5b6000905561059f816110b5565b6060610b1d611c82565b905090565b610b2a610b55565b8060601b610b4057637448fbae6000526004601cfd5b61059f816110b5565b61067482826000611db5565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108fd576382b429006000526004601cfd5b61067482826001611db5565b610ba2600083611e0e565b610bd8576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c25573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c4d9190810190612a18565b60408101515190915060005b81811015610cec57600180600085604001518481518110610c7c57610c7c612aef565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610cdf9190612b4d565b9091555050600101610c59565b5060808201515160005b81811015610db5576002600085608001518381518110610d1857610d18612aef565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610cf6565b5060608301515160005b81811015610e7e576002600086606001518381518110610de157610de1612aef565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610dbf565b50836020015115610f93576000808773ffffffffffffffffffffffffffffffffffffffff16343389604051602401610eb7929190612b84565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f13fe88e10000000000000000000000000000000000000000000000000000000017905251610f1a9190612bd4565b60006040518083038185875af1925050503d8060008114610f57576040519150601f19603f3d011682016040523d82523d6000602084013e610f5c565b606091505b509150915081610f9057610f90817f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c151761103a5760019350838301541561103a5760029350838301541561103a57600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061107684610ff0565b83106110ae576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b611126600083611f95565b61115c576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156111a9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111d19190810190612a18565b80519091507fffffffff0000000000000000000000000000000000000000000000000000000016156112fb5780516040517f01ffc9a70000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015230906301ffc9a790602401602060405180830381865afa158015611276573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129a9190612bf0565b6112fb5780516040517ff9b4b3d80000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015260240160405180910390fd5b60408101515160005b818110156113975760018060008560400151848151811061132757611327612aef565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600082825461138a9190612c0b565b9091555050600101611304565b5060006113a2610b13565b80516060850151519192509060005b81811015611639576000866060015182815181106113d1576113d1612aef565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611461576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114e45782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168782815181106114a3576114a3612aef565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916036114dc57600191506114e4565b600101611465565b508061151c576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016000600181111561155d5761155d61218c565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169083818111156116245761162461218c565b021790555050600190930192506113b1915050565b5060808501515160005b818110156118005760008760800151828151811061166357611663612aef565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156116f3576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169083818111156117ec576117ec61218c565b021790555050600190920191506116439050565b50856020015115611915576000808973ffffffffffffffffffffffffffffffffffffffff1634338b604051602401611839929190612b84565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff8a6e73f000000000000000000000000000000000000000000000000000000001790525161189c9190612bd4565b60006040518083038185875af1925050503d80600081146118d9576040519150601f19603f3d011682016040523d82523d6000602084013e6118de565b606091505b50915091508161191257611912817f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600260208181526040808420815160608181018452825473ffffffffffffffffffffffffffffffffffffffff16825260018084015495830195909552948201548694919384019160ff90911690811115611a5c57611a5c61218c565b6001811115611a6d57611a6d61218c565b9052509050600081604001516001811115611a8a57611a8a61218c565b14611ac1576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611acb610b13565b80519091506000805b82811015611b6b57887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611b0e57611b0e612aef565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611b6357838181518110611b5057611b50612aef565b6020026020010151602001519150611b6b565b600101611ad4565b50835173ffffffffffffffffffffffffffffffffffffffff1615611bfd57836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611bb29190612bd4565b600060405180830381855af49150503d8060008114611bed576040519150601f19603f3d011682016040523d82523d6000602084013e611bf2565b606091505b509096509450611c48565b6001816001811115611c1157611c1161218c565b03611c48576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b85611c7757611c77857f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b505050509250929050565b6060611c90600a6001612c0b565b67ffffffffffffffff811115611ca857611ca8612530565b604051908082528060200260200182016040528015611ced57816020015b6040805180820190915260008082526020820152815260200190600190039081611cc65790505b50905060005b600a811015611d5d57604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611d4a57611d4a612aef565b6020908102919091010152600101611cf3565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611da757611da7612aef565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611dd7575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611e6e5763f5a267f16000526004601cfd5b82611e805768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611f035760019350848260601c03611ebe57600183018054845560028401805490915560009055611f73565b84600184015460601c03611ee057600283018054600185015560009055611f73565b84600284015460601c03611efa5760006002840155611f73565b60009350611f73565b82602052846000526040600020805480611f1e575050611f73565b60018360011c039250826001820314611f56578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b815115611f8b57815182602001fd5b806000526004601cfd5b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611ff55763f5a267f16000526004601cfd5b826120075768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811682602052806120cf578160601c8061203a578560601b84556001945050611f73565b8581036120475750611f73565b600184015460601c80612068578660601b6001860155600195505050611f73565b868103612076575050611f73565b600285015460601c80612098578760601b600287015560019650505050611f73565b8781036120a757505050611f73565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b8460005260406000208054612102578160011c91508560601b828501558160010181558260020184556001945050611f73565b5050505092915050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016121876040518060a0016040528060007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000151581526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059f57600080fd5b6000602082840312156121fb57600080fd5b8135612206816121bb565b9392505050565b60006020828403121561221f57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461224a57600080fd5b919050565b6000806040838503121561226257600080fd5b61226b83612226565b946020939093013593505050565b60006020828403121561228b57600080fd5b61220682612226565b6000806000604084860312156122a957600080fd5b6122b284612226565b9250602084013567ffffffffffffffff808211156122cf57600080fd5b818601915086601f8301126122e357600080fd5b8135818111156122f257600080fd5b87602082850101111561230457600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b8381101561236b578151517fffffffff00000000000000000000000000000000000000000000000000000000168752958201959082019060010161232c565b509495945050505050565b60008151808452602080850194506020840160005b8381101561236b57815180517fffffffff00000000000000000000000000000000000000000000000000000000168852830151838801526040909601959082019060010161238b565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b83811015612522577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0898403810186528251805173ffffffffffffffffffffffffffffffffffffffff16855288015188850188905280517fffffffff0000000000000000000000000000000000000000000000000000000090811689870152818a0151151560608701528882015160a06080808901829052825160e08a01819052928d01939260009291906101008b01905b808510156124d157865186168252958f019560019490940193908f01906124af565b5060608701519550878b820301838c01526124ec8187612317565b95505080860151955050505050828682030160c087015261250d8183612376565b978a01979550505091870191506001016123fd565b509098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff8111828210171561258257612582612530565b60405290565b60405160a0810167ffffffffffffffff8111828210171561258257612582612530565b604051601f8201601f1916810167ffffffffffffffff811182821017156125d4576125d4612530565b604052919050565b600067ffffffffffffffff8211156125f6576125f6612530565b5060051b60200190565b6000601f83601f84011261261357600080fd5b82356020612628612623836125dc565b6125ab565b82815260059290921b8501810191818101908784111561264757600080fd5b8287015b848110156126de57803567ffffffffffffffff8082111561266c5760008081fd5b818a0191508a603f8301126126815760008081fd5b8582013560408282111561269757612697612530565b6126a888601f198c850116016125ab565b92508183528c818386010111156126bf5760008081fd5b818185018985013750600090820187015284525091830191830161264b565b50979650505050505050565b6000806000606084860312156126ff57600080fd5b61270884612226565b925060208085013567ffffffffffffffff8082111561272657600080fd5b818701915087601f83011261273a57600080fd5b8135612748612623826125dc565b81815260059190911b8301840190848101908a83111561276757600080fd5b938501935b8285101561278c5761277d85612226565b8252938501939085019061276c565b9650505060408701359250808311156127a457600080fd5b50506127b286828701612600565b9150509250925092565b60208082528251828201819052600091906040908185019086840185805b8381101561285657825180517fffffffff0000000000000000000000000000000000000000000000000000000016865287015160028110612842577f4e487b710000000000000000000000000000000000000000000000000000000083526021600452602483fd5b8588015293850193918601916001016127da565b509298975050505050505050565b805161224a816121bb565b8051801515811461224a57600080fd5b600082601f83011261289057600080fd5b815160206128a0612623836125dc565b8083825260208201915060208460051b8701019350868411156128c257600080fd5b602086015b848110156128e75780516128da816121bb565b83529183019183016128c7565b509695505050505050565b600082601f83011261290357600080fd5b81516020612913612623836125dc565b82815260059290921b8401810191818101908684111561293257600080fd5b8286015b848110156128e75783818903121561294e5760008081fd5b6040805185810181811067ffffffffffffffff8211171561297157612971612530565b909152815190612980826121bb565b9081528352918301918301612936565b600082601f8301126129a157600080fd5b815160206129b1612623836125dc565b82815260069290921b840181019181810190868411156129d057600080fd5b8286015b848110156128e757604081890312156129ed5760008081fd5b6129f561255f565b8151612a00816121bb565b815281850151858201528352918301916040016129d4565b600060208284031215612a2a57600080fd5b815167ffffffffffffffff80821115612a4257600080fd5b9083019060a08286031215612a5657600080fd5b612a5e612588565b612a6783612864565b8152612a756020840161286f565b6020820152604083015182811115612a8c57600080fd5b612a988782860161287f565b604083015250606083015182811115612ab057600080fd5b612abc878286016128f2565b606083015250608083015182811115612ad457600080fd5b612ae087828601612990565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561069157610691612b1e565b60005b83811015612b7b578181015183820152602001612b63565b50506000910152565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015260008251806040840152612bbf816060850160208701612b60565b601f01601f1916919091016060019392505050565b60008251612be6818460208701612b60565b9190910192915050565b600060208284031215612c0257600080fd5b6122068261286f565b8082018082111561069157610691612b1e56fea2646970667358221220ef64f89bb11c1bede7d6843c1ce4419a2e94bb25cc84cecda7cd8a4e16292f3f64736f6c63430008190033";

export const mockCoreDeployedBytecode =
  "0x6080604052600436106101635760003560e01c806354d1f13d116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104e9578063f2fde38b1461050b578063fee81cf41461051e5761016a565b8063edf8bf05146104c1578063f04e283e146104d65761016a565b80638da5cb5b116100a55780638da5cb5b14610447578063aca696f51461049b578063d561e489146104ae5761016a565b806354d1f13d14610437578063715018a61461043f5761016a565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103cb578063514e62fc146103de5780635357aa5e146104155761016a565b80632de948071461037757806342b7d0c8146103b85761016a565b80631c10893f116101485780631c10893f1461033c5780631cd64df41461034f578063256929621461036f5761016a565b806301ffc9a7146102f4578063183a4f6e146103295761016a565b3661016a57005b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101ec576101ec61218c565b60018111156101fd576101fd61218c565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610251576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000816040015160018111156102695761026961218c565b036102ac573330146102a7576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102e7565b6001816040015160018111156102c4576102c461218c565b1480156102d5575060008160200151115b156102e7576102e78160200151610551565b80516102f2906105a2565b005b34801561030057600080fd5b5061031461030f3660046121e9565b6105dd565b60405190151581526020015b60405180910390f35b6102f261033736600461220d565b610658565b6102f261034a36600461224f565b610662565b34801561035b57600080fd5b5061031461036a36600461224f565b610678565b6102f2610697565b34801561038357600080fd5b506103aa610392366004612279565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610320565b6102f26103c6366004612294565b6106e7565b6102f26103d936600461224f565b610757565b3480156103ea57600080fd5b506103146103f936600461224f565b638b78c6d8600c90815260009290925260209091205416151590565b34801561042157600080fd5b5061042a610769565b60405161032091906123d4565b6102f26108af565b6102f26108eb565b34801561045357600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610320565b6102f26104a9366004612294565b6108ff565b6102f26104bc3660046126ea565b610969565b3480156104cd57600080fd5b506102f2610a50565b6102f26104e4366004612279565b610ad6565b3480156104f557600080fd5b506104fe610b13565b60405161032091906127bc565b6102f2610519366004612279565b610b22565b34801561052a57600080fd5b506103aa610539366004612279565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059f57638b78c6d8600c5233600052806020600c20541661059f576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105cb3d60408051918201905290565b3d6000823e816105d9573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361061157506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561065057506001919050565b506000919050565b61059f3382610b49565b61066a610b55565b6106748282610b8b565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b7f800000000000000000000000000000000000000000000000000000000000000061071181610551565b6107518484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610b9792505050565b50505050565b61075f610b55565b6106748282610b49565b606060006107776000610ff0565b90508067ffffffffffffffff81111561079257610792612530565b6040519080825280602002602001820160405280156107cb57816020015b6107b861210c565b8152602001906001900390816107b05790505b50915060005b818110156108aa5760006107e58183611042565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610859573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108819190810190612a18565b81525084838151811061089657610896612aef565b6020908102919091010152506001016107d1565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b6108f3610b55565b6108fd60006110b5565b565b7f800000000000000000000000000000000000000000000000000000000000000061092981610551565b6107518484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061111b92505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109bb5760018160011c14303b106109b25763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109c584611974565b60005b8351811015610a1557610a0d8482815181106109e6576109e6612aef565b6020026020010151848381518110610a0057610a00612aef565b602002602001015161111b565b6001016109c8565b508015610751576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610674907fffffffff0000000000000000000000000000000000000000000000000000000060003516906119d8565b610ade610b55565b63389a75e1600c52806000526020600c208054421115610b0657636f5e88186000526004601cfd5b6000905561059f816110b5565b6060610b1d611c82565b905090565b610b2a610b55565b8060601b610b4057637448fbae6000526004601cfd5b61059f816110b5565b61067482826000611db5565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108fd576382b429006000526004601cfd5b61067482826001611db5565b610ba2600083611e0e565b610bd8576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c25573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c4d9190810190612a18565b60408101515190915060005b81811015610cec57600180600085604001518481518110610c7c57610c7c612aef565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610cdf9190612b4d565b9091555050600101610c59565b5060808201515160005b81811015610db5576002600085608001518381518110610d1857610d18612aef565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610cf6565b5060608301515160005b81811015610e7e576002600086606001518381518110610de157610de1612aef565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610dbf565b50836020015115610f93576000808773ffffffffffffffffffffffffffffffffffffffff16343389604051602401610eb7929190612b84565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f13fe88e10000000000000000000000000000000000000000000000000000000017905251610f1a9190612bd4565b60006040518083038185875af1925050503d8060008114610f57576040519150601f19603f3d011682016040523d82523d6000602084013e610f5c565b606091505b509150915081610f9057610f90817f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c151761103a5760019350838301541561103a5760029350838301541561103a57600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061107684610ff0565b83106110ae576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b611126600083611f95565b61115c576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156111a9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111d19190810190612a18565b80519091507fffffffff0000000000000000000000000000000000000000000000000000000016156112fb5780516040517f01ffc9a70000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015230906301ffc9a790602401602060405180830381865afa158015611276573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129a9190612bf0565b6112fb5780516040517ff9b4b3d80000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015260240160405180910390fd5b60408101515160005b818110156113975760018060008560400151848151811061132757611327612aef565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600082825461138a9190612c0b565b9091555050600101611304565b5060006113a2610b13565b80516060850151519192509060005b81811015611639576000866060015182815181106113d1576113d1612aef565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611461576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114e45782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168782815181106114a3576114a3612aef565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916036114dc57600191506114e4565b600101611465565b508061151c576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff168152602001600081526020016000600181111561155d5761155d61218c565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169083818111156116245761162461218c565b021790555050600190930192506113b1915050565b5060808501515160005b818110156118005760008760800151828151811061166357611663612aef565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156116f3576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169083818111156117ec576117ec61218c565b021790555050600190920191506116439050565b50856020015115611915576000808973ffffffffffffffffffffffffffffffffffffffff1634338b604051602401611839929190612b84565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff8a6e73f000000000000000000000000000000000000000000000000000000001790525161189c9190612bd4565b60006040518083038185875af1925050503d80600081146118d9576040519150601f19603f3d011682016040523d82523d6000602084013e6118de565b606091505b50915091508161191257611912817f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600260208181526040808420815160608181018452825473ffffffffffffffffffffffffffffffffffffffff16825260018084015495830195909552948201548694919384019160ff90911690811115611a5c57611a5c61218c565b6001811115611a6d57611a6d61218c565b9052509050600081604001516001811115611a8a57611a8a61218c565b14611ac1576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611acb610b13565b80519091506000805b82811015611b6b57887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611b0e57611b0e612aef565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611b6357838181518110611b5057611b50612aef565b6020026020010151602001519150611b6b565b600101611ad4565b50835173ffffffffffffffffffffffffffffffffffffffff1615611bfd57836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611bb29190612bd4565b600060405180830381855af49150503d8060008114611bed576040519150601f19603f3d011682016040523d82523d6000602084013e611bf2565b606091505b509096509450611c48565b6001816001811115611c1157611c1161218c565b03611c48576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b85611c7757611c77857f3fcb904500000000000000000000000000000000000000000000000000000000611f7c565b505050509250929050565b6060611c90600a6001612c0b565b67ffffffffffffffff811115611ca857611ca8612530565b604051908082528060200260200182016040528015611ced57816020015b6040805180820190915260008082526020820152815260200190600190039081611cc65790505b50905060005b600a811015611d5d57604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611d4a57611d4a612aef565b6020908102919091010152600101611cf3565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611da757611da7612aef565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611dd7575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611e6e5763f5a267f16000526004601cfd5b82611e805768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611f035760019350848260601c03611ebe57600183018054845560028401805490915560009055611f73565b84600184015460601c03611ee057600283018054600185015560009055611f73565b84600284015460601c03611efa5760006002840155611f73565b60009350611f73565b82602052846000526040600020805480611f1e575050611f73565b60018360011c039250826001820314611f56578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b815115611f8b57815182602001fd5b806000526004601cfd5b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611ff55763f5a267f16000526004601cfd5b826120075768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811682602052806120cf578160601c8061203a578560601b84556001945050611f73565b8581036120475750611f73565b600184015460601c80612068578660601b6001860155600195505050611f73565b868103612076575050611f73565b600285015460601c80612098578760601b600287015560019650505050611f73565b8781036120a757505050611f73565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b8460005260406000208054612102578160011c91508560601b828501558160010181558260020184556001945050611f73565b5050505092915050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016121876040518060a0016040528060007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000151581526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059f57600080fd5b6000602082840312156121fb57600080fd5b8135612206816121bb565b9392505050565b60006020828403121561221f57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461224a57600080fd5b919050565b6000806040838503121561226257600080fd5b61226b83612226565b946020939093013593505050565b60006020828403121561228b57600080fd5b61220682612226565b6000806000604084860312156122a957600080fd5b6122b284612226565b9250602084013567ffffffffffffffff808211156122cf57600080fd5b818601915086601f8301126122e357600080fd5b8135818111156122f257600080fd5b87602082850101111561230457600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b8381101561236b578151517fffffffff00000000000000000000000000000000000000000000000000000000168752958201959082019060010161232c565b509495945050505050565b60008151808452602080850194506020840160005b8381101561236b57815180517fffffffff00000000000000000000000000000000000000000000000000000000168852830151838801526040909601959082019060010161238b565b600060208083018184528085518083526040925060408601915060408160051b87010184880160005b83811015612522577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0898403810186528251805173ffffffffffffffffffffffffffffffffffffffff16855288015188850188905280517fffffffff0000000000000000000000000000000000000000000000000000000090811689870152818a0151151560608701528882015160a06080808901829052825160e08a01819052928d01939260009291906101008b01905b808510156124d157865186168252958f019560019490940193908f01906124af565b5060608701519550878b820301838c01526124ec8187612317565b95505080860151955050505050828682030160c087015261250d8183612376565b978a01979550505091870191506001016123fd565b509098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff8111828210171561258257612582612530565b60405290565b60405160a0810167ffffffffffffffff8111828210171561258257612582612530565b604051601f8201601f1916810167ffffffffffffffff811182821017156125d4576125d4612530565b604052919050565b600067ffffffffffffffff8211156125f6576125f6612530565b5060051b60200190565b6000601f83601f84011261261357600080fd5b82356020612628612623836125dc565b6125ab565b82815260059290921b8501810191818101908784111561264757600080fd5b8287015b848110156126de57803567ffffffffffffffff8082111561266c5760008081fd5b818a0191508a603f8301126126815760008081fd5b8582013560408282111561269757612697612530565b6126a888601f198c850116016125ab565b92508183528c818386010111156126bf5760008081fd5b818185018985013750600090820187015284525091830191830161264b565b50979650505050505050565b6000806000606084860312156126ff57600080fd5b61270884612226565b925060208085013567ffffffffffffffff8082111561272657600080fd5b818701915087601f83011261273a57600080fd5b8135612748612623826125dc565b81815260059190911b8301840190848101908a83111561276757600080fd5b938501935b8285101561278c5761277d85612226565b8252938501939085019061276c565b9650505060408701359250808311156127a457600080fd5b50506127b286828701612600565b9150509250925092565b60208082528251828201819052600091906040908185019086840185805b8381101561285657825180517fffffffff0000000000000000000000000000000000000000000000000000000016865287015160028110612842577f4e487b710000000000000000000000000000000000000000000000000000000083526021600452602483fd5b8588015293850193918601916001016127da565b509298975050505050505050565b805161224a816121bb565b8051801515811461224a57600080fd5b600082601f83011261289057600080fd5b815160206128a0612623836125dc565b8083825260208201915060208460051b8701019350868411156128c257600080fd5b602086015b848110156128e75780516128da816121bb565b83529183019183016128c7565b509695505050505050565b600082601f83011261290357600080fd5b81516020612913612623836125dc565b82815260059290921b8401810191818101908684111561293257600080fd5b8286015b848110156128e75783818903121561294e5760008081fd5b6040805185810181811067ffffffffffffffff8211171561297157612971612530565b909152815190612980826121bb565b9081528352918301918301612936565b600082601f8301126129a157600080fd5b815160206129b1612623836125dc565b82815260069290921b840181019181810190868411156129d057600080fd5b8286015b848110156128e757604081890312156129ed5760008081fd5b6129f561255f565b8151612a00816121bb565b815281850151858201528352918301916040016129d4565b600060208284031215612a2a57600080fd5b815167ffffffffffffffff80821115612a4257600080fd5b9083019060a08286031215612a5657600080fd5b612a5e612588565b612a6783612864565b8152612a756020840161286f565b6020820152604083015182811115612a8c57600080fd5b612a988782860161287f565b604083015250606083015182811115612ab057600080fd5b612abc878286016128f2565b606083015250608083015182811115612ad457600080fd5b612ae087828601612990565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561069157610691612b1e565b60005b83811015612b7b578181015183820152602001612b63565b50506000910152565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015260008251806040840152612bbf816060850160208701612b60565b601f01601f1916919091016060019392505050565b60008251612be6818460208701612b60565b9190910192915050565b600060208284031215612c0257600080fd5b6122068261286f565b8082018082111561069157610691612b1e56fea2646970667358221220ef64f89bb11c1bede7d6843c1ce4419a2e94bb25cc84cecda7cd8a4e16292f3f64736f6c63430008190033";
