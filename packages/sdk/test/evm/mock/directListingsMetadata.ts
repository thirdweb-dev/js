export const directListingsCompilerMetadata = {
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
            name: "listingId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "BuyerApprovedForListing",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "listingCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "listingId",
            type: "uint256",
          },
        ],
        name: "CancelledListing",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "listingId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "currency",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
        ],
        name: "CurrencyApprovedForListing",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "oldListingId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "newListingId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IDirectListings.Listing",
            name: "newListing",
            type: "tuple",
          },
        ],
        name: "ListingMigrated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "listingCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "listingId",
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
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IDirectListings.Listing",
            name: "listing",
            type: "tuple",
          },
        ],
        name: "NewListing",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "listingCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "listingId",
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
            name: "buyer",
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
        name: "NewSale",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "listingCreator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "listingId",
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
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            indexed: false,
            internalType: "struct IDirectListings.Listing",
            name: "listing",
            type: "tuple",
          },
        ],
        name: "UpdatedListing",
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
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_buyer",
            type: "address",
          },
          {
            internalType: "bool",
            name: "_toApprove",
            type: "bool",
          },
        ],
        name: "approveBuyerForListing",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_pricePerTokenInCurrency",
            type: "uint256",
          },
        ],
        name: "approveCurrencyForListing",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_buyFor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_expectedTotalPrice",
            type: "uint256",
          },
        ],
        name: "buyFromListing",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_listingId",
            type: "uint256",
          },
        ],
        name: "cancelListing",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
            ],
            internalType: "struct IDirectListings.ListingParameters",
            name: "_params",
            type: "tuple",
          },
        ],
        name: "createListing",
        outputs: [
          {
            internalType: "uint256",
            name: "listingId",
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
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_currency",
            type: "address",
          },
        ],
        name: "currencyPriceForListing",
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
            name: "_startId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_endId",
            type: "uint256",
          },
        ],
        name: "getAllListings",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IDirectListings.Listing[]",
            name: "_allListings",
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
        name: "getAllValidListings",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IDirectListings.Listing[]",
            name: "_validListings",
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
            name: "_listingId",
            type: "uint256",
          },
        ],
        name: "getListing",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "listingId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "listingCreator",
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
              {
                internalType: "enum IDirectListings.TokenType",
                name: "tokenType",
                type: "uint8",
              },
              {
                internalType: "enum IDirectListings.Status",
                name: "status",
                type: "uint8",
              },
            ],
            internalType: "struct IDirectListings.Listing",
            name: "listing",
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
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_buyer",
            type: "address",
          },
        ],
        name: "isBuyerApprovedForListing",
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
            name: "_listingId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_currency",
            type: "address",
          },
        ],
        name: "isCurrencyApprovedForListing",
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
        name: "totalListings",
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
            name: "_listingId",
            type: "uint256",
          },
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
                name: "pricePerToken",
                type: "uint256",
              },
              {
                internalType: "uint128",
                name: "startTimestamp",
                type: "uint128",
              },
              {
                internalType: "uint128",
                name: "endTimestamp",
                type: "uint128",
              },
              {
                internalType: "bool",
                name: "reserved",
                type: "bool",
              },
            ],
            internalType: "struct IDirectListings.ListingParameters",
            name: "_params",
            type: "tuple",
          },
        ],
        name: "updateListing",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      author: "thirdweb.com",
      kind: "dev",
      methods: {
        "totalListings()": {
          details:
            "At any point, the return value is the ID of the next listing created.",
        },
      },
      stateVariables: {
        ASSET_ROLE: {
          details:
            "Only assets from NFT contracts with asset role can be listed, when listings are restricted by asset address.",
        },
        LISTER_ROLE: {
          details:
            "Only lister role holders can create listings, when listings are restricted by lister address.",
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
        "BuyerApprovedForListing(uint256,address,bool)": {
          notice:
            "Emitted when a buyer is approved to buy from a reserved listing.",
        },
        "CancelledListing(address,uint256)": {
          notice: "Emitted when a listing is cancelled.",
        },
        "CurrencyApprovedForListing(uint256,address,uint256)": {
          notice:
            "Emitted when a currency is approved as a form of payment for the listing.",
        },
        "ListingMigrated(uint256,uint256,(uint256,address,address,uint256,uint256,address,uint256,uint128,uint128,bool,uint8,uint8))":
          {
            notice:
              "Emitted when a listing from the old marketplace is migrated.",
          },
        "NewListing(address,uint256,address,(uint256,address,address,uint256,uint256,address,uint256,uint128,uint128,bool,uint8,uint8))":
          {
            notice: "Emitted when a new listing is created.",
          },
        "NewSale(address,uint256,address,uint256,address,uint256,uint256)": {
          notice: "Emitted when NFTs are bought from a listing.",
        },
        "UpdatedListing(address,uint256,address,(uint256,address,address,uint256,uint256,address,uint256,uint128,uint128,bool,uint8,uint8))":
          {
            notice: "Emitted when a listing is updated.",
          },
      },
      kind: "user",
      methods: {
        "approveBuyerForListing(uint256,address,bool)": {
          notice: "Approve a buyer to buy from a reserved listing.",
        },
        "approveCurrencyForListing(uint256,address,uint256)": {
          notice: "Approve a currency as a form of payment for the listing.",
        },
        "buyFromListing(uint256,address,uint256,address,uint256)": {
          notice: "Buy NFTs from a listing.",
        },
        "cancelListing(uint256)": {
          notice: "Cancel a listing.",
        },
        "createListing((address,uint256,uint256,address,uint256,uint128,uint128,bool))":
          {
            notice: "List NFTs (ERC721 or ERC1155) for sale at a fixed price.",
          },
        "currencyPriceForListing(uint256,address)": {
          notice:
            "Returns the price per token for a listing, in the given currency.",
        },
        "getAllListings(uint256,uint256)": {
          notice: "Returns all non-cancelled listings.",
        },
        "getAllValidListings(uint256,uint256)": {
          notice:
            "Returns all valid listings between the start and end Id (both inclusive) provided.          A valid listing is where the listing creator still owns and has approved Marketplace          to transfer the listed NFTs.",
        },
        "getListing(uint256)": {
          notice: "Returns a listing at a particular listing ID.",
        },
        "isBuyerApprovedForListing(uint256,address)": {
          notice: "Returns whether a buyer is approved for a listing.",
        },
        "isCurrencyApprovedForListing(uint256,address)": {
          notice: "Returns whether a currency is approved for a listing.",
        },
        "totalListings()": {
          notice: "Returns the total number of listings created.",
        },
        "updateListing(uint256,(address,uint256,uint256,address,uint256,uint128,uint128,bool))":
          {
            notice: "Update parameters of a listing of NFTs.",
          },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/prebuilts/marketplace/direct-listings/DirectListingsLogic.sol":
        "DirectListingsLogic",
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
    "contracts/eip/ERC165.sol": {
      keccak256:
        "0x0ea604ea6ebe99809a2f620009c8dead82d7fb17ab12b734e1e29c8ceb85938b",
      license: "MIT",
      urls: [
        "bzz-raw://d9d109154c913e34d107db2cec5608dd8a55075dee35ae77aa78ebb9ff7d856c",
        "dweb:/ipfs/QmW8QKw4kag1Bv68FjSZiGvPP8WDocjdhLSd3ssUXZ5Kgr",
      ],
    },
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
    "contracts/extension/Multicall.sol": {
      keccak256:
        "0x737a71c74307fa360863550d64bbaef599bbcb47829b19c3743ed1ff22b9af55",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://7e82a79ee183dffa3ec01faac0907e04d72a185e55b7c24bff8e8e952b05f4c2",
        "dweb:/ipfs/QmQ9neZqpcgJtGgm84FBzMqFntZ1Sk1KFTWhjCMq8vnKDg",
      ],
    },
    "contracts/extension/interface/IContractMetadata.sol": {
      keccak256:
        "0x41d3f7f43c124e9ff0247cb94f4e8fc8c5a79b1de331c67eb03654154248d7f2",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://fa8d6251cf3a876193cc719b456c02ff23d3f2d5486431e9bdaf290be9a4ce9a",
        "dweb:/ipfs/QmRwnA2q15Vdkc66fz6BAinZM3tjuVNHn5CeGzc7ZFMAzr",
      ],
    },
    "contracts/extension/interface/IMulticall.sol": {
      keccak256:
        "0xe2bbd37b8fdb9cc8b933e598512a068ebb214b3f5abc2bc634916def55be4ef3",
      license: "MIT",
      urls: [
        "bzz-raw://012352099c262348ac755a53b082af520babc6c66dc5f1251fc23609728340ca",
        "dweb:/ipfs/QmcXEgzQ53jdJX5ZNy8zivvUjDq7J8WTnR1yAiwTpkQ2ar",
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
    "contracts/extension/interface/plugin/IPluginMap.sol": {
      keccak256:
        "0x1eea73f6be80a7e78afae80c52db9fda9c5e820a919de4313c0dad29f65c2da2",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://ac4a03221cc44b6648a1eade3ff74b9aa5eeb11a6b9965e76c72268a3997d2b4",
        "dweb:/ipfs/QmegheU9UN6Pjb3yXssK6iAaKTZMhz9NMxjEeUFgtbMuvv",
      ],
    },
    "contracts/extension/interface/plugin/IRouter.sol": {
      keccak256:
        "0xb7783d7c43d132ea2a7af584cfa90abac3236961fd5a5013afd32d4dc3f4e410",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://80b9babff66fffe78727fcc03831051595163ccbcbcd403feb78fbf7cc4cc5b2",
        "dweb:/ipfs/QmPwY7nFarVhhpPyrWk4Wy4NpeX3tDUP8S9j7Xxn3ESP5z",
      ],
    },
    "contracts/extension/plugin/ContractMetadataLogic.sol": {
      keccak256:
        "0x03b15f59bdef64105915f3a512acf05031686dc100097b302e86aa9655b1cb87",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e5699be9cee263dcbbd486d6b7c9a8f9754f154edea1828f91e1935789504a45",
        "dweb:/ipfs/QmRv9LuHjrCPHDPtoRmnJoT2hYXyaHjZGNkC8MDeyAeqtN",
      ],
    },
    "contracts/extension/plugin/ContractMetadataStorage.sol": {
      keccak256:
        "0xbbd40a6c419b4b6cb9960288c36a7891c748a292b56f7b7dcd3de7b477d76e35",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://5ac424b465fb9658910b4cf86279a5127a0fb63d8510fc8eb007b01438f0995e",
        "dweb:/ipfs/QmNP82PBoNz2qysBr4o12Nvh75SKCNaWMRYibJVPcAT7hm",
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
    "contracts/extension/plugin/ERC2771ContextUpgradeableLogic.sol": {
      keccak256:
        "0xfd9cd535c253c10a86c4a5c0ad6f14747fc0762d69f0b61c427c993927ac8fb4",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://4945cf27eca23eca0a8c64cd6471c8b30665ec15ab986a21c350f11e984b06f6",
        "dweb:/ipfs/QmaJ9FsZCYjFmB8Jpob3Nqt5EnsQXiSoWx11924pvZbhRP",
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
    "contracts/extension/plugin/PlatformFeeLogic.sol": {
      keccak256:
        "0xa89057df7e9e062f2d1c0be1e98fbc8acd8e7976f14b92ac450d0ea3868138d1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://cbcd39dd5230954786416b083bf20ee9b288c8fd57d9c4f5657455b8e4afc316",
        "dweb:/ipfs/QmTnBvuy2bVMMiRNcjSyKYeGcrQzqyxaWvv4yE6Z3sJgFq",
      ],
    },
    "contracts/extension/plugin/PlatformFeeStorage.sol": {
      keccak256:
        "0x65098ad82e9e90ad43a1bea2d326290f44611bb9a320cb16a310163efac0a696",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://da7817b134eb06afd32e3976ab133c9aeebc1862127e5788ddf4dc2d3b13cc8e",
        "dweb:/ipfs/QmeBfk9rgJ19mpQQdNgWARwSwQZJKiviP3bbhM2k26K13Z",
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
    "contracts/extension/plugin/Router.sol": {
      keccak256:
        "0x14e27c5ba756014166c8de48b49b369c0ad87b10e123a96f20393c6c709f6c87",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://93e1d860a2378e182352b23f827da03b4ca10200e957895dee97ca71cda1aef0",
        "dweb:/ipfs/QmTJskmdUdrwMppAmPY7XQTNbANzrysCfHMijQpPm9tWKX",
      ],
    },
    "contracts/extension/plugin/RouterImmutable.sol": {
      keccak256:
        "0x15ecb2f35877648ff95b9794453723987ac22eb521ea3650a0e61f25f4d32558",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6fe3496adb99e195eb45401c2f9e14c59af3ee917d9f12ce1151c6130fb6f98f",
        "dweb:/ipfs/QmRh6hS7DVs1EgtyTQTzmJcbNuD1436a1wQ86XZdsFz3Qn",
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
    "contracts/external-deps/openzeppelin/utils/EnumerableSet.sol": {
      keccak256:
        "0x5050943b32b6a8f282573d166b2e9d87ab7eb4dbba4ab6acf36ecb54fe6995e4",
      license: "MIT",
      urls: [
        "bzz-raw://d4831d777a29ebdf9f2caecd70e74b97bff1b70e53622fd0a02aed01e21c8271",
        "dweb:/ipfs/QmUqurVVnCc7XkMxb2k23TVQUtuhHZduJ3hTZarTJrqU24",
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
    "contracts/prebuilts/marketplace/direct-listings/DirectListingsLogic.sol": {
      keccak256:
        "0x2bb3b8eb79dc6b0ecff429a965aed74cb9443aedfa229e7bc6962ef301c4bd7b",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://884b5c87655a6dfcd22f78b2fee3598513ca3d224b1ffa47e912bdeaace4498a",
        "dweb:/ipfs/QmeQ2ZL34XCQEZw42KKQr5fJRReBYY1C4c8QBcyvqeMNLF",
      ],
    },
    "contracts/prebuilts/marketplace/direct-listings/DirectListingsStorage.sol":
      {
        keccak256:
          "0xc019ea31516d122a4826b6e416e762583be97ddd78fa82071636838dcde6aca1",
        license: "Apache-2.0",
        urls: [
          "bzz-raw://2daca251432458b4c763c456e44605c2f3c0763a339f736914231388e06fa9c1",
          "dweb:/ipfs/QmdknepUopF2BDVJQcYv3XoFJEA9FP1Y8kAwiY4S76jpvE",
        ],
      },
    "contracts/prebuilts/marketplace/entrypoint/InitStorage.sol": {
      keccak256:
        "0x7ee124bf16f0b2120ace929bda8efd157e15b62141d4f93cb7a3f33063b6b360",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6ebce4aef32509f479ca858be5eae56f74afed403dbed9c51a3e4a8aa9fab169",
        "dweb:/ipfs/QmRYSXuMLdZuyhG572RVLPyMCijC1XowTQKAgFRx99Kcjx",
      ],
    },
    "contracts/prebuilts/marketplace/entrypoint/MarketplaceV3.sol": {
      keccak256:
        "0xf39f9408588ab11d3efd9767cecc7614d2fa5d97350613212535a96f1c0f9974",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://0c6b0f61e3c8c876a19e4ca8e061041939e8db1259bfebe0390b8e2902b154ff",
        "dweb:/ipfs/QmUemTVojQT8MDebLGDnSYiCeUz39J13G1EFJvkBwKCcYp",
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
    "lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol": {
      keccak256:
        "0xeb373f1fdc7b755c6a750123a9b9e3a8a02c1470042fd6505d875000a80bde0b",
      license: "MIT",
      urls: [
        "bzz-raw://0e28648f994abf1d6bc345644a361cc0b7efa544f8bc0c8ec26011fed85a91ec",
        "dweb:/ipfs/QmVVE7AiRjKaQYYji7TkjmTeVzGpNmms5eoxqTCfvvpj6D",
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
    "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol": {
      keccak256:
        "0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da",
      license: "MIT",
      urls: [
        "bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708",
        "dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV",
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

export const directListingsBytecode =
  "0x60a06040523480156200001157600080fd5b50604051620040e0380380620040e0833981016040819052620000349162000046565b6001600160a01b031660805262000078565b6000602082840312156200005957600080fd5b81516001600160a01b03811681146200007157600080fd5b9392505050565b60805161404c620000946000396000612c11015261404c6000f3fe6080604052600436106100b85760003560e01c806307b67758146100bd578063107a274a146100df578063119df25f14610115578063305a67a81461013757806331654b4d1461015757806348dd77df14610184578063704232dc146101a4578063746415b5146101b75780638b49d47e146101e55780639cfbe2a614610208578063a851904714610238578063c5275fb014610258578063c78b616c14610278578063ea8f9a3c1461028d578063fb14079d146102ad575b600080fd5b3480156100c957600080fd5b506100dd6100d83660046136ea565b6102cd565b005b3480156100eb57600080fd5b506100ff6100fa366004613718565b610af0565b60405161010c9190613837565b60405180910390f35b34801561012157600080fd5b5061012a610c24565b60405161010c9190613846565b34801561014357600080fd5b506100dd610152366004613718565b610ca2565b34801561016357600080fd5b5061017761017236600461385a565b610dc3565b60405161010c919061387c565b34801561019057600080fd5b506100dd61019f3660046138cb565b6110e0565b6100dd6101b236600461390d565b61127a565b3480156101c357600080fd5b506101d76101d236600461395f565b6118c9565b60405190815260200161010c565b3480156101f157600080fd5b506101fa611de5565b60405161010c929190613978565b34801561021457600080fd5b506102286102233660046139a7565b611e80565b604051901515815260200161010c565b34801561024457600080fd5b506102286102533660046139a7565b611ebe565b34801561026457600080fd5b5061017761027336600461385a565b611ef6565b34801561028457600080fd5b506101d76120f8565b34801561029957600080fd5b506100dd6102a83660046139d7565b61210a565b3480156102b957600080fd5b506101d76102c83660046139a7565b612455565b8160006102d8612508565b90506001600083815260018301602052604090206008015462010000900460ff16600381111561030a5761030a61373e565b146103305760405162461bcd60e51b815260040161032790613a0f565b60405180910390fd5b825160405163a32fa5b360e01b8152309063a32fa5b390610377907f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae6908590600401613a46565b602060405180830381865afa158015610394573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b89190613a5d565b6103d45760405162461bcd60e51b815260040161032790613a7a565b8460006103df612508565b90506103e9610c24565b60008381526001808401602052604090912001546001600160a01b039081169116146104275760405162461bcd60e51b815260040161032790613a9f565b6000610431612508565b9050600061043d610c24565b60008a815260018085016020908152604080842081516101808101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c082015260078201546001600160801b0380821660e0840152600160801b9091041661010080830191909152600883015460ff8082161515610120850152969750949591949293610140860193919091049091169081111561050d5761050d61373e565b600181111561051e5761051e61373e565b81526020016008820160029054906101000a900460ff1660038111156105465761054661373e565b60038111156105575761055761373e565b815250509050600061056c8a6000015161252c565b9050428261010001516001600160801b0316116105cb5760405162461bcd60e51b815260206004820152601d60248201527f4d61726b6574706c6163653a206c697374696e6720657870697265642e0000006044820152606401610327565b89600001516001600160a01b031682604001516001600160a01b03161480156105fb575089602001518260600151145b6106605760405162461bcd60e51b815260206004820152603060248201527f4d61726b6574706c6163653a2063616e6e6f742075706461746520776861742060448201526f3a37b5b2b71034b9903634b9ba32b21760811b6064820152608401610327565b60a08a015160c08b01516001600160801b03808216908316106106955760405162461bcd60e51b815260040161032790613ae0565b428460e001516001600160801b031611806106d857508360e001516001600160801b0316826001600160801b03161480156106d8575042816001600160801b0316115b6107305760405162461bcd60e51b8152602060048201526024808201527f4d61726b6574706c6163653a206c697374696e6720616c72656164792061637460448201526334bb329760e11b6064820152608401610327565b8360e001516001600160801b0316826001600160801b03161415801561075e575042826001600160801b0316105b156107f3574261077083610e10613b50565b6001600160801b031610156107975760405162461bcd60e51b815260040161032790613b7b565b4291508361010001516001600160801b0316816001600160801b031614806107c757506001600160801b03818116145b6107ee578b60a001518c60c001516107df9190613bbf565b6107e99083613b50565b6107f0565b805b90505b60008660030160008f815260200190815260200160002060008e606001516001600160a01b03166001600160a01b0316815260200190815260200160002054905080600014806108465750808d60800151145b6108ab5760405162461bcd60e51b815260206004820152603060248201527f4d61726b6574706c6163653a20707269636520646966666572656e742066726f60448201526f6d20617070726f76656420707269636560801b6064820152608401610327565b506108b68c8461269b565b6040518061018001604052808e8152602001866001600160a01b031681526020018d600001516001600160a01b031681526020018d6020015181526020018d6040015181526020018d606001516001600160a01b031681526020018d608001518152602001836001600160801b03168152602001826001600160801b031681526020018d60e00151151581526020018460018111156109575761095761373e565b81526020016001905260008e815260018089016020908152604092839020845181559084015181830180546001600160a01b039283166001600160a01b03199182161790915593850151600283018054918316918616919091179055606085015160038301556080850151600483015560a08501516005830180549190921694169390931790925560c0830151600683015560e0830151610100808501516001600160801b03908116600160801b02921691909117600784015561012084015160088401805491151560ff19831681178255610140870151969a508a9694919361ff001990911661ffff199093169290921791908490811115610a5c57610a5c61373e565b021790555061016082015160088201805462ff0000191662010000836003811115610a8957610a8961373e565b02179055509050508b600001516001600160a01b03168d866001600160a01b03167f1b02bc7e37d63b0bfe14fcb365a81fbcb6671e3258bd29297461df27c4631d5587604051610ad99190613837565b60405180910390a450505050505050505050505050565b610af8613537565b6000610b02612508565b60008481526001808301602090815260409283902083516101808101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c084015260078101546001600160801b0380821660e0860152600160801b9091041661010080850191909152600882015460ff80821615156101208701529596509394919361014086019391900490911690811115610bd057610bd061373e565b6001811115610be157610be161373e565b81526020016008820160029054906101000a900460ff166003811115610c0957610c0961373e565b6003811115610c1a57610c1a61373e565b9052509392505050565b60405163572b6c0560e01b8152600090309063572b6c0590610c4a903390600401613846565b602060405180830381865afa158015610c67573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c8b9190613a5d565b15610c9d575060131936013560601c90565b503390565b806000610cad612508565b90506001600083815260018301602052604090206008015462010000900460ff166003811115610cdf57610cdf61373e565b14610cfc5760405162461bcd60e51b815260040161032790613a0f565b826000610d07612508565b9050610d11610c24565b60008381526001808401602052604090912001546001600160a01b03908116911614610d4f5760405162461bcd60e51b815260040161032790613a9f565b6000610d59612508565b60008781526001820160205260409020600801805462ff0000191662030000179055905085610d86610c24565b6001600160a01b03167ff6e9b23c95dec70093b0abc1cf13bc5d35c9af03743f941904a4ef664e0119fb60405160405180910390a3505050505050565b60606000610dcf612508565b9050828411158015610de15750805483105b610dfd5760405162461bcd60e51b815260040161032790613be7565b6000610e098585613c0e565b610e14906001613c25565b6001600160401b03811115610e2b57610e2b61359a565b604051908082528060200260200182016040528015610e6457816020015b610e51613537565b815260200190600190039081610e495790505b5090506000855b858111610fff5760008181526001808601602090815260409283902083516101808101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c084015260078101546001600160801b0380821660e0860152600160801b9091041661010080850191909152600882015460ff808216151561012087015292936101408601939290910490911690811115610f3c57610f3c61373e565b6001811115610f4d57610f4d61373e565b81526020016008820160029054906101000a900460ff166003811115610f7557610f7561373e565b6003811115610f8657610f8661373e565b90525083610f948984613c0e565b81518110610fa457610fa4613c3d565b6020908102919091010152610fda83610fbd8984613c0e565b81518110610fcd57610fcd613c3d565b60200260200101516127b7565b15610fed57610fea600183613c25565b91505b610ff8600182613c25565b9050610e6b565b50806001600160401b038111156110185761101861359a565b60405190808252806020026020018201604052801561105157816020015b61103e613537565b8152602001906001900390816110365790505b508251909450600090815b818110156110d457611079858281518110610fcd57610fcd613c3d565b156110c25784818151811061109057611090613c3d565b60200260200101518784806110a490613c53565b9550815181106110b6576110b6613c3d565b60200260200101819052505b6110cd600182613c25565b905061105c565b50505050505092915050565b8260006110eb612508565b90506001600083815260018301602052604090206008015462010000900460ff16600381111561111d5761111d61373e565b1461113a5760405162461bcd60e51b815260040161032790613a0f565b846000611145612508565b905061114f610c24565b60008381526001808401602052604090912001546001600160a01b0390811691161461118d5760405162461bcd60e51b815260040161032790613a9f565b6000611197612508565b600089815260018201602052604090206008015490915060ff166112085760405162461bcd60e51b815260206004820152602260248201527f4d61726b6574706c6163653a206c697374696e67206e6f742072657365727665604482015261321760f11b6064820152608401610327565b600088815260028201602090815260408083206001600160a01b038b1680855290835292819020805460ff19168a151590811790915590519081528a917f3b557e1ed3b963f7473508fd10c6d7248b593c0dde6acd2a566b92caec84038a910160405180910390a35050505050505050565b7fbbf78d3411d42a81effd97bb8c69faae4e77e75cec462245c1001191a0634c6f8054600214156112ed5760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610327565b600281558560006112fc612508565b90506001600083815260018301602052604090206008015462010000900460ff16600381111561132e5761132e61373e565b1461134b5760405162461bcd60e51b815260040161032790613a0f565b6000611355612508565b60008a815260018083016020908152604080842081516101808101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c082015260078201546001600160801b0380821660e0840152600160801b9091041661010080830191909152600883015460ff808216151561012085015296975094959194929361014086019391909104909116908111156114255761142561373e565b60018111156114365761143661373e565b81526020016008820160029054906101000a900460ff16600381111561145e5761145e61373e565b600381111561146f5761146f61373e565b9052509050600061147e610c24565b905081610120015115806114b6575060008b815260028401602090815260408083206001600160a01b038516845290915290205460ff165b6114f75760405162461bcd60e51b8152602060048201526012602482015271189d5e595c881b9bdd08185c1c1c9bdd995960721b6044820152606401610327565b60008911801561150b575081608001518911155b6115515760405162461bcd60e51b8152602060048201526017602482015276427579696e6720696e76616c6964207175616e7469747960481b6044820152606401610327565b8161010001516001600160801b03164210801561157b57508160e001516001600160801b03164210155b6115c15760405162461bcd60e51b81526020600482015260176024820152763737ba103bb4ba3434b71039b0b632903bb4b73237bb9760491b6044820152606401610327565b6115df8260200151836040015184606001518c86610140015161282a565b6115fb5760405162461bcd60e51b815260040161032790613c6e565b60008b815260038401602090815260408083206001600160a01b038c1684529091528120541561165b5760008c815260038501602090815260408083206001600160a01b038d168452909152902054611654908b613cb8565b90506116d0565b8260a001516001600160a01b0316896001600160a01b0316146116be5760405162461bcd60e51b815260206004820152601b60248201527a2830bcb4b7339034b71034b73b30b634b21031bab93932b731bc9760291b6044820152606401610327565b60c08301516116cd908b613cb8565b90505b8781146117185760405162461bcd60e51b8152602060048201526016602482015275556e657870656374656420746f74616c20707269636560501b6044820152606401610327565b6001600160a01b03891673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee14156117b1578034146117ac5760405162461bcd60e51b815260206004820152603760248201527f4d61726b6574706c6163653a206d73672e76616c7565206d75737420657861636044820152763a363c903132903a3432903a37ba30b610383934b1b29760491b6064820152608401610327565b6117bc565b6117bc828a83612ae7565b89836080015114156117eb5760008c81526001850160205260409020600801805462ff00001916620200001790555b60008c8152600185016020526040812060040180548c929061180e908490613c0e565b925050819055506118268284602001518b8487612c0d565b61183683602001518c8c86612e38565b82604001516001600160a01b0316836000015184602001516001600160a01b03167ff6e03f1c408cfd2d118397c912a4b576683c43b41b015e3d7c212bac0cd0e7c78660600151868f876040516118af94939291909384526001600160a01b039290921660208401526040830152606082015260800190565b60405180910390a450506001909455505050505050505050565b60003063a32fa5b37ff94103142c1baabe9ac2b5d1487bf783de9e69cfeea9a72f5c9c94afd7877b8c6118fa610c24565b6040518363ffffffff1660e01b8152600401611917929190613a46565b602060405180830381865afa158015611934573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119589190613a5d565b6119935760405162461bcd60e51b815260206004820152600c60248201526b214c49535445525f524f4c4560a01b6044820152606401610327565b6119a06020830183613cd7565b60405163a32fa5b360e01b8152309063a32fa5b3906119e5907f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae6908590600401613a46565b602060405180830381865afa158015611a02573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a269190613a5d565b611a425760405162461bcd60e51b815260040161032790613a7a565b611a4a612f8f565b91506000611a56610c24565b90506000611a6f611a6a6020870187613cd7565b61252c565b90506000611a8360c0870160a08801613cf4565b90506000611a9760e0880160c08901613cf4565b9050806001600160801b0316826001600160801b031610611aca5760405162461bcd60e51b815260040161032790613ae0565b42826001600160801b03161015611b605742611ae883610e10613b50565b6001600160801b03161015611b0f5760405162461bcd60e51b815260040161032790613b7b565b4291506001600160801b0381811614611b5b57611b3260c0880160a08901613cf4565b611b4260e0890160c08a01613cf4565b611b4c9190613bbf565b611b569083613b50565b611b5d565b805b90505b611b78611b7236899003890189613d0f565b8461269b565b6000604051806101800160405280888152602001866001600160a01b03168152602001896000016020810190611bae9190613cd7565b6001600160a01b031681526020018960200135815260200189604001358152602001896060016020810190611be39190613cd7565b6001600160a01b031681526080808b013560208301526001600160801b0380871660408401528516606083015201611c226101008b0160e08c01613d2c565b15158152602001856001811115611c3b57611c3b61373e565b81526020016001905290506000611c50612508565b600089815260018083016020908152604092839020865181559086015181830180546001600160a01b039283166001600160a01b03199182161790915593870151600283018054918316918616919091179055606087015160038301556080870151600483015560a08701516005830180549190921694169390931790925560c0850151600683015560e0850151610100808701516001600160801b03908116600160801b02921691909117600784015561012086015160088401805491151560ff19831681178255610140890151969750889694919361ff001990911661ffff199093169290921791908490811115611d4c57611d4c61373e565b021790555061016082015160088201805462ff0000191662010000836003811115611d7957611d7961373e565b0217905550611d8e91505060208a018a613cd7565b6001600160a01b031688876001600160a01b03167f8f149f1b5fc14b27b6526b740dd7ab3a029263d44dbb17024915a55047940ab485604051611dd19190613837565b60405180910390a450505050505050919050565b60405163572b6c0560e01b81523690600090309063572b6c0590611e0d903390600401613846565b602060405180830381865afa158015611e2a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e4e9190613a5d565b15611e775760008036611e62601482613c0e565b92611e6f93929190613d49565b915091509091565b50600091369150565b600080611e8b612508565b60008581526002909101602090815260408083206001600160a01b038716845290915290205460ff169150505b92915050565b600080611ec9612508565b6000948552600301602090815260408086206001600160a01b039590951686529390525050902054151590565b60606000611f02612508565b9050828411158015611f145750805483105b611f305760405162461bcd60e51b815260040161032790613be7565b611f3a8484613c0e565b611f45906001613c25565b6001600160401b03811115611f5c57611f5c61359a565b604051908082528060200260200182016040528015611f9557816020015b611f82613537565b815260200190600190039081611f7a5790505b509150835b8381116120f05760008181526001808401602090815260409283902083516101808101855281548152818401546001600160a01b039081169382019390935260028201548316948101949094526003810154606085015260048101546080850152600581015490911660a0840152600681015460c084015260078101546001600160801b0380821660e0860152600160801b9091041661010080850191909152600882015460ff80821615156101208701529293610140860193929091049091169081111561206b5761206b61373e565b600181111561207c5761207c61373e565b81526020016008820160029054906101000a900460ff1660038111156120a4576120a461373e565b60038111156120b5576120b561373e565b905250836120c38784613c0e565b815181106120d3576120d3613c3d565b60209081029190910101526120e9600182613c25565b9050611f9a565b505092915050565b600080612103612508565b5492915050565b826000612115612508565b90506001600083815260018301602052604090206008015462010000900460ff1660038111156121475761214761373e565b146121645760405162461bcd60e51b815260040161032790613a0f565b84600061216f612508565b9050612179610c24565b60008381526001808401602052604090912001546001600160a01b039081169116146121b75760405162461bcd60e51b815260040161032790613a9f565b60006121c1612508565b600089815260018083016020908152604080842081516101808101835281548152818501546001600160a01b039081169482019490945260028201548416928101929092526003810154606083015260048101546080830152600581015490921660a0820152600682015460c082015260078201546001600160801b0380821660e0840152600160801b9091041661010080830191909152600883015460ff808216151561012085015296975094959194929361014086019391909104909116908111156122915761229161373e565b60018111156122a2576122a261373e565b81526020016008820160029054906101000a900460ff1660038111156122ca576122ca61373e565b60038111156122db576122db61373e565b8152505090508060a001516001600160a01b0316886001600160a01b031614158061230957508060c0015187145b61237b5760405162461bcd60e51b815260206004820152603d60248201527f4d61726b6574706c6163653a20617070726f76696e67206c697374696e67206360448201527f757272656e6379207769746820646966666572656e742070726963652e0000006064820152608401610327565b600089815260038301602090815260408083206001600160a01b038c1684529091529020548714156123ef5760405162461bcd60e51b815260206004820152601d60248201527f4d61726b6574706c6163653a20707269636520756e6368616e6765642e0000006044820152606401610327565b600089815260038301602090815260408083206001600160a01b038c16808552908352928190208a9055518981528b917f928cc552fea23b15fbd5c6b45fbfc5935c5b4a6397d7fdab884164648a777cf2910160405180910390a3505050505050505050565b600080612460612508565b600085815260038201602090815260408083206001600160a01b03881684529091529020549091506124de5760405162461bcd60e51b815260206004820152602160248201527f43757272656e6379206e6f7420617070726f76656420666f72206c697374696e6044820152606760f81b6064820152608401610327565b6000938452600301602090815260408085206001600160a01b039490941685529290525090205490565b7fbde2ebd6fd7bed2358dd7ed448613644a3349ac97dd3e0ae2ccd1f11b3ebe61390565b6040516301ffc9a760e01b81526000906001600160a01b038316906301ffc9a79061256290636cdb3d1360e11b90600401613d73565b602060405180830381865afa15801561257f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125a39190613a5d565b156125b057506001919050565b6040516301ffc9a760e01b81526001600160a01b038316906301ffc9a7906125e3906380ac58cd60e01b90600401613d73565b602060405180830381865afa158015612600573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906126249190613a5d565b1561263157506000919050565b60405162461bcd60e51b815260206004820152603460248201527f4d61726b6574706c6163653a206c697374656420746f6b656e206d7573742062604482015273329022a92198989a9a9037b91022a9219b99189760611b6064820152608401610327565b919050565b60008260400151116126fb5760405162461bcd60e51b815260206004820152602360248201527f4d61726b6574706c6163653a206c697374696e67207a65726f207175616e74696044820152623a3c9760e91b6064820152608401610327565b81604001516001148061271f5750600181600181111561271d5761271d61373e565b145b61277a5760405162461bcd60e51b815260206004820152602660248201527f4d61726b6574706c6163653a206c697374696e6720696e76616c696420717561604482015265373a34ba3c9760d11b6064820152608401610327565b612797612785610c24565b8351602085015160408601518561282a565b6127b35760405162461bcd60e51b815260040161032790613c6e565b5050565b6000428260e001516001600160801b0316111580156127e35750428261010001516001600160801b0316115b80156128055750600182610160015160038111156128035761280361373e565b145b8015611eb85750611eb882602001518360400151846060015185608001518661014001515b60003060018360018111156128415761284161373e565b141561293557604051627eeac760e11b815284906001600160a01b0388169062fdd58e90612875908b908a90600401613d88565b602060405180830381865afa158015612892573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128b69190613da1565b1015801561292e575060405163e985e9c560e01b81526001600160a01b0387169063e985e9c5906128ed908a908590600401613dba565b602060405180830381865afa15801561290a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061292e9190613a5d565b9150612add565b60008360018111156129495761294961373e565b1415612add576040516331a9108f60e11b81526004810186905260009081906001600160a01b03891690636352211e90602401602060405180830381865afa9250505080156129b5575060408051601f3d908101601f191682019092526129b291810190613dd4565b60015b6129be57612a32565b60405163020604bf60e21b81526004810189905290925082906001600160a01b038a169063081812fc90602401602060405180830381865afa925050508015612a24575060408051601f3d908101601f19168201909252612a2191810190613dd4565b60015b612a2d57612a30565b91505b505b886001600160a01b0316826001600160a01b0316148015612ad85750826001600160a01b0316816001600160a01b03161480612ad8575060405163e985e9c560e01b81526001600160a01b0389169063e985e9c590612a97908c908790600401613dba565b602060405180830381865afa158015612ab4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ad89190613a5d565b935050505b5095945050505050565b6040516370a0823160e01b815281906001600160a01b038416906370a0823190612b15908790600401613846565b602060405180830381865afa158015612b32573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b569190613da1565b10158015612bd35750604051636eb1769f60e11b815281906001600160a01b0384169063dd62ed3e90612b8f9087903090600401613dba565b602060405180830381865afa158015612bac573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612bd09190613da1565b10155b612c085760405162461bcd60e51b815260206004820152600660248201526502142414c32360d41b6044820152606401610327565b505050565b60007f000000000000000000000000000000000000000000000000000000000000000090506000806000306001600160a01b031663d45573f66040518163ffffffff1660e01b81526004016040805180830381865afa158015612c74573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c989190613df1565b90925090506000612710612cb061ffff841689613cb8565b612cba9190613e27565b9050612cc9888b858489612fba565b612cd38188613c0e565b60408781015160608901519151637a99dc0160e11b81526001600160a01b0390911660048201526024810191909152604481018990529094506000935083925030915063f533b802906064016000604051808303816000875af1158015612d3e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052612d669190810190613ed7565b815191935091508015612e1f5760008060005b83811015612e1b57858181518110612d9357612d93613c3d565b60200260200101519150848181518110612daf57612daf613c3d565b6020026020010151925082871015612e015760405162461bcd60e51b815260206004820152601560248201527466656573206578636565642074686520707269636560581b6044820152606401610327565b612e0e8b8e84868c612fba565b9582900395600101612d79565b5050505b505050612e2f8588888486612fba565b50505050505050565b60018161014001516001811115612e5157612e5161373e565b1415612ee65760408082015160608301519151637921219560e11b81526001600160a01b038781166004830152868116602483015260448201939093526064810185905260a06084820152600060a482015291169063f242432a9060c401600060405180830381600087803b158015612ec957600080fd5b505af1158015612edd573d6000803e3d6000fd5b50505050612f89565b60008161014001516001811115612eff57612eff61373e565b1415612f895760408082015160608301519151635c46a7ef60e11b81526001600160a01b03878116600483015286811660248301526044820193909352608060648201526000608482015291169063b88d4fde9060a401600060405180830381600087803b158015612f7057600080fd5b505af1158015612f84573d6000803e3d6000fd5b505050505b50505050565b600080612f9a612508565b8054925090506001816000612faf8386613c25565b925050819055505090565b81612fc45761312a565b6001600160a01b03851673eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee141561311e576001600160a01b03841630141561306457604051632e1a7d4d60e01b8152600481018390526001600160a01b03821690632e1a7d4d90602401600060405180830381600087803b15801561303c57600080fd5b505af1158015613050573d6000803e3d6000fd5b5050505061305f838383613131565b61312a565b6001600160a01b038316301415613113573482146130ba5760405162461bcd60e51b81526020600482015260136024820152721b5cd9cb9d985b1d5948084f48185b5bdd5b9d606a1b6044820152606401610327565b806001600160a01b031663d0e30db0836040518263ffffffff1660e01b81526004016000604051808303818588803b1580156130f557600080fd5b505af1158015613109573d6000803e3d6000fd5b505050505061312a565b61305f838383613131565b61312a858585856131f6565b5050505050565b6000836001600160a01b03168360405160006040518083038185875af1925050503d806000811461317e576040519150601f19603f3d011682016040523d82523d6000602084013e613183565b606091505b5050905080612f8957816001600160a01b031663d0e30db0846040518263ffffffff1660e01b81526004016000604051808303818588803b1580156131c757600080fd5b505af11580156131db573d6000803e3d6000fd5b50612f89935050506001600160a01b03841690508585613254565b816001600160a01b0316836001600160a01b0316141561321557612f89565b6001600160a01b03831630141561323f5761323a6001600160a01b0385168383613254565b612f89565b612f896001600160a01b0385168484846132aa565b612c088363a9059cbb60e01b8484604051602401613273929190613d88565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526132e2565b6040516001600160a01b0380851660248301528316604482015260648101829052612f899085906323b872dd60e01b90608401613273565b6000613337826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166133b49092919063ffffffff16565b805190915015612c0857808060200190518101906133559190613a5d565b612c085760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610327565b60606133c384846000856133cd565b90505b9392505050565b60608247101561342e5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b6064820152608401610327565b6001600160a01b0385163b6134855760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610327565b600080866001600160a01b031685876040516134a19190613fc7565b60006040518083038185875af1925050503d80600081146134de576040519150601f19603f3d011682016040523d82523d6000602084013e6134e3565b606091505b50915091506134f38282866134fe565b979650505050505050565b6060831561350d5750816133c6565b82511561351d5782518084602001fd5b8160405162461bcd60e51b81526004016103279190613fe3565b6040805161018081018252600080825260208201819052918101829052606081018290526080810182905260a0810182905260c0810182905260e08101829052610100810182905261012081018290529061014082019081526020016000905290565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156135d8576135d861359a565b604052919050565b6001600160a01b03811681146135f557600080fd5b50565b8035612696816135e0565b80356001600160801b038116811461269657600080fd5b80151581146135f557600080fd5b80356126968161361a565b600061010080838503121561364757600080fd5b604051908101906001600160401b03821181831017156136695761366961359a565b816040528092508335915061367d826135e0565b81815260208401356020820152604084013560408201526136a0606085016135f8565b6060820152608084013560808201526136bb60a08501613603565b60a08201526136cc60c08501613603565b60c08201526136dd60e08501613628565b60e0820152505092915050565b60008061012083850312156136fe57600080fd5b8235915061370f8460208501613633565b90509250929050565b60006020828403121561372a57600080fd5b5035919050565b6001600160a01b03169052565b634e487b7160e01b600052602160045260246000fd5b600281106137645761376461373e565b9052565b600481106137645761376461373e565b80518252602081015161378e6020840182613731565b5060408101516137a16040840182613731565b50606081015160608301526080810151608083015260a08101516137c860a0840182613731565b5060c081015160c083015260e08101516137ed60e08401826001600160801b03169052565b50610100818101516001600160801b031690830152610120808201511515908301526101408082015161382282850182613754565b505061016080820151612f8982850182613768565b6101808101611eb88284613778565b6001600160a01b0391909116815260200190565b6000806040838503121561386d57600080fd5b50508035926020909101359150565b6020808252825182820181905260009190848201906040850190845b818110156138bf576138ab838551613778565b928401926101809290920191600101613898565b50909695505050505050565b6000806000606084860312156138e057600080fd5b8335925060208401356138f2816135e0565b915060408401356139028161361a565b809150509250925092565b600080600080600060a0868803121561392557600080fd5b853594506020860135613937816135e0565b935060408601359250606086013561394e816135e0565b949793965091946080013592915050565b6000610100828403121561397257600080fd5b50919050565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b600080604083850312156139ba57600080fd5b8235915060208301356139cc816135e0565b809150509250929050565b6000806000606084860312156139ec57600080fd5b8335925060208401356139fe816135e0565b929592945050506040919091013590565b6020808252601d908201527f4d61726b6574706c6163653a20696e76616c6964206c697374696e672e000000604082015260600190565b9182526001600160a01b0316602082015260400190565b600060208284031215613a6f57600080fd5b81516133c68161361a565b6020808252600b908201526a2141535345545f524f4c4560a81b604082015260600190565b60208082526021908201527f4d61726b6574706c6163653a206e6f74206c697374696e672063726561746f726040820152601760f91b606082015260800190565b6020808252603a908201527f4d61726b6574706c6163653a20656e6454696d657374616d70206e6f7420677260408201527932b0ba32b9103a3430b71039ba30b93a2a34b6b2b9ba30b6b81760311b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60006001600160801b03828116848216808303821115613b7257613b72613b3a565b01949350505050565b60208082526024908201527f4d61726b6574706c6163653a20696e76616c696420737461727454696d65737460408201526330b6b81760e11b606082015260800190565b60006001600160801b0383811690831681811015613bdf57613bdf613b3a565b039392505050565b6020808252600d908201526c696e76616c69642072616e676560981b604082015260600190565b600082821015613c2057613c20613b3a565b500390565b60008219821115613c3857613c38613b3a565b500190565b634e487b7160e01b600052603260045260246000fd5b6000600019821415613c6757613c67613b3a565b5060010190565b6020808252602a908201527f4d61726b6574706c6163653a206e6f74206f776e6572206f7220617070726f7660408201526932b2103a37b5b2b7399760b11b606082015260800190565b6000816000190483118215151615613cd257613cd2613b3a565b500290565b600060208284031215613ce957600080fd5b81356133c6816135e0565b600060208284031215613d0657600080fd5b6133c682613603565b60006101008284031215613d2257600080fd5b6133c68383613633565b600060208284031215613d3e57600080fd5b81356133c68161361a565b60008085851115613d5957600080fd5b83861115613d6657600080fd5b5050820193919092039150565b6001600160e01b031991909116815260200190565b6001600160a01b03929092168252602082015260400190565b600060208284031215613db357600080fd5b5051919050565b6001600160a01b0392831681529116602082015260400190565b600060208284031215613de657600080fd5b81516133c6816135e0565b60008060408385031215613e0457600080fd5b8251613e0f816135e0565b602084015190925061ffff811681146139cc57600080fd5b600082613e4457634e487b7160e01b600052601260045260246000fd5b500490565b60006001600160401b03821115613e6257613e6261359a565b5060051b60200190565b600082601f830112613e7d57600080fd5b81516020613e92613e8d83613e49565b6135b0565b82815260059290921b84018101918181019086841115613eb157600080fd5b8286015b84811015613ecc5780518352918301918301613eb5565b509695505050505050565b60008060408385031215613eea57600080fd5b82516001600160401b0380821115613f0157600080fd5b818501915085601f830112613f1557600080fd5b81516020613f25613e8d83613e49565b82815260059290921b84018101918181019089841115613f4457600080fd5b948201945b83861015613f6b578551613f5c816135e0565b82529482019490820190613f49565b91880151919650909350505080821115613f8457600080fd5b50613f9185828601613e6c565b9150509250929050565b60005b83811015613fb6578181015183820152602001613f9e565b83811115612f895750506000910152565b60008251613fd9818460208701613f9b565b9190910192915050565b6020815260008251806020840152614002816040850160208701613f9b565b601f01601f1916919091016040019291505056fea2646970667358221220e25be3991868135a82eb987cc6f410a1cf05ec1a162b6360c775a291f4305b0f64736f6c634300080c0033";
