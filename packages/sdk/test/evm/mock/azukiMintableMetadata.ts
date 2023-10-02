export const azukiMintableCompilerMetadata = {
  compiler: {
    version: "0.8.4+commit.c7e474f2",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "maxSupply",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "ApprovalCallerNotOwnerNorApproved",
        type: "error",
      },
      {
        inputs: [],
        name: "ApprovalQueryForNonexistentToken",
        type: "error",
      },
      {
        inputs: [],
        name: "ApprovalToCurrentOwner",
        type: "error",
      },
      {
        inputs: [],
        name: "ApproveToCaller",
        type: "error",
      },
      {
        inputs: [],
        name: "BalanceQueryForZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "MintToZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "MintZeroQuantity",
        type: "error",
      },
      {
        inputs: [],
        name: "OwnerQueryForNonexistentToken",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferCallerNotOwnerNorApproved",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferFromIncorrectOwner",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferToNonERC721ReceiverImplementer",
        type: "error",
      },
      {
        inputs: [],
        name: "TransferToZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "URIQueryForNonexistentToken",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
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
            indexed: false,
            internalType: "address",
            name: "newRoyaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newRoyaltyBps",
            type: "uint256",
          },
        ],
        name: "DefaultRoyalty",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnerUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "royaltyRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "royaltyBps",
            type: "uint256",
          },
        ],
        name: "RoyaltyForToken",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "mintedTo",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenIdMinted",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        name: "TokensMinted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
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
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
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
        inputs: [],
        name: "getDefaultRoyaltyInfo",
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
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "getRoyaltyInfoForToken",
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
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
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
            name: "to",
            type: "address",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        name: "mintTo",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
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
        name: "owner",
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
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
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
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salePrice",
            type: "uint256",
          },
        ],
        name: "royaltyInfo",
        outputs: [
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "royaltyAmount",
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
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
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
            name: "_royaltyRecipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_royaltyBps",
            type: "uint256",
          },
        ],
        name: "setDefaultRoyaltyInfo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_newOwner",
            type: "address",
          },
        ],
        name: "setOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_bps",
            type: "uint256",
          },
        ],
        name: "setRoyaltyInfoForToken",
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
        inputs: [],
        name: "symbol",
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
        inputs: [
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "tokenByIndex",
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
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "tokenOfOwnerByIndex",
        outputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
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
        name: "totalSupply",
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
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "approve(address,uint256)": {
          details: "See {IERC721-approve}.",
        },
        "balanceOf(address)": {
          details: "See {IERC721-balanceOf}.",
        },
        constructor: {
          details:
            "Custom constructor parameters, will be filled in on the dashboard before deploying",
        },
        "getApproved(uint256)": {
          details: "See {IERC721-getApproved}.",
        },
        "getDefaultRoyaltyInfo()": {
          details: "Returns the default royalty recipient and bps.",
        },
        "getRoyaltyInfoForToken(uint256)": {
          details:
            "Returns the royalty recipient and bps for a particular token Id.",
        },
        "isApprovedForAll(address,address)": {
          details: "See {IERC721-isApprovedForAll}.",
        },
        "mintTo(address,string)": {
          details:
            "Modified Azuki mint function to accept a URI, and work in our dashboard",
        },
        "name()": {
          details: "See {IERC721Metadata-name}.",
        },
        "ownerOf(uint256)": {
          details: "See {IERC721-ownerOf}.",
        },
        "royaltyInfo(uint256,uint256)": {
          details:
            "Returns the royalty recipient and amount, given a tokenId and sale price.",
        },
        "safeTransferFrom(address,address,uint256)": {
          details: "See {IERC721-safeTransferFrom}.",
        },
        "safeTransferFrom(address,address,uint256,bytes)": {
          details: "See {IERC721-safeTransferFrom}.",
        },
        "setApprovalForAll(address,bool)": {
          details: "See {IERC721-setApprovalForAll}.",
        },
        "setContractURI(string)": {
          details:
            "Lets a contract admin set the URI for contract-level metadata.",
        },
        "setDefaultRoyaltyInfo(address,uint256)": {
          details:
            "Lets a contract admin update the default royalty recipient and bps.",
        },
        "setOwner(address)": {
          details:
            "Lets a contract admin set a new owner for the contract. The new owner must be a contract admin.",
        },
        "setRoyaltyInfoForToken(uint256,address,uint256)": {
          details:
            "Lets a contract admin set the royalty recipient and bps for a particular token Id.",
        },
        "supportsInterface(bytes4)": {
          details: "See {IERC165-supportsInterface}.",
        },
        "symbol()": {
          details: "See {IERC721Metadata-symbol}.",
        },
        "tokenByIndex(uint256)": {
          details:
            "Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with {totalSupply} to enumerate all tokens.",
        },
        "tokenOfOwnerByIndex(address,uint256)": {
          details:
            "Returns a token ID owned by `owner` at a given `index` of its token list. Use along with {balanceOf} to enumerate all of ``owner``'s tokens.",
        },
        "tokenURI(uint256)": {
          details: "Modified tokenURI to return more than just base URI",
        },
        "totalSupply()": {
          details:
            "Burned tokens are calculated here, use _totalMinted() if you want to count just minted tokens.",
        },
        "transferFrom(address,address,uint256)": {
          details: "See {IERC721-transferFrom}.",
        },
      },
      title: "Azuki contract that can be fully used in the thirdweb dashboard",
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "mintTo(address,string)": {
          notice: "Test user comment TW WAS HERE",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/CustomAzuki.sol": "CustomAzukiContract",
    },
    evmVersion: "istanbul",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
    remappings: [],
  },
  sources: {
    "@openzeppelin/contracts/token/ERC721/IERC721.sol": {
      keccak256:
        "0x516a22876c1fab47f49b1bc22b4614491cd05338af8bd2e7b382da090a079990",
      license: "MIT",
      urls: [
        "bzz-raw://a439187f7126d31add4557f82d8aed6be0162007cd7182c48fd934dbab8f3849",
        "dweb:/ipfs/QmRPLguRFvrRJS7r6F1bcLvsx6q1VrgjEpZafyeL8D7xZh",
      ],
    },
    "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
      keccak256:
        "0xd5fa74b4fb323776fa4a8158800fec9d5ac0fec0d6dd046dd93798632ada265f",
      license: "MIT",
      urls: [
        "bzz-raw://33017a30a99cc5411a9e376622c31fc4a55cfc6a335e2f57f00cbf24a817ff3f",
        "dweb:/ipfs/QmWNQtWTPhA7Lo8nbxbc8KFMvZwbFYB8fSeEQ3vuapSV4a",
      ],
    },
    "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol": {
      keccak256:
        "0x483f88fbbb1d6d75000fbe8ce14279b5e6121cd5a29ff5f1b91fed407735a6c3",
      license: "MIT",
      urls: [
        "bzz-raw://51cbe83f9ccd8619d58ca5458ff49c470c656a45856b0e7435eebf5f5d431bf1",
        "dweb:/ipfs/QmZwR7nwu4hzVJW2m3JTPyjUopoxZUxjYLSgcSK5D4F7E2",
      ],
    },
    "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol": {
      keccak256:
        "0x75b829ff2f26c14355d1cba20e16fe7b29ca58eb5fef665ede48bc0f9c6c74b9",
      license: "MIT",
      urls: [
        "bzz-raw://a0a107160525724f9e1bbbab031defc2f298296dd9e331f16a6f7130cec32146",
        "dweb:/ipfs/QmemujxSd7gX8A9M8UwmNbz4Ms3U9FG9QfudUgxwvTmPWf",
      ],
    },
    "@openzeppelin/contracts/utils/Address.sol": {
      keccak256:
        "0x51b758a8815ecc9596c66c37d56b1d33883a444631a3f916b9fe65cb863ef7c4",
      license: "MIT",
      urls: [
        "bzz-raw://997ca03557985b3c6f9143a18b6c3a710b3bc1c7f189ee956d305a966ecfb922",
        "dweb:/ipfs/QmQaD3Wb62F88SHqmpLttvF6wKuPDQep2LLUcKPekeRzvz",
      ],
    },
    "@openzeppelin/contracts/utils/Context.sol": {
      keccak256:
        "0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7",
      license: "MIT",
      urls: [
        "bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92",
        "dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3",
      ],
    },
    "@openzeppelin/contracts/utils/Strings.sol": {
      keccak256:
        "0x32c202bd28995dd20c4347b7c6467a6d3241c74c8ad3edcbb610cd9205916c45",
      license: "MIT",
      urls: [
        "bzz-raw://8179c356adb19e70d6b31a1eedc8c5c7f0c00e669e2540f4099e3844c6074d30",
        "dweb:/ipfs/QmWFbivarEobbqhS1go64ootVuHfVohBseerYy9FTEd1W2",
      ],
    },
    "@openzeppelin/contracts/utils/introspection/ERC165.sol": {
      keccak256:
        "0xd10975de010d89fd1c78dc5e8a9a7e7f496198085c151648f20cba166b32582b",
      license: "MIT",
      urls: [
        "bzz-raw://fb0048dee081f6fffa5f74afc3fb328483c2a30504e94a0ddd2a5114d731ec4d",
        "dweb:/ipfs/QmZptt1nmYoA5SgjwnSgWqgUSDgm4q52Yos3xhnMv3MV43",
      ],
    },
    "@openzeppelin/contracts/utils/introspection/IERC165.sol": {
      keccak256:
        "0x447a5f3ddc18419d41ff92b3773fb86471b1db25773e07f877f548918a185bf1",
      license: "MIT",
      urls: [
        "bzz-raw://be161e54f24e5c6fae81a12db1a8ae87bc5ae1b0ddc805d82a1440a68455088f",
        "dweb:/ipfs/QmP7C3CHdY9urF4dEMb9wmsp1wMxHF6nhA2yQE5SKiPAdy",
      ],
    },
    "@thirdweb-dev/contracts/feature/ContractMetadata.sol": {
      keccak256:
        "0x97620ca807f2f4187f869e7f9a128a2cec0b6e1c6ab80b594d49350af1112f1a",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://0a63a514d75ce94f3fc4b0ac2910fa5e8bc163c99f562d60e9dc2c76ef723145",
        "dweb:/ipfs/QmfLY4MxqikepggnZRCaRAM4Ghfr6TqZA5YBHcn8bhFMqJ",
      ],
    },
    "@thirdweb-dev/contracts/feature/Ownable.sol": {
      keccak256:
        "0xd189b801fbde5450893afdb42ba5a461df91b1b03cfb335f339cf3e96cf65f43",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e3153b60d48dd99bb3fdc860eb3fdc58db9c978dd142440ae4e551f4527c1b9f",
        "dweb:/ipfs/QmafoVGSSLEa48DadjVCNsPCLBvUosHZqU2JTZfWHrQFdZ",
      ],
    },
    "@thirdweb-dev/contracts/feature/Royalty.sol": {
      keccak256:
        "0x68150332180b14b523c84c49151b44764325f7509626ca8b5a0203d0cd6a4d86",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://90428d9a8716cd4bcf344930b6408bfa9dfc655d6d3ba3713fe950d14af05dc1",
        "dweb:/ipfs/QmSPvBmuQkiCE6nkBqrP5kmi8MZ6F8B3sWfxP5tUEvykeS",
      ],
    },
    "@thirdweb-dev/contracts/feature/interface/IContractMetadata.sol": {
      keccak256:
        "0x3fe36fe1bebbbfdcfb65027f54aa199948806c879548ce69d65fe4ba260f0415",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f411db3a6f4956357840f353864b5b43ff99319b38b5fe98b1daa89c4d75833a",
        "dweb:/ipfs/QmWdnGJT41Va4zPmrh3TGCve3ApQdcmUs8GNjFxn1VsRkc",
      ],
    },
    "@thirdweb-dev/contracts/feature/interface/IMintableERC721.sol": {
      keccak256:
        "0xe41f6948041e638692158e45f0fa66a4cf464a442a33f9d5a70634f3a440d1a1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://7cbe1b8b99660c99be0b0339eec414c52be5dfc5a2eda44ae4714a1cf848b0be",
        "dweb:/ipfs/QmdzygbUQyf8QXWiAuGi6WDou2KZkre3WqDGbSo1PYMhXZ",
      ],
    },
    "@thirdweb-dev/contracts/feature/interface/IOwnable.sol": {
      keccak256:
        "0x2c3ea8c3c1688337d3eacf55b055b51689ab03d6906366e0a8c6959b4794d7c7",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4136249c9207296acc87bf1ea0999ddf786570efe1fd6986ba9347c9998d7a3d",
        "dweb:/ipfs/Qmd726Pcis1DUtuac6VwHuMKodGt8FhtMZm7BXjdx8EX6a",
      ],
    },
    "@thirdweb-dev/contracts/feature/interface/IRoyalty.sol": {
      keccak256:
        "0xebad2b5837b872e4e37fd4d5ea5eaef7b5d79bd651d7fd3406d1de2787819542",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e6781517f767fe5bc2cd32325cf15a414e846d21ae2b6cb3f3d9be4844eb9c5d",
        "dweb:/ipfs/QmXqQmswyURtJLnu5FzSj3ZvExfvctVRnUVj1S8hf9SLqw",
      ],
    },
    "contracts/CustomAzuki.sol": {
      keccak256:
        "0x7c1a5fbfca2d2b1e55d88f643d4e0f497b3cf8cf3d4dfd7902082e2271f49ddd",
      license: "MIT",
      urls: [
        "bzz-raw://4f323b34a8d466b2952dd52669971b7fe1a0f04d210e8dfe922ff8e18fcb47dd",
        "dweb:/ipfs/QmdRc8WZ1g9puSKD4zMG9dTCFG9JxHknB7P6D64ZFRP5sY",
      ],
    },
    "contracts/ERC721A.sol": {
      keccak256:
        "0xda7933157258c8fe1b51fdc369c680f5493947aa967b7ec8537e63824b2b8320",
      license: "MIT",
      urls: [
        "bzz-raw://35543d648a0657e1853bb539f861f5f78609812d03bda289349828bb45902774",
        "dweb:/ipfs/QmUf8Q7vkv46qm6yiWAMHYNjP1KDzc9bipVfde3qsFG7io",
      ],
    },
    "contracts/IERC721A.sol": {
      keccak256:
        "0xf91d0005163e80f1f419bf88bd7384d35fed5bf47903df95edfba7274dd7312f",
      license: "MIT",
      urls: [
        "bzz-raw://47a20c029c96df0cd7c324e51fc7be3b678ba0f34097c076f76e9040c953b0c3",
        "dweb:/ipfs/QmVMDy2cPs43PGUVaa7drZWS88CyxdcQod6XXfS4dQuyLZ",
      ],
    },
  },
  version: 1,
};

export const azukiMintableBytecode =
  "0x60806040523480156200001157600080fd5b5060405162001ca738038062001ca7833981016040819052620000349162000146565b60408051808201909152600980825268105e9d5ada535a5b9d60ba1b6020830190815283916200006791600291620000a0565b5080516200007d906003906020840190620000a0565b50600080555050600880546001600160a01b0319163317905550600d556200027d565b828054620000ae906200022a565b90600052602060002090601f016020900481019282620000d257600085556200011d565b82601f10620000ed57805160ff19168380011785556200011d565b828001600101855582156200011d579182015b828111156200011d57825182559160200191906001019062000100565b506200012b9291506200012f565b5090565b5b808211156200012b576000815560010162000130565b6000806040838503121562000159578182fd5b8251602080850151919350906001600160401b03808211156200017a578384fd5b818601915086601f8301126200018e578384fd5b815181811115620001a357620001a362000267565b604051601f8201601f19908116603f01168101908382118183101715620001ce57620001ce62000267565b816040528281528986848701011115620001e6578687fd5b8693505b82841015620002095784840186015181850187015292850192620001ea565b828411156200021a57868684830101525b8096505050505050509250929050565b600181811c908216806200023f57607f821691505b602082108114156200026157634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b611a1a806200028d6000396000f3fe608060405234801561001057600080fd5b506004361061018d5760003560e01c8063600dd5ea116100de5780639bcf7a1511610097578063b88d4fde11610071578063b88d4fde146103b1578063c87b56dd146103c4578063e8a3d485146103d7578063e985e9c5146103df57600080fd5b80639bcf7a151461036d578063a22cb46514610380578063b24f2d391461039357600080fd5b8063600dd5ea146103065780636352211e1461031957806370a082311461032c5780638da5cb5b1461033f578063938e3d7b1461035257806395d89b411461036557600080fd5b806318160ddd1161014b5780632f745c59116101255780632f745c591461029457806342842e0e146102aa5780634cc157df146102bd5780634f6ccce7146102f257600080fd5b806318160ddd1461024357806323b872dd1461024f5780632a55205a1461026257600080fd5b806275a3171461019257806301ffc9a7146101b857806306fdde03146101db578063081812fc146101f0578063095ea7b31461021b57806313af403514610230575b600080fd5b6101a56101a036600461168d565b61041b565b6040519081526020015b60405180910390f35b6101cb6101c6366004611734565b6104e2565b60405190151581526020016101af565b6101e3610534565b6040516101af91906118c6565b6102036101fe3660046117b2565b6105c6565b6040516001600160a01b0390911681526020016101af565b61022e61022936600461170b565b61060a565b005b61022e61023e36600461154c565b610698565b600154600054036101a5565b61022e61025d36600461159f565b610724565b6102756102703660046117ee565b61072f565b604080516001600160a01b0390931683526020830191909152016101af565b6101a56102a236600461170b565b600092915050565b61022e6102b836600461159f565b61076c565b6102d06102cb3660046117b2565b610787565b604080516001600160a01b03909316835261ffff9091166020830152016101af565b6101a56103003660046117b2565b50600090565b61022e61031436600461170b565b6107f2565b6102036103273660046117b2565b6108c1565b6101a561033a36600461154c565b6108d3565b600854610203906001600160a01b031681565b61022e61036036600461176c565b610922565b6101e3610a22565b61022e61037b3660046117ca565b610a31565b61022e61038e366004611653565b610b27565b6009546001600160a01b03811690600160a01b900461ffff166102d0565b61022e6103bf3660046115da565b610bbd565b6101e36103d23660046117b2565b610c0e565b6101e3610cb0565b6101cb6103ed36600461156d565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b6000600d546000541061046e5760405162461bcd60e51b815260206004820152601660248201527513585e1a5b5d5b481cdd5c1c1b1e481c995858da195960521b60448201526064015b60405180910390fd5b60005461047c856001610d3e565b6000818152600c602052604090206104959085856113ad565b5080856001600160a01b03167f9d89e36eadf856db0ad9ffb5a569e07f95634dddd9501141ecf04820484ad0dc86866040516104d2929190611897565b60405180910390a3949350505050565b60006001600160e01b031982166380ac58cd60e01b148061051357506001600160e01b03198216635b5e139f60e01b145b8061052e57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600280546105439061197a565b80601f016020809104026020016040519081016040528092919081815260200182805461056f9061197a565b80156105bc5780601f10610591576101008083540402835291602001916105bc565b820191906000526020600020905b81548152906001019060200180831161059f57829003601f168201915b5050505050905090565b60006105d182610d5c565b6105ee576040516333d1c03960e21b815260040160405180910390fd5b506000908152600660205260409020546001600160a01b031690565b6000610615826108c1565b9050806001600160a01b0316836001600160a01b0316141561064a5760405163250fdee360e21b815260040160405180910390fd5b336001600160a01b0382161480159061066a575061066881336103ed565b155b15610688576040516367d9dca160e11b815260040160405180910390fd5b610693838383610d87565b505050565b6008546001600160a01b031633146106c25760405162461bcd60e51b815260040161046590611907565b600880546001600160a01b038381166001600160a01b031983168117909355604080519190921680825260208201939093527f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7691015b60405180910390a15050565b610693838383610de3565b60008060008061073e86610787565b90945084925061ffff169050612710610757828761194f565b610761919061192f565b925050509250929050565b61069383838360405180602001604052806000815250610bbd565b6000818152600a60209081526040808320815180830190925280546001600160a01b0316808352600190910154928201929092528291156107ce57805160208201516107e8565b6009546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b6008546001600160a01b0316331461081c5760405162461bcd60e51b815260040161046590611907565b6127108111156108605760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610465565b600980546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff8516021790915560408051918252602082018390527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9101610718565b60006108cc82610fd2565b5192915050565b60006001600160a01b0382166108fc576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b031660009081526005602052604090205467ffffffffffffffff1690565b6008546001600160a01b0316331461094c5760405162461bcd60e51b815260040161046590611907565b6000600b805461095b9061197a565b80601f01602080910402602001604051908101604052809291908181526020018280546109879061197a565b80156109d45780601f106109a9576101008083540402835291602001916109d4565b820191906000526020600020905b8154815290600101906020018083116109b757829003601f168201915b505085519394506109f093600b93506020870192509050611431565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a1681836040516107189291906118d9565b6060600380546105439061197a565b6008546001600160a01b03163314610a5b5760405162461bcd60e51b815260040161046590611907565b612710811115610a9f5760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610465565b6040805180820182526001600160a01b0384811680835260208084018681526000898152600a8352869020945185546001600160a01b031916941693909317845591516001909301929092558251918252810183905284917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910160405180910390a2505050565b6001600160a01b038216331415610b515760405163b06307db60e01b815260040160405180910390fd5b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610bc8848484610de3565b6001600160a01b0383163b15158015610bea5750610be8848484846110ee565b155b15610c08576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b6000818152600c60205260409020805460609190610c2b9061197a565b80601f0160208091040260200160405190810160405280929190818152602001828054610c579061197a565b8015610ca45780601f10610c7957610100808354040283529160200191610ca4565b820191906000526020600020905b815481529060010190602001808311610c8757829003601f168201915b50505050509050919050565b600b8054610cbd9061197a565b80601f0160208091040260200160405190810160405280929190818152602001828054610ce99061197a565b8015610d365780601f10610d0b57610100808354040283529160200191610d36565b820191906000526020600020905b815481529060010190602001808311610d1957829003601f168201915b505050505081565b610d588282604051806020016040528060008152506111e6565b5050565b600080548210801561052e575050600090815260046020526040902054600160e01b900460ff161590565b60008281526006602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6000610dee82610fd2565b9050836001600160a01b031681600001516001600160a01b031614610e255760405162a1148160e81b815260040160405180910390fd5b6000336001600160a01b0386161480610e435750610e4385336103ed565b80610e5e575033610e53846105c6565b6001600160a01b0316145b905080610e7e57604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b038416610ea557604051633a954ecd60e21b815260040160405180910390fd5b610eb160008487610d87565b6001600160a01b038581166000908152600560209081526040808320805467ffffffffffffffff1980821667ffffffffffffffff92831660001901831617909255898616808652838620805493841693831660019081018416949094179055898652600490945282852080546001600160e01b031916909417600160a01b42909216919091021783558701808452922080549193909116610f87576000548214610f87578054602086015167ffffffffffffffff16600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050505050565b6040805160608101825260008082526020820181905291810191909152816000548110156110d557600081815260046020908152604091829020825160608101845290546001600160a01b0381168252600160a01b810467ffffffffffffffff1692820192909252600160e01b90910460ff161515918101829052906110d35780516001600160a01b031615611069579392505050565b5060001901600081815260046020908152604091829020825160608101845290546001600160a01b038116808352600160a01b820467ffffffffffffffff1693830193909352600160e01b900460ff16151592810192909252156110ce579392505050565b611069565b505b604051636f96cda160e11b815260040160405180910390fd5b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a029061112390339089908890889060040161185a565b602060405180830381600087803b15801561113d57600080fd5b505af192505050801561116d575060408051601f3d908101601f1916820190925261116a91810190611750565b60015b6111c8573d80801561119b576040519150601f19603f3d011682016040523d82523d6000602084013e6111a0565b606091505b5080516111c0576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b6000546001600160a01b03841661120f57604051622e076360e81b815260040160405180910390fd5b8261122d5760405163b562e8dd60e01b815260040160405180910390fd5b6001600160a01b038416600081815260056020908152604080832080546fffffffffffffffffffffffffffffffff19811667ffffffffffffffff8083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b01811690920217909155858452600490925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b15611357575b60405182906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a461131f60008784806001019550876110ee565b61133c576040516368d2bf6b60e11b815260040160405180910390fd5b808214156112d457826000541461135257600080fd5b61139d565b5b6040516001830192906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480821415611358575b506000908155610c089085838684565b8280546113b99061197a565b90600052602060002090601f0160209004810192826113db5760008555611421565b82601f106113f45782800160ff19823516178555611421565b82800160010185558215611421579182015b82811115611421578235825591602001919060010190611406565b5061142d9291506114a5565b5090565b82805461143d9061197a565b90600052602060002090601f01602090048101928261145f5760008555611421565b82601f1061147857805160ff1916838001178555611421565b82800160010185558215611421579182015b8281111561142157825182559160200191906001019061148a565b5b8082111561142d57600081556001016114a6565b600067ffffffffffffffff808411156114d5576114d56119b5565b604051601f8501601f19908116603f011681019082821181831017156114fd576114fd6119b5565b8160405280935085815286868601111561151657600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b038116811461154757600080fd5b919050565b60006020828403121561155d578081fd5b61156682611530565b9392505050565b6000806040838503121561157f578081fd5b61158883611530565b915061159660208401611530565b90509250929050565b6000806000606084860312156115b3578081fd5b6115bc84611530565b92506115ca60208501611530565b9150604084013590509250925092565b600080600080608085870312156115ef578081fd5b6115f885611530565b935061160660208601611530565b925060408501359150606085013567ffffffffffffffff811115611628578182fd5b8501601f81018713611638578182fd5b611647878235602084016114ba565b91505092959194509250565b60008060408385031215611665578182fd5b61166e83611530565b915060208301358015158114611682578182fd5b809150509250929050565b6000806000604084860312156116a1578283fd5b6116aa84611530565b9250602084013567ffffffffffffffff808211156116c6578384fd5b818601915086601f8301126116d9578384fd5b8135818111156116e7578485fd5b8760208285010111156116f8578485fd5b6020830194508093505050509250925092565b6000806040838503121561171d578182fd5b61172683611530565b946020939093013593505050565b600060208284031215611745578081fd5b8135611566816119cb565b600060208284031215611761578081fd5b8151611566816119cb565b60006020828403121561177d578081fd5b813567ffffffffffffffff811115611793578182fd5b8201601f810184136117a3578182fd5b6111de848235602084016114ba565b6000602082840312156117c3578081fd5b5035919050565b6000806000606084860312156117de578283fd5b833592506115ca60208501611530565b60008060408385031215611800578182fd5b50508035926020909101359150565b60008151808452815b8181101561183457602081850181015186830182015201611818565b818111156118455782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061188d9083018461180f565b9695505050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b602081526000611566602083018461180f565b6040815260006118ec604083018561180f565b82810360208401526118fe818561180f565b95945050505050565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b60008261194a57634e487b7160e01b81526012600452602481fd5b500490565b600081600019048311821515161561197557634e487b7160e01b81526011600452602481fd5b500290565b600181811c9082168061198e57607f821691505b602082108114156119af57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146119e157600080fd5b5056fea26469706673582212209e1639f35df3da209aa39e77ee7fd4fee5b8ebf68d4e12462a0a2fb4fa25259f64736f6c63430008040033";
