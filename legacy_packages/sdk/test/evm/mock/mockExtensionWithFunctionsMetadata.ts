export const mockExtensionWithFunctionsCompilerMetadata = {
  compiler: {
    version: "0.8.25+commit.b61c2a91",
  },
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
        name: "getExtensionConfig",
        outputs: [
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
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "getNumber",
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
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "onInstall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
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
        inputs: [
          {
            internalType: "uint256",
            name: "_number",
            type: "uint256",
          },
        ],
        name: "setNumber",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "getExtensionConfig()": {
          details: "Returns the ExtensionConfig of the Extension contract.",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {},
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/Demo.sol": "DemoExtensionWithFunctions",
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
    "src/Demo.sol": {
      keccak256:
        "0x068244f9a6a172915e87645a5452fd89e1d74708a0f832c5e4b0ef2be2708482",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://7607e0e4d57b9b892993bebc375ddf589ce56111658dd174411cd2eb6a555b6e",
        "dweb:/ipfs/QmeAHmTYWbZ2ES1vo84cPA6kFeirTmgMSww9fQ6asV8uU6",
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

export const mockExtensionWithFunctionsBytecode =
  "0x6080604052348015600f57600080fd5b50610a708061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100de5760003560e01c80637c173ecc1161008c578063ae7c8cb711610066578063ae7c8cb7146100e3578063edf8bf0514610142578063f2c9ecd81461014a578063f8a6e73f146100ed57600080fd5b80637c173ecc1461012d57806389242efb146100e35780638dc5fd9e146100e357600080fd5b806313fe88e1116100bd57806313fe88e1146100ed5780633fb5c1cb146100ff578063774237fc1461011257600080fd5b8062862ba3146100e35780630a340d43146100e357806313efddd6146100e5575b600080fd5b005b6100e3610152565b6100e36100fb366004610710565b5050565b6100e361010d36600461080b565b600055565b61011a602081565b6040519081526020015b60405180910390f35b61013561017d565b60405161012491906108e1565b6100e36105a2565b60005461011a565b6040517f6a94d761ae01a14a6739229452f57b368e87612171065a3d5019e116a9d396f290600090a1565b6040805160a08101825260008082526020820152606091810182905281810182905260808101919091526101af6105cd565b60608201526040805160088082526101208201909252600091816020015b60408051808201909152600080825260208201528152602001906001900390816101cd57905050905060405180604001604052807f13efddd6569653d47ffac5372eb47444c286a8ffef1e53038543a9c9fe261e907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160008151811061025e5761025e6109cb565b602002602001018190525060405180604001604052807f0a340d43c189d7683fd9ee595c325b463eae26aafcbd5bf4771c28877148f06d7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000815250816001815181106102d1576102d16109cb565b602002602001018190525060405180604001604052807f89242efbc954119627fd4a16f1f2790891241f888b08be9ba0e8af83c98d3bf37bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600081525081600281518110610344576103446109cb565b602002602001018190525060405180604001604052807fae7c8cb7979eaf4a80027a43922a52050b99ff8ed3c879b57a11ceb2b27119037bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816003815181106103b7576103b76109cb565b602002602001018190525060405180604001604052807e862ba3689d7a82a419b334a17a891037a52d70a8e64ee36441f919abd23bf17bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001602081525081600481518110610429576104296109cb565b602002602001018190525060405180604001604052807f8dc5fd9e74636db43b52422eb4d289625be2cf24b7f73fa7ebd9b1fae51c70f87bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160058151811061049c5761049c6109cb565b602002602001018190525060405180604001604052807f3fb5c1cb9d57cc981b075ac270f9215e697bc33dacd5ce87319656ebf8fc7b927bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160068151811061050f5761050f6109cb565b602002602001018190525060405180604001604052807ff2c9ecd8ec9cc7cb8e7819015497279c0a95e47a657075f0f863f20e4918963c7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600081525081600781518110610582576105826109cb565b602090810291909101810191909152608083019190915260019082015290565b6040517f79201cdedb9b351e17bd1274b3465126723ac336d7a6b1546a2f0e97b8f0a73090600090a1565b60606105db600a60016109fa565b67ffffffffffffffff8111156105f3576105f36106e1565b60405190808252806020026020018201604052801561063357816020015b6040805160208101909152600081528152602001906001900390816106115790505b50905060005b600a811015610691578060e01b828281518110610658576106586109cb565b60209081029190910101517fffffffff000000000000000000000000000000000000000000000000000000009091169052600101610639565b5063edf8bf0560e01b81600a815181106106ad576106ad6109cb565b60209081029190910101517fffffffff00000000000000000000000000000000000000000000000000000000909116905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806040838503121561072357600080fd5b823573ffffffffffffffffffffffffffffffffffffffff8116811461074757600080fd5b9150602083013567ffffffffffffffff8082111561076457600080fd5b818501915085601f83011261077857600080fd5b81358181111561078a5761078a6106e1565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156107d0576107d06106e1565b816040528281528860208487010111156107e957600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b60006020828403121561081d57600080fd5b5035919050565b60008151808452602080850194506020840160005b83811015610878578151517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101610839565b509495945050505050565b60008151808452602080850194506020840160005b8381101561087857815180517fffffffff000000000000000000000000000000000000000000000000000000001688528301518388015260409096019590820190600101610898565b6000602080835260c083017fffffffff0000000000000000000000000000000000000000000000000000000080865116838601528286015115156040860152604086015160a0606087015282815180855260e0880191508583019450600092505b8083101561096457845184168252938501936001929092019190850190610942565b50606088015194507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09350838782030160808801526109a38186610824565b94505050506080850151818584030160a08601526109c18382610883565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80820180821115610a34577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b9291505056fea2646970667358221220da623249376ce3cd34e573e3b913c0f4d97ed50f491df5431915d0c1674a9c8864736f6c63430008190033";

export const mockExtensionWithFunctionsDeployedBytecode =
  "0x608060405234801561001057600080fd5b50600436106100de5760003560e01c80637c173ecc1161008c578063ae7c8cb711610066578063ae7c8cb7146100e3578063edf8bf0514610142578063f2c9ecd81461014a578063f8a6e73f146100ed57600080fd5b80637c173ecc1461012d57806389242efb146100e35780638dc5fd9e146100e357600080fd5b806313fe88e1116100bd57806313fe88e1146100ed5780633fb5c1cb146100ff578063774237fc1461011257600080fd5b8062862ba3146100e35780630a340d43146100e357806313efddd6146100e5575b600080fd5b005b6100e3610152565b6100e36100fb366004610710565b5050565b6100e361010d36600461080b565b600055565b61011a602081565b6040519081526020015b60405180910390f35b61013561017d565b60405161012491906108e1565b6100e36105a2565b60005461011a565b6040517f6a94d761ae01a14a6739229452f57b368e87612171065a3d5019e116a9d396f290600090a1565b6040805160a08101825260008082526020820152606091810182905281810182905260808101919091526101af6105cd565b60608201526040805160088082526101208201909252600091816020015b60408051808201909152600080825260208201528152602001906001900390816101cd57905050905060405180604001604052807f13efddd6569653d47ffac5372eb47444c286a8ffef1e53038543a9c9fe261e907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160008152508160008151811061025e5761025e6109cb565b602002602001018190525060405180604001604052807f0a340d43c189d7683fd9ee595c325b463eae26aafcbd5bf4771c28877148f06d7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016000815250816001815181106102d1576102d16109cb565b602002602001018190525060405180604001604052807f89242efbc954119627fd4a16f1f2790891241f888b08be9ba0e8af83c98d3bf37bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600081525081600281518110610344576103446109cb565b602002602001018190525060405180604001604052807fae7c8cb7979eaf4a80027a43922a52050b99ff8ed3c879b57a11ceb2b27119037bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016020815250816003815181106103b7576103b76109cb565b602002602001018190525060405180604001604052807e862ba3689d7a82a419b334a17a891037a52d70a8e64ee36441f919abd23bf17bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001602081525081600481518110610429576104296109cb565b602002602001018190525060405180604001604052807f8dc5fd9e74636db43b52422eb4d289625be2cf24b7f73fa7ebd9b1fae51c70f87bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160058151811061049c5761049c6109cb565b602002602001018190525060405180604001604052807f3fb5c1cb9d57cc981b075ac270f9215e697bc33dacd5ce87319656ebf8fc7b927bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200160208152508160068151811061050f5761050f6109cb565b602002602001018190525060405180604001604052807ff2c9ecd8ec9cc7cb8e7819015497279c0a95e47a657075f0f863f20e4918963c7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001600081525081600781518110610582576105826109cb565b602090810291909101810191909152608083019190915260019082015290565b6040517f79201cdedb9b351e17bd1274b3465126723ac336d7a6b1546a2f0e97b8f0a73090600090a1565b60606105db600a60016109fa565b67ffffffffffffffff8111156105f3576105f36106e1565b60405190808252806020026020018201604052801561063357816020015b6040805160208101909152600081528152602001906001900390816106115790505b50905060005b600a811015610691578060e01b828281518110610658576106586109cb565b60209081029190910101517fffffffff000000000000000000000000000000000000000000000000000000009091169052600101610639565b5063edf8bf0560e01b81600a815181106106ad576106ad6109cb565b60209081029190910101517fffffffff00000000000000000000000000000000000000000000000000000000909116905290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806040838503121561072357600080fd5b823573ffffffffffffffffffffffffffffffffffffffff8116811461074757600080fd5b9150602083013567ffffffffffffffff8082111561076457600080fd5b818501915085601f83011261077857600080fd5b81358181111561078a5761078a6106e1565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156107d0576107d06106e1565b816040528281528860208487010111156107e957600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b60006020828403121561081d57600080fd5b5035919050565b60008151808452602080850194506020840160005b83811015610878578151517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101610839565b509495945050505050565b60008151808452602080850194506020840160005b8381101561087857815180517fffffffff000000000000000000000000000000000000000000000000000000001688528301518388015260409096019590820190600101610898565b6000602080835260c083017fffffffff0000000000000000000000000000000000000000000000000000000080865116838601528286015115156040860152604086015160a0606087015282815180855260e0880191508583019450600092505b8083101561096457845184168252938501936001929092019190850190610942565b50606088015194507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09350838782030160808801526109a38186610824565b94505050506080850151818584030160a08601526109c18382610883565b9695505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80820180821115610a34577f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b9291505056fea2646970667358221220da623249376ce3cd34e573e3b913c0f4d97ed50f491df5431915d0c1674a9c8864736f6c63430008190033";
