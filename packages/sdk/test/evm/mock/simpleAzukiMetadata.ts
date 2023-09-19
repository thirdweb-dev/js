export const simpleAzukiMetadata = {
  compiler: {
    version: "0.8.4+commit.c7e474f2",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [],
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
            internalType: "uint256",
            name: "quantity",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
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
        "getApproved(uint256)": {
          details: "See {IERC721-getApproved}.",
        },
        "isApprovedForAll(address,address)": {
          details: "See {IERC721-isApprovedForAll}.",
        },
        "mint(uint256)": {
          details: "Default Azuki mint",
        },
        "name()": {
          details: "See {IERC721Metadata-name}.",
        },
        "ownerOf(uint256)": {
          details: "See {IERC721-ownerOf}.",
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
          details: "See {IERC721Metadata-tokenURI}.",
        },
        "totalSupply()": {
          details:
            "Burned tokens are calculated here, use _totalMinted() if you want to count just minted tokens.",
        },
        "transferFrom(address,address,uint256)": {
          details: "See {IERC721-transferFrom}.",
        },
      },
      title: "Pure ERC721A contract that can be used with the thirdweb SDK",
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
      "contracts/AzukiSimple.sol": "SimpleAzuki",
    },
    evmVersion: "istanbul",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 800,
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
    "@thirdweb-dev/contracts/ThirdwebContract.sol": {
      keccak256:
        "0x0da29b16a67c01f708943d11b1e42b9bdf9c6d99395401845d9f00530e22753f",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b0e86391f7dc937c3ff50324b30c49ed6f58399f45cf47529bc312326646e617",
        "dweb:/ipfs/QmefoozzLddJpDXkLVZ8QF1FjaN6isxt3GTcgourR1kVBn",
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
    "@thirdweb-dev/contracts/feature/interface/IOwnable.sol": {
      keccak256:
        "0x2c3ea8c3c1688337d3eacf55b055b51689ab03d6906366e0a8c6959b4794d7c7",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4136249c9207296acc87bf1ea0999ddf786570efe1fd6986ba9347c9998d7a3d",
        "dweb:/ipfs/Qmd726Pcis1DUtuac6VwHuMKodGt8FhtMZm7BXjdx8EX6a",
      ],
    },
    "@thirdweb-dev/contracts/interfaces/IContractDeployer.sol": {
      keccak256:
        "0x2b883cf46f6cbf1a162e4ff5fb9f9f31dbf6d85d6c4417ddf0e2376af13d63ed",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4bd2edacff3d7a7a28987b5bea0cb0fd005db858ac542efcff8af3f806102389",
        "dweb:/ipfs/QmTdc27PFikNeFTKiCDbPHGST5mpe2K6UMqjy7cR5j5RY6",
      ],
    },
    "contracts/AzukiSimple.sol": {
      keccak256:
        "0x403cd7d0830a3a43b81fb688a0e7db6a1000bd3a9f61238cee1d4d4d49793383",
      license: "MIT",
      urls: [
        "bzz-raw://9b72da3f3936102fa49b20c569e58cea2965dfb7bc22d0fec8d4b7a080a8b166",
        "dweb:/ipfs/QmeoLRZMftjwZ6c459ub26KrsLTsjYky2KxFh6dUGBwtdT",
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

export const simpleAzukiBytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600b81526a53696d706c65417a756b6960a81b60208083019182528351808501909452600384526229a0ad60e91b908401528151919291620000609160029162000083565b5080516200007690600390602084019062000083565b5050600080555062000166565b828054620000919062000129565b90600052602060002090601f016020900481019282620000b5576000855562000100565b82601f10620000d057805160ff191683800117855562000100565b8280016001018555821562000100579182015b8281111562000100578251825591602001919060010190620000e3565b506200010e92915062000112565b5090565b5b808211156200010e576000815560010162000113565b600181811c908216806200013e57607f821691505b602082108114156200016057634e487b7160e01b600052602260045260246000fd5b50919050565b61134380620001766000396000f3fe60806040526004361061010e5760003560e01c80634f6ccce7116100a5578063a0712d6811610074578063b88d4fde11610059578063b88d4fde146102f3578063c87b56dd14610313578063e985e9c51461033357600080fd5b8063a0712d68146102c0578063a22cb465146102d357600080fd5b80634f6ccce71461024a5780636352211e1461026b57806370a082311461028b57806395d89b41146102ab57600080fd5b806318160ddd116100e157806318160ddd146101c457806323b872dd146101e75780632f745c591461020757806342842e0e1461022a57600080fd5b806301ffc9a71461011357806306fdde0314610148578063081812fc1461016a578063095ea7b3146101a2575b600080fd5b34801561011f57600080fd5b5061013361012e3660046110e2565b61037c565b60405190151581526020015b60405180910390f35b34801561015457600080fd5b5061015d6103ce565b60405161013f91906111c9565b34801561017657600080fd5b5061018a61018536600461111a565b610460565b6040516001600160a01b03909116815260200161013f565b3480156101ae57600080fd5b506101c26101bd3660046110b9565b6104a4565b005b3480156101d057600080fd5b50600154600054035b60405190815260200161013f565b3480156101f357600080fd5b506101c2610202366004610f6f565b610532565b34801561021357600080fd5b506101d96102223660046110b9565b600092915050565b34801561023657600080fd5b506101c2610245366004610f6f565b61053d565b34801561025657600080fd5b506101d961026536600461111a565b50600090565b34801561027757600080fd5b5061018a61028636600461111a565b610558565b34801561029757600080fd5b506101d96102a6366004610f23565b61056a565b3480156102b757600080fd5b5061015d6105b9565b6101c26102ce36600461111a565b6105c8565b3480156102df57600080fd5b506101c26102ee36600461107f565b6105d5565b3480156102ff57600080fd5b506101c261030e366004610faa565b61066b565b34801561031f57600080fd5b5061015d61032e36600461111a565b6106bc565b34801561033f57600080fd5b5061013361034e366004610f3d565b6001600160a01b03918216600090815260076020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b14806103ad57506001600160e01b03198216635b5e139f60e01b145b806103c857506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600280546103dd9061124b565b80601f01602080910402602001604051908101604052809291908181526020018280546104099061124b565b80156104565780601f1061042b57610100808354040283529160200191610456565b820191906000526020600020905b81548152906001019060200180831161043957829003601f168201915b5050505050905090565b600061046b8261074e565b610488576040516333d1c03960e21b815260040160405180910390fd5b506000908152600660205260409020546001600160a01b031690565b60006104af82610558565b9050806001600160a01b0316836001600160a01b031614156104e45760405163250fdee360e21b815260040160405180910390fd5b336001600160a01b038216148015906105045750610502813361034e565b155b15610522576040516367d9dca160e11b815260040160405180910390fd5b61052d838383610779565b505050565b61052d8383836107ed565b61052d8383836040518060200160405280600081525061066b565b6000610563826109dc565b5192915050565b60006001600160a01b038216610593576040516323d3ad8160e21b815260040160405180910390fd5b506001600160a01b031660009081526005602052604090205467ffffffffffffffff1690565b6060600380546103dd9061124b565b6105d23382610af8565b50565b6001600160a01b0382163314156105ff5760405163b06307db60e01b815260040160405180910390fd5b3360008181526007602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6106768484846107ed565b6001600160a01b0383163b15158015610698575061069684848484610b16565b155b156106b6576040516368d2bf6b60e11b815260040160405180910390fd5b50505050565b60606106c78261074e565b6106e457604051630a14c4b560e41b815260040160405180910390fd5b60006106fb60408051602081019091526000815290565b905080516000141561071c5760405180602001604052806000815250610747565b8061072684610c0e565b60405160200161073792919061115e565b6040516020818303038152906040525b9392505050565b60008054821080156103c8575050600090815260046020526040902054600160e01b900460ff161590565b60008281526006602052604080822080547fffffffffffffffffffffffff0000000000000000000000000000000000000000166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b60006107f8826109dc565b9050836001600160a01b031681600001516001600160a01b03161461082f5760405162a1148160e81b815260040160405180910390fd5b6000336001600160a01b038616148061084d575061084d853361034e565b8061086857503361085d84610460565b6001600160a01b0316145b90508061088857604051632ce44b5f60e11b815260040160405180910390fd5b6001600160a01b0384166108af57604051633a954ecd60e21b815260040160405180910390fd5b6108bb60008487610779565b6001600160a01b038581166000908152600560209081526040808320805467ffffffffffffffff1980821667ffffffffffffffff92831660001901831617909255898616808652838620805493841693831660019081018416949094179055898652600490945282852080546001600160e01b031916909417600160a01b42909216919091021783558701808452922080549193909116610991576000548214610991578054602086015167ffffffffffffffff16600160a01b026001600160e01b03199091166001600160a01b038a16171781555b50505082846001600160a01b0316866001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050505050565b604080516060810182526000808252602082018190529181019190915281600054811015610adf57600081815260046020908152604091829020825160608101845290546001600160a01b0381168252600160a01b810467ffffffffffffffff1692820192909252600160e01b90910460ff16151591810182905290610add5780516001600160a01b031615610a73579392505050565b5060001901600081815260046020908152604091829020825160608101845290546001600160a01b038116808352600160a01b820467ffffffffffffffff1693830193909352600160e01b900460ff1615159281019290925215610ad8579392505050565b610a73565b505b604051636f96cda160e11b815260040160405180910390fd5b610b12828260405180602001604052806000815250610d40565b5050565b604051630a85bd0160e11b81526000906001600160a01b0385169063150b7a0290610b4b90339089908890889060040161118d565b602060405180830381600087803b158015610b6557600080fd5b505af1925050508015610b95575060408051601f3d908101601f19168201909252610b92918101906110fe565b60015b610bf0573d808015610bc3576040519150601f19603f3d011682016040523d82523d6000602084013e610bc8565b606091505b508051610be8576040516368d2bf6b60e11b815260040160405180910390fd5b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490505b949350505050565b606081610c325750506040805180820190915260018152600360fc1b602082015290565b8160005b8115610c5c5780610c4681611286565b9150610c559050600a836111f4565b9150610c36565b60008167ffffffffffffffff811115610c8557634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610caf576020820181803683370190505b5090505b8415610c0657610cc4600183611208565b9150610cd1600a866112a1565b610cdc9060306111dc565b60f81b818381518110610cff57634e487b7160e01b600052603260045260246000fd5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350610d39600a866111f4565b9450610cb3565b6000546001600160a01b038416610d6957604051622e076360e81b815260040160405180910390fd5b82610d875760405163b562e8dd60e01b815260040160405180910390fd5b6001600160a01b038416600081815260056020908152604080832080546fffffffffffffffffffffffffffffffff19811667ffffffffffffffff8083168b0181169182176801000000000000000067ffffffffffffffff1990941690921783900481168b01811690920217909155858452600490925290912080546001600160e01b0319168317600160a01b42909316929092029190911790558190818501903b15610eb1575b60405182906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4610e796000878480600101955087610b16565b610e96576040516368d2bf6b60e11b815260040160405180910390fd5b80821415610e2e578260005414610eac57600080fd5b610ef7565b5b6040516001830192906001600160a01b038816906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480821415610eb2575b5060009081556106b69085838684565b80356001600160a01b0381168114610f1e57600080fd5b919050565b600060208284031215610f34578081fd5b61074782610f07565b60008060408385031215610f4f578081fd5b610f5883610f07565b9150610f6660208401610f07565b90509250929050565b600080600060608486031215610f83578081fd5b610f8c84610f07565b9250610f9a60208501610f07565b9150604084013590509250925092565b60008060008060808587031215610fbf578081fd5b610fc885610f07565b9350610fd660208601610f07565b925060408501359150606085013567ffffffffffffffff80821115610ff9578283fd5b818701915087601f83011261100c578283fd5b81358181111561101e5761101e6112e1565b604051601f8201601f19908116603f01168101908382118183101715611046576110466112e1565b816040528281528a602084870101111561105e578586fd5b82602086016020830137918201602001949094529598949750929550505050565b60008060408385031215611091578182fd5b61109a83610f07565b9150602083013580151581146110ae578182fd5b809150509250929050565b600080604083850312156110cb578182fd5b6110d483610f07565b946020939093013593505050565b6000602082840312156110f3578081fd5b8135610747816112f7565b60006020828403121561110f578081fd5b8151610747816112f7565b60006020828403121561112b578081fd5b5035919050565b6000815180845261114a81602086016020860161121f565b601f01601f19169290920160200192915050565b6000835161117081846020880161121f565b83519083019061118481836020880161121f565b01949350505050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526111bf6080830184611132565b9695505050505050565b6020815260006107476020830184611132565b600082198211156111ef576111ef6112b5565b500190565b600082611203576112036112cb565b500490565b60008282101561121a5761121a6112b5565b500390565b60005b8381101561123a578181015183820152602001611222565b838111156106b65750506000910152565b600181811c9082168061125f57607f821691505b6020821081141561128057634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561129a5761129a6112b5565b5060010190565b6000826112b0576112b06112cb565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146105d257600080fdfea2646970667358221220937ae5f5253ea89f8eb2f2348decf7bb40c658efb4158dcbc3b1d181294607d664736f6c63430008040033";
