export const mockCoreInitializableCompilerMetadata = {
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
        name: "ExtensionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionFunctionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionFunctionNotInstalled",
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
            name: "extensionImplementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "extensionProxy",
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
            name: "extensionImplementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "extensionProxy",
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
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "oldExtensionImplementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "newExtensionImplementation",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "extensionProxy",
            type: "address",
          },
        ],
        name: "ExtensionUpdated",
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
        name: "INSTALLER_ROLE",
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
                    name: "callbackFunctions",
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
                      {
                        internalType: "enum IExtensionConfig.CallType",
                        name: "callType",
                        type: "uint8",
                      },
                      {
                        internalType: "uint256",
                        name: "permissionBits",
                        type: "uint256",
                      },
                    ],
                    internalType: "struct IExtensionConfig.ExtensionFunction[]",
                    name: "extensionFunctions",
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
            name: "_extensionImplementation",
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
            name: "_extensionImplementation",
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
        inputs: [
          {
            internalType: "address",
            name: "_currentExtensionImplementation",
            type: "address",
          },
          {
            internalType: "address",
            name: "_newExtensionImplementation",
            type: "address",
          },
        ],
        name: "updateExtension",
        outputs: [],
        stateMutability: "nonpayable",
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
        "ExtensionUpdated(address,address,address,address)": {
          notice: "notice Emitted when an extension is updated.",
        },
      },
      kind: "user",
      methods: {
        "INSTALLER_ROLE()": {
          notice: "The role required to install or uninstall extensions.",
        },
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
        "updateExtension(address,address)": {
          notice: "Updates an extension contract.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/token/Mock.sol": "DemoCore",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 1000000,
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
    "lib/solady/src/utils/ERC1967Factory.sol": {
      keccak256:
        "0xffc6d7d03b7aee472e9cbf99f38493fad9438770d60fc637b5ef2dbb31b02403",
      license: "MIT",
      urls: [
        "bzz-raw://533c1905bf8f5a6c5bf420cc4e3e788b22f96c47c07a8d3efe21201fab4f5541",
        "dweb:/ipfs/QmTpaCQLi8Cv2awEE4j7cgoaV71qPQhMyo3ggPJY8uEKjt",
      ],
    },
    "lib/solady/src/utils/ERC1967FactoryConstants.sol": {
      keccak256:
        "0xd5e0d4f6733342f2fd023f5f3913ea7c80a0915b37463e7f335183fa9d040175",
      license: "MIT",
      urls: [
        "bzz-raw://653256b9f35c4e5d95de751b8714640d0f87eab7881ad6799883803e6f460dbb",
        "dweb:/ipfs/QmSbytsRYh587ZwtjjCQUsUdenfQ57nnToi2sMA1zarsd3",
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
    "src/ModularCoreUpgradeable.sol": {
      keccak256:
        "0x415e17bb907ee1f7fa97a7f7b026da63c0524715ae70a69538022dd8138dd266",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://ea7e17d5251943ed8b24a3d36653762ecf72f3011a3bdcc36ae6ae54813f1593",
        "dweb:/ipfs/QmUCNKcCBeiVrekHqqic3nSTZVoMsxZMWH1T2ZTVKfMBng",
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
    "src/interface/IERC165.sol": {
      keccak256:
        "0x836725770a5940198559db11d0be5dce8bb9cb117016a3f92e0ddd35f0ae3491",
      urls: [
        "bzz-raw://63b7dc8464222de0e2e6790cd003c9775e29ad1872655b418741d5e42818b85a",
        "dweb:/ipfs/QmamwhtfxUXF4v5DkcfnjP58cvLB2tWt3wJb1RXDeTiNzy",
      ],
    },
    "src/interface/IExtensionConfig.sol": {
      keccak256:
        "0x77074864e724d8cef0cf9929cecf3295be55224fc77a4ac8b5719b40ce758604",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8717e71bf9cc970ba29764903e28a9a743aabd9794a72e0e155dd1ec70241de4",
        "dweb:/ipfs/QmSdDEqvRJ4qXV7xhzTsKYB9d2LmDooXbp8WdATTqcuE2m",
      ],
    },
    "src/interface/IInstallationCallback.sol": {
      keccak256:
        "0x418abf57b493ad42d16c93bd60cf6439d918a646812f994c1480fb9c39b96d0d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://7028e9a56fa1ad11771f4f2b87994ab14aaebce1a3e55dfde15a972f207d4b49",
        "dweb:/ipfs/QmfUKU5bhLLjE4DXNXpHxMtQbH5JJDnQNS4DnuCPq6UbWp",
      ],
    },
    "src/interface/IModularCore.sol": {
      keccak256:
        "0x41ba8fca1d54de13c2278e546c05f3a88f4da9635263328a135c202e7073a967",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://79d50b66a6a2f66ef5ee26aa048dfbc8bc378f41b6900c9cf740166535975571",
        "dweb:/ipfs/QmbuUPsLmQ1QQhjsugowbuw4cXeP784eKLkwPnzk4MCccK",
      ],
    },
    "src/interface/IModularExtension.sol": {
      keccak256:
        "0x5a46e00f10a5b29e961aa63b8d7619e6952da6d7745b5662c32f2755ff5214af",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://0a5b8a411798682e4058f01e6119a70357e047c80529c465696e738fabf1ce7b",
        "dweb:/ipfs/QmcjR7XyWCScnYwjfSWPqgYVKcRXfpRtK1SHwxTUz5bXY3",
      ],
    },
    "src/token/Mock.sol": {
      keccak256:
        "0x4cb00762cf109b6ffb70de6dfa0b948c0d27d0cc22cc942a6322c6bf028b13e1",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://9032dfa0f1d083f10873a49c28db0f4887e48dce2941a94b8df9918051ea0057",
        "dweb:/ipfs/QmNkdEBmjWZuNHQoSugiVC5gYVcstEgSGt6zoNKYfKAwdm",
      ],
    },
  },
  version: 1,
};

export const mockCoreInitializableBytecode = "0x6080604052348015600f57600080fd5b50612f9b8061001f6000396000f3fe6080604052600436106101795760003560e01c80635357aa5e116100cb578063d561e4891161007f578063f147db8a11610059578063f147db8a14610531578063f2fde38b14610553578063fee81cf41461056657610180565b8063d561e489146104f6578063edf8bf0514610509578063f04e283e1461051e57610180565b8063715018a6116100b0578063715018a6146104875780638da5cb5b1461048f578063aca696f5146104e357610180565b80635357aa5e1461045d57806354d1f13d1461047f57610180565b8063256929621161012d5780634a4ee7b1116101075780634a4ee7b1146103fe5780634f63765014610411578063514e62fc1461042657610180565b806325692962146103a25780632de94807146103aa57806342b7d0c8146103eb57610180565b8063183a4f6e1161015e578063183a4f6e1461035c5780631c10893f1461036f5780631cd64df41461038257610180565b806301ffc9a71461030757806314a7a34b1461033c57610180565b3661018057005b600080357fffffffff00000000000000000000000000000000000000000000000000000000168152600560209081526040808320815160608101909252805473ffffffffffffffffffffffffffffffffffffffff81168352919290919083019074010000000000000000000000000000000000000000900460ff16600281111561020c5761020c61251e565b600281111561021d5761021d61251e565b815260019190910154602090910152805190915073ffffffffffffffffffffffffffffffffffffffff1661027d576040517fbcbdfc5b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b604081015115610294576102948160400151610599565b602081015160008160028111156102ad576102ad61251e565b036102bf5781516102bd906105ea565b005b60028160028111156102d3576102d361251e565b036102e35781516102bd90610627565b60018160028111156102f7576102f761251e565b036102bd5781516102bd9061064f565b34801561031357600080fd5b5061032761032236600461257b565b610677565b60405190151581526020015b60405180910390f35b34801561034857600080fd5b506102bd6103573660046125c1565b6106f2565b6102bd61036a3660046125fa565b6108bf565b6102bd61037d366004612613565b6108c9565b34801561038e57600080fd5b5061032761039d366004612613565b6108df565b6102bd6108fe565b3480156103b657600080fd5b506103dd6103c536600461263f565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610333565b6102bd6103f936600461265c565b61094e565b6102bd61040c366004612613565b61099f565b34801561041d57600080fd5b506103dd600181565b34801561043257600080fd5b50610327610441366004612613565b638b78c6d8600c90815260009290925260209091205416151590565b34801561046957600080fd5b506104726109b1565b604051610333919061273f565b6102bd610ba1565b6102bd610bdd565b34801561049b57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610333565b6102bd6104f136600461265c565b610bf1565b6102bd610504366004612aaa565b610c3c565b34801561051557600080fd5b506102bd610d23565b6102bd61052c36600461263f565b610da9565b34801561053d57600080fd5b50610546610de6565b6040516103339190612b80565b6102bd61056136600461263f565b610df5565b34801561057257600080fd5b506103dd61058136600461263f565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146105e757638b78c6d8600c5233600052806020600c2054166105e7576382b429006000526004601cfd5b50565b34604080513681019091523660008237600080368385875af190506106153d60408051918201905290565b3d6000823e81610623573d81fd5b3d81f35b60408051368101909152366000823750600080366000845af4604080513d8101909152610615565b60408051368101909152366000823750600080366000845afa604080513d8101909152610615565b60007fffffffff0000000000000000000000000000000000000000000000000000000080831690036106ab57506000919050565b7fffffffff000000000000000000000000000000000000000000000000000000008216600090815260036020526040902054156106ea57506001919050565b506000919050565b60016106fd81610599565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600260205260409020548061075a576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff848116600090815260026020526040808220829055918516815281812083905590517f5414dff0000000000000000000000000000000000000000000000000000000008152600481018390526d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa1580156107f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108189190612c01565b905061082381610e1c565b506040517f99a88ec400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff828116600483015286811660248301528316906399a88ec490604401600060405180830381600087803b15801561089557600080fd5b505af11580156108a9573d6000803e3d6000fd5b505050506108b681611094565b50505050505050565b6105e7338261164c565b6108d1611658565b6108db828261168e565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b600161095981610599565b6109998484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061169a92505050565b50505050565b6109a7611658565b6108db828261164c565b606060006109bf600161194f565b90508067ffffffffffffffff8111156109da576109da6128b4565b604051908082528060200260200182016040528015610a1357816020015b610a0061249e565b8152602001906001900390816109f85790505b5091506d6396ff2a80c067f99b3d2ab4df2460005b82811015610b9b57600073ffffffffffffffffffffffffffffffffffffffff8316635414dff0610a5960018561199f565b6040518263ffffffff1660e01b8152600401610a7791815260200190565b602060405180830381865afa158015610a94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ab89190612c01565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610b2c573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610b729190810190612d5c565b815250858381518110610b8757610b87612e33565b602090810291909101015250600101610a28565b50505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b610be5611658565b610bef6000611a02565b565b6001610bfc81610599565b6109998484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611a6892505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011328054600382558015610c8e5760018160011c14303b10610c855763f92ee8a96000526004601cfd5b818160ff1b1b91505b50610c9884611e68565b60005b8351811015610ce857610ce0848281518110610cb957610cb9612e33565b6020026020010151848381518110610cd357610cd3612e33565b6020026020010151611a68565b600101610c9b565b508015610999576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf05000000000000000000000000000000000000000000000000000000001790526108db907fffffffff000000000000000000000000000000000000000000000000000000006000351690611ecc565b610db1611658565b63389a75e1600c52806000526020600c208054421115610dd957636f5e88186000526004601cfd5b600090556105e781611a02565b6060610df06120c1565b905090565b610dfd611658565b8060601b610e1357637448fbae6000526004601cfd5b6105e781611a02565b6000808273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610e6a573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610eb09190810190612d5c565b60608101515190915060005b81811015610f505760016003600085606001518481518110610ee057610ee0612e33565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610f439190612e91565b9091555050600101610ebc565b5060808201515160005b81811015610ff157600084608001518281518110610f7a57610f7a612e33565b602090810291909101810151517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260059091526040812080547fffffffffffffffffffffff000000000000000000000000000000000000000000168155600190810191909155919091019050610f5a565b5060408301515160005b818110156110865760008560400151828151811061101b5761101b612e33565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260049091526040902080547fffffffffffffffffffffffff000000000000000000000000000000000000000016905550600101610ffb565b505050506020015192915050565b6000808273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156110e2573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526111289190810190612d5c565b80519091507fffffffff0000000000000000000000000000000000000000000000000000000016156111c057805161115f90610677565b6111c05780516040517ff9b4b3d80000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015260240160405180910390fd5b60608101515160005b8181101561125d57600160036000856060015184815181106111ed576111ed612e33565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112509190612ea4565b90915550506001016111c9565b506000611268610de6565b80516040850151519192509060005b818110156114545760008660400151828151811061129757611297612e33565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000081166000908152600490925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611326576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156113a557827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061136457611364612e33565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361139d57600191506113a5565b60010161132a565b50806113dd576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b507fffffffff0000000000000000000000000000000000000000000000000000000016600090815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8a16179055600101611277565b5060808501515160005b8181101561163a5760008760800151828151811061147e5761147e612e33565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600590925260409091205490915073ffffffffffffffffffffffffffffffffffffffff161561150e576040517f2e939f0600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff1681526020018260200151600281111561154b5761154b61251e565b815260408084015160209283015283517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260058352208251815473ffffffffffffffffffffffffffffffffffffffff9091167fffffffffffffffffffffffff000000000000000000000000000000000000000082168117835592840151919283917fffffffffffffffffffffff00000000000000000000000000000000000000000016177401000000000000000000000000000000000000000083600281111561161d5761161d61251e565b02179055506040919091015160019182015591909101905061145e565b50505060209093015195945050505050565b6108db828260006121f4565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610bef576382b429006000526004601cfd5b6108db828260016121f4565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260026020526040902054806116f7576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61170260018261224d565b5073ffffffffffffffffffffffffffffffffffffffff8316600090815260026020526040808220829055517f5414dff0000000000000000000000000000000000000000000000000000000008152600481018390526d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa158015611790573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117b49190612c01565b905060006117c182610e1c565b905080156118f1576000808373ffffffffffffffffffffffffffffffffffffffff163433896040516024016117f7929190612edb565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f13fe88e100000000000000000000000000000000000000000000000000000000179052516118789190612f49565b60006040518083038185875af1925050503d80600081146118b5576040519150601f19603f3d011682016040523d82523d6000602084013e6118ba565b606091505b5091509150816118ee576118ee817f3fcb904500000000000000000000000000000000000000000000000000000000612365565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff888116602083015284168183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b6318fb58646004526000818152602481208019548060011c9250806119985781546000935015611998576001925082820154156119985760029250828201541561199857600392505b5050919050565b6318fb586460045260008281526024902081015468fbb67fda52d4bfb8bf811415026119ca8361194f565b82106108f8576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b73ffffffffffffffffffffffffffffffffffffffff821660009081526002602052604090205415611ac5576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080546040805160208101929092523090820152606001604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815282825280516020918201207fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003060601b9081166bffffffffffffffffffffffff831617600081815573ffffffffffffffffffffffffffffffffffffffff8a16815260029094529383208490557f5414dff000000000000000000000000000000000000000000000000000000000855260048501849052909450926d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa158015611bdb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bff9190612c01565b90508073ffffffffffffffffffffffffffffffffffffffff163b600003611cc1576040517f3729f92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff888116600483015230602483015260448201859052831690633729f922906064016020604051808303816000875af1158015611c9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cbf9190612c01565b505b611ccc60018461237e565b506000611cd882611094565b90508015611e08576000808373ffffffffffffffffffffffffffffffffffffffff1634338b604051602401611d0e929190612edb565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff8a6e73f0000000000000000000000000000000000000000000000000000000017905251611d8f9190612f49565b60006040518083038185875af1925050503d8060008114611dcc576040519150601f19603f3d011682016040523d82523d6000602084013e611dd1565b606091505b509150915081611e0557611e05817f3fcb904500000000000000000000000000000000000000000000000000000000612365565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a8116602083015284168183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b600060606000611eda610de6565b80519091506000805b82811015611f7a57877bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611f1d57611f1d612e33565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611f7257838181518110611f5f57611f5f612e33565b6020026020010151602001519150611f7a565b600101611ee3565b507fffffffff00000000000000000000000000000000000000000000000000000000871660009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff16801561206b578073ffffffffffffffffffffffffffffffffffffffff163488604051611fef9190612f49565b60006040518083038185875af1925050503d806000811461202c576040519150601f19603f3d011682016040523d82523d6000602084013e612031565b606091505b5090965094508561206657612066857f3fcb904500000000000000000000000000000000000000000000000000000000612365565b6120b6565b600182600181111561207f5761207f61251e565b036120b6576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050509250929050565b60606120cf600a6001612ea4565b67ffffffffffffffff8111156120e7576120e76128b4565b60405190808252806020026020018201604052801561212c57816020015b60408051808201909152600080825260208201528152602001906001900390816121055790505b50905060005b600a81101561219c57604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b16815260208101600081525082828151811061218957612189612e33565b6020908102919091010152600101612132565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a815181106121e6576121e6612e33565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783612216575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b6318fb586460045260008281526024812068fbb67fda52d4bfb8bf830361227c5763f5a267f16000526004601cfd5b8261228e5768fbb67fda52d4bfb8bf92505b801954806122fb5760019250838254036122bc5760018201805483556002830180549091556000905561235d565b836001830154036122db5760028201805460018401556000905561235d565b836002830154036122f2576000600283015561235d565b6000925061235d565b8160205283600052604060002080548061231657505061235d565b60018360011c039250826001820314612348578284015480600183038601556000848601558060005250806040600020555b5060018260011b178319556000815550600192505b505092915050565b81511561237457815182602001fd5b806000526004601cfd5b6318fb586460045260008281526024812068fbb67fda52d4bfb8bf83036123ad5763f5a267f16000526004601cfd5b826123bf5768fbb67fda52d4bfb8bf92505b8019548160205280612464578154806123df57848355600193505061235d565b8481036123ec575061235d565b6001830154806124075785600185015560019450505061235d565b85810361241557505061235d565b600284015480612431578660028601556001955050505061235d565b8681036124405750505061235d565b60009283526040808420600190559183528183206002905582529020600390555060075b836000526040600020805461249557600191821c8381018690558083019182905590821b821783195590925061235d565b50505092915050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016125196040518060a0016040528060007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000151581526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff00000000000000000000000000000000000000000000000000000000811681146105e757600080fd5b60006020828403121561258d57600080fd5b81356125988161254d565b9392505050565b73ffffffffffffffffffffffffffffffffffffffff811681146105e757600080fd5b600080604083850312156125d457600080fd5b82356125df8161259f565b915060208301356125ef8161259f565b809150509250929050565b60006020828403121561260c57600080fd5b5035919050565b6000806040838503121561262657600080fd5b82356126318161259f565b946020939093013593505050565b60006020828403121561265157600080fd5b81356125988161259f565b60008060006040848603121561267157600080fd5b833561267c8161259f565b9250602084013567ffffffffffffffff8082111561269957600080fd5b818601915086601f8301126126ad57600080fd5b8135818111156126bc57600080fd5b8760208285010111156126ce57600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b838110156127345781517fffffffff0000000000000000000000000000000000000000000000000000000016875295820195908201906001016126f6565b509495945050505050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b838110156128a6577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808a8503018652825173ffffffffffffffffffffffffffffffffffffffff815116855288810151905087898601527fffffffff000000000000000000000000000000000000000000000000000000008082511689870152898201516060811515818901528a840151915060a0608081818b015261280f60e08b01856126e1565b935082860151878b860301838c015261282885826126e1565b96909101518a870390970160c08b015250508451808552938c01948c0193600092505b8083101561288e5784518481511687528d8101516003811061286f5761286f61251e565b878f01528c01518c87015294810194938c01936001929092019161284b565b50505096890196509093505090860190600101612766565b509098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715612906576129066128b4565b60405290565b60405160a0810167ffffffffffffffff81118282101715612906576129066128b4565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715612976576129766128b4565b604052919050565b600067ffffffffffffffff821115612998576129986128b4565b5060051b60200190565b6000601f83601f8401126129b557600080fd5b823560206129ca6129c58361297e565b61292f565b82815260059290921b850181019181810190878411156129e957600080fd5b8287015b84811015612a9e57803567ffffffffffffffff80821115612a0e5760008081fd5b818a0191508a603f830112612a235760008081fd5b85820135604082821115612a3957612a396128b4565b612a68887fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08c8501160161292f565b92508183528c81838601011115612a7f5760008081fd5b81818501898501375060009082018701528452509183019183016129ed565b50979650505050505050565b600080600060608486031215612abf57600080fd5b8335612aca8161259f565b925060208481013567ffffffffffffffff80821115612ae857600080fd5b818701915087601f830112612afc57600080fd5b8135612b0a6129c58261297e565b81815260059190911b8301840190848101908a831115612b2957600080fd5b938501935b82851015612b50578435612b418161259f565b82529385019390850190612b2e565b965050506040870135925080831115612b6857600080fd5b5050612b76868287016129a2565b9150509250925092565b602080825282518282018190526000919060409081850190868401855b82811015612bf457815180517fffffffff0000000000000000000000000000000000000000000000000000000016855286015160028110612be057612be061251e565b848701529284019290850190600101612b9d565b5091979650505050505050565b600060208284031215612c1357600080fd5b81516125988161259f565b8051612c298161254d565b919050565b80518015158114612c2957600080fd5b600082601f830112612c4f57600080fd5b81516020612c5f6129c58361297e565b8083825260208201915060208460051b870101935086841115612c8157600080fd5b602086015b84811015612ca6578051612c998161254d565b8352918301918301612c86565b509695505050505050565b600082601f830112612cc257600080fd5b81516020612cd26129c58361297e565b82815260609283028501820192828201919087851115612cf157600080fd5b8387015b85811015612d4f5781818a031215612d0d5760008081fd5b612d156128e3565b8151612d208161254d565b81528186015160038110612d345760008081fd5b81870152604082810151908201528452928401928101612cf5565b5090979650505050505050565b600060208284031215612d6e57600080fd5b815167ffffffffffffffff80821115612d8657600080fd5b9083019060a08286031215612d9a57600080fd5b612da261290c565b612dab83612c1e565b8152612db960208401612c2e565b6020820152604083015182811115612dd057600080fd5b612ddc87828601612c3e565b604083015250606083015182811115612df457600080fd5b612e0087828601612c3e565b606083015250608083015182811115612e1857600080fd5b612e2487828601612cb1565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b818103818111156108f8576108f8612e62565b808201808211156108f8576108f8612e62565b60005b83811015612ed2578181015183820152602001612eba565b50506000910152565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015260008251806040840152612f16816060850160208701612eb7565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016060019392505050565b60008251612f5b818460208701612eb7565b919091019291505056fea2646970667358221220b486badfd7f07b874b103ba29d985d0edb981ffa3c9f84067b384ddd17ed9e2064736f6c63430008190033";

export const mockCoreInitializableDeployedBytecode = "0x6080604052600436106101795760003560e01c80635357aa5e116100cb578063d561e4891161007f578063f147db8a11610059578063f147db8a14610531578063f2fde38b14610553578063fee81cf41461056657610180565b8063d561e489146104f6578063edf8bf0514610509578063f04e283e1461051e57610180565b8063715018a6116100b0578063715018a6146104875780638da5cb5b1461048f578063aca696f5146104e357610180565b80635357aa5e1461045d57806354d1f13d1461047f57610180565b8063256929621161012d5780634a4ee7b1116101075780634a4ee7b1146103fe5780634f63765014610411578063514e62fc1461042657610180565b806325692962146103a25780632de94807146103aa57806342b7d0c8146103eb57610180565b8063183a4f6e1161015e578063183a4f6e1461035c5780631c10893f1461036f5780631cd64df41461038257610180565b806301ffc9a71461030757806314a7a34b1461033c57610180565b3661018057005b600080357fffffffff00000000000000000000000000000000000000000000000000000000168152600560209081526040808320815160608101909252805473ffffffffffffffffffffffffffffffffffffffff81168352919290919083019074010000000000000000000000000000000000000000900460ff16600281111561020c5761020c61251e565b600281111561021d5761021d61251e565b815260019190910154602090910152805190915073ffffffffffffffffffffffffffffffffffffffff1661027d576040517fbcbdfc5b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b604081015115610294576102948160400151610599565b602081015160008160028111156102ad576102ad61251e565b036102bf5781516102bd906105ea565b005b60028160028111156102d3576102d361251e565b036102e35781516102bd90610627565b60018160028111156102f7576102f761251e565b036102bd5781516102bd9061064f565b34801561031357600080fd5b5061032761032236600461257b565b610677565b60405190151581526020015b60405180910390f35b34801561034857600080fd5b506102bd6103573660046125c1565b6106f2565b6102bd61036a3660046125fa565b6108bf565b6102bd61037d366004612613565b6108c9565b34801561038e57600080fd5b5061032761039d366004612613565b6108df565b6102bd6108fe565b3480156103b657600080fd5b506103dd6103c536600461263f565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610333565b6102bd6103f936600461265c565b61094e565b6102bd61040c366004612613565b61099f565b34801561041d57600080fd5b506103dd600181565b34801561043257600080fd5b50610327610441366004612613565b638b78c6d8600c90815260009290925260209091205416151590565b34801561046957600080fd5b506104726109b1565b604051610333919061273f565b6102bd610ba1565b6102bd610bdd565b34801561049b57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610333565b6102bd6104f136600461265c565b610bf1565b6102bd610504366004612aaa565b610c3c565b34801561051557600080fd5b506102bd610d23565b6102bd61052c36600461263f565b610da9565b34801561053d57600080fd5b50610546610de6565b6040516103339190612b80565b6102bd61056136600461263f565b610df5565b34801561057257600080fd5b506103dd61058136600461263f565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146105e757638b78c6d8600c5233600052806020600c2054166105e7576382b429006000526004601cfd5b50565b34604080513681019091523660008237600080368385875af190506106153d60408051918201905290565b3d6000823e81610623573d81fd5b3d81f35b60408051368101909152366000823750600080366000845af4604080513d8101909152610615565b60408051368101909152366000823750600080366000845afa604080513d8101909152610615565b60007fffffffff0000000000000000000000000000000000000000000000000000000080831690036106ab57506000919050565b7fffffffff000000000000000000000000000000000000000000000000000000008216600090815260036020526040902054156106ea57506001919050565b506000919050565b60016106fd81610599565b73ffffffffffffffffffffffffffffffffffffffff83166000908152600260205260409020548061075a576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff848116600090815260026020526040808220829055918516815281812083905590517f5414dff0000000000000000000000000000000000000000000000000000000008152600481018390526d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa1580156107f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108189190612c01565b905061082381610e1c565b506040517f99a88ec400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff828116600483015286811660248301528316906399a88ec490604401600060405180830381600087803b15801561089557600080fd5b505af11580156108a9573d6000803e3d6000fd5b505050506108b681611094565b50505050505050565b6105e7338261164c565b6108d1611658565b6108db828261168e565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b600161095981610599565b6109998484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061169a92505050565b50505050565b6109a7611658565b6108db828261164c565b606060006109bf600161194f565b90508067ffffffffffffffff8111156109da576109da6128b4565b604051908082528060200260200182016040528015610a1357816020015b610a0061249e565b8152602001906001900390816109f85790505b5091506d6396ff2a80c067f99b3d2ab4df2460005b82811015610b9b57600073ffffffffffffffffffffffffffffffffffffffff8316635414dff0610a5960018561199f565b6040518263ffffffff1660e01b8152600401610a7791815260200190565b602060405180830381865afa158015610a94573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ab89190612c01565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610b2c573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610b729190810190612d5c565b815250858381518110610b8757610b87612e33565b602090810291909101015250600101610a28565b50505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b610be5611658565b610bef6000611a02565b565b6001610bfc81610599565b6109998484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611a6892505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011328054600382558015610c8e5760018160011c14303b10610c855763f92ee8a96000526004601cfd5b818160ff1b1b91505b50610c9884611e68565b60005b8351811015610ce857610ce0848281518110610cb957610cb9612e33565b6020026020010151848381518110610cd357610cd3612e33565b6020026020010151611a68565b600101610c9b565b508015610999576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf05000000000000000000000000000000000000000000000000000000001790526108db907fffffffff000000000000000000000000000000000000000000000000000000006000351690611ecc565b610db1611658565b63389a75e1600c52806000526020600c208054421115610dd957636f5e88186000526004601cfd5b600090556105e781611a02565b6060610df06120c1565b905090565b610dfd611658565b8060601b610e1357637448fbae6000526004601cfd5b6105e781611a02565b6000808273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610e6a573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610eb09190810190612d5c565b60608101515190915060005b81811015610f505760016003600085606001518481518110610ee057610ee0612e33565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610f439190612e91565b9091555050600101610ebc565b5060808201515160005b81811015610ff157600084608001518281518110610f7a57610f7a612e33565b602090810291909101810151517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260059091526040812080547fffffffffffffffffffffff000000000000000000000000000000000000000000168155600190810191909155919091019050610f5a565b5060408301515160005b818110156110865760008560400151828151811061101b5761101b612e33565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260049091526040902080547fffffffffffffffffffffffff000000000000000000000000000000000000000016905550600101610ffb565b505050506020015192915050565b6000808273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156110e2573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526111289190810190612d5c565b80519091507fffffffff0000000000000000000000000000000000000000000000000000000016156111c057805161115f90610677565b6111c05780516040517ff9b4b3d80000000000000000000000000000000000000000000000000000000081527fffffffff00000000000000000000000000000000000000000000000000000000909116600482015260240160405180910390fd5b60608101515160005b8181101561125d57600160036000856060015184815181106111ed576111ed612e33565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112509190612ea4565b90915550506001016111c9565b506000611268610de6565b80516040850151519192509060005b818110156114545760008660400151828151811061129757611297612e33565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000081166000908152600490925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611326576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156113a557827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061136457611364612e33565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361139d57600191506113a5565b60010161132a565b50806113dd576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b507fffffffff0000000000000000000000000000000000000000000000000000000016600090815260046020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8a16179055600101611277565b5060808501515160005b8181101561163a5760008760800151828151811061147e5761147e612e33565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600590925260409091205490915073ffffffffffffffffffffffffffffffffffffffff161561150e576040517f2e939f0600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff1681526020018260200151600281111561154b5761154b61251e565b815260408084015160209283015283517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260058352208251815473ffffffffffffffffffffffffffffffffffffffff9091167fffffffffffffffffffffffff000000000000000000000000000000000000000082168117835592840151919283917fffffffffffffffffffffff00000000000000000000000000000000000000000016177401000000000000000000000000000000000000000083600281111561161d5761161d61251e565b02179055506040919091015160019182015591909101905061145e565b50505060209093015195945050505050565b6108db828260006121f4565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610bef576382b429006000526004601cfd5b6108db828260016121f4565b73ffffffffffffffffffffffffffffffffffffffff8216600090815260026020526040902054806116f7576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61170260018261224d565b5073ffffffffffffffffffffffffffffffffffffffff8316600090815260026020526040808220829055517f5414dff0000000000000000000000000000000000000000000000000000000008152600481018390526d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa158015611790573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117b49190612c01565b905060006117c182610e1c565b905080156118f1576000808373ffffffffffffffffffffffffffffffffffffffff163433896040516024016117f7929190612edb565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f13fe88e100000000000000000000000000000000000000000000000000000000179052516118789190612f49565b60006040518083038185875af1925050503d80600081146118b5576040519150601f19603f3d011682016040523d82523d6000602084013e6118ba565b606091505b5091509150816118ee576118ee817f3fcb904500000000000000000000000000000000000000000000000000000000612365565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff888116602083015284168183015290517fa6f847ae17c7e37d4683a5bd43fee85feabbcf20590c817a43242c63918fb4e99181900360600190a1505050505050565b6318fb58646004526000818152602481208019548060011c9250806119985781546000935015611998576001925082820154156119985760029250828201541561199857600392505b5050919050565b6318fb586460045260008281526024902081015468fbb67fda52d4bfb8bf811415026119ca8361194f565b82106108f8576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b73ffffffffffffffffffffffffffffffffffffffff821660009081526002602052604090205415611ac5576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080546040805160208101929092523090820152606001604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081840301815282825280516020918201207fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003060601b9081166bffffffffffffffffffffffff831617600081815573ffffffffffffffffffffffffffffffffffffffff8a16815260029094529383208490557f5414dff000000000000000000000000000000000000000000000000000000000855260048501849052909450926d6396ff2a80c067f99b3d2ab4df2491908290635414dff090602401602060405180830381865afa158015611bdb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bff9190612c01565b90508073ffffffffffffffffffffffffffffffffffffffff163b600003611cc1576040517f3729f92200000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff888116600483015230602483015260448201859052831690633729f922906064016020604051808303816000875af1158015611c9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cbf9190612c01565b505b611ccc60018461237e565b506000611cd882611094565b90508015611e08576000808373ffffffffffffffffffffffffffffffffffffffff1634338b604051602401611d0e929190612edb565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167ff8a6e73f0000000000000000000000000000000000000000000000000000000017905251611d8f9190612f49565b60006040518083038185875af1925050503d8060008114611dcc576040519150601f19603f3d011682016040523d82523d6000602084013e611dd1565b606091505b509150915081611e0557611e05817f3fcb904500000000000000000000000000000000000000000000000000000000612365565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a8116602083015284168183015290517f93c4853c9bae09bd4ad56f53035f286d79851539d0ec722a40a5a821a31c1dfd9181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b600060606000611eda610de6565b80519091506000805b82811015611f7a57877bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611f1d57611f1d612e33565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611f7257838181518110611f5f57611f5f612e33565b6020026020010151602001519150611f7a565b600101611ee3565b507fffffffff00000000000000000000000000000000000000000000000000000000871660009081526004602052604090205473ffffffffffffffffffffffffffffffffffffffff16801561206b578073ffffffffffffffffffffffffffffffffffffffff163488604051611fef9190612f49565b60006040518083038185875af1925050503d806000811461202c576040519150601f19603f3d011682016040523d82523d6000602084013e612031565b606091505b5090965094508561206657612066857f3fcb904500000000000000000000000000000000000000000000000000000000612365565b6120b6565b600182600181111561207f5761207f61251e565b036120b6576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050509250929050565b60606120cf600a6001612ea4565b67ffffffffffffffff8111156120e7576120e76128b4565b60405190808252806020026020018201604052801561212c57816020015b60408051808201909152600080825260208201528152602001906001900390816121055790505b50905060005b600a81101561219c57604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b16815260208101600081525082828151811061218957612189612e33565b6020908102919091010152600101612132565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a815181106121e6576121e6612e33565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783612216575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b6318fb586460045260008281526024812068fbb67fda52d4bfb8bf830361227c5763f5a267f16000526004601cfd5b8261228e5768fbb67fda52d4bfb8bf92505b801954806122fb5760019250838254036122bc5760018201805483556002830180549091556000905561235d565b836001830154036122db5760028201805460018401556000905561235d565b836002830154036122f2576000600283015561235d565b6000925061235d565b8160205283600052604060002080548061231657505061235d565b60018360011c039250826001820314612348578284015480600183038601556000848601558060005250806040600020555b5060018260011b178319556000815550600192505b505092915050565b81511561237457815182602001fd5b806000526004601cfd5b6318fb586460045260008281526024812068fbb67fda52d4bfb8bf83036123ad5763f5a267f16000526004601cfd5b826123bf5768fbb67fda52d4bfb8bf92505b8019548160205280612464578154806123df57848355600193505061235d565b8481036123ec575061235d565b6001830154806124075785600185015560019450505061235d565b85810361241557505061235d565b600284015480612431578660028601556001955050505061235d565b8681036124405750505061235d565b60009283526040808420600190559183528183206002905582529020600390555060075b836000526040600020805461249557600191821c8381018690558083019182905590821b821783195590925061235d565b50505092915050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016125196040518060a0016040528060007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000151581526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff00000000000000000000000000000000000000000000000000000000811681146105e757600080fd5b60006020828403121561258d57600080fd5b81356125988161254d565b9392505050565b73ffffffffffffffffffffffffffffffffffffffff811681146105e757600080fd5b600080604083850312156125d457600080fd5b82356125df8161259f565b915060208301356125ef8161259f565b809150509250929050565b60006020828403121561260c57600080fd5b5035919050565b6000806040838503121561262657600080fd5b82356126318161259f565b946020939093013593505050565b60006020828403121561265157600080fd5b81356125988161259f565b60008060006040848603121561267157600080fd5b833561267c8161259f565b9250602084013567ffffffffffffffff8082111561269957600080fd5b818601915086601f8301126126ad57600080fd5b8135818111156126bc57600080fd5b8760208285010111156126ce57600080fd5b6020830194508093505050509250925092565b60008151808452602080850194506020840160005b838110156127345781517fffffffff0000000000000000000000000000000000000000000000000000000016875295820195908201906001016126f6565b509495945050505050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b838110156128a6577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808a8503018652825173ffffffffffffffffffffffffffffffffffffffff815116855288810151905087898601527fffffffff000000000000000000000000000000000000000000000000000000008082511689870152898201516060811515818901528a840151915060a0608081818b015261280f60e08b01856126e1565b935082860151878b860301838c015261282885826126e1565b96909101518a870390970160c08b015250508451808552938c01948c0193600092505b8083101561288e5784518481511687528d8101516003811061286f5761286f61251e565b878f01528c01518c87015294810194938c01936001929092019161284b565b50505096890196509093505090860190600101612766565b509098975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715612906576129066128b4565b60405290565b60405160a0810167ffffffffffffffff81118282101715612906576129066128b4565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715612976576129766128b4565b604052919050565b600067ffffffffffffffff821115612998576129986128b4565b5060051b60200190565b6000601f83601f8401126129b557600080fd5b823560206129ca6129c58361297e565b61292f565b82815260059290921b850181019181810190878411156129e957600080fd5b8287015b84811015612a9e57803567ffffffffffffffff80821115612a0e5760008081fd5b818a0191508a603f830112612a235760008081fd5b85820135604082821115612a3957612a396128b4565b612a68887fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08c8501160161292f565b92508183528c81838601011115612a7f5760008081fd5b81818501898501375060009082018701528452509183019183016129ed565b50979650505050505050565b600080600060608486031215612abf57600080fd5b8335612aca8161259f565b925060208481013567ffffffffffffffff80821115612ae857600080fd5b818701915087601f830112612afc57600080fd5b8135612b0a6129c58261297e565b81815260059190911b8301840190848101908a831115612b2957600080fd5b938501935b82851015612b50578435612b418161259f565b82529385019390850190612b2e565b965050506040870135925080831115612b6857600080fd5b5050612b76868287016129a2565b9150509250925092565b602080825282518282018190526000919060409081850190868401855b82811015612bf457815180517fffffffff0000000000000000000000000000000000000000000000000000000016855286015160028110612be057612be061251e565b848701529284019290850190600101612b9d565b5091979650505050505050565b600060208284031215612c1357600080fd5b81516125988161259f565b8051612c298161254d565b919050565b80518015158114612c2957600080fd5b600082601f830112612c4f57600080fd5b81516020612c5f6129c58361297e565b8083825260208201915060208460051b870101935086841115612c8157600080fd5b602086015b84811015612ca6578051612c998161254d565b8352918301918301612c86565b509695505050505050565b600082601f830112612cc257600080fd5b81516020612cd26129c58361297e565b82815260609283028501820192828201919087851115612cf157600080fd5b8387015b85811015612d4f5781818a031215612d0d5760008081fd5b612d156128e3565b8151612d208161254d565b81528186015160038110612d345760008081fd5b81870152604082810151908201528452928401928101612cf5565b5090979650505050505050565b600060208284031215612d6e57600080fd5b815167ffffffffffffffff80821115612d8657600080fd5b9083019060a08286031215612d9a57600080fd5b612da261290c565b612dab83612c1e565b8152612db960208401612c2e565b6020820152604083015182811115612dd057600080fd5b612ddc87828601612c3e565b604083015250606083015182811115612df457600080fd5b612e0087828601612c3e565b606083015250608083015182811115612e1857600080fd5b612e2487828601612cb1565b60808301525095945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b818103818111156108f8576108f8612e62565b808201808211156108f8576108f8612e62565b60005b83811015612ed2578181015183820152602001612eba565b50506000910152565b73ffffffffffffffffffffffffffffffffffffffff831681526040602082015260008251806040840152612f16816060850160208701612eb7565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016919091016060019392505050565b60008251612f5b818460208701612eb7565b919091019291505056fea2646970667358221220b486badfd7f07b874b103ba29d985d0edb981ffa3c9f84067b384ddd17ed9e2064736f6c63430008190033";
