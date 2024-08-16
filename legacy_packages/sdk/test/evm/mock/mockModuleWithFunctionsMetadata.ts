export const mockModuleWithFunctionsCompilerMetadata = {
  compiler: { version: "0.8.26+commit.8a97fa7a" },
  language: "Solidity",
  output: {
    abi: [
      {
        anonymous: false,
        inputs: [],
        name: "CallbackFunctionOne",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [],
        name: "FallbackFunctionCalled",
        type: "event",
      },
      {
        inputs: [],
        name: "CALLER_ROLE",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
        name: "getModuleConfig",
        outputs: [
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
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "getNumber",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "notPermissioned_call",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "notPermissioned_delegatecall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "notPermissioned_staticcall",
        outputs: [],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "onInstall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "onUninstall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "permissioned_call",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "permissioned_delegatecall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "permissioned_staticcall",
        outputs: [],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "_number", type: "uint256" }],
        name: "setNumber",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "getModuleConfig()": {
          details: "Returns the ModuleConfig of the Module contract.",
        },
      },
      version: 1,
    },
    userdoc: { kind: "user", methods: {}, version: 1 },
  },
  settings: {
    compilationTarget: { "src/Demo.sol": "DemoModuleWithFunctions" },
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

export const mockModuleWithFunctionsBytecode =
  "0x6080604052348015600f57600080fd5b50610ab48061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100de5760003560e01c806389242efb1161008c5780638dc5fd9e116100665780638dc5fd9e146100e3578063ae7c8cb7146100e3578063edf8bf0514610141578063f2c9ecd81461014957600080fd5b806389242efb146100e357806389e04e0e1461012c5780638a91b0e31461010057600080fd5b80633fb5c1cb116100bd5780633fb5c1cb146100ed5780636d61fe7014610100578063774237fc1461011157600080fd5b8062862ba3146100e35780630a340d43146100e357806313efddd6146100e5575b600080fd5b005b6100e3610151565b6100e36100fb3660046106e1565b600055565b6100e361010e366004610729565b50565b610119602081565b6040519081526020015b60405180910390f35b61013461017c565b60405161012391906108dd565b6100e36105a2565b600054610119565b6040517f6a94d761ae01a14a6739229452f57b368e87612171065a3d5019e116a9d396f290600090a1565b6101b06040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b6101b86105cd565b60608201526040805160088082526101208201909252600091816020015b60408051808201909152600080825260208201528152602001906001900390816101d657905050905060405180604001604052807f13efddd6569653d47ffac5372eb47444c286a8ffef1e53038543a9c9fe261e907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160008151811061026757610267610a0f565b602002602001018190525060405180604001604052807f0a340d43c189d7683fd9ee595c325b463eae26aafcbd5bf4771c28877148f06d7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000815250816001815181106102da576102da610a0f565b602002602001018190525060405180604001604052807f89242efbc954119627fd4a16f1f2790891241f888b08be9ba0e8af83c98d3bf37bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160028151811061034d5761034d610a0f565b602002602001018190525060405180604001604052807fae7c8cb7979eaf4a80027a43922a52050b99ff8ed3c879b57a11ceb2b27119037bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816003815181106103c0576103c0610a0f565b602002602001018190525060405180604001604052807e862ba3689d7a82a419b334a17a891037a52d70a8e64ee36441f919abd23bf17bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160048151811061043257610432610a0f565b602002602001018190525060405180604001604052807f8dc5fd9e74636db43b52422eb4d289625be2cf24b7f73fa7ebd9b1fae51c70f87bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816005815181106104a5576104a5610a0f565b602002602001018190525060405180604001604052807f3fb5c1cb9d57cc981b075ac270f9215e697bc33dacd5ce87319656ebf8fc7b927bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160068151811061051857610518610a0f565b602002602001018190525060405180604001604052807ff2c9ecd8ec9cc7cb8e7819015497279c0a95e47a657075f0f863f20e4918963c7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160078151811061058b5761058b610a0f565b602090810291909101015260808201526001815290565b6040517f79201cdedb9b351e17bd1274b3465126723ac336d7a6b1546a2f0e97b8f0a73090600090a1565b60606105db600a6001610a3e565b67ffffffffffffffff8111156105f3576105f36106fa565b60405190808252806020026020018201604052801561063357816020015b6040805160208101909152600081528152602001906001900390816106115790505b50905060005b600a811015610691578060e01b82828151811061065857610658610a0f565b60209081029190910101517fffffffff000000000000000000000000000000000000000000000000000000009091169052600101610639565b5063edf8bf0560e01b81600a815181106106ad576106ad610a0f565b60209081029190910101517fffffffff00000000000000000000000000000000000000000000000000000000909116905290565b6000602082840312156106f357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020828403121561073b57600080fd5b813567ffffffffffffffff81111561075257600080fd5b8201601f8101841361076357600080fd5b803567ffffffffffffffff81111561077d5761077d6106fa565b6040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0603f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501160116810181811067ffffffffffffffff821117156107e9576107e96106fa565b60405281815282820160200186101561080157600080fd5b81602084016020830137600091810160200191909152949350505050565b600081518084526020840193506020830160005b828110156108735781517fffffffff0000000000000000000000000000000000000000000000000000000016865260209586019590910190600101610833565b5093949350505050565b600081518084526020840193506020830160005b8281101561087357815180517fffffffff000000000000000000000000000000000000000000000000000000001687526020908101518188015260409096019590910190600101610891565b602081528151151560208201526000602083015160a0604084015261090560c084018261081f565b905060408401517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0848303016060850152610940828261081f565b60608601518582037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0016080870152805180835260209182019450600093509101905b808310156109c9577fffffffff00000000000000000000000000000000000000000000000000000000845151168252602082019150602084019350600183019250610983565b50608086015192507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08582030160a0860152610a05818461087d565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80820180821115610a78577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b9291505056fea2646970667358221220a76d54bec703944cd2f50f00237a8283a1e7715bc5f1b6f9ccade395d248d9d364736f6c634300081a0033";

export const mockModuleWithFunctionsDeployedBytecode =
  "0x608060405234801561001057600080fd5b50600436106100de5760003560e01c806389242efb1161008c5780638dc5fd9e116100665780638dc5fd9e146100e3578063ae7c8cb7146100e3578063edf8bf0514610141578063f2c9ecd81461014957600080fd5b806389242efb146100e357806389e04e0e1461012c5780638a91b0e31461010057600080fd5b80633fb5c1cb116100bd5780633fb5c1cb146100ed5780636d61fe7014610100578063774237fc1461011157600080fd5b8062862ba3146100e35780630a340d43146100e357806313efddd6146100e5575b600080fd5b005b6100e3610151565b6100e36100fb3660046106e1565b600055565b6100e361010e366004610729565b50565b610119602081565b6040519081526020015b60405180910390f35b61013461017c565b60405161012391906108dd565b6100e36105a2565b600054610119565b6040517f6a94d761ae01a14a6739229452f57b368e87612171065a3d5019e116a9d396f290600090a1565b6101b06040518060a00160405280600015158152602001606081526020016060815260200160608152602001606081525090565b6101b86105cd565b60608201526040805160088082526101208201909252600091816020015b60408051808201909152600080825260208201528152602001906001900390816101d657905050905060405180604001604052807f13efddd6569653d47ffac5372eb47444c286a8ffef1e53038543a9c9fe261e907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160008151811061026757610267610a0f565b602002602001018190525060405180604001604052807f0a340d43c189d7683fd9ee595c325b463eae26aafcbd5bf4771c28877148f06d7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000815250816001815181106102da576102da610a0f565b602002602001018190525060405180604001604052807f89242efbc954119627fd4a16f1f2790891241f888b08be9ba0e8af83c98d3bf37bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160028151811061034d5761034d610a0f565b602002602001018190525060405180604001604052807fae7c8cb7979eaf4a80027a43922a52050b99ff8ed3c879b57a11ceb2b27119037bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816003815181106103c0576103c0610a0f565b602002602001018190525060405180604001604052807e862ba3689d7a82a419b334a17a891037a52d70a8e64ee36441f919abd23bf17bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160048151811061043257610432610a0f565b602002602001018190525060405180604001604052807f8dc5fd9e74636db43b52422eb4d289625be2cf24b7f73fa7ebd9b1fae51c70f87bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816005815181106104a5576104a5610a0f565b602002602001018190525060405180604001604052807f3fb5c1cb9d57cc981b075ac270f9215e697bc33dacd5ce87319656ebf8fc7b927bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160068151811061051857610518610a0f565b602002602001018190525060405180604001604052807ff2c9ecd8ec9cc7cb8e7819015497279c0a95e47a657075f0f863f20e4918963c7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160078151811061058b5761058b610a0f565b602090810291909101015260808201526001815290565b6040517f79201cdedb9b351e17bd1274b3465126723ac336d7a6b1546a2f0e97b8f0a73090600090a1565b60606105db600a6001610a3e565b67ffffffffffffffff8111156105f3576105f36106fa565b60405190808252806020026020018201604052801561063357816020015b6040805160208101909152600081528152602001906001900390816106115790505b50905060005b600a811015610691578060e01b82828151811061065857610658610a0f565b60209081029190910101517fffffffff000000000000000000000000000000000000000000000000000000009091169052600101610639565b5063edf8bf0560e01b81600a815181106106ad576106ad610a0f565b60209081029190910101517fffffffff00000000000000000000000000000000000000000000000000000000909116905290565b6000602082840312156106f357600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60006020828403121561073b57600080fd5b813567ffffffffffffffff81111561075257600080fd5b8201601f8101841361076357600080fd5b803567ffffffffffffffff81111561077d5761077d6106fa565b6040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0603f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8501160116810181811067ffffffffffffffff821117156107e9576107e96106fa565b60405281815282820160200186101561080157600080fd5b81602084016020830137600091810160200191909152949350505050565b600081518084526020840193506020830160005b828110156108735781517fffffffff0000000000000000000000000000000000000000000000000000000016865260209586019590910190600101610833565b5093949350505050565b600081518084526020840193506020830160005b8281101561087357815180517fffffffff000000000000000000000000000000000000000000000000000000001687526020908101518188015260409096019590910190600101610891565b602081528151151560208201526000602083015160a0604084015261090560c084018261081f565b905060408401517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0848303016060850152610940828261081f565b60608601518582037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0016080870152805180835260209182019450600093509101905b808310156109c9577fffffffff00000000000000000000000000000000000000000000000000000000845151168252602082019150602084019350600183019250610983565b50608086015192507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08582030160a0860152610a05818461087d565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80820180821115610a78577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b9291505056fea2646970667358221220a76d54bec703944cd2f50f00237a8283a1e7715bc5f1b6f9ccade395d248d9d364736f6c634300081a0033";
