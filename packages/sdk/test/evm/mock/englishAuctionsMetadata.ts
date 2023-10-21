export const englishAuctionsCompilerMetadata = {
  compiler: {
    version: "0.8.12+commit.f00d7308",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_nativeTokenWrapper",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "auctionId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "assetContract",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "closer",
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
            name: "auctionCreator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "winningBidder",
            type: "address",
          },
        ],
        name: "AuctionClosed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "auctionCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "auctionId",
            type: "uint256",
          },
        ],
        name: "CancelledAuction",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "auctionCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "auctionId",
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
                name: "auctionId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "auctionCreator",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
              {
                internalType: "enum IEnglishAuctions.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IEnglishAuctions.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IEnglishAuctions.Auction",
            name: "auction",
            type: "tuple",
          },
        ],
        name: "NewAuction",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "auctionId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "bidder",
            type: "address",
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
            name: "bidAmount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "auctionCreator",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
              {
                internalType: "enum IEnglishAuctions.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IEnglishAuctions.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IEnglishAuctions.Auction",
            name: "auction",
            type: "tuple",
          },
        ],
        name: "NewBid",
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
            name: "_auctionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_bidAmount",
            type: "uint256",
          },
        ],
        name: "bidInAuction",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "cancelAuction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "collectAuctionPayout",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "collectAuctionTokens",
        outputs: [],
        stateMutability: "nonpayable",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
            ],
            internalType: "struct IEnglishAuctions.AuctionParameters",
            name: "_params",
            type: "tuple",
          },
        ],
        name: "createAuction",
        outputs: [
          {
            internalType: "uint256",
            name: "auctionId",
            type: "uint256",
          },
        ],
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
        name: "getAllAuctions",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "auctionCreator",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
              {
                internalType: "enum IEnglishAuctions.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IEnglishAuctions.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IEnglishAuctions.Auction[]",
            name: "_allAuctions",
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
        name: "getAllValidAuctions",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "auctionCreator",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
              {
                internalType: "enum IEnglishAuctions.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IEnglishAuctions.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IEnglishAuctions.Auction[]",
            name: "_validAuctions",
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
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "getAuction",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "auctionId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "auctionCreator",
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
                name: "minimumBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "buyoutBidAmount",
                type: "uint256",
              },
              {
                internalType: "uint64",
                name: "timeBufferInSeconds",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "bidBufferBps",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "startTimestamp",
                type: "uint64",
              },
              {
                internalType: "uint64",
                name: "endTimestamp",
                type: "uint64",
              },
              {
                internalType: "enum IEnglishAuctions.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IEnglishAuctions.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IEnglishAuctions.Auction",
            name: "_auction",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "getWinningBid",
        outputs: [
          {
            internalType: "address",
            name: "_bidder",
            type: "address",
          },
          {
            internalType: "address",
            name: "_currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_bidAmount",
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
            name: "_auctionId",
            type: "uint256",
          },
        ],
        name: "isAuctionExpired",
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
            name: "_auctionId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_bidAmount",
            type: "uint256",
          },
        ],
        name: "isNewWinningBid",
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
        name: "totalAuctions",
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
        "bidInAuction(uint256,uint256)": {
          params: {
            _auctionId: "The ID of the auction to bid in.",
            _bidAmount:
              "The bid amount in the currency specified by the auction.",
          },
        },
        "cancelAuction(uint256)": {
          details: "Cancels an auction.",
        },
        "collectAuctionPayout(uint256)": {
          params: {
            _auctionId: "The ID of an auction.",
          },
        },
        "collectAuctionTokens(uint256)": {
          params: {
            _auctionId: "The ID of an auction.",
          },
        },
        "isNewWinningBid(uint256,uint256)": {
          params: {
            _auctionId: "The ID of an auction.",
            _bidAmount: "The bid amount to check.",
          },
        },
      },
      stateVariables: {
        ASSET_ROLE: {
          details:
            "Only assets from NFT contracts with asset role can be auctioned, when auctions are restricted by asset address.",
        },
        LISTER_ROLE: {
          details:
            "Only lister role holders can create auctions, when auctions are restricted by lister address.",
        },
        MAX_BPS: {
          details: "The max bps of the contract. So, 10_000 == 100 %",
        },
        nativeTokenWrapper: {
          details: "The address of the native token wrapper contract.",
        },
      },
      version: 1,
    },
    userdoc: {
      events: {
        "CancelledAuction(address,uint256)": {
          notice: "Emitted when a auction is cancelled.",
        },
      },
      kind: "user",
      methods: {
        "bidInAuction(uint256,uint256)": {
          notice: "Bid in an active auction.",
        },
        "collectAuctionPayout(uint256)": {
          notice: "Distribute the winning bid amount to the auction creator.",
        },
        "collectAuctionTokens(uint256)": {
          notice: "Distribute the auctioned NFTs to the winning bidder.",
        },
        "createAuction((address,uint256,uint256,address,uint256,uint256,uint64,uint64,uint64,uint64))":
          {
            notice: "Auction ERC721 or ERC1155 NFTs.",
          },
        "getAllAuctions(uint256,uint256)": {
          notice: "Returns all non-cancelled auctions.",
        },
        "getAllValidAuctions(uint256,uint256)": {
          notice: "Returns all active auctions.",
        },
        "getAuction(uint256)": {
          notice: "Returns the auction of the provided auction ID.",
        },
        "getWinningBid(uint256)": {
          notice: "Returns the winning bid of an active auction.",
        },
        "isAuctionExpired(uint256)": {
          notice: "Returns whether an auction is active.",
        },
        "isNewWinningBid(uint256,uint256)": {
          notice:
            "Returns whether a given bid amount would make for a winning bid in an auction.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/prebuilts/marketplace/english-auctions/EnglishAuctionsLogic.sol":
        "EnglishAuctionsLogic",
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
      ":@thirdweb-dev/dynamic-contracts/=lib/dynamic-contracts/",
      ":ERC721A-Upgradeable/=lib/ERC721A-Upgradeable/contracts/",
      ":ERC721A/=lib/ERC721A/contracts/",
      ":chainlink/=lib/chainlink/",
      ":contracts/=contracts/",
      ":ds-test/=lib/ds-test/src/",
      ":dynamic-contracts/=lib/dynamic-contracts/src/",
      ":erc4626-tests/=lib/chainlink/contracts/foundry-lib/openzeppelin-contracts/lib/erc4626-tests/",
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
    "contracts/eip/interface/IERC721.sol": {
      keccak256:
        "0xbd9f2dd131e8f1e4e50b1b116eae917510ab9bf5d4356de37c5daf4cffdfa049",
      license: "MIT",
      urls: [
        "bzz-raw://8ac3530b317083464271b100de1976ed9179b9e7d5a4fc3d992c61c80676a676",
        "dweb:/ipfs/QmUq1AVzymvp7Y8H1eypGEGU4icjzn5vDSvKMNpXnoaeMT",
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
        "0xb6fdc2c235817c9108db4dc2c6efc8ef58b026ebfb08f070a238b425769c8f2e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://a3ff797b8ed32b168cea4a2bd0358137b6dd4d89986999cf77798f0fb3a68951",
        "dweb:/ipfs/QmUzX9BdSY5bSXCNHsDFU3uk9s7s5sUi5BpNxFHCQVzndn",
      ],
    },
    "contracts/extension/plugin/PermissionsLogic.sol": {
      keccak256:
        "0x8454debd03ee5000cbb2777e624e02ccd55252491f5cb550d5e72fcb1eefbabc",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://a06dc5ade50bbe7e604acda51f50798331a74044174d5dadf6aa65d3747d4577",
        "dweb:/ipfs/QmQxtqAmwWVC6TzMYzFmuvrgfedcZJQ1uQLUaephojygz4",
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
    "contracts/external-deps/openzeppelin/token/ERC20/utils/SafeERC20.sol": {
      keccak256:
        "0xa6149938a7c7c8af4244743aeaafcfb1fd9ce15ad45de58fa9576f0ed5599b2c",
      license: "MIT",
      urls: [
        "bzz-raw://839aa4ea6ef6d1972881bfd7420a9ddcd2f37139e3f0bf25310f93f48410702d",
        "dweb:/ipfs/QmSH65kStfbgMbfjFdfJqV412omPy6nB1JMvMt9q7SsytW",
      ],
    },
    "contracts/infra/interface/IWETH.sol": {
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
        "0x4a30bc9a8cd6cc8b855621fb1a651e2c3a1639b0ad153f1139c3ba463605672d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://417cc64ec6393f3cc89981ca9c32bbcc444a5f91363d69f84dd8ace888b2b859",
        "dweb:/ipfs/QmZeaQsYGx4VNoP8e1fcwC87PwvyakheWYeuwEwhFSJnvB",
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
    "contracts/prebuilts/marketplace/IMarketplace.sol": {
      keccak256:
        "0xaccbdafe7b186c737c7b2f89487d6535af52ef489f2e98a3fa2cf5340595f6a1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e2123e8d6fde446aacebda959a7b6e1e08d5e0e014d0e71f74f6ab44cc9c0bf1",
        "dweb:/ipfs/QmafGaobV5FZj1LZW1CxqQzxS1TJ5ZxwMTzp472v7TpQgi",
      ],
    },
    "contracts/prebuilts/marketplace/english-auctions/EnglishAuctionsLogic.sol":
      {
        keccak256:
          "0x96774a8f7ba4b45630cb4a1a5d5c1e947c4db15d7ce86910760dd2a61ca5b375",
        license: "Apache-2.0",
        urls: [
          "bzz-raw://f879461a4bcf6ebd11c4951bbea159d25683d907a312121c8cf6be34d2f91006",
          "dweb:/ipfs/QmPdyn2azg6N7gEECQDW7um8DhLPrMY6mGSWE6g2DkSnWU",
        ],
      },
    "contracts/prebuilts/marketplace/english-auctions/EnglishAuctionsStorage.sol":
      {
        keccak256:
          "0x492e9fb7752e56145f80e1856a9797902ef8ce78c6765a0414cfbe0093eb8cd5",
        license: "Apache-2.0",
        urls: [
          "bzz-raw://3439ac69bd5291f78da652a14862646e9c23142277273fc76e5565068fece21f",
          "dweb:/ipfs/QmcTaH4Av4QybuqgAbooNp13nXcQXmgBhfSFxbYsKF7BEE",
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

export const englishAuctionsBytecode =
  "0x60a06040523480156200001157600080fd5b5060405162003f2b38038062003f2b833981016040819052620000349162000046565b6001600160a01b031660805262000078565b6000602082840312156200005957600080fd5b81516001600160a01b03811681146200007157600080fd5b9392505050565b608051613e906200009b600039600081816123c60152612f250152613e906000f3fe6080604052600436106100ad5760003560e01c806303a54fe0146100b25780630858e5ad146100d4578063119df25f146100e75780631389b1171461011257806316002f4a1461014257806316654d40146101655780632eb566bd146101855780636891939d146101a557806378bd7935146101d45780637b063801146102015780638b49d47e1461022e57806396b5a75514610251578063c291537c14610271578063ebf05a6214610291575b600080fd5b3480156100be57600080fd5b506100d26100cd3660046135b8565b6102b1565b005b6100d26100e23660046135d1565b61054d565b3480156100f357600080fd5b506100fc6108a0565b6040516101099190613600565b60405180910390f35b34801561011e57600080fd5b5061013261012d3660046135b8565b61091e565b6040519015158152602001610109565b34801561014e57600080fd5b506101576109b3565b604051908152602001610109565b34801561017157600080fd5b50610157610180366004613614565b6109c5565b34801561019157600080fd5b506101326101a03660046135d1565b610ea7565b3480156101b157600080fd5b506101c56101c03660046135b8565b6110ae565b6040516101099392919061362d565b3480156101e057600080fd5b506101f46101ef3660046135b8565b61123a565b6040516101099190613769565b34801561020d57600080fd5b5061022161021c3660046135d1565b611383565b604051610109919061377e565b34801561023a57600080fd5b50610243611826565b6040516101099291906137cd565b34801561025d57600080fd5b506100d261026c3660046135b8565b6118c1565b34801561027d57600080fd5b5061022161028c3660046135d1565b611be9565b34801561029d57600080fd5b506100d26102ac3660046135b8565b611df7565b60006102bb61208e565b8054909150600214156102e95760405162461bcd60e51b81526004016102e0906137fc565b60405180910390fd5b6002815560006102f76120b2565b600084815260018083016020908152604080842081516101c08101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c0820152600782015460e082015260088201546001600160401b03808216610100840152600160401b82048116610120840152600160801b82048116610140840152600160c01b9091041661016082015260098201549495509293909161018084019160ff16908111156103d9576103d9613651565b60018111156103ea576103ea613651565b81526020016009820160019054906101000a900460ff16600381111561041257610412613651565b600381111561042357610423613651565b90525060008581526002808501602090815260409283902083516060810185528154815260018201546001600160a01b03169281019290925290910154918101919091529091506003826101a00151600381111561048357610483613651565b14156104a15760405162461bcd60e51b81526004016102e090613833565b428261016001516001600160401b031611156104cf5760405162461bcd60e51b81526004016102e09061386a565b60208101516001600160a01b03166104f95760405162461bcd60e51b81526004016102e0906138ac565b61050382826120d6565b6002826101a00151600381111561051c5761051c613651565b146105425760008581526001840160205260409020600901805461ff0019166102001790555b505060019091555050565b600061055761208e565b80549091506002141561057c5760405162461bcd60e51b81526004016102e0906137fc565b6002815582600061058b6120b2565b905060016000838152600183016020526040902060090154610100900460ff1660038111156105bc576105bc613651565b146105d95760405162461bcd60e51b81526004016102e090613833565b60006105e36120b2565b600087815260018083016020908152604080842081516101c08101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c0820152600782015460e082015260088201546001600160401b03808216610100840152600160401b82048116610120840152600160801b82048116610140840152600160c01b9091041661016082015260098201549495509293909161018084019160ff16908111156106c5576106c5613651565b60018111156106d6576106d6613651565b81526020016009820160019054906101000a900460ff1660038111156106fe576106fe613651565b600381111561070f5761070f613651565b815250509050428161016001516001600160401b03161180156107405750428161014001516001600160401b031611155b61078c5760405162461bcd60e51b815260206004820152601e60248201527f4d61726b6574706c6163653a20696e6163746976652061756374696f6e2e000060448201526064016102e0565b856107e85760405162461bcd60e51b815260206004820152602660248201527f4d61726b6574706c6163653a2042696464696e672077697468207a65726f206160448201526536b7bab73a1760d11b60648201526084016102e0565b8060e00151861115806107fd575060e0810151155b61085a5760405162461bcd60e51b815260206004820152602860248201527f4d61726b6574706c6163653a2042696464696e672061626f7665206275796f756044820152673a10383934b1b29760c11b60648201526084016102e0565b600060405180606001604052808981526020016108756108a0565b6001600160a01b031681526020018890529050610892828261236a565b505060019093555050505050565b60405163572b6c0560e01b8152600090309063572b6c05906108c6903390600401613600565b602060405180830381865afa1580156108e3573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061090791906138e3565b15610919575060131936013560601c90565b503390565b600081600061092b6120b2565b905060016000838152600183016020526040902060090154610100900460ff16600381111561095c5761095c613651565b146109795760405162461bcd60e51b81526004016102e090613833565b60006109836120b2565b6000958652600101602052505060409092206008015442600160c01b9091046001600160401b0316101592915050565b6000806109be6120b2565b5492915050565b60003063a32fa5b37ff94103142c1baabe9ac2b5d1487bf783de9e69cfeea9a72f5c9c94afd7877b8c6109f66108a0565b6040518363ffffffff1660e01b8152600401610a13929190613905565b602060405180830381865afa158015610a30573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a5491906138e3565b610a8f5760405162461bcd60e51b815260206004820152600c60248201526b214c49535445525f524f4c4560a01b60448201526064016102e0565b610a9c602083018361393f565b60405163a32fa5b360e01b8152309063a32fa5b390610ae1907f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae6908590600401613905565b602060405180830381865afa158015610afe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b2291906138e3565b610b5c5760405162461bcd60e51b815260206004820152600b60248201526a2141535345545f524f4c4560a81b60448201526064016102e0565b610b646127c2565b91506000610b706108a0565b90506000610b89610b84602087018761393f565b6127ed565b9050610ba3610b9d368790038701876139e2565b8261295f565b6000604051806101c00160405280868152602001846001600160a01b03168152602001876000016020810190610bd9919061393f565b6001600160a01b031681526020018760200135815260200187604001358152602001876060016020810190610c0e919061393f565b6001600160a01b031681526080880135602082015260a08801356040820152606001610c4060e0890160c08a01613a8e565b6001600160401b03168152602001610c5f610100890160e08a01613a8e565b6001600160401b03168152602001610c7f61012089016101008a01613a8e565b6001600160401b03168152602001610c9f61014089016101208a01613a8e565b6001600160401b03168152602001836001811115610cbf57610cbf613651565b81526020016001905290506000610cd46120b2565b600087815260018083016020908152604092839020865181559086015181830180546001600160a01b039283166001600160a01b03199182161790915593870151600283018054918316918616919091179055606087015160038301556080870151600483015560a08701516005830180549190921694169390931790925560c0850151600683015560e085015160078301556101008501516008830180546101208801516101408901516101608a01516001600160401b03908116600160c01b026001600160c01b03928216600160801b02929092166001600160801b03938216600160401b026001600160801b0319909516919096161792909217169290921791909117905561018085015160098301805494955086949192909160ff1916908381811115610e0757610e07613651565b02179055506101a082015160098201805461ff001916610100836003811115610e3257610e32613651565b0217905550905050610e45843084612c00565b610e52602088018861393f565b6001600160a01b031686856001600160a01b03167fc04e70ae90764fd9186e71dc14056ada1cd1e2f34cc2d6476eb22ff60efb40c885604051610e959190613769565b60405180910390a45050505050919050565b6000826000610eb46120b2565b905060016000838152600183016020526040902060090154610100900460ff166003811115610ee557610ee5613651565b14610f025760405162461bcd60e51b81526004016102e090613833565b6000610f0c6120b2565b600087815260018083016020908152604080842081516101c08101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c0820152600782015460e082015260088201546001600160401b03808216610100840152600160401b82048116610120840152600160801b82048116610140840152600160c01b9091041661016082015260098201549495509293909161018084019160ff1690811115610fee57610fee613651565b6001811115610fff57610fff613651565b81526020016009820160019054906101000a900460ff16600381111561102757611027613651565b600381111561103857611038613651565b90525060008881526002808501602090815260409283902083516060810185528154815260018201546001600160a01b0316928101929092529091015491810182905260c083015161012084015193945090926110a092908a906001600160401b0316612d42565b95505050505b505092915050565b6000806000806110bc6120b2565b600086815260018083016020908152604080842081516101c08101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c0820152600782015460e082015260088201546001600160401b03808216610100840152600160401b82048116610120840152600160801b82048116610140840152600160c01b9091041661016082015260098201549495509293909161018084019160ff169081111561119e5761119e613651565b60018111156111af576111af613651565b81526020016009820160019054906101000a900460ff1660038111156111d7576111d7613651565b60038111156111e8576111e8613651565b9052506000968752600292830160209081526040978890208851606081018a528154815260018201546001600160a01b03169281018390529401549390970183905260a0015195969194509092505050565b611242613545565b600061124c6120b2565b60008481526001808301602090815260409283902083516101c08101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c0840152600781015460e084015260088101546001600160401b03808216610100860152600160401b82048116610120860152600160801b82048116610140860152600160c01b909104166101608401526009810154939450919261018084019160ff9091169081111561132f5761132f613651565b600181111561134057611340613651565b81526020016009820160019054906101000a900460ff16600381111561136857611368613651565b600381111561137957611379613651565b9052509392505050565b6060600061138f6120b2565b90508284111580156113a15750805483105b6113bd5760405162461bcd60e51b81526004016102e090613aa9565b60006113c98585613ae6565b6113d4906001613afd565b6001600160401b038111156113eb576113eb61395c565b60405190808252806020026020018201604052801561142457816020015b611411613545565b8152602001906001900390816114095790505b5090506000855b85811161168657600061143e8883613ae6565b60008381526001808801602090815260409283902083516101c08101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c0840152600781015460e084015260088101546001600160401b03808216610100860152600160401b82048116610120860152600160801b82048116610140860152600160c01b909104166101608401526009810154939450919261018084019160ff9091169081111561152157611521613651565b600181111561153257611532613651565b81526020016009820160019054906101000a900460ff16600381111561155a5761155a613651565b600381111561156b5761156b613651565b8152505084828151811061158157611581613b15565b60200260200101819052504284828151811061159f5761159f613b15565b602002602001015161014001516001600160401b0316111580156115e95750428482815181106115d1576115d1613b15565b602002602001015161016001516001600160401b0316115b80156116245750600184828151811061160457611604613b15565b60200260200101516101a00151600381111561162257611622613651565b145b8015611660575060006001600160a01b031684828151811061164857611648613b15565b6020026020010151604001516001600160a01b031614155b1561167357611670600184613afd565b92505b5061167f600182613afd565b905061142b565b50806001600160401b0381111561169f5761169f61395c565b6040519080825280602002602001820160405280156116d857816020015b6116c5613545565b8152602001906001900390816116bd5790505b508251909450600090815b8181101561181a57428582815181106116fe576116fe613b15565b602002602001015161014001516001600160401b03161115801561174857504285828151811061173057611730613b15565b602002602001015161016001516001600160401b0316115b80156117835750600185828151811061176357611763613b15565b60200260200101516101a00151600381111561178157611781613651565b145b80156117bf575060006001600160a01b03168582815181106117a7576117a7613b15565b6020026020010151604001516001600160a01b031614155b15611808578481815181106117d6576117d6613b15565b60200260200101518784806117ea90613b2b565b9550815181106117fc576117fc613b15565b60200260200101819052505b611813600182613afd565b90506116e3565b50505050505092915050565b60405163572b6c0560e01b81523690600090309063572b6c059061184e903390600401613600565b602060405180830381865afa15801561186b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061188f91906138e3565b156118b857600080366118a3601482613ae6565b926118b093929190613b46565b915091509091565b50600091369150565b8060006118cc6120b2565b905060016000838152600183016020526040902060090154610100900460ff1660038111156118fd576118fd613651565b1461191a5760405162461bcd60e51b81526004016102e090613833565b8260006119256120b2565b905061192f6108a0565b60008381526001808401602052604090912001546001600160a01b039081169116146119a75760405162461bcd60e51b815260206004820152602160248201527f4d61726b6574706c6163653a206e6f742061756374696f6e2063726561746f726044820152601760f91b60648201526084016102e0565b60006119b16120b2565b600087815260018083016020908152604080842081516101c08101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c0820152600782015460e082015260088201546001600160401b03808216610100840152600160401b82048116610120840152600160801b82048116610140840152600160c01b9091041661016082015260098201549495509293909161018084019160ff1690811115611a9357611a93613651565b6001811115611aa457611aa4613651565b81526020016009820160019054906101000a900460ff166003811115611acc57611acc613651565b6003811115611add57611add613651565b90525060008881526002808501602090815260409283902083516060810185528154815260018201546001600160a01b03169281018390529201549282019290925291925015611b6f5760405162461bcd60e51b815260206004820152601f60248201527f4d61726b6574706c6163653a206269647320616c7265616479206d6164652e0060448201526064016102e0565b6000888152600184016020526040902060090180546003919061ff001916610100830217905550611ba530836020015184612c00565b602082015160405189916001600160a01b0316907fd68d26ab7202e0ff43e7ee058c16686e737f214c5832bfc1dd2fbb0518f60d8e90600090a35050505050505050565b60606000611bf56120b2565b9050828411158015611c075750805483105b611c235760405162461bcd60e51b81526004016102e090613aa9565b611c2d8484613ae6565b611c38906001613afd565b6001600160401b03811115611c4f57611c4f61395c565b604051908082528060200260200182016040528015611c8857816020015b611c75613545565b815260200190600190039081611c6d5790505b509150835b8381116110a65760008181526001808401602090815260409283902083516101c08101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c0840152600781015460e084015260088101546001600160401b03808216610100860152600160401b82048116610120860152600160801b82048116610140860152600160c01b909104166101608401526009810154909161018084019160ff1690811115611d7257611d72613651565b6001811115611d8357611d83613651565b81526020016009820160019054906101000a900460ff166003811115611dab57611dab613651565b6003811115611dbc57611dbc613651565b90525083611dca8784613ae6565b81518110611dda57611dda613b15565b6020908102919091010152611df0600182613afd565b9050611c8d565b6000611e0161208e565b805490915060021415611e265760405162461bcd60e51b81526004016102e0906137fc565b600281556000611e346120b2565b6000848152600382016020526040902054909150610100900460ff1615611e6d5760405162461bcd60e51b81526004016102e090613b70565b6000838152600380830160209081526040808420805461ff0019166101009081179091556001868101845282862083516101c08101855281548152818301546001600160a01b0390811696820196909652600282015486169481019490945294850154606084015260048501546080840152600585015490931660a0830152600684015460c0830152600784015460e083015260088401546001600160401b0380821692840192909252600160401b81048216610120840152600160801b81048216610140840152600160c01b900416610160820152600983015490929161018084019160ff1690811115611f6457611f64613651565b6001811115611f7557611f75613651565b81526020016009820160019054906101000a900460ff166003811115611f9d57611f9d613651565b6003811115611fae57611fae613651565b90525060008581526002808501602090815260409283902083516060810185528154815260018201546001600160a01b03169281019290925290910154918101919091529091506003826101a00151600381111561200e5761200e613651565b141561202c5760405162461bcd60e51b81526004016102e090613833565b428261016001516001600160401b0316111561205a5760405162461bcd60e51b81526004016102e09061386a565b60208101516001600160a01b03166120845760405162461bcd60e51b81526004016102e0906138ac565b6105038282612d8e565b7fbbf78d3411d42a81effd97bb8c69faae4e77e75cec462245c1001191a0634c6f90565b7fd526f5655f36f7dc8e8bd7b8ff16d8886b1e27059b0d19a6ab0f4742ac8dc6e390565b60006120e06120b2565b8351600090815260038201602052604090205490915060ff16156121165760405162461bcd60e51b81526004016102e090613b70565b825160009081526003828101602090815260408084208054600160ff199182168117909255426001600160401b039081166101608b019081528a5188526002808a0187528589208b5181558b88015181870180546001600160a01b03199081166001600160a01b03938416179091558d890151928401929092558d518b52868c018952998790208d518155978d015188870180548316918c16919091179055958c015190870180548716918a1691909117905560608b01519686019690965560808a0151600486015560a08a015160058601805490951697169690961790925560c0880151600684015560e088015160078401556101008801516008840180546101208b01516101408c015197519389166001600160801b031990921691909117600160401b91891691909102176001600160801b0316600160801b968816969096026001600160c01b031695909517600160c01b91909616029490941790925561018086015160098201805488959394929391921690838181111561229e5761229e613651565b02179055506101a082015160098201805461ff0019166101008360038111156122c9576122c9613651565b02179055509050506122e030836020015185612c00565b6122e86108a0565b6001600160a01b031683604001516001600160a01b031684600001517f7003143824ad94e684efcfd33e097dd7cd0e67243daf20f345f5186a9a7ba00a86606001518760200151876020015160405161235d939291909283526001600160a01b03918216602084015216604082015260600190565b60405180910390a4505050565b60006123746120b2565b835160009081526002808301602090815260409283902083516060810185528154815260018201546001600160a01b031692810192909252909101548183018190529185015160e087015193945090927f000000000000000000000000000000000000000000000000000000000000000090158015906123f857508660e001518210155b1561241a5760e087015160408701819052915061241587876120d6565b612710565b6124388760c0015184848a61012001516001600160401b0316612d42565b6124845760405162461bcd60e51b815260206004820152601d60248201527f4d61726b6574706c6163653a206e6f742077696e6e696e67206269642e00000060448201526064016102e0565b865160009081526002868101602090815260409283902089518155908901516001820180546001600160a01b0319166001600160a01b03909216919091179055918801519101556101008701516101608801516001600160401b03918216916124ef91429116613ae6565b1161271057866101000151876101600181815161250c9190613bb6565b9150906001600160401b031690816001600160401b03168152505086856001016000896000015181526020019081526020016000206000820151816000015560208201518160010160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060408201518160020160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550606082015181600301556080820151816004015560a08201518160050160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060c0820151816006015560e082015181600701556101008201518160080160006101000a8154816001600160401b0302191690836001600160401b031602179055506101208201518160080160086101000a8154816001600160401b0302191690836001600160401b031602179055506101408201518160080160106101000a8154816001600160401b0302191690836001600160401b031602179055506101608201518160080160186101000a8154816001600160401b0302191690836001600160401b031602179055506101808201518160090160006101000a81548160ff021916908360018111156126dd576126dd613651565b02179055506101a082015160098201805461ff00191661010083600381111561270857612708613651565b021790555050505b60208401516001600160a01b03161580159061272c5750600083115b15612746576127468760a001513086602001518685612daa565b61275b8760a001518760200151308585612daa565b86604001516001600160a01b031686602001516001600160a01b031688600001517f73a3ddb4c4a8f012b37d781ad9d6c303dc9273877b279dfc5e7841b7caa867c589604001518b6040516127b1929190613be1565b60405180910390a450505050505050565b6000806127cd6120b2565b80549250905060018160006127e28386613afd565b925050819055505090565b6040516301ffc9a760e01b81526000906001600160a01b038316906301ffc9a79061282390636cdb3d1360e11b90600401613bf6565b602060405180830381865afa158015612840573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061286491906138e3565b1561287157506001919050565b6040516301ffc9a760e01b81526001600160a01b038316906301ffc9a7906128a4906380ac58cd60e01b90600401613bf6565b602060405180830381865afa1580156128c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128e591906138e3565b156128f257506000919050565b60405162461bcd60e51b815260206004820152603760248201527f4d61726b6574706c6163653a2061756374696f6e656420746f6b656e206d75736044820152763a1031329022a92198989a9a9037b91022a9219b99189760491b60648201526084016102e0565b919050565b60008260400151116129c25760405162461bcd60e51b815260206004820152602660248201527f4d61726b6574706c6163653a2061756374696f6e696e67207a65726f20717561604482015265373a34ba3c9760d11b60648201526084016102e0565b8160400151600114806129e6575060018160018111156129e4576129e4613651565b145b612a445760405162461bcd60e51b815260206004820152602960248201527f4d61726b6574706c6163653a2061756374696f6e696e6720696e76616c69642060448201526838bab0b73a34ba3c9760b91b60648201526084016102e0565b60008260c001516001600160401b031611612aa05760405162461bcd60e51b815260206004820152601c60248201527b26b0b935b2ba383630b1b29d103737903a34b6b296b13ab33332b91760211b60448201526064016102e0565b60008260e001516001600160401b031611612afb5760405162461bcd60e51b815260206004820152601b60248201527a26b0b935b2ba383630b1b29d103737903134b216b13ab33332b91760291b60448201526064016102e0565b42826101000151610e10612b0f9190613bb6565b6001600160401b031610158015612b4157508161012001516001600160401b03168261010001516001600160401b0316105b612b8d5760405162461bcd60e51b815260206004820181905260248201527f4d61726b6574706c6163653a20696e76616c69642074696d657374616d70732e60448201526064016102e0565b60a08201511580612ba6575081608001518260a0015110155b612bfc5760405162461bcd60e51b815260206004820152602160248201527f4d61726b6574706c6163653a20696e76616c69642062696420616d6f756e74736044820152601760f91b60648201526084016102e0565b5050565b60018161018001516001811115612c1957612c19613651565b1415612cb357604081810151606083015160808401519251637921219560e11b81526001600160a01b03878116600483015286811660248301526044820192909252606481019390935260a06084840152600060a4840152169063f242432a9060c401600060405180830381600087803b158015612c9657600080fd5b505af1158015612caa573d6000803e3d6000fd5b50505050505050565b60008161018001516001811115612ccc57612ccc613651565b1415612d3d5760408082015160608301519151635c46a7ef60e11b81526001600160a01b03868116600483015285811660248301526044820193909352608060648201526000608482015291169063b88d4fde9060a401600060405180830381600087803b158015612c9657600080fd5b505050565b600083612d53575083821015612d86565b8383118015612d8357508184612710612d6c8287613ae6565b612d769190613c0b565b612d809190613c2a565b10155b90505b949350505050565b6040810151602083015160a08401516122e09130918487612f21565b81612db457612f1a565b6001600160a01b03851673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1415612f0e576001600160a01b038416301415612e5457604051632e1a7d4d60e01b8152600481018390526001600160a01b03821690632e1a7d4d90602401600060405180830381600087803b158015612e2c57600080fd5b505af1158015612e40573d6000803e3d6000fd5b50505050612e4f838383613143565b612f1a565b6001600160a01b038316301415612f0357348214612eaa5760405162461bcd60e51b81526020600482015260136024820152721b5cd9cb9d985b1d5948084f48185b5bdd5b9d606a1b60448201526064016102e0565b806001600160a01b031663d0e30db0836040518263ffffffff1660e01b81526004016000604051808303818588803b158015612ee557600080fd5b505af1158015612ef9573d6000803e3d6000fd5b5050505050612f1a565b612e4f838383613143565b612f1a8585858561320e565b5050505050565b60007f000000000000000000000000000000000000000000000000000000000000000090506000806000306001600160a01b031663d45573f66040518163ffffffff1660e01b81526004016040805180830381865afa158015612f88573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612fac9190613c4c565b90925090506000612710612fc461ffff841689613c0b565b612fce9190613c2a565b9050612fdd888b858489612daa565b612fe78188613ae6565b60408781015160608901519151637a99dc0160e11b81526001600160a01b0390911660048201526024810191909152604481018990529094506000935083925030915063f533b802906064016000604051808303816000875af1158015613052573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261307a9190810190613d1b565b8151919350915080156131335760008060005b8381101561312f578581815181106130a7576130a7613b15565b602002602001015191508481815181106130c3576130c3613b15565b60200260200101519250828710156131155760405162461bcd60e51b815260206004820152601560248201527466656573206578636565642074686520707269636560581b60448201526064016102e0565b6131228b8e84868c612daa565b958290039560010161308d565b5050505b505050612caa8588888486612daa565b6000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114613190576040519150601f19603f3d011682016040523d82523d6000602084013e613195565b606091505b505090508061320857816001600160a01b031663d0e30db0846040518263ffffffff1660e01b81526004016000604051808303818588803b1580156131d957600080fd5b505af11580156131ed573d6000803e3d6000fd5b50613208935050506001600160a01b0384169050858561326c565b50505050565b816001600160a01b0316836001600160a01b0316141561322d57613208565b6001600160a01b038316301415613257576132526001600160a01b038516838361326c565b613208565b6132086001600160a01b0385168484846132cf565b6040516001600160a01b038316602482015260448101829052612d3d90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526132f0565b613208846323b872dd60e01b8585856040516024016132989392919061362d565b6000613345826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166133c29092919063ffffffff16565b805190915015612d3d578080602001905181019061336391906138e3565b612d3d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016102e0565b60606133d184846000856133db565b90505b9392505050565b60608247101561343c5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016102e0565b6001600160a01b0385163b6134935760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016102e0565b600080866001600160a01b031685876040516134af9190613e0b565b60006040518083038185875af1925050503d80600081146134ec576040519150601f19603f3d011682016040523d82523d6000602084013e6134f1565b606091505b509150915061350182828661350c565b979650505050505050565b6060831561351b5750816133d4565b82511561352b5782518084602001fd5b8160405162461bcd60e51b81526004016102e09190613e27565b604080516101c081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e0810182905261010081018290526101208101829052610140810182905261016081018290529061018082019081526020016000905290565b6000602082840312156135ca57600080fd5b5035919050565b600080604083850312156135e457600080fd5b50508035926020909101359150565b6001600160a01b03169052565b6001600160a01b0391909116815260200190565b6000610140828403121561362757600080fd5b50919050565b6001600160a01b039384168152919092166020820152604081019190915260600190565b634e487b7160e01b600052602160045260246000fd5b6002811061367757613677613651565b9052565b6004811061367757613677613651565b8051825260208101516136a160208401826135f3565b5060408101516136b460408401826135f3565b50606081015160608301526080810151608083015260a08101516136db60a08401826135f3565b5060c081015160c083015260e081015160e08301526101008082015161370b828501826001600160401b03169052565b5050610120818101516001600160401b03908116918401919091526101408083015182169084015261016080830151909116908301526101808082015161375482850182613667565b50506101a0808201516132088285018261367b565b6101c08101613778828461368b565b92915050565b6020808252825182820181905260009190848201906040850190845b818110156137c1576137ad83855161368b565b928401926101c0929092019160010161379a565b50909695505050505050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b6020808252601d908201527f4d61726b6574706c6163653a20696e76616c69642061756374696f6e2e000000604082015260600190565b60208082526022908201527f4d61726b6574706c6163653a2061756374696f6e207374696c6c206163746976604082015261329760f11b606082015260800190565b6020808252601f908201527f4d61726b6574706c6163653a206e6f20626964732077657265206d6164652e00604082015260600190565b6000602082840312156138f557600080fd5b815180151581146133d457600080fd5b9182526001600160a01b0316602082015260400190565b6001600160a01b038116811461393157600080fd5b50565b803561295a8161391c565b60006020828403121561395157600080fd5b81356133d48161391c565b634e487b7160e01b600052604160045260246000fd5b60405161014081016001600160401b03811182821017156139955761399561395c565b60405290565b604051601f8201601f191681016001600160401b03811182821017156139c3576139c361395c565b604052919050565b80356001600160401b038116811461295a57600080fd5b600061014082840312156139f557600080fd5b6139fd613972565b613a0683613934565b81526020830135602082015260408301356040820152613a2860608401613934565b60608201526080830135608082015260a083013560a0820152613a4d60c084016139cb565b60c0820152613a5e60e084016139cb565b60e0820152610100613a718185016139cb565b90820152610120613a838482016139cb565b908201529392505050565b600060208284031215613aa057600080fd5b6133d4826139cb565b6020808252600d908201526c696e76616c69642072616e676560981b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600082821015613af857613af8613ad0565b500390565b60008219821115613b1057613b10613ad0565b500190565b634e487b7160e01b600052603260045260246000fd5b6000600019821415613b3f57613b3f613ad0565b5060010190565b60008085851115613b5657600080fd5b83861115613b6357600080fd5b5050820193919092039150565b60208082526026908201527f4d61726b6574706c6163653a207061796f757420616c726561647920636f6d706040820152653632ba32b21760d11b606082015260800190565b60006001600160401b03808316818516808303821115613bd857613bd8613ad0565b01949350505050565b8281526101e081016133d4602083018461368b565b6001600160e01b031991909116815260200190565b6000816000190483118215151615613c2557613c25613ad0565b500290565b600082613c4757634e487b7160e01b600052601260045260246000fd5b500490565b60008060408385031215613c5f57600080fd5b8251613c6a8161391c565b602084015190925061ffff81168114613c8257600080fd5b809150509250929050565b60006001600160401b03821115613ca657613ca661395c565b5060051b60200190565b600082601f830112613cc157600080fd5b81516020613cd6613cd183613c8d565b61399b565b82815260059290921b84018101918181019086841115613cf557600080fd5b8286015b84811015613d105780518352918301918301613cf9565b509695505050505050565b60008060408385031215613d2e57600080fd5b82516001600160401b0380821115613d4557600080fd5b818501915085601f830112613d5957600080fd5b81516020613d69613cd183613c8d565b82815260059290921b84018101918181019089841115613d8857600080fd5b948201945b83861015613daf578551613da08161391c565b82529482019490820190613d8d565b91880151919650909350505080821115613dc857600080fd5b50613dd585828601613cb0565b9150509250929050565b60005b83811015613dfa578181015183820152602001613de2565b838111156132085750506000910152565b60008251613e1d818460208701613ddf565b9190910192915050565b6020815260008251806020840152613e46816040850160208701613ddf565b601f01601f1916919091016040019291505056fea26469706673582212206887ea14ff98a3d7ffde725fc34a626abf686c5dfb11b4f86dc345d0c6626a1864736f6c634300080c0033";
