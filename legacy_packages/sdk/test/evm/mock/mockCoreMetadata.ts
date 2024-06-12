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
            name: "caller",
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
            name: "caller",
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
                    internalType: "bool",
                    name: "registerInstallationCallback",
                    type: "bool",
                  },
                  {
                    internalType: "bytes4[]",
                    name: "requiredInterfaces",
                    type: "bytes4[]",
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
        "0x7ec493d88700caed88169f40feda2b9b90eb3d68ce2d93be546988d57c034625",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://90c4da29f6db1795b3cf07d066c0e95c1f875fa593951c1d60deda6db54cd71a",
        "dweb:/ipfs/QmaM4eKB5kuXe8uF1rQmKetiSHFf6D2Jo12sxJyG9GckMK",
      ],
    },
    "src/ModularCore.sol": {
      keccak256:
        "0x8a9689ce76dd1620af3d8e4447d34690ce7b723b2afafd53d90e95408b287125",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://2ad7bb3f46b307efd5820ea25cfa3447ff0833ab9e9625d529bc42778f431e73",
        "dweb:/ipfs/QmfJGq5rDaArSJpNH2SxQpZM5t7GaikgQsTGaU5KQhJWao",
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
        "0x665aea5ebea206c634c3510260a083f13b0275a771740f278183d4b2a42a91f8",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8897a304b83d7e8a01f764fcc49287abdbdbf92b762332c919d56b22d72dc66f",
        "dweb:/ipfs/QmaEDW3w26NLVrLpfa5aNMwSMwnLCiiF9ukAAAcFNPrHrg",
      ],
    },
    "src/interface/IInstallationCallback.sol": {
      keccak256:
        "0xc26be53a5c593dea9d0694955b682af3b6ebb510042571bc793257b2d64fb907",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://5772a6f9e69f55a0946c0d3f208b4a9fb3d7da3c552aa61ec55027d62b61a231",
        "dweb:/ipfs/QmPFR6jecZuzRMgP2abPaWznR4yY7NnZooRk3TozvrMVdw",
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
  "0x6080604052348015600f57600080fd5b50612b698061001f6000396000f3fe60806040526004361061015f5760003560e01c806354d1f13d116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104de578063f2fde38b14610500578063fee81cf4146105135761015f565b8063edf8bf05146104b6578063f04e283e146104cb5761015f565b80638da5cb5b116100a55780638da5cb5b1461043c578063aca696f514610490578063d561e489146104a35761015f565b806354d1f13d1461042c578063715018a6146104345761015f565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103c0578063514e62fc146103d35780635357aa5e1461040a5761015f565b80632de948071461036c57806342b7d0c8146103ad5761015f565b80631c10893f116101485780631c10893f146103315780631cd64df41461034457806325692962146103645761015f565b806301ffc9a7146102e9578063183a4f6e1461031e575b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101e1576101e16120c7565b60018111156101f2576101f26120c7565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610246576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008160400151600181111561025e5761025e6120c7565b036102a15733301461029c576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102dc565b6001816040015160018111156102b9576102b96120c7565b1480156102ca575060008160200151115b156102dc576102dc8160200151610546565b80516102e790610597565b005b3480156102f557600080fd5b50610309610304366004612124565b6105d2565b60405190151581526020015b60405180910390f35b6102e761032c366004612148565b61064d565b6102e761033f36600461218a565b610657565b34801561035057600080fd5b5061030961035f36600461218a565b61066d565b6102e761068c565b34801561037857600080fd5b5061039f6103873660046121b4565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610315565b6102e76103bb3660046121cf565b6106dc565b6102e76103ce36600461218a565b61074c565b3480156103df57600080fd5b506103096103ee36600461218a565b638b78c6d8600c90815260009290925260209091205416151590565b34801561041657600080fd5b5061041f61075e565b604051610315919061230e565b6102e76108a4565b6102e76108e0565b34801561044857600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610315565b6102e761049e3660046121cf565b6108f4565b6102e76104b136600461262f565b61095e565b3480156104c257600080fd5b506102e7610a45565b6102e76104d93660046121b4565b610acb565b3480156104ea57600080fd5b506104f3610b08565b6040516103159190612701565b6102e761050e3660046121b4565b610b17565b34801561051f57600080fd5b5061039f61052e3660046121b4565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059457638b78c6d8600c5233600052806020600c205416610594576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105c03d60408051918201905290565b3d6000823e816105ce573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361060657506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561064557506001919050565b506000919050565b6105943382610b3e565b61065f610b4a565b6106698282610b80565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b7f800000000000000000000000000000000000000000000000000000000000000061070681610546565b6107468484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610b8c92505050565b50505050565b610754610b4a565b6106698282610b3e565b6060600061076c6000610fa7565b90508067ffffffffffffffff81111561078757610787612475565b6040519080825280602002602001820160405280156107c057816020015b6107ad612066565b8152602001906001900390816107a55790505b50915060005b8181101561089f5760006107da8183610ff9565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa15801561084e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108769190810190612952565b81525084838151811061088b5761088b612a3c565b6020908102919091010152506001016107c6565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b6108e8610b4a565b6108f2600061106c565b565b7f800000000000000000000000000000000000000000000000000000000000000061091e81610546565b6107468484848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110d292505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109b05760018160011c14303b106109a75763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109ba846118ce565b60005b8351811015610a0a57610a028482815181106109db576109db612a3c565b60200260200101518483815181106109f5576109f5612a3c565b60200260200101516110d2565b6001016109bd565b508015610746576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610669907fffffffff000000000000000000000000000000000000000000000000000000006000351690611932565b610ad3610b4a565b63389a75e1600c52806000526020600c208054421115610afb57636f5e88186000526004601cfd5b600090556105948161106c565b6060610b12611bdc565b905090565b610b1f610b4a565b8060601b610b3557637448fbae6000526004601cfd5b6105948161106c565b61066982826000611d0f565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108f2576382b429006000526004601cfd5b61066982826001611d0f565b610b97600083611d68565b610bcd576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c1a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c429190810190612952565b60408101515190915060005b81811015610ce157600180600085604001518481518110610c7157610c71612a3c565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610cd49190612a9a565b9091555050600101610c4e565b5060808201515160005b81811015610daa576002600085608001518381518110610d0d57610d0d612a3c565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610ceb565b5060608301515160005b81811015610e73576002600086606001518381518110610dd657610dd6612a3c565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610db4565b50835115610f4a578573ffffffffffffffffffffffffffffffffffffffff1685604051602401610ea39190612ad1565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f8a91b0e30000000000000000000000000000000000000000000000000000000017905251610f069190612b04565b600060405180830381855af49150503d8060008114610f41576040519150601f19603f3d011682016040523d82523d6000602084013e610f46565b606091505b5050505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c1517610ff157600193508383015415610ff157600293508383015415610ff157600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061102d84610fa7565b8310611065576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6110dd600083611ed6565b611113576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611160573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111889190810190612952565b905080602001515160001461125d5760005b81602001515181101561125b576111cd826020015182815181106111c0576111c0612a3c565b60200260200101516105d2565b61125357816020015181815181106111e7576111e7612a3c565b60200260200101516040517ff9b4b3d800000000000000000000000000000000000000000000000000000000815260040161124a91907fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b60405180910390fd5b60010161119a565b505b60408101515160005b818110156112f95760018060008560400151848151811061128957611289612a3c565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112ec9190612b20565b9091555050600101611266565b506000611304610b08565b80516060850151519192509060005b8181101561159b5760008660600151828151811061133357611333612a3c565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156113c3576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114465782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061140557611405612a3c565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361143e5760019150611446565b6001016113c7565b508061147e576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600060018111156114bf576114bf6120c7565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016908381811115611586576115866120c7565b02179055505060019093019250611313915050565b5060808501515160005b81811015611762576000876080015182815181106115c5576115c5612a3c565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611655576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561174e5761174e6120c7565b021790555050600190920191506115a59050565b5085511561186f576000808973ffffffffffffffffffffffffffffffffffffffff16896040516024016117959190612ad1565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f6d61fe7000000000000000000000000000000000000000000000000000000000179052516117f89190612b04565b600060405180830381855af49150503d8060008114611833576040519150601f19603f3d011682016040523d82523d6000602084013e611838565b606091505b50915091508161186c5761186c817f3fcb90450000000000000000000000000000000000000000000000000000000061204d565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600260208181526040808420815160608181018452825473ffffffffffffffffffffffffffffffffffffffff16825260018084015495830195909552948201548694919384019160ff909116908111156119b6576119b66120c7565b60018111156119c7576119c76120c7565b90525090506000816040015160018111156119e4576119e46120c7565b14611a1b576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611a25610b08565b80519091506000805b82811015611ac557887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611a6857611a68612a3c565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611abd57838181518110611aaa57611aaa612a3c565b6020026020010151602001519150611ac5565b600101611a2e565b50835173ffffffffffffffffffffffffffffffffffffffff1615611b8657836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611b0c9190612b04565b600060405180830381855af49150503d8060008114611b47576040519150601f19603f3d011682016040523d82523d6000602084013e611b4c565b606091505b50909650945085611b8157611b81857f3fcb90450000000000000000000000000000000000000000000000000000000061204d565b611bd1565b6001816001811115611b9a57611b9a6120c7565b03611bd1576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050509250929050565b6060611bea600a6001612b20565b67ffffffffffffffff811115611c0257611c02612475565b604051908082528060200260200182016040528015611c4757816020015b6040805180820190915260008082526020820152815260200190600190039081611c205790505b50905060005b600a811015611cb757604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611ca457611ca4612a3c565b6020908102919091010152600101611c4d565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611d0157611d01612a3c565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611d31575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611dc85763f5a267f16000526004601cfd5b82611dda5768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611e5d5760019350848260601c03611e1857600183018054845560028401805490915560009055611ecd565b84600184015460601c03611e3a57600283018054600185015560009055611ecd565b84600284015460601c03611e545760006002840155611ecd565b60009350611ecd565b82602052846000526040600020805480611e78575050611ecd565b60018360011c039250826001820314611eb0578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611f365763f5a267f16000526004601cfd5b82611f485768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff81168260205280612010578160601c80611f7b578560601b84556001945050611ecd565b858103611f885750611ecd565b600184015460601c80611fa9578660601b6001860155600195505050611ecd565b868103611fb7575050611ecd565b600285015460601c80611fd9578760601b600287015560019650505050611ecd565b878103611fe857505050611ecd565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b8460005260406000208054612043578160011c91508560601b828501558160010181558260020184556001945050611ecd565b5050505092915050565b81511561205c57815182602001fd5b806000526004601cfd5b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016120c26040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059457600080fd5b60006020828403121561213657600080fd5b8135612141816120f6565b9392505050565b60006020828403121561215a57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461218557600080fd5b919050565b6000806040838503121561219d57600080fd5b6121a683612161565b946020939093013593505050565b6000602082840312156121c657600080fd5b61214182612161565b6000806000604084860312156121e457600080fd5b6121ed84612161565b9250602084013567ffffffffffffffff8082111561220a57600080fd5b818601915086601f83011261221e57600080fd5b81358181111561222d57600080fd5b87602082850101111561223f57600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b838110156122a55781517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101612267565b509495945050505050565b60008151808452602080850194506020840160005b838110156122a557815180517fffffffff0000000000000000000000000000000000000000000000000000000016885283015183880152604090960195908201906001016122c5565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b84811015612466577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808b8603018752835173ffffffffffffffffffffffffffffffffffffffff8151168652898101519050888a87015280511515898701528981015160a0606081818a01526123b160e08a0184612252565b92508b8401516080868b860301818c01526123cc8583612252565b928601518b84038801948c01949094528351808452938f019450918e019288929091505b81831015612433578451517fffffffff00000000000000000000000000000000000000000000000000000000168452938e0193928e0192600192909201916123f0565b808601519550505050838882030160c089015261245081846122b0565b998c019997505050938901935050600101612338565b50919998505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156124c7576124c7612475565b60405290565b60405160a0810167ffffffffffffffff811182821017156124c7576124c7612475565b604051601f8201601f1916810167ffffffffffffffff8111828210171561251957612519612475565b604052919050565b600067ffffffffffffffff82111561253b5761253b612475565b5060051b60200190565b6000601f83601f84011261255857600080fd5b8235602061256d61256883612521565b6124f0565b82815260059290921b8501810191818101908784111561258c57600080fd5b8287015b8481101561262357803567ffffffffffffffff808211156125b15760008081fd5b818a0191508a603f8301126125c65760008081fd5b858201356040828211156125dc576125dc612475565b6125ed88601f198c850116016124f0565b92508183528c818386010111156126045760008081fd5b8181850189850137506000908201870152845250918301918301612590565b50979650505050505050565b60008060006060848603121561264457600080fd5b61264d84612161565b925060208085013567ffffffffffffffff8082111561266b57600080fd5b818701915087601f83011261267f57600080fd5b813561268d61256882612521565b81815260059190911b8301840190848101908a8311156126ac57600080fd5b938501935b828510156126d1576126c285612161565b825293850193908501906126b1565b9650505060408701359250808311156126e957600080fd5b50506126f786828701612545565b9150509250925092565b60208082528251828201819052600091906040908185019086840185805b8381101561279b57825180517fffffffff0000000000000000000000000000000000000000000000000000000016865287015160028110612787577f4e487b710000000000000000000000000000000000000000000000000000000083526021600452602483fd5b85880152938501939186019160010161271f565b509298975050505050505050565b8051801515811461218557600080fd5b600082601f8301126127ca57600080fd5b815160206127da61256883612521565b8083825260208201915060208460051b8701019350868411156127fc57600080fd5b602086015b84811015612821578051612814816120f6565b8352918301918301612801565b509695505050505050565b600082601f83011261283d57600080fd5b8151602061284d61256883612521565b82815260059290921b8401810191818101908684111561286c57600080fd5b8286015b84811015612821578381890312156128885760008081fd5b6040805185810181811067ffffffffffffffff821117156128ab576128ab612475565b9091528151906128ba826120f6565b9081528352918301918301612870565b600082601f8301126128db57600080fd5b815160206128eb61256883612521565b82815260069290921b8401810191818101908684111561290a57600080fd5b8286015b8481101561282157604081890312156129275760008081fd5b61292f6124a4565b815161293a816120f6565b8152818501518582015283529183019160400161290e565b60006020828403121561296457600080fd5b815167ffffffffffffffff8082111561297c57600080fd5b9083019060a0828603121561299057600080fd5b6129986124cd565b6129a1836127a9565b81526020830151828111156129b557600080fd5b6129c1878286016127b9565b6020830152506040830151828111156129d957600080fd5b6129e5878286016127b9565b6040830152506060830151828111156129fd57600080fd5b612a098782860161282c565b606083015250608083015182811115612a2157600080fd5b612a2d878286016128ca565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561068657610686612a6b565b60005b83811015612ac8578181015183820152602001612ab0565b50506000910152565b6020815260008251806020840152612af0816040850160208701612aad565b601f01601f19169190910160400192915050565b60008251612b16818460208701612aad565b9190910192915050565b8082018082111561068657610686612a6b56fea2646970667358221220cf2bc619585e89bd215427a23edaf0a1b75f982dd55b358201ef59a0c4f67fec64736f6c63430008190033";

export const mockCoreDeployedBytecode =
  "0x60806040526004361061015f5760003560e01c806354d1f13d116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104de578063f2fde38b14610500578063fee81cf4146105135761015f565b8063edf8bf05146104b6578063f04e283e146104cb5761015f565b80638da5cb5b116100a55780638da5cb5b1461043c578063aca696f514610490578063d561e489146104a35761015f565b806354d1f13d1461042c578063715018a6146104345761015f565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103c0578063514e62fc146103d35780635357aa5e1461040a5761015f565b80632de948071461036c57806342b7d0c8146103ad5761015f565b80631c10893f116101485780631c10893f146103315780631cd64df41461034457806325692962146103645761015f565b806301ffc9a7146102e9578063183a4f6e1461031e575b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101e1576101e16120c7565b60018111156101f2576101f26120c7565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610246576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008160400151600181111561025e5761025e6120c7565b036102a15733301461029c576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102dc565b6001816040015160018111156102b9576102b96120c7565b1480156102ca575060008160200151115b156102dc576102dc8160200151610546565b80516102e790610597565b005b3480156102f557600080fd5b50610309610304366004612124565b6105d2565b60405190151581526020015b60405180910390f35b6102e761032c366004612148565b61064d565b6102e761033f36600461218a565b610657565b34801561035057600080fd5b5061030961035f36600461218a565b61066d565b6102e761068c565b34801561037857600080fd5b5061039f6103873660046121b4565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610315565b6102e76103bb3660046121cf565b6106dc565b6102e76103ce36600461218a565b61074c565b3480156103df57600080fd5b506103096103ee36600461218a565b638b78c6d8600c90815260009290925260209091205416151590565b34801561041657600080fd5b5061041f61075e565b604051610315919061230e565b6102e76108a4565b6102e76108e0565b34801561044857600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610315565b6102e761049e3660046121cf565b6108f4565b6102e76104b136600461262f565b61095e565b3480156104c257600080fd5b506102e7610a45565b6102e76104d93660046121b4565b610acb565b3480156104ea57600080fd5b506104f3610b08565b6040516103159190612701565b6102e761050e3660046121b4565b610b17565b34801561051f57600080fd5b5061039f61052e3660046121b4565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059457638b78c6d8600c5233600052806020600c205416610594576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105c03d60408051918201905290565b3d6000823e816105ce573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361060657506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561064557506001919050565b506000919050565b6105943382610b3e565b61065f610b4a565b6106698282610b80565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b7f800000000000000000000000000000000000000000000000000000000000000061070681610546565b6107468484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610b8c92505050565b50505050565b610754610b4a565b6106698282610b3e565b6060600061076c6000610fa7565b90508067ffffffffffffffff81111561078757610787612475565b6040519080825280602002602001820160405280156107c057816020015b6107ad612066565b8152602001906001900390816107a55790505b50915060005b8181101561089f5760006107da8183610ff9565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa15801561084e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108769190810190612952565b81525084838151811061088b5761088b612a3c565b6020908102919091010152506001016107c6565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b6108e8610b4a565b6108f2600061106c565b565b7f800000000000000000000000000000000000000000000000000000000000000061091e81610546565b6107468484848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110d292505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109b05760018160011c14303b106109a75763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109ba846118ce565b60005b8351811015610a0a57610a028482815181106109db576109db612a3c565b60200260200101518483815181106109f5576109f5612a3c565b60200260200101516110d2565b6001016109bd565b508015610746576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610669907fffffffff000000000000000000000000000000000000000000000000000000006000351690611932565b610ad3610b4a565b63389a75e1600c52806000526020600c208054421115610afb57636f5e88186000526004601cfd5b600090556105948161106c565b6060610b12611bdc565b905090565b610b1f610b4a565b8060601b610b3557637448fbae6000526004601cfd5b6105948161106c565b61066982826000611d0f565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108f2576382b429006000526004601cfd5b61066982826001611d0f565b610b97600083611d68565b610bcd576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c1a573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c429190810190612952565b60408101515190915060005b81811015610ce157600180600085604001518481518110610c7157610c71612a3c565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610cd49190612a9a565b9091555050600101610c4e565b5060808201515160005b81811015610daa576002600085608001518381518110610d0d57610d0d612a3c565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610ceb565b5060608301515160005b81811015610e73576002600086606001518381518110610dd657610dd6612a3c565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610db4565b50835115610f4a578573ffffffffffffffffffffffffffffffffffffffff1685604051602401610ea39190612ad1565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f8a91b0e30000000000000000000000000000000000000000000000000000000017905251610f069190612b04565b600060405180830381855af49150503d8060008114610f41576040519150601f19603f3d011682016040523d82523d6000602084013e610f46565b606091505b5050505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c1517610ff157600193508383015415610ff157600293508383015415610ff157600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf8214158202915061102d84610fa7565b8310611065576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6110dd600083611ed6565b611113576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611160573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111889190810190612952565b905080602001515160001461125d5760005b81602001515181101561125b576111cd826020015182815181106111c0576111c0612a3c565b60200260200101516105d2565b61125357816020015181815181106111e7576111e7612a3c565b60200260200101516040517ff9b4b3d800000000000000000000000000000000000000000000000000000000815260040161124a91907fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b60405180910390fd5b60010161119a565b505b60408101515160005b818110156112f95760018060008560400151848151811061128957611289612a3c565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112ec9190612b20565b9091555050600101611266565b506000611304610b08565b80516060850151519192509060005b8181101561159b5760008660600151828151811061133357611333612a3c565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156113c3576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114465782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061140557611405612a3c565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361143e5760019150611446565b6001016113c7565b508061147e576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600060018111156114bf576114bf6120c7565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016908381811115611586576115866120c7565b02179055505060019093019250611313915050565b5060808501515160005b81811015611762576000876080015182815181106115c5576115c5612a3c565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611655576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561174e5761174e6120c7565b021790555050600190920191506115a59050565b5085511561186f576000808973ffffffffffffffffffffffffffffffffffffffff16896040516024016117959190612ad1565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f6d61fe7000000000000000000000000000000000000000000000000000000000179052516117f89190612b04565b600060405180830381855af49150503d8060008114611833576040519150601f19603f3d011682016040523d82523d6000602084013e611838565b606091505b50915091508161186c5761186c817f3fcb90450000000000000000000000000000000000000000000000000000000061204d565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600260208181526040808420815160608181018452825473ffffffffffffffffffffffffffffffffffffffff16825260018084015495830195909552948201548694919384019160ff909116908111156119b6576119b66120c7565b60018111156119c7576119c76120c7565b90525090506000816040015160018111156119e4576119e46120c7565b14611a1b576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611a25610b08565b80519091506000805b82811015611ac557887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611a6857611a68612a3c565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611abd57838181518110611aaa57611aaa612a3c565b6020026020010151602001519150611ac5565b600101611a2e565b50835173ffffffffffffffffffffffffffffffffffffffff1615611b8657836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611b0c9190612b04565b600060405180830381855af49150503d8060008114611b47576040519150601f19603f3d011682016040523d82523d6000602084013e611b4c565b606091505b50909650945085611b8157611b81857f3fcb90450000000000000000000000000000000000000000000000000000000061204d565b611bd1565b6001816001811115611b9a57611b9a6120c7565b03611bd1576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050509250929050565b6060611bea600a6001612b20565b67ffffffffffffffff811115611c0257611c02612475565b604051908082528060200260200182016040528015611c4757816020015b6040805180820190915260008082526020820152815260200190600190039081611c205790505b50905060005b600a811015611cb757604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611ca457611ca4612a3c565b6020908102919091010152600101611c4d565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611d0157611d01612a3c565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611d31575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611dc85763f5a267f16000526004601cfd5b82611dda5768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611e5d5760019350848260601c03611e1857600183018054845560028401805490915560009055611ecd565b84600184015460601c03611e3a57600283018054600185015560009055611ecd565b84600284015460601c03611e545760006002840155611ecd565b60009350611ecd565b82602052846000526040600020805480611e78575050611ecd565b60018360011c039250826001820314611eb0578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611f365763f5a267f16000526004601cfd5b82611f485768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff81168260205280612010578160601c80611f7b578560601b84556001945050611ecd565b858103611f885750611ecd565b600184015460601c80611fa9578660601b6001860155600195505050611ecd565b868103611fb7575050611ecd565b600285015460601c80611fd9578760601b600287015560019650505050611ecd565b878103611fe857505050611ecd565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b8460005260406000208054612043578160011c91508560601b828501558160010181558260020184556001945050611ecd565b5050505092915050565b81511561205c57815182602001fd5b806000526004601cfd5b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016120c26040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059457600080fd5b60006020828403121561213657600080fd5b8135612141816120f6565b9392505050565b60006020828403121561215a57600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461218557600080fd5b919050565b6000806040838503121561219d57600080fd5b6121a683612161565b946020939093013593505050565b6000602082840312156121c657600080fd5b61214182612161565b6000806000604084860312156121e457600080fd5b6121ed84612161565b9250602084013567ffffffffffffffff8082111561220a57600080fd5b818601915086601f83011261221e57600080fd5b81358181111561222d57600080fd5b87602082850101111561223f57600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b838110156122a55781517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101612267565b509495945050505050565b60008151808452602080850194506020840160005b838110156122a557815180517fffffffff0000000000000000000000000000000000000000000000000000000016885283015183880152604090960195908201906001016122c5565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b84811015612466577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808b8603018752835173ffffffffffffffffffffffffffffffffffffffff8151168652898101519050888a87015280511515898701528981015160a0606081818a01526123b160e08a0184612252565b92508b8401516080868b860301818c01526123cc8583612252565b928601518b84038801948c01949094528351808452938f019450918e019288929091505b81831015612433578451517fffffffff00000000000000000000000000000000000000000000000000000000168452938e0193928e0192600192909201916123f0565b808601519550505050838882030160c089015261245081846122b0565b998c019997505050938901935050600101612338565b50919998505050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156124c7576124c7612475565b60405290565b60405160a0810167ffffffffffffffff811182821017156124c7576124c7612475565b604051601f8201601f1916810167ffffffffffffffff8111828210171561251957612519612475565b604052919050565b600067ffffffffffffffff82111561253b5761253b612475565b5060051b60200190565b6000601f83601f84011261255857600080fd5b8235602061256d61256883612521565b6124f0565b82815260059290921b8501810191818101908784111561258c57600080fd5b8287015b8481101561262357803567ffffffffffffffff808211156125b15760008081fd5b818a0191508a603f8301126125c65760008081fd5b858201356040828211156125dc576125dc612475565b6125ed88601f198c850116016124f0565b92508183528c818386010111156126045760008081fd5b8181850189850137506000908201870152845250918301918301612590565b50979650505050505050565b60008060006060848603121561264457600080fd5b61264d84612161565b925060208085013567ffffffffffffffff8082111561266b57600080fd5b818701915087601f83011261267f57600080fd5b813561268d61256882612521565b81815260059190911b8301840190848101908a8311156126ac57600080fd5b938501935b828510156126d1576126c285612161565b825293850193908501906126b1565b9650505060408701359250808311156126e957600080fd5b50506126f786828701612545565b9150509250925092565b60208082528251828201819052600091906040908185019086840185805b8381101561279b57825180517fffffffff0000000000000000000000000000000000000000000000000000000016865287015160028110612787577f4e487b710000000000000000000000000000000000000000000000000000000083526021600452602483fd5b85880152938501939186019160010161271f565b509298975050505050505050565b8051801515811461218557600080fd5b600082601f8301126127ca57600080fd5b815160206127da61256883612521565b8083825260208201915060208460051b8701019350868411156127fc57600080fd5b602086015b84811015612821578051612814816120f6565b8352918301918301612801565b509695505050505050565b600082601f83011261283d57600080fd5b8151602061284d61256883612521565b82815260059290921b8401810191818101908684111561286c57600080fd5b8286015b84811015612821578381890312156128885760008081fd5b6040805185810181811067ffffffffffffffff821117156128ab576128ab612475565b9091528151906128ba826120f6565b9081528352918301918301612870565b600082601f8301126128db57600080fd5b815160206128eb61256883612521565b82815260069290921b8401810191818101908684111561290a57600080fd5b8286015b8481101561282157604081890312156129275760008081fd5b61292f6124a4565b815161293a816120f6565b8152818501518582015283529183019160400161290e565b60006020828403121561296457600080fd5b815167ffffffffffffffff8082111561297c57600080fd5b9083019060a0828603121561299057600080fd5b6129986124cd565b6129a1836127a9565b81526020830151828111156129b557600080fd5b6129c1878286016127b9565b6020830152506040830151828111156129d957600080fd5b6129e5878286016127b9565b6040830152506060830151828111156129fd57600080fd5b612a098782860161282c565b606083015250608083015182811115612a2157600080fd5b612a2d878286016128ca565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561068657610686612a6b565b60005b83811015612ac8578181015183820152602001612ab0565b50506000910152565b6020815260008251806020840152612af0816040850160208701612aad565b601f01601f19169190910160400192915050565b60008251612b16818460208701612aad565b9190910192915050565b8082018082111561068657610686612a6b56fea2646970667358221220cf2bc619585e89bd215427a23edaf0a1b75f982dd55b358201ef59a0c4f67fec64736f6c63430008190033";
