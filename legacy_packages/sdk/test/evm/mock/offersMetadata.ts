export const offersCompilerMetadata = {
  compiler: {
    version: "0.8.12+commit.f00d7308",
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
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "offeror",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "offerId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "assetContract",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "quantityBought",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "totalPricePaid",
            type: "uint256",
          },
        ],
        name: "AcceptedOffer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "offeror",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "offerId",
            type: "uint256",
          },
        ],
        name: "CancelledOffer",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "offeror",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "offerId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "assetContract",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "offerId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "offeror",
                type: "address",
              },
              {
                internalType: "address",
                name: "assetContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "currency",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationTimestamp",
                type: "uint256",
              },
              {
                internalType: "enum IOffers.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IOffers.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IOffers.Offer",
            name: "offer",
            type: "tuple",
          },
        ],
        name: "NewOffer",
        type: "event",
      },
      {
        inputs: [],
        name: "_msgData",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "_msgSender",
        outputs: [
          {
            internalType: "address",
            name: "sender",
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
            name: "_offerId",
            type: "uint256",
          },
        ],
        name: "acceptOffer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_offerId",
            type: "uint256",
          },
        ],
        name: "cancelOffer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_startId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_endId",
            type: "uint256",
          },
        ],
        name: "getAllOffers",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "offerId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "offeror",
                type: "address",
              },
              {
                internalType: "address",
                name: "assetContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "currency",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationTimestamp",
                type: "uint256",
              },
              {
                internalType: "enum IOffers.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IOffers.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IOffers.Offer[]",
            name: "_allOffers",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_startId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_endId",
            type: "uint256",
          },
        ],
        name: "getAllValidOffers",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "offerId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "offeror",
                type: "address",
              },
              {
                internalType: "address",
                name: "assetContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "currency",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationTimestamp",
                type: "uint256",
              },
              {
                internalType: "enum IOffers.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IOffers.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IOffers.Offer[]",
            name: "_validOffers",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_offerId",
            type: "uint256",
          },
        ],
        name: "getOffer",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "offerId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "offeror",
                type: "address",
              },
              {
                internalType: "address",
                name: "assetContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "currency",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationTimestamp",
                type: "uint256",
              },
              {
                internalType: "enum IOffers.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IOffers.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IOffers.Offer",
            name: "_offer",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                internalType: "address",
                name: "assetContract",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "quantity",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "currency",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "totalPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "expirationTimestamp",
                type: "uint256",
              },
            ],
            internalType: "struct IOffers.OfferParams",
            name: "_params",
            type: "tuple",
          },
        ],
        name: "makeOffer",
        outputs: [
          {
            internalType: "uint256",
            name: "_offerId",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "totalOffers",
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
    ],
    devdoc: {
      author: "thirdweb.com",
      kind: "dev",
      methods: {
        "acceptOffer(uint256)": {
          params: {
            _offerId: "The ID of the offer to accept.",
          },
        },
        "cancelOffer(uint256)": {
          params: {
            _offerId: "The ID of the offer to cancel.",
          },
        },
        "getAllOffers(uint256,uint256)": {
          details: "Returns all existing offers within the specified range.",
        },
        "getAllValidOffers(uint256,uint256)": {
          details:
            "Returns offers within the specified range, where offeror has sufficient balance.",
        },
        "getOffer(uint256)": {
          details: "Returns existing offer with the given uid.",
        },
        "makeOffer((address,uint256,uint256,address,uint256,uint256))": {
          params: {
            _params: "The parameters of an offer.",
          },
          returns: {
            _offerId: "The unique integer ID assigned to the offer.",
          },
        },
        "totalOffers()": {
          details: "Returns total number of offers",
        },
      },
      stateVariables: {
        ASSET_ROLE: {
          details:
            "Can create offer for only assets from NFT contracts with asset role, when offers are restricted by asset address.",
        },
        MAX_BPS: {
          details: "The max bps of the contract. So, 10_000 == 100 %",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "acceptOffer(uint256)": {
          notice: "Accept an offer.",
        },
        "cancelOffer(uint256)": {
          notice: "Cancel an offer.",
        },
        "makeOffer((address,uint256,uint256,address,uint256,uint256))": {
          notice: "Make an offer for NFTs (ERC-721 or ERC-1155)",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/marketplace/offers/OffersLogic.sol": "OffersLogic",
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
      ":ERC721A-Upgradeable/=lib/ERC721A-Upgradeable/contracts/",
      ":ERC721A/=lib/ERC721A/contracts/",
      ":chainlink/=lib/chainlink/",
      ":contracts/=contracts/",
      ":ds-test/=lib/ds-test/src/",
      ":dynamic-contracts/=lib/dynamic-contracts/src/",
      ":erc721a-upgradeable/=lib/ERC721A-Upgradeable/",
      ":erc721a/=lib/ERC721A/",
      ":forge-std/=lib/forge-std/src/",
      ":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/",
      ":openzeppelin-contracts/=lib/openzeppelin-contracts/",
    ],
  },
  sources: {
    "contracts/eip/interface/IERC165.sol": {
      keccak256:
        "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
      license: "MIT",
      urls: [
        "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
        "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
      ],
    },
    "contracts/eip/interface/IERC20.sol": {
      keccak256:
        "0x5bdd9dd97ba7d9d7c9a2953db287e4d9d7fa93a27a96bc2e72a8da4919b6f7ff",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://45527c265ee5de6bbb3ecfc052e7b1175531a82c2ac16172020aee855f7dd592",
        "dweb:/ipfs/QmVZthqbG916qUQSwv1LE8bB58ZGQ1VfQbLbbRV5urfEYA",
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
    "contracts/extension/plugin/ERC2771ContextConsumer.sol": {
      keccak256:
        "0xec8f285d7d3bf07b736da7534720878f3aa0f98317a6dba599c9fb693df9e2d6",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://7796a89f39969386fad253504144618189fb0a737870e67a2531e0fec6e13216",
        "dweb:/ipfs/QmecTPsx1Y92Pbi4xcFzb6U6wjLXvR47DZcHbh8Ng3YwQH",
      ],
    },
    "contracts/extension/plugin/ERC2771ContextLogic.sol": {
      keccak256:
        "0xb5e556d4030f82c337c782200003bdcafc91bd5b090d3ca124b14e931238d280",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://d0a6b378cc42d00a3e50f3107582a2c280ebfbb6908666d941f2b0bcaa2e5a8d",
        "dweb:/ipfs/Qma52ccntoviJREy5wDeYUPFekTCxUue8WDVkAKaMjYCS9",
      ],
    },
    "contracts/extension/plugin/ERC2771ContextStorage.sol": {
      keccak256:
        "0x6626e7a0808ef98598260ce70337628fd21df1702cee4a3a9350df39718ae94e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://35c1c79783bc6d1dad301088b54234555eab24526a1b4a1b6e5c9f7754efc2e4",
        "dweb:/ipfs/QmURHFT9W6M1BMt2L66dciPBZVmDpzyK8kCVs3KKnqUZuJ",
      ],
    },
    "contracts/extension/plugin/PermissionsEnumerableLogic.sol": {
      keccak256:
        "0x73da7d923377fb4be1ce87e1ec0f3ca108f55d4be7f8cd4a305f4d09dc670547",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://681cfc4908bdbf207e95cfd15b265823d776886bf50611ce6449178bb4e3e416",
        "dweb:/ipfs/QmQ2Z4Jy4FogvBd9LUNujVSJAmJXTvcTggTh8JVUNJs5vB",
      ],
    },
    "contracts/extension/plugin/PermissionsEnumerableStorage.sol": {
      keccak256:
        "0xa0c61d4a8ab83e16babe712cfc2971234a8821927da6cfbbbcdee9f1e625b17c",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://bc32950586077942a2beb6bdc2cb95c11d372e5d0ad940e4f30350c3c4619091",
        "dweb:/ipfs/QmZGCZH7JkfM3oGg4TMwBXGRoc6MNj7uaokffYQ3udreQW",
      ],
    },
    "contracts/extension/plugin/PermissionsLogic.sol": {
      keccak256:
        "0x1e40379ccb614b34c2f2f9bbde5e9570847b4a5a8504a88cd533eb5eb2c78e3d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://a843036ae0b8fbc6d290eaaee68e8aff5120994ff5d155cf27afc0bc99fd91c3",
        "dweb:/ipfs/QmSYHpoF3EBJtwt2aayt1LLXc6VrZEbD2uRYtttw6jaAWV",
      ],
    },
    "contracts/extension/plugin/PermissionsStorage.sol": {
      keccak256:
        "0x8454ed03b4c2af50730d1fafe355933fcec3c0190c628fd0213d9e3be1055984",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b7298e02b077aa756500bedfb5515291d825a385bbdb534cf3eaa9093888b6b8",
        "dweb:/ipfs/Qmb3U3kZMkLe9ejY7pzwXZH5asGQuTsf2aB4o3uXbYN7hE",
      ],
    },
    "contracts/extension/plugin/ReentrancyGuardLogic.sol": {
      keccak256:
        "0x51ba82a4a13d893fa7f4aa83e3af9dfb9f0e57d433808b60c1002800fda4d85a",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://e68a2b6764de758dd91e88b227d89b9ea88cd226e4db326787d33f97bdf60f04",
        "dweb:/ipfs/QmaQG5faFJfek2Rf6XEEtJvEXKmK3johLtBno5dXUMu8yq",
      ],
    },
    "contracts/extension/plugin/ReentrancyGuardStorage.sol": {
      keccak256:
        "0xc351f940485d4667eec6f76f1549316877dce1912e8ba899b320ac0f2268f83f",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f5123e655db86c053b6e55890c2e99185a2526e2ccb8cfd9bb3239e4f7a7910b",
        "dweb:/ipfs/QmbXPV2crZR9TiFZCjEtfSDDJdi9ZhwZsgzEQh2arYcWio",
      ],
    },
    "contracts/extension/plugin/RoyaltyPayments.sol": {
      keccak256:
        "0xb4240ae32c3681d27be84dd21ac16a6ed424b63f8613ca1d455e0ba1e96a3d24",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://50d2efe500543d4acc809ea471798f455a65d192444c68a22647d5aba3db6035",
        "dweb:/ipfs/QmZy41iFrSrfDpsfiMSbvDbPucfFkJ2n1GVqqxpZ3fgoRf",
      ],
    },
    "contracts/interfaces/IWETH.sol": {
      keccak256:
        "0x5c1df76e8c1d9b5c069e4c0e35c3ad3316530c382fe3ddc6c21584f5e56f0a7b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1ff3429e0845d3266dd65ce097e194008511940a6f9fe651578b19737d37f2b1",
        "dweb:/ipfs/QmdnrZ7hr7BezqyhrmKTzTovbTjQYT5EcDYfvRYxxYFVeU",
      ],
    },
    "contracts/lib/CurrencyTransferLib.sol": {
      keccak256:
        "0x4b0dc7c0ca9e463b2efbf3e8177a40bab333f5669ab368cad98534678a81cbc3",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1d5e91c28bb509afcbb3da66bbbf03465de5b168937b604f1cab63397472388a",
        "dweb:/ipfs/QmTqs9U5eWAQzJxVwD9pMQAtjXxK59cvJ4xzYMUnfVCsp5",
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
    "contracts/marketplace/IMarketplace.sol": {
      keccak256:
        "0x3b4729024e82d5cd3ecc3da2177efc058306dc0137b59242bac41254fb36eb32",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://40f1cd0144d0fd9a04f9bc87ed73368aeaabb7e3266a0fa0684e4816d0be24b2",
        "dweb:/ipfs/QmTnyzyCP8wVdfqxpxSRnbFopvKEbFBwXssNe2YaFD2XDJ",
      ],
    },
    "contracts/marketplace/offers/OffersLogic.sol": {
      keccak256:
        "0xee7a29490f371db22b35c25f675cc654185be402fd86aa7a400292afa0956da8",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://0282c524ba22769700ac6184492b6120bf406f0346e12c18dfc28db67bf9156c",
        "dweb:/ipfs/QmaDUCUwT5gFkBXfGyqyh8jwHttWxNe6vr9wz3s7kRden4",
      ],
    },
    "contracts/marketplace/offers/OffersStorage.sol": {
      keccak256:
        "0x90ac4f6da1bd5de9af3c7d2a222fecc2283ceef25c7b28c0859474ef0556e37e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b5e64b3cf30b8bb206e9179e955b2956e4072cbd6d60cfc5faa13bf2d3f2d975",
        "dweb:/ipfs/QmbwK2yYeUaNfV62u8EwCLqL9aSHmZbotGYFCWqNZEndWS",
      ],
    },
    "contracts/openzeppelin-presets/token/ERC20/utils/SafeERC20.sol": {
      keccak256:
        "0x293d8d7a3502950df5b9d6d36fcad85ca758f06dd946cdc8645cac1aa56686c4",
      license: "MIT",
      urls: [
        "bzz-raw://3cd805dbdcf6b7cebcd47201badbd7f7464e49eec51c4e0627b899ece1b04790",
        "dweb:/ipfs/QmRP3JYK4wzDaRrk9so6m433TuqHW9axAXLLnQAjCp2Gs4",
      ],
    },
    "lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol": {
      keccak256:
        "0xa812eed728198acd2c30d06950a5bea8d68436e4f694dd892273266ec2f79f5b",
      license: "MIT",
      urls: [
        "bzz-raw://f5522afc5c222c810d9ad67c45f37cb7169452fcf76692cad10ac8153c068daa",
        "dweb:/ipfs/QmX4XgnDp7pyvojQ6g5tacrUMCf7TED2qC2vERH9Xh9feZ",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol": {
      keccak256:
        "0x6392f2cfe3a5ee802227fe7a2dfd47096d881aec89bddd214b35c5b46d3cd941",
      license: "MIT",
      urls: [
        "bzz-raw://bd9c47a375639888e726a99da718890ba16d17d7ad9eacb0ccc892d46d1b3ee0",
        "dweb:/ipfs/Qmb41W5RUjy2sWg49A2rMnxekSeEk6SvGyJL5tyCCSr7un",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol": {
      keccak256:
        "0x9750c6b834f7b43000631af5cc30001c5f547b3ceb3635488f140f60e897ea6b",
      license: "MIT",
      urls: [
        "bzz-raw://5a7d5b1ef5d8d5889ad2ed89d8619c09383b80b72ab226e0fe7bde1636481e34",
        "dweb:/ipfs/QmebXWgtEfumQGBdVeM6c71McLixYXQP5Bk6kKXuoY4Bmr",
      ],
    },
    "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol": {
      keccak256:
        "0xed6a749c5373af398105ce6ee3ac4763aa450ea7285d268c85d9eeca809cdb1f",
      license: "MIT",
      urls: [
        "bzz-raw://20a97f891d06f0fe91560ea1a142aaa26fdd22bed1b51606b7d48f670deeb50f",
        "dweb:/ipfs/QmTbCtZKChpaX5H2iRiTDMcSz29GSLCpTCDgJpcMR4wg8x",
      ],
    },
    "lib/openzeppelin-contracts/contracts/utils/Context.sol": {
      keccak256:
        "0xe2e337e6dde9ef6b680e07338c493ebea1b5fd09b43424112868e9cc1706bca7",
      license: "MIT",
      urls: [
        "bzz-raw://6df0ddf21ce9f58271bdfaa85cde98b200ef242a05a3f85c2bc10a8294800a92",
        "dweb:/ipfs/QmRK2Y5Yc6BK7tGKkgsgn3aJEQGi5aakeSPZvS65PV8Xp3",
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
  },
  version: 1,
};

export const offersBytecode =
  "0x608060405234801561001057600080fd5b506127de806100206000396000f3fe608060405234801561001057600080fd5b50600436106100835760003560e01c8063016767fa14610088578063119df25f146100ae5780634579268a146100c35780638b49d47e146100e357806391940b3e146100f9578063a9fd8ed114610119578063c1edcfbe14610121578063c815729d14610134578063ef706adf14610149575b600080fd5b61009b610096366004612138565b61015c565b6040519081526020015b60405180910390f35b6100b6610445565b6040516100a591906121cf565b6100d66100d13660046121e3565b6104c3565b6040516100a591906122c3565b6100eb6105ca565b6040516100a59291906122d2565b61010c610107366004612301565b610665565b6040516100a59190612323565b61009b610955565b61010c61012f366004612301565b610967565b6101476101423660046121e3565b610b3f565b005b6101476101573660046121e3565b610e91565b805160405163a32fa5b360e01b81527f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae660048201526001600160a01b038216602482015260009190309063a32fa5b390604401602060405180830381865afa1580156101cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101f09190612372565b61022f5760405162461bcd60e51b815260206004820152600b60248201526a2141535345545f524f4c4560a81b60448201526064015b60405180910390fd5b610237610fca565b91506000610243610445565b905060006102548560000151610ff5565b90506102608582611158565b6000604051806101400160405280868152602001846001600160a01b0316815260200187600001516001600160a01b03168152602001876020015181526020018760400151815260200187606001516001600160a01b03168152602001876080015181526020018760a0015181526020018360028111156102e3576102e36121fc565b815260200160019052905060006102f8611319565b600087815260018281016020908152604092839020865181559086015181830180546001600160a01b03199081166001600160a01b03938416179091559387015160028084018054871692841692909217909155606088015160038401556080880151600484015560a088015160058401805490961692169190911790935560c0860151600682015560e08601516007820155610100860151600882018054959650879592949193909260ff19169184908111156103b8576103b86121fc565b021790555061012082015160088201805461ff0019166101008360038111156103e3576103e36121fc565b021790555090505086600001516001600160a01b031686856001600160a01b03167fbf5eeff972e784a2617d6d6dfd376c154342b876584ae84702c567dbd794e2118560405161043391906122c3565b60405180910390a45050505050919050565b60405163572b6c0560e01b8152600090309063572b6c059061046b9033906004016121cf565b602060405180830381865afa158015610488573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ac9190612372565b156104be575060131936013560601c90565b503390565b6104cb61205c565b60006104d5611319565b60008481526001808301602090815260409283902083516101408101855281548152928101546001600160a01b03908116928401929092526002808201548316948401949094526003810154606084015260048101546080840152600581015490911660a0830152600681015460c0830152600781015460e083015260088101549394509092909161010084019160ff1690811115610576576105766121fc565b6002811115610587576105876121fc565b81526020016008820160019054906101000a900460ff1660038111156105af576105af6121fc565b60038111156105c0576105c06121fc565b9052509392505050565b60405163572b6c0560e01b81523690600090309063572b6c05906105f29033906004016121cf565b602060405180830381865afa15801561060f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106339190612372565b1561065c57600080366106476014826123aa565b92610654939291906123c1565b915091509091565b50600091369150565b60606000610671611319565b90508284111580156106835750805483105b61069f5760405162461bcd60e51b8152600401610226906123eb565b60006106ab85856123aa565b6106b6906001612412565b6001600160401b038111156106cd576106cd6120da565b60405190808252806020026020018201604052801561070657816020015b6106f361205c565b8152602001906001900390816106eb5790505b5090506000855b85811161087457600061072088836123aa565b60008381526001808801602090815260409283902083516101408101855281548152928101546001600160a01b03908116928401929092526002808201548316948401949094526003810154606084015260048101546080840152600581015490911660a0830152600681015460c0830152600781015460e083015260088101549394509092909161010084019160ff16908111156107c1576107c16121fc565b60028111156107d2576107d26121fc565b81526020016008820160019054906101000a900460ff1660038111156107fa576107fa6121fc565b600381111561080b5761080b6121fc565b815250508482815181106108215761082161242a565b602002602001018190525061084e8482815181106108415761084161242a565b602002602001015161133d565b156108615761085e600184612412565b92505b5061086d600182612412565b905061070d565b50806001600160401b0381111561088d5761088d6120da565b6040519080825280602002602001820160405280156108c657816020015b6108b361205c565b8152602001906001900390816108ab5790505b508251909450600090815b81811015610949576108ee8582815181106108415761084161242a565b15610937578481815181106109055761090561242a565b602002602001015187848061091990612440565b95508151811061092b5761092b61242a565b60200260200101819052505b610942600182612412565b90506108d1565b50505050505092915050565b600080610960611319565b5492915050565b60606000610973611319565b90508284111580156109855750805483105b6109a15760405162461bcd60e51b8152600401610226906123eb565b6109ab84846123aa565b6109b6906001612412565b6001600160401b038111156109cd576109cd6120da565b604051908082528060200260200182016040528015610a0657816020015b6109f361205c565b8152602001906001900390816109eb5790505b509150835b838111610b375760008181526001808401602090815260409283902083516101408101855281548152928101546001600160a01b03908116928401929092526002808201548316948401949094526003810154606084015260048101546080840152600581015490911660a0830152600681015460c0830152600781015460e083015260088101549192909161010084019160ff90911690811115610ab257610ab26121fc565b6002811115610ac357610ac36121fc565b81526020016008820160019054906101000a900460ff166003811115610aeb57610aeb6121fc565b6003811115610afc57610afc6121fc565b90525083610b0a87846123aa565b81518110610b1a57610b1a61242a565b6020908102919091010152610b30600182612412565b9050610a0b565b505092915050565b7fbbf78d3411d42a81effd97bb8c69faae4e77e75cec462245c1001191a0634c6f805460021415610bb25760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610226565b60028155816000610bc1611319565b905060016000838152600183016020526040902060080154610100900460ff166003811115610bf257610bf26121fc565b14610c0f5760405162461bcd60e51b81526004016102269061245b565b6000610c19611319565b600086815260018083016020908152604080842081516101408101835281548152938101546001600160a01b03908116938501939093526002808201548416928501929092526003810154606085015260048101546080850152600581015490921660a0840152600682015460c0840152600782015460e0840152600882015494955092939192909161010084019160ff90911690811115610cbd57610cbd6121fc565b6002811115610cce57610cce6121fc565b81526020016008820160019054906101000a900460ff166003811115610cf657610cf66121fc565b6003811115610d0757610d076121fc565b815250509050428160e0015111610d4a5760405162461bcd60e51b81526020600482015260076024820152661156141254915160ca1b6044820152606401610226565b610d6181602001518260a001518360c0015161138c565b610d7d5760405162461bcd60e51b815260040161022690612490565b610da2610d88610445565b826040015183606001518460800151856101000151611481565b60008681526001830160209081526040909120600801805461ff001916610200179055810151610de490610dd4610445565b8360a001518460c001518561177e565b610dff610def610445565b8260200151836080015184611986565b80604001516001600160a01b0316816000015182602001516001600160a01b03167fc3888b4f8640ff369e48089b45596f4adc2e39c73dc7fc6e609f2ad05f8795408460600151610e4e610445565b60808088015160c0890151604080519586526001600160a01b0390941660208601529284015260608301919091520160405180910390a450506001909255505050565b806000610e9c611319565b905060016000838152600183016020526040902060080154610100900460ff166003811115610ecd57610ecd6121fc565b14610eea5760405162461bcd60e51b81526004016102269061245b565b826000610ef5611319565b9050610eff610445565b60008381526001808401602052604090912001546001600160a01b03908116911614610f585760405162461bcd60e51b815260206004820152600860248201526710a7b33332b937b960c11b6044820152606401610226565b6000610f62611319565b60008781526001820160205260409020600801805461ff001916610300179055905085610f8d610445565b6001600160a01b03167f26c37611219fb1f3253d3027b738bb3e678ed39b193c956cb48193e6431478d360405160405180910390a3505050505050565b600080610fd5611319565b8054925090506001816000610fea8386612412565b925050819055505090565b6040516301ffc9a760e01b81526000906001600160a01b038316906301ffc9a79061102b90636cdb3d1360e11b906004016124db565b602060405180830381865afa158015611048573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061106c9190612372565b1561107957506001919050565b6040516301ffc9a760e01b81526001600160a01b038316906301ffc9a7906110ac906380ac58cd60e01b906004016124db565b602060405180830381865afa1580156110c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110ed9190612372565b156110fa57506000919050565b60405162461bcd60e51b815260206004820152602d60248201527f4d61726b6574706c6163653a20746f6b656e206d75737420626520455243313160448201526c1a9a9037b91022a9219b99189760991b6064820152608401610226565b600082608001511161119a5760405162461bcd60e51b815260206004820152600b60248201526a3d32b93790383934b1b29760a91b6044820152606401610226565b60008260400151116111ee5760405162461bcd60e51b815260206004820181905260248201527f4d61726b6574706c6163653a2077616e746564207a65726f20746f6b656e732e6044820152606401610226565b81604001516001148061121257506001816002811115611210576112106121fc565b145b61126c5760405162461bcd60e51b815260206004820152602560248201527f4d61726b6574706c6163653a2077616e74656420696e76616c6964207175616e6044820152643a34ba3c9760d91b6064820152608401610226565b428260a00151610e1061127f9190612412565b116112df5760405162461bcd60e51b815260206004820152602a60248201527f4d61726b6574706c6163653a20696e76616c69642065787069726174696f6e206044820152693a34b6b2b9ba30b6b81760b11b6064820152608401610226565b6112f96112ea610445565b8360600151846080015161138c565b6113155760405162461bcd60e51b815260040161022690612490565b5050565b7fe4435c80c9874d455ad2136af47d67165644bb851fd208179d93e973f0624ca990565b6000428260e00151118015611368575060018261012001516003811115611366576113666121fc565b145b8015611386575061138682602001518360a001518460c0015161138c565b92915050565b600081836001600160a01b03166370a08231866040518263ffffffff1660e01b81526004016113bb91906121cf565b602060405180830381865afa1580156113d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113fc91906124f0565b101580156114795750604051636eb1769f60e11b815282906001600160a01b0385169063dd62ed3e906114359088903090600401612509565b602060405180830381865afa158015611452573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061147691906124f0565b10155b949350505050565b3060006001836002811115611498576114986121fc565b141561158c57604051627eeac760e11b815284906001600160a01b0388169062fdd58e906114cc908b908a90600401612523565b602060405180830381865afa1580156114e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061150d91906124f0565b10158015611585575060405163e985e9c560e01b81526001600160a01b0387169063e985e9c590611544908a908690600401612509565b602060405180830381865afa158015611561573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115859190612372565b9050611715565b60008360028111156115a0576115a06121fc565b1415611715576040516331a9108f60e11b8152600481018690526001600160a01b038089169190881690636352211e90602401602060405180830381865afa1580156115f0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611614919061253c565b6001600160a01b0316148015611712575060405163020604bf60e21b8152600481018690526001600160a01b03808416919088169063081812fc90602401602060405180830381865afa15801561166f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611693919061253c565b6001600160a01b03161480611712575060405163e985e9c560e01b81526001600160a01b0387169063e985e9c5906116d1908a908690600401612509565b602060405180830381865afa1580156116ee573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117129190612372565b90505b806117755760405162461bcd60e51b815260206004820152602a60248201527f4d61726b6574706c6163653a206e6f74206f776e6572206f7220617070726f7660448201526932b2103a37b5b2b7399760b11b6064820152608401610226565b50505050505050565b6000806000306001600160a01b031663d45573f66040518163ffffffff1660e01b81526004016040805180830381865afa1580156117c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117e49190612559565b909250905060006127106117fc61ffff84168861259a565b61180691906125b9565b9050611816878a85846000611add565b61182081876123aa565b60408681015160608801519151637a99dc0160e11b81526001600160a01b0390911660048201526024810191909152604481018890529094506000935083925030915063f533b802906064016000604051808303816000875af115801561188b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526118b39190810190612669565b81519193509150801561196d5760008060005b83811015611969578581815181106118e0576118e061242a565b602002602001015191508481815181106118fc576118fc61242a565b602002602001015192508287101561194e5760405162461bcd60e51b815260206004820152601560248201527466656573206578636565642074686520707269636560581b6044820152606401610226565b61195c8a8d84866000611add565b95829003956001016118c6565b5050505b50505061197e848787846000611add565b505050505050565b6001816101000151600281111561199f5761199f6121fc565b1415611a345760408082015160608301519151637921219560e11b81526001600160a01b038781166004830152868116602483015260448201939093526064810185905260a06084820152600060a482015291169063f242432a9060c401600060405180830381600087803b158015611a1757600080fd5b505af1158015611a2b573d6000803e3d6000fd5b50505050611ad7565b60008161010001516002811115611a4d57611a4d6121fc565b1415611ad75760408082015160608301519151635c46a7ef60e11b81526001600160a01b03878116600483015286811660248301526044820193909352608060648201526000608482015291169063b88d4fde9060a401600060405180830381600087803b158015611abe57600080fd5b505af1158015611ad2573d6000803e3d6000fd5b505050505b50505050565b81611ae757611c4d565b6001600160a01b03851673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1415611c41576001600160a01b038416301415611b8757604051632e1a7d4d60e01b8152600481018390526001600160a01b03821690632e1a7d4d90602401600060405180830381600087803b158015611b5f57600080fd5b505af1158015611b73573d6000803e3d6000fd5b50505050611b82838383611c54565b611c4d565b6001600160a01b038316301415611c3657348214611bdd5760405162461bcd60e51b81526020600482015260136024820152721b5cd9cb9d985b1d5948084f48185b5bdd5b9d606a1b6044820152606401610226565b806001600160a01b031663d0e30db0836040518263ffffffff1660e01b81526004016000604051808303818588803b158015611c1857600080fd5b505af1158015611c2c573d6000803e3d6000fd5b5050505050611c4d565b611b82838383611c54565b611c4d85858585611d19565b5050505050565b6000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114611ca1576040519150601f19603f3d011682016040523d82523d6000602084013e611ca6565b606091505b5050905080611ad757816001600160a01b031663d0e30db0846040518263ffffffff1660e01b81526004016000604051808303818588803b158015611cea57600080fd5b505af1158015611cfe573d6000803e3d6000fd5b50611ad7935050506001600160a01b03841690508585611d77565b816001600160a01b0316836001600160a01b03161415611d3857611ad7565b6001600160a01b038316301415611d6257611d5d6001600160a01b0385168383611d77565b611ad7565b611ad76001600160a01b038516848484611dd2565b611dcd8363a9059cbb60e01b8484604051602401611d96929190612523565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611e0a565b505050565b6040516001600160a01b0380851660248301528316604482015260648101829052611ad79085906323b872dd60e01b90608401611d96565b6000611e5f826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611edc9092919063ffffffff16565b805190915015611dcd5780806020019051810190611e7d9190612372565b611dcd5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610226565b60606114798484600085611ef2565b9392505050565b606082471015611f535760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610226565b6001600160a01b0385163b611faa5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610226565b600080866001600160a01b03168587604051611fc69190612759565b60006040518083038185875af1925050503d8060008114612003576040519150601f19603f3d011682016040523d82523d6000602084013e612008565b606091505b5091509150612018828286612023565b979650505050505050565b60608315612032575081611eeb565b8251156120425782518084602001fd5b8160405162461bcd60e51b81526004016102269190612775565b6040518061014001604052806000815260200160006001600160a01b0316815260200160006001600160a01b03168152602001600081526020016000815260200160006001600160a01b031681526020016000815260200160008152602001600060028111156120ce576120ce6121fc565b81526020016000905290565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715612118576121186120da565b604052919050565b6001600160a01b038116811461213557600080fd5b50565b600060c0828403121561214a57600080fd5b60405160c081018181106001600160401b038211171561216c5761216c6120da565b604052823561217a81612120565b80825250602083013560208201526040830135604082015260608301356121a081612120565b60608201526080838101359082015260a0928301359281019290925250919050565b6001600160a01b03169052565b6001600160a01b0391909116815260200190565b6000602082840312156121f557600080fd5b5035919050565b634e487b7160e01b600052602160045260246000fd5b60038110612222576122226121fc565b9052565b60048110612222576122226121fc565b80518252602081015161224c60208401826121c2565b50604081015161225f60408401826121c2565b50606081015160608301526080810151608083015260a081015161228660a08401826121c2565b5060c081015160c083015260e081015160e0830152610100808201516122ae82850182612212565b505061012080820151611ad782850182612226565b61014081016113868284612236565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b6000806040838503121561231457600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b8181101561236657612352838551612236565b92840192610140929092019160010161233f565b50909695505050505050565b60006020828403121561238457600080fd5b81518015158114611eeb57600080fd5b634e487b7160e01b600052601160045260246000fd5b6000828210156123bc576123bc612394565b500390565b600080858511156123d157600080fd5b838611156123de57600080fd5b5050820193919092039150565b6020808252600d908201526c696e76616c69642072616e676560981b604082015260600190565b6000821982111561242557612425612394565b500190565b634e487b7160e01b600052603260045260246000fd5b600060001982141561245457612454612394565b5060010190565b6020808252601b908201527a26b0b935b2ba383630b1b29d1034b73b30b634b21037b33332b91760291b604082015260600190565b6020808252602b908201527f4d61726b6574706c6163653a20696e73756666696369656e742063757272656e60408201526a31bc903130b630b731b29760a91b606082015260800190565b6001600160e01b031991909116815260200190565b60006020828403121561250257600080fd5b5051919050565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b03929092168252602082015260400190565b60006020828403121561254e57600080fd5b8151611eeb81612120565b6000806040838503121561256c57600080fd5b825161257781612120565b602084015190925061ffff8116811461258f57600080fd5b809150509250929050565b60008160001904831182151516156125b4576125b4612394565b500290565b6000826125d657634e487b7160e01b600052601260045260246000fd5b500490565b60006001600160401b038211156125f4576125f46120da565b5060051b60200190565b600082601f83011261260f57600080fd5b8151602061262461261f836125db565b6120f0565b82815260059290921b8401810191818101908684111561264357600080fd5b8286015b8481101561265e5780518352918301918301612647565b509695505050505050565b6000806040838503121561267c57600080fd5b82516001600160401b038082111561269357600080fd5b818501915085601f8301126126a757600080fd5b815160206126b761261f836125db565b82815260059290921b840181019181810190898411156126d657600080fd5b948201945b838610156126fd5785516126ee81612120565b825294820194908201906126db565b9188015191965090935050508082111561271657600080fd5b50612723858286016125fe565b9150509250929050565b60005b83811015612748578181015183820152602001612730565b83811115611ad75750506000910152565b6000825161276b81846020870161272d565b9190910192915050565b602081526000825180602084015261279481604085016020870161272d565b601f01601f1916919091016040019291505056fea2646970667358221220452d3a0014d8a71fd6929d77e6e5ba297c98281869be6df73f5c4decac6fc50964736f6c634300080c0033";
