export const mockCoreCompilerMetadata = {
  compiler: { version: "0.8.26+commit.8a97fa7a" },
  language: "Solidity",
  output: {
    abi: [
      { inputs: [], name: "AlreadyInitialized", type: "error" },
      { inputs: [], name: "CallbackExecutionReverted", type: "error" },
      {
        inputs: [],
        name: "CallbackFunctionAlreadyInstalled",
        type: "error",
      },
      { inputs: [], name: "CallbackFunctionNotSupported", type: "error" },
      { inputs: [], name: "CallbackFunctionRequired", type: "error" },
      {
        inputs: [],
        name: "CallbackFunctionUnauthorizedCall",
        type: "error",
      },
      {
        inputs: [],
        name: "FallbackFunctionAlreadyInstalled",
        type: "error",
      },
      { inputs: [], name: "FallbackFunctionNotInstalled", type: "error" },
      { inputs: [], name: "IndexOutOfBounds", type: "error" },
      { inputs: [], name: "InvalidInitialization", type: "error" },
      { inputs: [], name: "ModuleAlreadyInstalled", type: "error" },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "requiredInterfaceId",
            type: "bytes4",
          },
        ],
        name: "ModuleInterfaceNotCompatible",
        type: "error",
      },
      { inputs: [], name: "ModuleNotInstalled", type: "error" },
      { inputs: [], name: "ModuleOutOfSync", type: "error" },
      { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
      { inputs: [], name: "NoHandoverRequest", type: "error" },
      { inputs: [], name: "NotInitializing", type: "error" },
      { inputs: [], name: "Reentrancy", type: "error" },
      { inputs: [], name: "Unauthorized", type: "error" },
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
            name: "installedModule",
            type: "address",
          },
        ],
        name: "ModuleInstalled",
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
            name: "installedModule",
            type: "address",
          },
        ],
        name: "ModuleUninstalled",
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
      { stateMutability: "payable", type: "fallback" },
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
        name: "getInstalledModules",
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
                    internalType: "struct IModuleConfig.CallbackFunction[]",
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
                    internalType: "struct IModuleConfig.FallbackFunction[]",
                    name: "fallbackFunctions",
                    type: "tuple[]",
                  },
                ],
                internalType: "struct IModuleConfig.ModuleConfig",
                name: "config",
                type: "tuple",
              },
            ],
            internalType: "struct IModularCore.InstalledModule[]",
            name: "_installedModules",
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
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "roles", type: "uint256" },
        ],
        name: "grantRoles",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "roles", type: "uint256" },
        ],
        name: "hasAllRoles",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "roles", type: "uint256" },
        ],
        name: "hasAnyRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_owner", type: "address" },
          {
            internalType: "address[]",
            name: "modules",
            type: "address[]",
          },
          {
            internalType: "bytes[]",
            name: "moduleInstallData",
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
          { internalType: "address", name: "_module", type: "address" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "installModule",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
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
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
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
        inputs: [{ internalType: "uint256", name: "roles", type: "uint256" }],
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
          { internalType: "address", name: "user", type: "address" },
          { internalType: "uint256", name: "roles", type: "uint256" },
        ],
        name: "revokeRoles",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "rolesOf",
        outputs: [{ internalType: "uint256", name: "roles", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
        ],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_module", type: "address" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "uninstallModule",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    devdoc: {
      errors: {
        "AlreadyInitialized()": [{ details: "Cannot double-initialize." }],
        "IndexOutOfBounds()": [
          { details: "The index must be less than the length." },
        ],
        "InvalidInitialization()": [
          { details: "The contract is already initialized." },
        ],
        "NewOwnerIsZeroAddress()": [
          { details: "The `newOwner` cannot be the zero address." },
        ],
        "NoHandoverRequest()": [
          {
            details:
              "The `pendingOwner` does not have a valid handover request.",
          },
        ],
        "NotInitializing()": [{ details: "The contract is not initializing." }],
        "Reentrancy()": [{ details: "Unauthorized reentrant call." }],
        "Unauthorized()": [
          { details: "The caller is not authorized to call the function." },
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
        "owner()": { details: "Returns the owner of the contract." },
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
        "rolesOf(address)": { details: "Returns the roles of `user`." },
        "transferOwnership(address)": {
          details: "Allows the owner to transfer the ownership to `newOwner`.",
        },
      },
      version: 1,
    },
    userdoc: {
      events: {
        "ModuleInstalled(address,address,address)": {
          notice: "Emitted when an module is installed.",
        },
        "ModuleUninstalled(address,address,address)": {
          notice: "Emitted when an module is uninstalled.",
        },
      },
      kind: "user",
      methods: {
        "getInstalledModules()": {
          notice:
            "Returns a list of addresess and respective module configs of all installed modules.",
        },
        "getSupportedCallbackFunctions()": {
          notice:
            "Returns the list of all callback functions called on some module contract.",
        },
        "installModule(address,bytes)": {
          notice: "Installs an module contract.",
        },
        "supportsInterface(bytes4)": {
          notice:
            "Returns whether a given interface is implemented by the contract.",
        },
        "uninstallModule(address,bytes)": {
          notice: "Uninstalls an module contract.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: { "src/Demo.sol": "DemoCore" },
    evmVersion: "paris",
    libraries: {},
    metadata: { bytecodeHash: "ipfs" },
    optimizer: { enabled: true, runs: 10000 },
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
    "lib/solady/src/utils/ReentrancyGuard.sol": {
      keccak256:
        "0xdb28f318ec45197a6c7cc2abebed67d7cb8b965838ef962e3844423256a9ddb8",
      license: "MIT",
      urls: [
        "bzz-raw://873cd46b77a2aeb781e7a0d131e7299151323ed884c330101a51d0727e218d98",
        "dweb:/ipfs/QmddadCjyedztvdSgLZEyKWoRes2SqtpviSjhEbSNrkUoi",
      ],
    },
    "src/Demo.sol": {
      keccak256:
        "0xec96f1fadc784f7c986bf3b2d2c711647033304cb30c3f0b2d2e326b1f4050d4",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://e6a1b11fc2ed21dad8b309f7ef550178a88f56035c638dcd48c043c8f7676242",
        "dweb:/ipfs/QmVp6r9iQvD1s6KYj4XeuQviywk2kzeVucTnKXkkxudt6Z",
      ],
    },
    "src/ModularCore.sol": {
      keccak256:
        "0xcfbdebbbcddde91d095bd4ff6c8d45b7d5e056fce124a4a3b31e04a26205b1a9",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1df5563e244082dd4fcc8badb9aaa82d0156012b8dd29a81266cccf81cbdaea0",
        "dweb:/ipfs/QmYGR1BNQBbK7VDWj4kYvHYco4xbWcHH76PDxizJf2rXan",
      ],
    },
    "src/ModularModule.sol": {
      keccak256:
        "0x51113eab00cbb4716b0142318ef17e025d3209cbf585099d1ec439646144fcae",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://368c387b669477634b9b87972087800df8fd16bc089d54261232ffdd3e4c5e24",
        "dweb:/ipfs/QmYixtwjr96n421TJYpTfXBtVJnbK139gERdwJrTf78mXp",
      ],
    },
    "src/Role.sol": {
      keccak256:
        "0xeddcd77db42bcb9131a22f215c4a7bea0c116fe9aaa286c43fb6b4f9fc4e1b2a",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://bf1aaec00858a253b8ae6839450411129aae38b65ca9351533865b81cce4284c",
        "dweb:/ipfs/QmauNo8mhU3LwySXdMapJnhzhrsK4Ch3x2vBgn7uzW4HxK",
      ],
    },
    "src/interface/IERC165.sol": {
      keccak256:
        "0x825a9f9163c18551bbdcc62b824a4ffb0a99f737910e9629422b646e367e80d3",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://c98fcaa581cad28faad143d1db85ed6849949ed7a89b2b2115991e1f425192a0",
        "dweb:/ipfs/QmeRxdmW4kAtvbCL13XFFrrEKhsfo4hbHS1ypgfT62Wzkw",
      ],
    },
    "src/interface/IInstallationCallback.sol": {
      keccak256:
        "0x236a1c0fde2afa7935bdd9586e25baf222e7dfc2f18bd25270389e256bd27124",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8c12039aba8293132adec7203d461ca42f7d2f572cbd95d6465e4697fd28101d",
        "dweb:/ipfs/QmQtAa5aRGtNvYw7kBgrr3fXwweSFSARWNmxAUc57B4T5k",
      ],
    },
    "src/interface/IModularCore.sol": {
      keccak256:
        "0x6961bae3e4ddb77e5a9e21b21f30c6a12e5531e6e667d7c2d98d7c603dfc2194",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://726a215eefe611edc7ce0a2953ad5b31e5cb3e52ef75a973fdaf48b963cdca28",
        "dweb:/ipfs/QmUVHC1zQbMeUt6FbwU7kLSye1Js5TFXg8EJegdjGL3iXL",
      ],
    },
    "src/interface/IModularModule.sol": {
      keccak256:
        "0xeaa7841ec1475c3063e0879c02bed2e822929ff6da273642328b9f0ee4ccb831",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://3831cb826e09821bd100bb5d9f2ddf9a06ccfe1b703c11b3aaa1b27d789345a9",
        "dweb:/ipfs/QmQSMt38GU7K9cH2q3LAj3emqKeJEwDCnvsEgtzjVApZnJ",
      ],
    },
    "src/interface/IModuleConfig.sol": {
      keccak256:
        "0xfc649395c8e4704e18b05b503ecef1c4cf15eb83061510167bc24d28d1e42e9a",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://25eccfe3747cbbb86fc13a1da049430f7238ad000ed1ab91634e7db20a4a1cd0",
        "dweb:/ipfs/QmTz7FVUL8FFZJ7eeRSMfLcxRJFWCemrgTX3xFQFNLRXyQ",
      ],
    },
  },
  version: 1,
};

export const mockCoreBytecode =
  "0x6080604052348015600f57600080fd5b50612c378061001f6000396000f3fe60806040526004361061015f5760003560e01c806370c109cd116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104de578063f2fde38b14610500578063fee81cf4146105135761015f565b8063edf8bf05146104b6578063f04e283e146104cb5761015f565b80638da5cb5b116100a55780638da5cb5b1461043c5780638da798da14610490578063d561e489146104a35761015f565b806370c109cd14610421578063715018a6146104345761015f565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103cf578063514e62fc146103e257806354d1f13d146104195761015f565b80632de948071461036c5780633e429396146103ad5761015f565b80631c10893f116101485780631c10893f146103315780631cd64df41461034457806325692962146103645761015f565b806301ffc9a7146102e9578063183a4f6e1461031e575b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101e1576101e1612100565b60018111156101f2576101f2612100565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610246576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008160400151600181111561025e5761025e612100565b036102a15733301461029c576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102dc565b6001816040015160018111156102b9576102b9612100565b1480156102ca575060008160200151115b156102dc576102dc8160200151610546565b80516102e790610597565b005b3480156102f557600080fd5b5061030961030436600461215d565b6105d2565b60405190151581526020015b60405180910390f35b6102e761032c366004612181565b61064d565b6102e761033f3660046121c3565b610657565b34801561035057600080fd5b5061030961035f3660046121c3565b61066d565b6102e761068c565b34801561037857600080fd5b5061039f6103873660046121ed565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610315565b3480156103b957600080fd5b506103c26106dc565b60405161031591906122c6565b6102e76103dd3660046121c3565b610822565b3480156103ee57600080fd5b506103096103fd3660046121c3565b638b78c6d8600c90815260009290925260209091205416151590565b6102e7610834565b6102e761042f36600461248e565b610870565b6102e76108e0565b34801561044857600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610315565b6102e761049e36600461248e565b6108f4565b6102e76104b13660046126fa565b61095e565b3480156104c257600080fd5b506102e7610a45565b6102e76104d93660046121ed565b610acb565b3480156104ea57600080fd5b506104f3610b08565b60405161031591906127d3565b6102e761050e3660046121ed565b610b17565b34801561051f57600080fd5b5061039f61052e3660046121ed565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059457638b78c6d8600c5233600052806020600c205416610594576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105c03d60408051918201905290565b3d6000823e816105ce573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361060657506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561064557506001919050565b506000919050565b6105943382610b3e565b61065f610b4a565b6106698282610b80565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b606060006106ea6000610b8c565b90508067ffffffffffffffff81111561070557610705612513565b60405190808252806020026020018201604052801561073e57816020015b61072b61209f565b8152602001906001900390816107235790505b50915060005b8181101561081d5760006107588183610bde565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156107cc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107f49190810190612a04565b81525084838151811061080957610809612b0a565b602090810291909101015250600101610744565b505090565b61082a610b4a565b6106698282610b3e565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b7f800000000000000000000000000000000000000000000000000000000000000061089a81610546565b6108da8484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610c5192505050565b50505050565b6108e8610b4a565b6108f2600061106c565b565b7f800000000000000000000000000000000000000000000000000000000000000061091e81610546565b6108da8484848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110d292505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109b05760018160011c14303b106109a75763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109ba846118ce565b60005b8351811015610a0a57610a028482815181106109db576109db612b0a565b60200260200101518483815181106109f5576109f5612b0a565b60200260200101516110d2565b6001016109bd565b5080156108da576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610669907fffffffff000000000000000000000000000000000000000000000000000000006000351690611932565b610ad3610b4a565b63389a75e1600c52806000526020600c208054421115610afb57636f5e88186000526004601cfd5b600090556105948161106c565b6060610b12611c15565b905090565b610b1f610b4a565b8060601b610b3557637448fbae6000526004601cfd5b6105948161106c565b61066982826000611d48565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108f2576382b429006000526004601cfd5b61066982826001611d48565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c1517610bd657600193508383015415610bd657600293508383015415610bd657600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150610c1284610b8c565b8310610c4a576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b610c5c600083611da1565b610c92576040517f2a6f792900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610cdf573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610d079190810190612a04565b60408101515190915060005b81811015610da657600180600085604001518481518110610d3657610d36612b0a565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610d999190612b68565b9091555050600101610d13565b5060808201515160005b81811015610e6f576002600085608001518381518110610dd257610dd2612b0a565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610db0565b5060608301515160005b81811015610f38576002600086606001518381518110610e9b57610e9b612b0a565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610e79565b5083511561100f578573ffffffffffffffffffffffffffffffffffffffff1685604051602401610f689190612b9f565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f8a91b0e30000000000000000000000000000000000000000000000000000000017905251610fcb9190612bd2565b600060405180830381855af49150503d8060008114611006576040519150601f19603f3d011682016040523d82523d6000602084013e61100b565b606091505b5050505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fef3b2e20acbb62d61d782c5449bd73d3970cb9be1050a6ad6f846b2cbe21c03a9181900360600190a1505050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6110dd600083611f0f565b611113576040517f24c377e200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611160573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111889190810190612a04565b905080602001515160001461125d5760005b81602001515181101561125b576111cd826020015182815181106111c0576111c0612b0a565b60200260200101516105d2565b61125357816020015181815181106111e7576111e7612b0a565b60200260200101516040517f56ba3a7f00000000000000000000000000000000000000000000000000000000815260040161124a91907fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b60405180910390fd5b60010161119a565b505b60408101515160005b818110156112f95760018060008560400151848151811061128957611289612b0a565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112ec9190612bee565b9091555050600101611266565b506000611304610b08565b80516060850151519192509060005b8181101561159b5760008660600151828151811061133357611333612b0a565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156113c3576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114465782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061140557611405612b0a565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361143e5760019150611446565b6001016113c7565b508061147e576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600060018111156114bf576114bf612100565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561158657611586612100565b02179055505060019093019250611313915050565b5060808501515160005b81811015611762576000876080015182815181106115c5576115c5612b0a565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611655576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561174e5761174e612100565b021790555050600190920191506115a59050565b5085511561186f576000808973ffffffffffffffffffffffffffffffffffffffff16896040516024016117959190612b9f565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f6d61fe7000000000000000000000000000000000000000000000000000000000179052516117f89190612bd2565b600060405180830381855af49150503d8060008114611833576040519150601f19603f3d011682016040523d82523d6000602084013e611838565b606091505b50915091508161186c5761186c817f3fcb904500000000000000000000000000000000000000000000000000000000612086565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517fbcd03fe408dcc45614e803cbab9f500dddff61b17380b993e76d30398da472299181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b600060603068929eee149b4bd2126854036119555763ab143c066000526004601cfd5b3068929eee149b4bd21268557fffffffff00000000000000000000000000000000000000000000000000000000841660009081526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156119e3576119e3612100565b60018111156119f4576119f4612100565b9052509050600081604001516001811115611a1157611a11612100565b14611a48576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611a52610b08565b80519091506000805b82811015611af257887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611a9557611a95612b0a565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611aea57838181518110611ad757611ad7612b0a565b6020026020010151602001519150611af2565b600101611a5b565b50835173ffffffffffffffffffffffffffffffffffffffff1615611bb357836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611b399190612bd2565b600060405180830381855af49150503d8060008114611b74576040519150601f19603f3d011682016040523d82523d6000602084013e611b79565b606091505b50909650945085611bae57611bae857f3fcb904500000000000000000000000000000000000000000000000000000000612086565b611bfe565b6001816001811115611bc757611bc7612100565b03611bfe576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050503868929eee149b4bd21268559250929050565b6060611c23600a6001612bee565b67ffffffffffffffff811115611c3b57611c3b612513565b604051908082528060200260200182016040528015611c8057816020015b6040805180820190915260008082526020820152815260200190600190039081611c595790505b50905060005b600a811015611cf057604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611cdd57611cdd612b0a565b6020908102919091010152600101611c86565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611d3a57611d3a612b0a565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611d6a575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611e015763f5a267f16000526004601cfd5b82611e135768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611e965760019350848260601c03611e5157600183018054845560028401805490915560009055611f06565b84600184015460601c03611e7357600283018054600185015560009055611f06565b84600284015460601c03611e8d5760006002840155611f06565b60009350611f06565b82602052846000526040600020805480611eb1575050611f06565b60018360011c039250826001820314611ee9578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611f6f5763f5a267f16000526004601cfd5b82611f815768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff81168260205280612049578160601c80611fb4578560601b84556001945050611f06565b858103611fc15750611f06565b600184015460601c80611fe2578660601b6001860155600195505050611f06565b868103611ff0575050611f06565b600285015460601c80612012578760601b600287015560019650505050611f06565b87810361202157505050611f06565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b846000526040600020805461207c578160011c91508560601b828501558160010181558260020184556001945050611f06565b5050505092915050565b81511561209557815182602001fd5b806000526004601cfd5b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016120fb6040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059457600080fd5b60006020828403121561216f57600080fd5b813561217a8161212f565b9392505050565b60006020828403121561219357600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff811681146121be57600080fd5b919050565b600080604083850312156121d657600080fd5b6121df8361219a565b946020939093013593505050565b6000602082840312156121ff57600080fd5b61217a8261219a565b600081518084526020840193506020830160005b8281101561225c5781517fffffffff000000000000000000000000000000000000000000000000000000001686526020958601959091019060010161221c565b5093949350505050565b600081518084526020840193506020830160005b8281101561225c57815180517fffffffff00000000000000000000000000000000000000000000000000000000168752602090810151818801526040909601959091019060010161227a565b6000602082016020835280845180835260408501915060408160051b86010192506020860160005b82811015612482577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0878603018452815173ffffffffffffffffffffffffffffffffffffffff81511686526020810151905060406020870152805115156040870152602081015160a0606088015261236960e0880182612208565b905060408201517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08883030160808901526123a48282612208565b60608401518982037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc00160a08b0152805180835260209182019450600093509101905b8083101561242d577fffffffff000000000000000000000000000000000000000000000000000000008451511682526020820191506020840193506001830192506123e7565b50608084015193507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08982030160c08a01526124698185612266565b98505050602095860195939093019250506001016122ee565b50929695505050505050565b6000806000604084860312156124a357600080fd5b6124ac8461219a565b9250602084013567ffffffffffffffff8111156124c857600080fd5b8401601f810186136124d957600080fd5b803567ffffffffffffffff8111156124f057600080fd5b86602082840101111561250257600080fd5b939660209190910195509293505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516020810167ffffffffffffffff8111828210171561256557612565612513565b60405290565b6040805190810167ffffffffffffffff8111828210171561256557612565612513565b60405160a0810167ffffffffffffffff8111828210171561256557612565612513565b604051601f8201601f1916810167ffffffffffffffff811182821017156125da576125da612513565b604052919050565b600067ffffffffffffffff8211156125fc576125fc612513565b5060051b60200190565b600082601f83011261261757600080fd5b813561262a612625826125e2565b6125b1565b8082825260208201915060208360051b86010192508583111561264c57600080fd5b602085015b838110156126f057803567ffffffffffffffff81111561267057600080fd5b8601603f8101881361268157600080fd5b602081013567ffffffffffffffff81111561269e5761269e612513565b6126b16020601f19601f840116016125b1565b8181526040838301018a10156126c657600080fd5b81604084016020830137600060208383010152808652505050602083019250602081019050612651565b5095945050505050565b60008060006060848603121561270f57600080fd5b6127188461219a565b9250602084013567ffffffffffffffff81111561273457600080fd5b8401601f8101861361274557600080fd5b8035612753612625826125e2565b8082825260208201915060208360051b85010192508883111561277557600080fd5b6020840193505b8284101561279e5761278d8461219a565b82526020938401939091019061277c565b9450505050604084013567ffffffffffffffff8111156127bd57600080fd5b6127c986828701612606565b9150509250925092565b602080825282518282018190526000918401906040840190835b8181101561287457835180517fffffffff000000000000000000000000000000000000000000000000000000001684526020015160028110612858577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60208481019190915293909301926040909201916001016127ed565b509095945050505050565b805180151581146121be57600080fd5b600082601f8301126128a057600080fd5b81516128ae612625826125e2565b8082825260208201915060208360051b8601019250858311156128d057600080fd5b602085015b838110156126f05780516128e88161212f565b8352602092830192016128d5565b600082601f83011261290757600080fd5b8151612915612625826125e2565b8082825260208201915060208360051b86010192508583111561293757600080fd5b602085015b838110156126f0576020818803121561295457600080fd5b61295c612542565b81516129678161212f565b815283526020928301920161293c565b600082601f83011261298857600080fd5b8151612996612625826125e2565b8082825260208201915060208360061b8601019250858311156129b857600080fd5b602085015b838110156126f057604081880312156129d557600080fd5b6129dd61256b565b81516129e88161212f565b81526020828101518183015290845292909201916040016129bd565b600060208284031215612a1657600080fd5b815167ffffffffffffffff811115612a2d57600080fd5b820160a08185031215612a3f57600080fd5b612a4761258e565b612a508261287f565b8152602082015167ffffffffffffffff811115612a6c57600080fd5b612a788682850161288f565b602083015250604082015167ffffffffffffffff811115612a9857600080fd5b612aa48682850161288f565b604083015250606082015167ffffffffffffffff811115612ac457600080fd5b612ad0868285016128f6565b606083015250608082015167ffffffffffffffff811115612af057600080fd5b612afc86828501612977565b608083015250949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561068657610686612b39565b60005b83811015612b96578181015183820152602001612b7e565b50506000910152565b6020815260008251806020840152612bbe816040850160208701612b7b565b601f01601f19169190910160400192915050565b60008251612be4818460208701612b7b565b9190910192915050565b8082018082111561068657610686612b3956fea2646970667358221220e1baec8a0d6b380a8c72f6aec6d1c17e4a37c84d872dd683e3f2be44a49ecb3264736f6c634300081a0033";

export const mockCoreDeployedBytecode =
  "0x60806040526004361061015f5760003560e01c806370c109cd116100c0578063edf8bf0511610074578063f147db8a11610059578063f147db8a146104de578063f2fde38b14610500578063fee81cf4146105135761015f565b8063edf8bf05146104b6578063f04e283e146104cb5761015f565b80638da5cb5b116100a55780638da5cb5b1461043c5780638da798da14610490578063d561e489146104a35761015f565b806370c109cd14610421578063715018a6146104345761015f565b80632de94807116101175780634a4ee7b1116100fc5780634a4ee7b1146103cf578063514e62fc146103e257806354d1f13d146104195761015f565b80632de948071461036c5780633e429396146103ad5761015f565b80631c10893f116101485780631c10893f146103315780631cd64df41461034457806325692962146103645761015f565b806301ffc9a7146102e9578063183a4f6e1461031e575b600080357fffffffff000000000000000000000000000000000000000000000000000000001681526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156101e1576101e1612100565b60018111156101f2576101f2612100565b905250805190915073ffffffffffffffffffffffffffffffffffffffff16610246576040517fb6b8317700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008160400151600181111561025e5761025e612100565b036102a15733301461029c576040517f295dcf7800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6102dc565b6001816040015160018111156102b9576102b9612100565b1480156102ca575060008160200151115b156102dc576102dc8160200151610546565b80516102e790610597565b005b3480156102f557600080fd5b5061030961030436600461215d565b6105d2565b60405190151581526020015b60405180910390f35b6102e761032c366004612181565b61064d565b6102e761033f3660046121c3565b610657565b34801561035057600080fd5b5061030961035f3660046121c3565b61066d565b6102e761068c565b34801561037857600080fd5b5061039f6103873660046121ed565b638b78c6d8600c908152600091909152602090205490565b604051908152602001610315565b3480156103b957600080fd5b506103c26106dc565b60405161031591906122c6565b6102e76103dd3660046121c3565b610822565b3480156103ee57600080fd5b506103096103fd3660046121c3565b638b78c6d8600c90815260009290925260209091205416151590565b6102e7610834565b6102e761042f36600461248e565b610870565b6102e76108e0565b34801561044857600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610315565b6102e761049e36600461248e565b6108f4565b6102e76104b13660046126fa565b61095e565b3480156104c257600080fd5b506102e7610a45565b6102e76104d93660046121ed565b610acb565b3480156104ea57600080fd5b506104f3610b08565b60405161031591906127d3565b6102e761050e3660046121ed565b610b17565b34801561051f57600080fd5b5061039f61052e3660046121ed565b63389a75e1600c908152600091909152602090205490565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff7487392754331461059457638b78c6d8600c5233600052806020600c205416610594576382b429006000526004601cfd5b50565b6040805136810190915236600082376000803683855af490506105c03d60408051918201905290565b3d6000823e816105ce573d81fd5b3d81f35b60007fffffffff00000000000000000000000000000000000000000000000000000000808316900361060657506000919050565b7fffffffff0000000000000000000000000000000000000000000000000000000082166000908152600160205260409020541561064557506001919050565b506000919050565b6105943382610b3e565b61065f610b4a565b6106698282610b80565b5050565b638b78c6d8600c90815260008390526020902054811681145b92915050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b606060006106ea6000610b8c565b90508067ffffffffffffffff81111561070557610705612513565b60405190808252806020026020018201604052801561073e57816020015b61072b61209f565b8152602001906001900390816107235790505b50915060005b8181101561081d5760006107588183610bde565b905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa1580156107cc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107f49190810190612a04565b81525084838151811061080957610809612b0a565b602090810291909101015250600101610744565b505090565b61082a610b4a565b6106698282610b3e565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b7f800000000000000000000000000000000000000000000000000000000000000061089a81610546565b6108da8484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610c5192505050565b50505050565b6108e8610b4a565b6108f2600061106c565b565b7f800000000000000000000000000000000000000000000000000000000000000061091e81610546565b6108da8484848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110d292505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156109b05760018160011c14303b106109a75763f92ee8a96000526004601cfd5b818160ff1b1b91505b506109ba846118ce565b60005b8351811015610a0a57610a028482815181106109db576109db612b0a565b60200260200101518483815181106109f5576109f5612b0a565b60200260200101516110d2565b6001016109bd565b5080156108da576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a150505050565b6040805160048152602481019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fedf8bf0500000000000000000000000000000000000000000000000000000000179052610669907fffffffff000000000000000000000000000000000000000000000000000000006000351690611932565b610ad3610b4a565b63389a75e1600c52806000526020600c208054421115610afb57636f5e88186000526004601cfd5b600090556105948161106c565b6060610b12611c15565b905090565b610b1f610b4a565b8060601b610b3557637448fbae6000526004601cfd5b6105948161106c565b61066982826000611d48565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275433146108f2576382b429006000526004601cfd5b61066982826001611d48565b63978aab9260045260008181526024812080548060a01b60a01c8060011c9350808260601c1517610bd657600193508383015415610bd657600293508383015415610bd657600393505b505050919050565b63978aab926004526000828152602481208281015460601c915068fbb67fda52d4bfb8bf82141582029150610c1284610b8c565b8310610c4a576040517f4e23d03500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5092915050565b610c5c600083611da1565b610c92576040517f2a6f792900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610cdf573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610d079190810190612a04565b60408101515190915060005b81811015610da657600180600085604001518481518110610d3657610d36612b0a565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000828254610d999190612b68565b9091555050600101610d13565b5060808201515160005b81811015610e6f576002600085608001518381518110610dd257610dd2612b0a565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610db0565b5060608301515160005b81811015610f38576002600086606001518381518110610e9b57610e9b612b0a565b602090810291909101810151517fffffffff00000000000000000000000000000000000000000000000000000000168252810191909152604001600090812080547fffffffffffffffffffffffff000000000000000000000000000000000000000016815560018082019290925560020180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905501610e79565b5083511561100f578573ffffffffffffffffffffffffffffffffffffffff1685604051602401610f689190612b9f565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f8a91b0e30000000000000000000000000000000000000000000000000000000017905251610fcb9190612bd2565b600060405180830381855af49150503d8060008114611006576040519150601f19603f3d011682016040523d82523d6000602084013e61100b565b606091505b5050505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8816602082018190528183015290517fef3b2e20acbb62d61d782c5449bd73d3970cb9be1050a6ad6f846b2cbe21c03a9181900360600190a1505050505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6110dd600083611f0f565b611113576040517f24c377e200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166389e04e0e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015611160573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526111889190810190612a04565b905080602001515160001461125d5760005b81602001515181101561125b576111cd826020015182815181106111c0576111c0612b0a565b60200260200101516105d2565b61125357816020015181815181106111e7576111e7612b0a565b60200260200101516040517f56ba3a7f00000000000000000000000000000000000000000000000000000000815260040161124a91907fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b60405180910390fd5b60010161119a565b505b60408101515160005b818110156112f95760018060008560400151848151811061128957611289612b0a565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060008282546112ec9190612bee565b9091555050600101611266565b506000611304610b08565b80516060850151519192509060005b8181101561159b5760008660600151828151811061133357611333612b0a565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156113c3576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b858110156114465782600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191687828151811061140557611405612b0a565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19160361143e5760019150611446565b6001016113c7565b508061147e576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60405180606001604052808b73ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600060018111156114bf576114bf612100565b905282517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561158657611586612100565b02179055505060019093019250611313915050565b5060808501515160005b81811015611762576000876080015182815181106115c5576115c5612b0a565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611655576040517f92bffc6500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040805160608101825273ffffffffffffffffffffffffffffffffffffffff8c168152602083810151908201529081016001905281517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020818152604092839020845181547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff90911617815590840151600180830191909155928401519181018054919390917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690838181111561174e5761174e612100565b021790555050600190920191506115a59050565b5085511561186f576000808973ffffffffffffffffffffffffffffffffffffffff16896040516024016117959190612b9f565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f6d61fe7000000000000000000000000000000000000000000000000000000000179052516117f89190612bd2565b600060405180830381855af49150503d8060008114611833576040519150601f19603f3d011682016040523d82523d6000602084013e611838565b606091505b50915091508161186c5761186c817f3fcb904500000000000000000000000000000000000000000000000000000000612086565b50505b6040805133815273ffffffffffffffffffffffffffffffffffffffff8a16602082018190528183015290517fbcd03fe408dcc45614e803cbab9f500dddff61b17380b993e76d30398da472299181900360600190a15050505050505050565b73ffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739278190558060007f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08180a350565b600060603068929eee149b4bd2126854036119555763ab143c066000526004601cfd5b3068929eee149b4bd21268557fffffffff00000000000000000000000000000000000000000000000000000000841660009081526002602081815260408084208151606081018352815473ffffffffffffffffffffffffffffffffffffffff168152600180830154948201949094529381015490929184019160ff909116908111156119e3576119e3612100565b60018111156119f4576119f4612100565b9052509050600081604001516001811115611a1157611a11612100565b14611a48576040517fae7ff83e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000611a52610b08565b80519091506000805b82811015611af257887bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916848281518110611a9557611a95612b0a565b6020026020010151600001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611aea57838181518110611ad757611ad7612b0a565b6020026020010151602001519150611af2565b600101611a5b565b50835173ffffffffffffffffffffffffffffffffffffffff1615611bb357836000015173ffffffffffffffffffffffffffffffffffffffff1687604051611b399190612bd2565b600060405180830381855af49150503d8060008114611b74576040519150601f19603f3d011682016040523d82523d6000602084013e611b79565b606091505b50909650945085611bae57611bae857f3fcb904500000000000000000000000000000000000000000000000000000000612086565b611bfe565b6001816001811115611bc757611bc7612100565b03611bfe576040517f2d51781900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050503868929eee149b4bd21268559250929050565b6060611c23600a6001612bee565b67ffffffffffffffff811115611c3b57611c3b612513565b604051908082528060200260200182016040528015611c8057816020015b6040805180820190915260008082526020820152815260200190600190039081611c595790505b50905060005b600a811015611cf057604080518082019091527fffffffff0000000000000000000000000000000000000000000000000000000060e083901b168152602081016000815250828281518110611cdd57611cdd612b0a565b6020908102919091010152600101611c86565b50604080518082019091527fedf8bf0500000000000000000000000000000000000000000000000000000000815260208101600181525081600a81518110611d3a57611d3a612b0a565b602002602001018190525090565b638b78c6d8600c52826000526020600c20805483811783611d6a575080841681185b80835580600c5160601c7f715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26600080a3505050505050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611e015763f5a267f16000526004601cfd5b82611e135768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff811680611e965760019350848260601c03611e5157600183018054845560028401805490915560009055611f06565b84600184015460601c03611e7357600283018054600185015560009055611f06565b84600284015460601c03611e8d5760006002840155611f06565b60009350611f06565b82602052846000526040600020805480611eb1575050611f06565b60018360011c039250826001820314611ee9578285015460601c8060601b600183038701556000848701558060005250806040600020555b5060018260011b17845460601c60601b1784556000815550600193505b50505092915050565b63978aab9260045260008281526024812073ffffffffffffffffffffffffffffffffffffffff92909216917fffffffffffffffffffffffffffffffffffffffffffffff04498025ad2b4047418301611f6f5763f5a267f16000526004601cfd5b82611f815768fbb67fda52d4bfb8bf92505b80546bffffffffffffffffffffffff81168260205280612049578160601c80611fb4578560601b84556001945050611f06565b858103611fc15750611f06565b600184015460601c80611fe2578660601b6001860155600195505050611f06565b868103611ff0575050611f06565b600285015460601c80612012578760601b600287015560019650505050611f06565b87810361202157505050611f06565b6000928352604080842060019055918352818320600290558252902060039055506007908117905b846000526040600020805461207c578160011c91508560601b828501558160010181558260020184556001945050611f06565b5050505092915050565b81511561209557815182602001fd5b806000526004601cfd5b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016120fb6040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7fffffffff000000000000000000000000000000000000000000000000000000008116811461059457600080fd5b60006020828403121561216f57600080fd5b813561217a8161212f565b9392505050565b60006020828403121561219357600080fd5b5035919050565b803573ffffffffffffffffffffffffffffffffffffffff811681146121be57600080fd5b919050565b600080604083850312156121d657600080fd5b6121df8361219a565b946020939093013593505050565b6000602082840312156121ff57600080fd5b61217a8261219a565b600081518084526020840193506020830160005b8281101561225c5781517fffffffff000000000000000000000000000000000000000000000000000000001686526020958601959091019060010161221c565b5093949350505050565b600081518084526020840193506020830160005b8281101561225c57815180517fffffffff00000000000000000000000000000000000000000000000000000000168752602090810151818801526040909601959091019060010161227a565b6000602082016020835280845180835260408501915060408160051b86010192506020860160005b82811015612482577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0878603018452815173ffffffffffffffffffffffffffffffffffffffff81511686526020810151905060406020870152805115156040870152602081015160a0606088015261236960e0880182612208565b905060408201517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08883030160808901526123a48282612208565b60608401518982037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc00160a08b0152805180835260209182019450600093509101905b8083101561242d577fffffffff000000000000000000000000000000000000000000000000000000008451511682526020820191506020840193506001830192506123e7565b50608084015193507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08982030160c08a01526124698185612266565b98505050602095860195939093019250506001016122ee565b50929695505050505050565b6000806000604084860312156124a357600080fd5b6124ac8461219a565b9250602084013567ffffffffffffffff8111156124c857600080fd5b8401601f810186136124d957600080fd5b803567ffffffffffffffff8111156124f057600080fd5b86602082840101111561250257600080fd5b939660209190910195509293505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516020810167ffffffffffffffff8111828210171561256557612565612513565b60405290565b6040805190810167ffffffffffffffff8111828210171561256557612565612513565b60405160a0810167ffffffffffffffff8111828210171561256557612565612513565b604051601f8201601f1916810167ffffffffffffffff811182821017156125da576125da612513565b604052919050565b600067ffffffffffffffff8211156125fc576125fc612513565b5060051b60200190565b600082601f83011261261757600080fd5b813561262a612625826125e2565b6125b1565b8082825260208201915060208360051b86010192508583111561264c57600080fd5b602085015b838110156126f057803567ffffffffffffffff81111561267057600080fd5b8601603f8101881361268157600080fd5b602081013567ffffffffffffffff81111561269e5761269e612513565b6126b16020601f19601f840116016125b1565b8181526040838301018a10156126c657600080fd5b81604084016020830137600060208383010152808652505050602083019250602081019050612651565b5095945050505050565b60008060006060848603121561270f57600080fd5b6127188461219a565b9250602084013567ffffffffffffffff81111561273457600080fd5b8401601f8101861361274557600080fd5b8035612753612625826125e2565b8082825260208201915060208360051b85010192508883111561277557600080fd5b6020840193505b8284101561279e5761278d8461219a565b82526020938401939091019061277c565b9450505050604084013567ffffffffffffffff8111156127bd57600080fd5b6127c986828701612606565b9150509250925092565b602080825282518282018190526000918401906040840190835b8181101561287457835180517fffffffff000000000000000000000000000000000000000000000000000000001684526020015160028110612858577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60208481019190915293909301926040909201916001016127ed565b509095945050505050565b805180151581146121be57600080fd5b600082601f8301126128a057600080fd5b81516128ae612625826125e2565b8082825260208201915060208360051b8601019250858311156128d057600080fd5b602085015b838110156126f05780516128e88161212f565b8352602092830192016128d5565b600082601f83011261290757600080fd5b8151612915612625826125e2565b8082825260208201915060208360051b86010192508583111561293757600080fd5b602085015b838110156126f0576020818803121561295457600080fd5b61295c612542565b81516129678161212f565b815283526020928301920161293c565b600082601f83011261298857600080fd5b8151612996612625826125e2565b8082825260208201915060208360061b8601019250858311156129b857600080fd5b602085015b838110156126f057604081880312156129d557600080fd5b6129dd61256b565b81516129e88161212f565b81526020828101518183015290845292909201916040016129bd565b600060208284031215612a1657600080fd5b815167ffffffffffffffff811115612a2d57600080fd5b820160a08185031215612a3f57600080fd5b612a4761258e565b612a508261287f565b8152602082015167ffffffffffffffff811115612a6c57600080fd5b612a788682850161288f565b602083015250604082015167ffffffffffffffff811115612a9857600080fd5b612aa48682850161288f565b604083015250606082015167ffffffffffffffff811115612ac457600080fd5b612ad0868285016128f6565b606083015250608082015167ffffffffffffffff811115612af057600080fd5b612afc86828501612977565b608083015250949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8181038181111561068657610686612b39565b60005b83811015612b96578181015183820152602001612b7e565b50506000910152565b6020815260008251806020840152612bbe816040850160208701612b7b565b601f01601f19169190910160400192915050565b60008251612be4818460208701612b7b565b9190910192915050565b8082018082111561068657610686612b3956fea2646970667358221220e1baec8a0d6b380a8c72f6aec6d1c17e4a37c84d872dd683e3f2be44a49ecb3264736f6c634300081a0033";
