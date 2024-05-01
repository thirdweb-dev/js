export const mockExtensionERC20CompilerMetadata = {
  compiler: {
    version: "0.8.25+commit.b61c2a91",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
        name: "BeforeMintCallbackERC20NotImplemented",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidInitialization",
        type: "error",
      },
      {
        inputs: [],
        name: "NotInitializing",
        type: "error",
      },
      {
        inputs: [],
        name: "UnauthorizedCallContext",
        type: "error",
      },
      {
        inputs: [],
        name: "UnauthorizedUpgrade",
        type: "error",
      },
      {
        inputs: [],
        name: "UpgradeFailed",
        type: "error",
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
            name: "implementation",
            type: "address",
          },
        ],
        name: "Upgraded",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "beforeMintERC20",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getExtensionConfig",
        outputs: [
          {
            components: [
              {
                internalType: "bytes4[]",
                name: "callbackFunctions",
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
                    internalType: "enum IExtensionTypes.CallType",
                    name: "callType",
                    type: "uint8",
                  },
                  {
                    internalType: "bool",
                    name: "permissioned",
                    type: "bool",
                  },
                ],
                internalType: "struct IExtensionTypes.ExtensionFunction[]",
                name: "extensionABI",
                type: "tuple[]",
              },
            ],
            internalType: "struct IExtensionTypes.ExtensionConfig",
            name: "config",
            type: "tuple",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_upgradeAdmin",
            type: "address",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "proxiableUUID",
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
        inputs: [],
        name: "upgradeAdmin",
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
            internalType: "address",
            name: "newImplementation",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "upgradeToAndCall",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    devdoc: {
      errors: {
        "InvalidInitialization()": [
          {
            details: "The contract is already initialized.",
          },
        ],
        "NotInitializing()": [
          {
            details: "The contract is not initializing.",
          },
        ],
        "UnauthorizedCallContext()": [
          {
            details: "The call is from an unauthorized call context.",
          },
        ],
        "UpgradeFailed()": [
          {
            details: "The upgrade failed.",
          },
        ],
      },
      events: {
        "Initialized(uint64)": {
          details: "Triggered when the contract has been initialized.",
        },
        "Upgraded(address)": {
          details: "Emitted when the proxy's implementation is upgraded.",
        },
      },
      kind: "dev",
      methods: {
        "beforeMintERC20(address,uint256,bytes)": {
          params: {
            _amount: "The amount of tokens to mint.",
            _data: "Optional extra data passed to the hook.",
            _to: "The address to mint tokens to.",
          },
          returns: {
            _0: "Abi encoded bytes result of the hook.",
          },
        },
        "proxiableUUID()": {
          details:
            "Returns the storage slot used by the implementation, as specified in [ERC1822](https://eips.ethereum.org/EIPS/eip-1822). Note: The `notDelegated` modifier prevents accidental upgrades to an implementation that is a proxy contract.",
        },
        "upgradeToAndCall(address,bytes)": {
          details:
            "Upgrades the proxy's implementation to `newImplementation`. Emits a {Upgraded} event. Note: Passing in empty `data` skips the delegatecall to `newImplementation`.",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "beforeMintERC20(address,uint256,bytes)": {
          notice:
            "The beforeMintERC20 hook that is called by a core token before minting tokens.",
        },
        "getExtensionConfig()": {
          notice:
            "Returns all extension functions and supported callback functions of an extension contract.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/DemoExtension.sol": "DemoExtensionERC20",
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
      ":@erc721a/=lib/erc721a/contracts/",
      ":@solady/=lib/solady/src/",
      ":ds-test/=lib/forge-std/lib/ds-test/src/",
      ":erc721a/=lib/erc721a/contracts/",
      ":forge-std/=lib/forge-std/src/",
      ":solady/=lib/solady/src/",
    ],
  },
  sources: {
    "lib/solady/src/utils/Initializable.sol": {
      keccak256:
        "0x039ac865df50f874528619e58f2bfaa665b6cec82647c711e515cb252a45a2ec",
      license: "MIT",
      urls: [
        "bzz-raw://1886c0e71f4861a23113f9d3eb5f6f00397c1d1bf0191f92534c177a79ac8559",
        "dweb:/ipfs/QmPLWU427MN9KHFg6DFkrYNutCDLdtNSQLaqmPqKcoPRLy",
      ],
    },
    "lib/solady/src/utils/UUPSUpgradeable.sol": {
      keccak256:
        "0x0f4da34fe99caf063e6d3a09d0a4ce783fdcd955b475d46ba00be48f7fda348f",
      license: "MIT",
      urls: [
        "bzz-raw://5f8e8e92e7b781a8b0d3fdb720915964f46354395a806e87aa7d0a355a024a83",
        "dweb:/ipfs/QmdDmVgUstEYpVQn97jDdaACoqoqiEvcXjxtEhC8b6vmFC",
      ],
    },
    "src/DemoExtension.sol": {
      keccak256:
        "0xc42eca7b682a01a2a3eb961da1388da381fdd22a43c2cd775ffd64077008d836",
      license: "UNLICENSED",
      urls: [
        "bzz-raw://ea68215b9627fa23b71275080a20eeba6efe3c8179c8568dd95120724dc16196",
        "dweb:/ipfs/QmaEgiaLPCHD9Ri8MhrQdfb6LqS8C9cLkFXdcjKRCc1UCs",
      ],
    },
    "src/callback/BeforeApproveCallbackERC20.sol": {
      keccak256:
        "0x0fc8bfdc87329d9889858f06d40c7789af33b5f163e1ae03d8d7e76d34758d51",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://8b8d0d5ea48e3948650dc0190fbb91d5d3607c5824ee6281229c809e67d583a5",
        "dweb:/ipfs/QmSZVTAxEbphKMYr6KXHNvtrdHu9pdGDdJDY5MuwVpWa5Y",
      ],
    },
    "src/callback/BeforeApproveCallbackERC721.sol": {
      keccak256:
        "0x8de3fef08cb681d653ee782ce6ce8bd95e410f2f751c239b4577d868c28ed1b5",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://13ee284748869e3d9f4502b02f0e87460b73c78d6100d06071ee08b157bfaa38",
        "dweb:/ipfs/QmPmmqBFHvPqHTzkcocH7hNvMn2g9eLKbPaDEN4uhav4Gz",
      ],
    },
    "src/callback/BeforeApproveForAllCallback.sol": {
      keccak256:
        "0xdd387a603ea6038e5070d188e8c497f3ec2abe8afc504d5aac688a5e4a90e13d",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://c648d0b32eb281801041703d0db948d791f2b6bc10ce370c91e6f57016aecd75",
        "dweb:/ipfs/QmWqExhmALuF5M9Pm2jTqJeaTwAqv53Mg1sgwohA7MXh1w",
      ],
    },
    "src/callback/BeforeBurnCallbackERC1155.sol": {
      keccak256:
        "0x124e1dfee05b998928fd99fe738de1b4aa47b6b71680672a770b61e9d353b2d0",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://89a20f97007c783609faeecd40f56c6bf69acfb6f602cbc29259b3a357d3f6a8",
        "dweb:/ipfs/QmPmqAz3jJpcseTyfhi3AD9sCUcwuou1bRJFzo9H8hj7P2",
      ],
    },
    "src/callback/BeforeBurnCallbackERC20.sol": {
      keccak256:
        "0x5abb18d6361878bff52548ea047e5f2ada5781c2c25785741a749caf5eecbb91",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://2128bf7211020b900d682bf30c1dad7620ff7cf037b339117d7095b8c77283e8",
        "dweb:/ipfs/QmPyuy3vznBC2uQ4vC9yBQaNYS6BC6Cdraomtbs68Hmv5c",
      ],
    },
    "src/callback/BeforeBurnCallbackERC721.sol": {
      keccak256:
        "0x909988b80ff4c961b7ebab348ac03b20e371ab6b21b920cf8f92bd9e7c856355",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://964a4b48b4c42d359d4c252e6d1cf357a970276d14944a1b2364cafc4c77fa46",
        "dweb:/ipfs/QmUSRu72QxQkMBf4axV5UoYSsS3xvtgUFpY1XgEN34BhV5",
      ],
    },
    "src/callback/BeforeMintCallbackERC1155.sol": {
      keccak256:
        "0xea73d8d86bd1e8abac63b3e567d3d0182284d88a4f24dfcc52b9ff43ab2839fa",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://89f87619ef645d08b9d78b6eead2c0b95d8e9934c511fadc7ddb3aae08ec0ca5",
        "dweb:/ipfs/QmTj4UwLvjkr5Uxhkz7APdCTWUqPFk4JVkRnzmHW7jkY5q",
      ],
    },
    "src/callback/BeforeMintCallbackERC20.sol": {
      keccak256:
        "0xb1840f964179bb8ec3495065de565920a201a9320fb1c76021b4b586d30edbf9",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://4b11cda06cd0807c691ffb4be6f0d090d7a529b1b42e1128ab62bbba3cb09813",
        "dweb:/ipfs/QmY3AKzBpM9nNVmH4L9WVV22qWAda6QVdfp8xWZSeN5bKk",
      ],
    },
    "src/callback/BeforeMintCallbackERC721.sol": {
      keccak256:
        "0x0f8ec47dd3c232f075cf16e35c8c01c1d3519a28bd72b127925d76c2026a8b6e",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://c0ac380fe44aa8271aae7e06b30cf9f8b61415897cbc5145d66a254d01ed120d",
        "dweb:/ipfs/Qma5r9P3kxXCY8kpDhC36bBprMZ3T3joDpcoqf86mdwDuv",
      ],
    },
    "src/callback/BeforeTransferCallbackERC1155.sol": {
      keccak256:
        "0x95d0f56471a343aa8220371e00c36c5f330f05f5018ac571b5cd646c82bad2da",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://31be727fb59d5088588837ef9a2879823fa6a55bf6c94375cc64150f616b4382",
        "dweb:/ipfs/Qmf6ELoXAxbHaaRvxH5fneNXfr4qAffyawtUFHnuJWcHES",
      ],
    },
    "src/callback/BeforeTransferCallbackERC20.sol": {
      keccak256:
        "0x7ec3caa8e2a0beccf1e1bc91332900cb9198b49eec940201835617a4fc894128",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://170c25ad2b635e2d47d4615153ed47d2d805a352daf4d21a423a4081b5d9be47",
        "dweb:/ipfs/QmeyXcvEFyqkaJqcxFrSVnVcQ6fmRcWVuRaSCbHHSXsPiY",
      ],
    },
    "src/callback/BeforeTransferCallbackERC721.sol": {
      keccak256:
        "0xf7d61d74e5845d708fce7d251ef8317cdd0699138ab32dd05b7c103fd13c7af2",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://06b081f6a53a8869b09d5331811ad6e0239b0aaee3df0e1e59b4b53ffe7f4bd2",
        "dweb:/ipfs/QmTJDNH1gMWoa31N7Dy9hdixdf5t5nhX3dsJKXDiCddjLK",
      ],
    },
    "src/callback/OnTokenURICallback.sol": {
      keccak256:
        "0x988b95ad5ad6e3252e3eb4e1816796a814c6f7160b4966a1e557456276a9c4cf",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://840d15b62ece3f2d98ae49a1a8e5e288f99a6d06f468d54e7bac2afed7d81b31",
        "dweb:/ipfs/Qmdf7e8wTLtZQtxftzUS6TtyvikWeVQFX5EMZBs1UzqQNb",
      ],
    },
    "src/interface/IExtensionContract.sol": {
      keccak256:
        "0x604bda31ac473ee192e6ad157c4c8423825c391dc1797a5624c6be9f2228b35b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://9266977e06c967eff47402993ce34ee94b6eb88b4fff74ecd3919dedf0d2445b",
        "dweb:/ipfs/QmQU8SQPYof2GWLk9GB46dyvRfBoHEar3eouKpHj4ig7KH",
      ],
    },
    "src/interface/IExtensionTypes.sol": {
      keccak256:
        "0x930177ab145f62e4a03cf28ec931570f9d4bdbac9348cea313f0a1eec527fb0c",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://eb6a254b855b132e35b4146b02096bf5740d0c3561f5b52cb6cc9908713493d3",
        "dweb:/ipfs/QmSCieDGJTJiU4x3MxSUhBMJQny9j1G2xN1pANmjh7uut8",
      ],
    },
  },
  version: 1,
};
export const mockExtensionERC20Bytecode =
  "0x60a060405230608052348015601357600080fd5b506080516108886100366000396000818161015d015261024301526108886000f3fe6080604052600436106100655760003560e01c80637ce7cf07116100435780637ce7cf07146100c9578063c4d5608a146100e9578063c4d66de81461013b57600080fd5b80634f1ef2861461006a57806352d1902d1461007f5780637c173ecc146100a7575b600080fd5b61007d6100783660046104b0565b61015b565b005b34801561008b57600080fd5b5061009461023f565b6040519081526020015b60405180910390f35b3480156100b357600080fd5b506100bc61029e565b60405161009e9190610533565b6100dc6100d73660046106ab565b61033a565b60405161009e9190610794565b3480156100f557600080fd5b506000546101169073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161009e565b34801561014757600080fd5b5061007d610156366004610801565b610367565b7f000000000000000000000000000000000000000000000000000000000000000030810361019157639f03a0266000526004601cfd5b61019a84610433565b8360601b60601c93506352d1902d6001527f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80602060016004601d895afa51146101ec576355299b496001526004601dfd5b847fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b600038a2849055811561023957604051828482376000388483885af4610237573d6000823e3d81fd5b505b50505050565b60007f000000000000000000000000000000000000000000000000000000000000000030811461027757639f03a0266000526004601cfd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc91505090565b6040805180820182526060808252602082015281516001808252818401909352909181602001602082028036833750505080825280517f7ce7cf0700000000000000000000000000000000000000000000000000000000919060009061030657610306610823565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015290565b60608260405160200161034f91815260200190565b60405160208183030381529060405290509392505050565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf60113280546003825580156103b95760018160011c14303b106103b05763f92ee8a96000526004601cfd5b818160ff1b1b91505b50600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff8416179055801561042f576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050565b60005473ffffffffffffffffffffffffffffffffffffffff163314610484576040517f3a617a5400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b50565b803573ffffffffffffffffffffffffffffffffffffffff811681146104ab57600080fd5b919050565b6000806000604084860312156104c557600080fd5b6104ce84610487565b9250602084013567ffffffffffffffff808211156104eb57600080fd5b818601915086601f8301126104ff57600080fd5b81358181111561050e57600080fd5b87602082850101111561052057600080fd5b6020830194508093505050509250925092565b6000602080835260608084018551604080858801528282518085526080890191508684019450600093505b808410156105a05784517fffffffff0000000000000000000000000000000000000000000000000000000016825293860193600193909301929086019061055e565b50888601518882037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe00160408a01528051808352908701945090860192506000905b8082101561066e5784517fffffffff000000000000000000000000000000000000000000000000000000008151168552878101516003811061064d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b858901528301511515838501529386019392850192600191909101906105e2565b509198975050505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000806000606084860312156106c057600080fd5b6106c984610487565b925060208401359150604084013567ffffffffffffffff808211156106ed57600080fd5b818601915086601f83011261070157600080fd5b8135818111156107135761071361067c565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156107595761075961067c565b8160405282815289602084870101111561077257600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b60006020808352835180602085015260005b818110156107c2578581018301518582016040015282016107a6565b5060006040828601015260407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8301168501019250505092915050565b60006020828403121561081357600080fd5b61081c82610487565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea264697066735822122084af5b3db44dc2ff0711b90b89374aa6590d0c2e4a55545734186b25d48e1d6564736f6c63430008190033";
