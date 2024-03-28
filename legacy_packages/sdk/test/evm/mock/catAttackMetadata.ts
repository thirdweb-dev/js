export const catAttackMetadata = {
  compiler: {
    version: "0.8.13+commit.abaa5c0e",
  },
  language: "Solidity",
  output: {
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "bytes4",
            name: "test",
            type: "bytes4",
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
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "_approved",
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
            indexed: true,
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
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
        ],
        name: "LevelUp",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "attacker",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "victim",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "level",
            type: "uint256",
          },
        ],
        name: "Miaowed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            indexed: true,
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
            indexed: true,
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
            internalType: "uint256",
            name: "startTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "endTokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "baseURI",
            type: "string",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "encryptedBaseURI",
            type: "bytes",
          },
        ],
        name: "TokensLazyMinted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "_ids",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "_values",
            type: "uint256[]",
          },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "_value",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "victim",
            type: "address",
          },
        ],
        name: "attack",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
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
            internalType: "address[]",
            name: "accounts",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
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
            internalType: "uint256[]",
            name: "_tokenIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "_amounts",
            type: "uint256[]",
          },
        ],
        name: "burnBatch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_receiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
        ],
        name: "claim",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "claimKitten",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "getBaseURICount",
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
            name: "_index",
            type: "uint256",
          },
        ],
        name: "getBatchIdAtIndex",
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
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
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
        inputs: [],
        name: "isGamePaused",
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
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_baseURIForTokens",
            type: "string",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "lazyMint",
        outputs: [
          {
            internalType: "uint256",
            name: "batchId",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes[]",
            name: "data",
            type: "bytes[]",
          },
        ],
        name: "multicall",
        outputs: [
          {
            internalType: "bytes[]",
            name: "results",
            type: "bytes[]",
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
        name: "nextTokenIdToMint",
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
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeBatchTransferFrom",
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
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
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
        inputs: [],
        name: "startGame",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "stopGame",
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
            name: "",
            type: "uint256",
          },
        ],
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
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
        ],
        name: "uri",
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
            internalType: "address",
            name: "_claimer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_quantity",
            type: "uint256",
          },
        ],
        name: "verifyClaim",
        outputs: [],
        stateMutability: "view",
        type: "function",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "burnBatch(address,uint256[],uint256[])": {
          params: {
            _amounts: "The amounts of the NFTs to burn.",
            _owner: "The owner of the NFTs to burn.",
            _tokenIds: "The tokenIds of the NFTs to burn.",
          },
        },
        "claim(address,uint256,uint256)": {
          details:
            "The logic in the `verifyClaim` function determines whether the caller is authorized to mint NFTs.",
          params: {
            _quantity: "The number of tokens to mint.",
            _receiver: "The recipient of the tokens to mint.",
            _tokenId: "The tokenId of the lazy minted NFT to mint.",
          },
        },
        "getBaseURICount()": {
          details:
            "Each batch of tokens has an in ID and an associated `baseURI`.                  See {batchIds}.",
        },
        "getBatchIdAtIndex(uint256)": {
          details: "See {getBaseURICount}.",
          params: {
            _index: "ID of a token.",
          },
        },
        "getRoyaltyInfoForToken(uint256)": {
          details: "Returns royalty recipient and bps for `_tokenId`.",
          params: {
            _tokenId: "The tokenID of the NFT for which to query royalty info.",
          },
        },
        "lazyMint(uint256,string,bytes)": {
          params: {
            _amount: "The number of NFTs to lazy mint.",
            _baseURIForTokens:
              "The base URI for the 'n' number of NFTs being lazy minted, where the metadata for each                           of those NFTs is `${baseURIForTokens}/${tokenId}`.",
            _data:
              "Additional bytes data to be used at the discretion of the consumer of the contract.",
          },
          returns: {
            batchId:
              "         A unique integer identifier for the batch of NFTs lazy minted together.",
          },
        },
        "multicall(bytes[])": {
          details:
            "Receives and executes a batch of function calls on this contract.",
          params: {
            data: "The bytes data that makes up the batch of function calls to execute.",
          },
          returns: {
            results:
              "The bytes data that makes up the result of the batch of function calls executed.",
          },
        },
        "royaltyInfo(uint256,uint256)": {
          details:
            "Returns royalty amount and recipient for `tokenId` and `salePrice`.",
          params: {
            salePrice: "Sale price of the token.",
            tokenId: "The tokenID of the NFT for which to query royalty info.",
          },
          returns: {
            receiver: "       Address of royalty recipient account.",
            royaltyAmount:
              "  Royalty amount calculated at current royaltyBps value.",
          },
        },
        "setContractURI(string)": {
          details:
            "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
          params: {
            _uri: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "setDefaultRoyaltyInfo(address,uint256)": {
          details:
            "Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {DefaultRoyalty Event}; See {_setupDefaultRoyaltyInfo}.",
          params: {
            _royaltyBps: "Updated royalty bps.",
            _royaltyRecipient:
              "Address to be set as default royalty recipient.",
          },
        },
        "setOwner(address)": {
          params: {
            _newOwner: "The address to set as the new owner of the contract.",
          },
        },
        "setRoyaltyInfoForToken(uint256,address,uint256)": {
          details:
            "Sets royalty info for `_tokenId`. Caller should be authorized to set royalty info.                  See {_canSetRoyaltyInfo}.                  Emits {RoyaltyForToken Event}; See {_setupRoyaltyInfoForToken}.",
          params: {
            _bps: "Updated royalty bps for the token Id.",
            _recipient:
              "Address to be set as royalty recipient for given token Id.",
          },
        },
        "verifyClaim(address,uint256,uint256)": {
          details: "Checks a request to claim NFTs against a custom condition.",
          params: {
            _claimer: "Caller of the claim function.",
            _quantity: "The number of NFTs being claimed.",
            _tokenId: "The tokenId of the lazy minted NFT to mint.",
          },
        },
      },
      title:
        "CatAttackNFT - The game contract for https://catattacknft.vercel.app/",
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "attack(address)": {
          notice:
            "Lets a Ninja cat owner attack another user's to burn their cats",
        },
        "balanceOf(address,uint256)": {
          notice: "Get the balance of an account's Tokens.",
        },
        "burn(address,uint256,uint256)": {
          notice: "Burn a cat to either level up or attack another cat",
        },
        "burnBatch(address,uint256[],uint256[])": {
          notice:
            "Lets an owner or approved operator burn NFTs of the given tokenIds.",
        },
        "claim(address,uint256,uint256)": {
          notice:
            "Lets an address claim multiple lazy minted NFTs at once to a recipient.                   Contract creators should override this function to create custom logic for claiming,                   for e.g. price collection, allowlist, max quantity, etc.",
        },
        "claimKitten()": {
          notice:
            "Claim a kitten to start playing, but only if you don't already own a cat",
        },
        "contractURI()": {
          notice: "Returns the contract metadata URI.",
        },
        "getBaseURICount()": {
          notice: "Returns the count of batches of NFTs.",
        },
        "getBatchIdAtIndex(uint256)": {
          notice:
            "Returns the ID for the batch of tokens the given tokenId belongs to.",
        },
        "getDefaultRoyaltyInfo()": {
          notice:
            "Returns the defualt royalty recipient and BPS for this contract's NFTs.",
        },
        "getRoyaltyInfoForToken(uint256)": {
          notice: "View royalty info for a given token.",
        },
        "isApprovedForAll(address,address)": {
          notice:
            "Queries the approval status of an operator for a given owner.",
        },
        "lazyMint(uint256,string,bytes)": {
          notice:
            "Lets an authorized address lazy mint a given amount of NFTs.",
        },
        "multicall(bytes[])": {
          notice:
            "Receives and executes a batch of function calls on this contract.",
        },
        "nextTokenIdToMint()": {
          notice: "The tokenId assigned to the next new NFT to be lazy minted.",
        },
        "owner()": {
          notice: "Returns the owner of the contract.",
        },
        "royaltyInfo(uint256,uint256)": {
          notice: "View royalty info for a given token and sale price.",
        },
        "safeTransferFrom(address,address,uint256,uint256,bytes)": {
          notice: "Transfer cats to level up",
        },
        "setContractURI(string)": {
          notice:
            "Lets a contract admin set the URI for contract-level metadata.",
        },
        "setDefaultRoyaltyInfo(address,uint256)": {
          notice: "Updates default royalty recipient and bps.",
        },
        "setOwner(address)": {
          notice: "Lets an authorized wallet set a new owner for the contract.",
        },
        "setRoyaltyInfoForToken(uint256,address,uint256)": {
          notice:
            "Updates default royalty recipient and bps for a particular token.",
        },
        "startGame()": {
          notice: "Lets the owner restart the game",
        },
        "stopGame()": {
          notice: "Lets the owner pause the game",
        },
        "supportsInterface(bytes4)": {
          notice: "Returns whether this contract supports the given interface.",
        },
        "totalSupply(uint256)": {
          notice: "Returns the total supply of NFTs of a given tokenId",
        },
        "uri(uint256)": {
          notice: "Returns the metadata URI for the given tokenId.",
        },
        "verifyClaim(address,uint256,uint256)": {
          notice:
            "Override this function to add logic for claim verification, based on conditions                   such as allowlist, price, max quantity etc.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/CatAttackNFT.sol": "CatAttackNFT",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
    remappings: [
      ":@thirdweb-dev/=node_modules/@thirdweb-dev/",
      ":ds-test/=lib/forge-std/lib/ds-test/src/",
      ":forge-std/=lib/forge-std/src/",
    ],
  },
  sources: {
    "node_modules/@thirdweb-dev/contracts/base/ERC1155LazyMint.sol": {
      keccak256:
        "0x416b224a921062f088c0657fcb464f47977df0b4efc978a512e00a540c8d7de1",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b972cd3450e5559c3dd87de89b2d332b3b1af2e88d43c882cd39f4a43b3cf2d2",
        "dweb:/ipfs/Qmeejpx3FzgaLPAbMQQJyzVC6kdEvxWCs6UaipSEFthf9V",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/ERC1155.sol": {
      keccak256:
        "0x378fcbe3a191a44060f66b2b2932391cbf31f945039087b9024bb2eee91ba5b6",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://f36697fa07898c79d77d0b294849de4eab4b6d24679c33f0b448b8d82e172f4b",
        "dweb:/ipfs/QmZ8jqskjHnjHuoDqa9dQdP6KrRDyHcvBKVDZZNXX9e7bS",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/interface/IERC1155.sol": {
      keccak256:
        "0x17c265f3f47161c9d2f6c7f7f4040440df9ad4cd7eb74eb411bf25a94b542f9e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://c4f468eb184f2a08909834b51e33e854741647f9798aa1e6746f3f1b69525552",
        "dweb:/ipfs/QmbCMy9vJLga2dCxGG6nXW7VKGqsMrzU8phPhcd58xkapq",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/interface/IERC1155Metadata.sol": {
      keccak256:
        "0xe9d530111d75c5d6db4ca4f30dd76d6a29d9363ab7390e922942a0fc9e3ce32e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8272be1ca643bd3038fd67b00acad09a8dca44536284bcca6b862d09f8b53e43",
        "dweb:/ipfs/Qme9wiWPDfh36xm7TNaxpAYxv5jAptMNLtYksRwc5zNFbU",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/interface/IERC1155Receiver.sol": {
      keccak256:
        "0xfef511c703e7ebdb193d35a67e0d9b70728789b2ac45cc5cf5ee56c4ad034f00",
      license: "MIT",
      urls: [
        "bzz-raw://f838e560ba0caddc54ad4ba082e0ff3bf27a721c15bc0cf19791fef7940837a5",
        "dweb:/ipfs/QmTwfwYYK4Ky9PPhdDoVVmZJaJ7y2hZDH8YnBQRfiA8Baz",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/interface/IERC165.sol": {
      keccak256:
        "0x35d0a916f70344a5fcc6c67cb531b6150d2fce43e72a6282385eab02020f2f49",
      license: "MIT",
      urls: [
        "bzz-raw://75ccd8b9a8b52a93b8097fcb8181b7afb6d72bbe6eaabf434f0481a7a207cc8a",
        "dweb:/ipfs/QmPUZAEE4nwkijcE2amAXAWEVGVG5XaKWGhpgnRwpAf93R",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/eip/interface/IERC2981.sol": {
      keccak256:
        "0x7886c17b1bc3df885201378fd070d2f00d05fa54f20f7daf10382ec6ff4bd0c9",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://a0802623ba9555f6d186bab5fd139203b643e88ea31d78f4f05cddd4008ac6cf",
        "dweb:/ipfs/QmYbqzSKkKmF2xYeH1zGNewBDNAhukuaZEUVAvYgnKt1He",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/BatchMintMetadata.sol": {
      keccak256:
        "0x8a6253c2ed20a78864aa309d416b3cb264c67aaccca2416787c2fb419bef7beb",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f10a9d0ca8c8cf62e19f1de27e5f4716e8ad96497f26238bc403aff134c5d2d8",
        "dweb:/ipfs/QmTihBeEHfWwbYs2Vu7ZSzLhGimXVAFthzyBoP4nXgmThM",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/ContractMetadata.sol": {
      keccak256:
        "0x86393a27319a054a1cabc9b7b4e97ff0aa33caaa2eb79173858d905e591ad5bc",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://66bd1acd03438412fc1f57c6e86eda9dfcbda354b120c0fe115d0f9e6f26c57a",
        "dweb:/ipfs/QmaykDmYfP1ZtbwpgNRvz4Hqf7KJTQijZXn6ucaYT9xxWQ",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/LazyMint.sol": {
      keccak256:
        "0x21e97655e2d9caa5dea4dca0a964ccfb5eb7a1dbb72a6945c73b0c199f9e1a2c",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://503e1da520db949817b8104339c638dfb124220904ea07ed5da7f1c958104958",
        "dweb:/ipfs/QmRbrrRjYpz9xBN5mo2gYojHRFMiYQLYQq7HAAPuNcG5tZ",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/Multicall.sol": {
      keccak256:
        "0x6b01a01f258774dca807d9902cdfd956895c65b09d931c0b88df97a1086ee504",
      license: "MIT",
      urls: [
        "bzz-raw://cda6ed9746e93537a4e9ae705a0166247cb5ba9b375b68f96fe8612f79e0609c",
        "dweb:/ipfs/QmY1j68ozowaViXDnDtYK64vWsLH3PYMUxKxGqEgsfYh6m",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/Ownable.sol": {
      keccak256:
        "0xc1e91e941998b16e12fe77c28daed6b271de680997bf3a5cf21726934d752adf",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f5e122e7899b77bd7b27b8aa1ce1013160406d1ea493211223cfde7ccfa27d84",
        "dweb:/ipfs/QmbJsbJv3B3bHggGZCfbUB6RubU6sRRUUEhAh2uGU7bt6G",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/Royalty.sol": {
      keccak256:
        "0x90df448d415dbf44a0d2ca78159a2925f0e9e82729610daa2b1c29fdebeff63d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://8b0a0cff3ad0551857e94d284b71bca92f2e3b1914124be4ceb7b397ac47ab93",
        "dweb:/ipfs/Qme5d8M3oLMYnsmQZjwWqFPbks39M9jUE2iXbmkWDq1CUQ",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/interface/IContractMetadata.sol":
      {
        keccak256:
          "0x72afb65f99429230a9d6ca7734853cf8c53264d0d013f1bff3a5625396ee1ff1",
        license: "Apache-2.0",
        urls: [
          "bzz-raw://8de0d8da22da658225705129bde46f3d18dc511dd300906ca457f04806f200b0",
          "dweb:/ipfs/QmWbTpgvQz3mE4RiBBcHhKJENroMD1ACMeKDECcyuanCvC",
        ],
      },
    "node_modules/@thirdweb-dev/contracts/extension/interface/ILazyMint.sol": {
      keccak256:
        "0x7584a78d071f12fc16dac6db37355ca1d5e6869ccfb27ea412223101a17acd25",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://c8e386f850a3d3ea01c9c9ca2fe853e878cf06f0c5abb2f40717dc6a3483c024",
        "dweb:/ipfs/QmNvQDrXxCZM3FacMTubMourh8EwCYEduvL9Mgq4U3UAnU",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/interface/IMulticall.sol": {
      keccak256:
        "0x78589586f039d77c94a346b8d1fc3e4bf14ef7d4dc3f51c75b18fd04b79433ea",
      license: "MIT",
      urls: [
        "bzz-raw://377f057fd9f89c4eca439d37f9188e4275e7e558fbc06c9d64f6f30bc90cf921",
        "dweb:/ipfs/QmfKRmLuffQNZmt5UyP9xa2oa9TKvphNvKnsfkg4Jzd1Ag",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/interface/IOwnable.sol": {
      keccak256:
        "0xa1195f8a222f99add4d594e6a1fa4c3ac36b9ef65378dbe1151eec24fa4d2ec0",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://20e7e62207e61848cbeed4439bd6366b72b3f5dad420fe65f777f3618e718294",
        "dweb:/ipfs/QmPRzBPce3FmPCmMDSzCPzNvViAYo9rD182Mkuequt2L5a",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/extension/interface/IRoyalty.sol": {
      keccak256:
        "0x82cd77453b9200c541910ac0f72be940dfa96552029550f304ccbf149d950020",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6fc450122af8f6669e2949c3cbfca1a56f5405520c7652dd7f236f172f2a5241",
        "dweb:/ipfs/QmUQaHNahCR9VPF6iwqJ4kFkW9JsHdzWGvBHhpUrqy3Urn",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/lib/TWAddress.sol": {
      keccak256:
        "0x4546bc7fd7332d33610063ea1c7e8cde8528ac31fa6f49e25d92777d937def4f",
      license: "MIT",
      urls: [
        "bzz-raw://848840b707dbf66a1e8a383652eee426aff9814f06ef01e82800ed9799b2278a",
        "dweb:/ipfs/QmTeYtUEEsZvCpeqfEpkWqP2Kqb7QWS1tSfzRgeSUeFbAx",
      ],
    },
    "node_modules/@thirdweb-dev/contracts/lib/TWStrings.sol": {
      keccak256:
        "0x7cc7fcf5ab662a5d0b179371ca056e67f4a998c49379ff2cbd7bd91609ebb401",
      license: "MIT",
      urls: [
        "bzz-raw://a679fcdf635a741c27d4e52b1f865bcdc44e54866a89db08239d72dfa48fe7f6",
        "dweb:/ipfs/QmaKKiFma4EpnDt7UmAYRuRmb2cxLBMJ7ik1zsuJHkzmVU",
      ],
    },
    "src/CatAttackNFT.sol": {
      keccak256:
        "0x574dd39e8ded91a0648fe47d1488020a2909cd70a15ae71325ac122b02710efa",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6a9127e29198153a1bd5f98bd1ea460f16af4842592df79dadb749e36f4e61ec",
        "dweb:/ipfs/Qmdc98TAdhH5pPcqMXG6PZgXck9aGeLYJt83m33uPA7MiQ",
      ],
    },
  },
  version: 1,
};

export const catAttackBytecode =
  "0x6080604052600d805460ff191690553480156200001b57600080fd5b5060405162003a3a38038062003a3a8339810160408190526200003e9162000337565b8282336000838381600090805190602001906200005d929190620001c4565b50805162000073906001906020840190620001c4565b5050506200008733620000c760201b60201c565b6200009c826001600160801b03831662000119565b5050505080600d60016101000a81548163ffffffff021916908360e01c0217905550505050620003fe565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b612710811115620001625760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b604482015260640160405180910390fd5b600780546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b828054620001d290620003c2565b90600052602060002090601f016020900481019282620001f6576000855562000241565b82601f106200021157805160ff191683800117855562000241565b8280016001018555821562000241579182015b828111156200024157825182559160200191906001019062000224565b506200024f92915062000253565b5090565b5b808211156200024f576000815560010162000254565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200029257600080fd5b81516001600160401b0380821115620002af57620002af6200026a565b604051601f8301601f19908116603f01168101908282118183101715620002da57620002da6200026a565b81604052838152602092508683858801011115620002f757600080fd5b600091505b838210156200031b5785820183015181830184015290820190620002fc565b838211156200032d5760008385830101525b9695505050505050565b6000806000606084860312156200034d57600080fd5b83516001600160401b03808211156200036557600080fd5b620003738783880162000280565b945060208601519150808211156200038a57600080fd5b50620003998682870162000280565b925050604084015163ffffffff60e01b81168114620003b757600080fd5b809150509250925092565b600181811c90821680620003d757607f821691505b602082108103620003f857634e487b7160e01b600052602260045260246000fd5b50919050565b61362c806200040e6000396000f3fe6080604052600436106101f85760003560e01c806383bd72ba1161010d578063bd85b039116100a0578063d65ab5f21161006f578063d65ab5f21461060d578063e8a3d48514610622578063e985e9c514610637578063f242432a14610672578063f5298aca1461069257600080fd5b8063bd85b0391461058b578063be895ece146105b8578063d018db3e146105cd578063d37c353b146105ed57600080fd5b80639bcf7a15116100dc5780639bcf7a15146104f3578063a22cb46514610513578063ac9650d814610533578063b24f2d391461056057600080fd5b806383bd72ba146104815780638da5cb5b14610496578063938e3d7b146104be57806395d89b41146104de57600080fd5b80632bc43fd9116101905780634cc157df1161015f5780634cc157df146103bd5780634e1273f4146103ff578063600dd5ea1461042c57806363b45e2d1461044c5780636b20c4541461046157600080fd5b80632bc43fd9146103555780632eb2c2d6146103685780633b1475a7146103885780634bbb1abf1461039d57600080fd5b80630e89341c116101cc5780630e89341c146102b457806313af4035146102d45780632419f51b146102f65780632a55205a1461031657600080fd5b8062fdd58e146101fd57806301ffc9a7146102485780630422ddf31461027857806306fdde0314610292575b600080fd5b34801561020957600080fd5b5061023561021836600461297d565b600260209081526000928352604080842090915290825290205481565b6040519081526020015b60405180910390f35b34801561025457600080fd5b506102686102633660046129bd565b6106b2565b604051901515815260200161023f565b34801561028457600080fd5b50600d546102689060ff1681565b34801561029e57600080fd5b506102a761071f565b60405161023f9190612a32565b3480156102c057600080fd5b506102a76102cf366004612a45565b6107ad565b3480156102e057600080fd5b506102f46102ef366004612a5e565b6107ee565b005b34801561030257600080fd5b50610235610311366004612a45565b610827565b34801561032257600080fd5b50610336610331366004612a79565b610895565b604080516001600160a01b03909316835260208301919091520161023f565b6102f4610363366004612a9b565b6108d2565b34801561037457600080fd5b506102f4610383366004612c21565b61093b565b34801561039457600080fd5b50600b54610235565b3480156103a957600080fd5b506102f46103b8366004612a9b565b6109ca565b3480156103c957600080fd5b506103dd6103d8366004612a45565b610b89565b604080516001600160a01b03909316835261ffff90911660208301520161023f565b34801561040b57600080fd5b5061041f61041a366004612cca565b610bf4565b60405161023f9190612dcf565b34801561043857600080fd5b506102f461044736600461297d565b610d08565b34801561045857600080fd5b50600954610235565b34801561046d57600080fd5b506102f461047c366004612de2565b610d3a565b34801561048d57600080fd5b506102f4610ee2565b3480156104a257600080fd5b506006546040516001600160a01b03909116815260200161023f565b3480156104ca57600080fd5b506102f46104d9366004612e55565b610f4b565b3480156104ea57600080fd5b506102a7610f78565b3480156104ff57600080fd5b506102f461050e366004612e9d565b610f85565b34801561051f57600080fd5b506102f461052e366004612ed2565b610fb4565b34801561053f57600080fd5b5061055361054e366004612f0e565b61106c565b60405161023f9190612f82565b34801561056c57600080fd5b506007546001600160a01b03811690600160a01b900461ffff166103dd565b34801561059757600080fd5b506102356105a6366004612a45565b600c6020526000908152604090205481565b3480156105c457600080fd5b506102f4611160565b3480156105d957600080fd5b506102f46105e8366004612a5e565b611193565b3480156105f957600080fd5b5061023561060836600461302c565b611346565b34801561061957600080fd5b506102f461145e565b34801561062e57600080fd5b506102a76114c4565b34801561064357600080fd5b506102686106523660046130a5565b600360209081526000928352604080842090915290825290205460ff1681565b34801561067e57600080fd5b506102f461068d3660046130d8565b6114d1565b34801561069e57600080fd5b506102f46106ad366004612a9b565b6115fb565b60006301ffc9a760e01b6001600160e01b0319831614806106e35750636cdb3d1360e11b6001600160e01b03198316145b806106fe57506303a24d0760e21b6001600160e01b03198316145b8061071957506001600160e01b0319821663152a902d60e11b145b92915050565b6000805461072c9061313c565b80601f01602080910402602001604051908101604052809291908181526020018280546107589061313c565b80156107a55780601f1061077a576101008083540402835291602001916107a5565b820191906000526020600020905b81548152906001019060200180831161078857829003601f168201915b505050505081565b606060006107ba83611701565b9050806107c68461189d565b6040516020016107d7929190613176565b604051602081830303815290604052915050919050565b6107f66119a5565b61081b5760405162461bcd60e51b8152600401610812906131a5565b60405180910390fd5b610824816119d2565b50565b600061083260095490565b82106108705760405162461bcd60e51b815260206004820152600d60248201526c092dcecc2d8d2c840d2dcc8caf609b1b6044820152606401610812565b60098281548110610883576108836131cd565b90600052602060002001549050919050565b6000806000806108a486610b89565b90945084925061ffff1690506127106108bd82876131f9565b6108c7919061322e565b925050509250929050565b6108dd3383836109ca565b600b54821061091b5760405162461bcd60e51b815260206004820152600a6024820152691a5b9d985b1a59081a5960b21b6044820152606401610812565b61093683838360405180602001604052806000815250611a24565b505050565b6001600160a01b03851633148061097557506001600160a01b038516600090815260036020908152604080832033845290915290205460ff165b6109b65760405162461bcd60e51b81526020600482015260126024820152710853d5d3915497d3d497d054141493d5915160721b6044820152606401610812565b6109c38585858585611afd565b5050505050565b600d5460ff1615610a0b5760405162461bcd60e51b815260206004820152600b60248201526a11d0535157d4105554d15160aa1b6044820152606401610812565b8115610a595760405162461bcd60e51b815260206004820152601b60248201527f4f6e6c79204b697474656e732063616e20626520636c61696d656400000000006044820152606401610812565b33600090815260026020908152604080832083805290915290205415610ab85760405162461bcd60e51b815260206004820152601460248201527320b63932b0b23c9033b7ba10309025b4ba3a32b760611b6044820152606401610812565b3360009081526002602090815260408083206001845290915290205415610b215760405162461bcd60e51b815260206004820152601860248201527f416c726561647920676f742061204772756d70792063617400000000000000006044820152606401610812565b336000908152600260208181526040808420928452919052902054156109365760405162461bcd60e51b815260206004820152601760248201527f416c726561647920676f742061204e696e6a61206361740000000000000000006044820152606401610812565b6000818152600860209081526040808320815180830190925280546001600160a01b031680835260019091015492820192909252829115610bd05780516020820151610bea565b6007546001600160a01b03811690600160a01b900461ffff165b9250925050915091565b60608151835114610c175760405162461bcd60e51b815260040161081290613242565b600083516001600160401b03811115610c3257610c32612ace565b604051908082528060200260200182016040528015610c5b578160200160208202803683370190505b50905060005b8451811015610d005760026000868381518110610c8057610c806131cd565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020016000206000858381518110610cbc57610cbc6131cd565b6020026020010151815260200190815260200160002054828281518110610ce557610ce56131cd565b6020908102919091010152610cf98161326b565b9050610c61565b509392505050565b610d106119a5565b610d2c5760405162461bcd60e51b8152600401610812906131a5565b610d368282611cb8565b5050565b336001600160a01b038416811480610d7757506001600160a01b0380851660009081526003602090815260408083209385168352929052205460ff165b610db75760405162461bcd60e51b81526020600482015260116024820152702ab730b8383937bb32b21031b0b63632b960791b6044820152606401610812565b8151835114610dfa5760405162461bcd60e51b815260206004820152600f60248201526e098cadccee8d040dad2e6dac2e8c6d608b1b6044820152606401610812565b60005b8351811015610ed057828181518110610e1857610e186131cd565b602002602001015160026000876001600160a01b03166001600160a01b031681526020019081526020016000206000868481518110610e5957610e596131cd565b60200260200101518152602001908152602001600020541015610ebe5760405162461bcd60e51b815260206004820152601760248201527f4e6f7420656e6f75676820746f6b656e73206f776e65640000000000000000006044820152606401610812565b610ec9600182613284565b9050610dfd565b50610edc848484611d5e565b50505050565b6006546001600160a01b03163314610f3c5760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c79206f776e65722063616e2073746f70207468652067616d65000000006044820152606401610812565b600d805460ff19166001179055565b610f536119a5565b610f6f5760405162461bcd60e51b8152600401610812906131a5565b61082481611f13565b6001805461072c9061313c565b610f8d6119a5565b610fa95760405162461bcd60e51b8152600401610812906131a5565b610936838383611ff5565b336001600160a01b0383168103610ffe5760405162461bcd60e51b815260206004820152600e60248201526d20a8282927ab24a723afa9a2a62360911b6044820152606401610812565b6001600160a01b03818116600081815260036020908152604080832094881680845294825291829020805460ff191687151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3191015b60405180910390a3505050565b6060816001600160401b0381111561108657611086612ace565b6040519080825280602002602001820160405280156110b957816020015b60608152602001906001900390816110a45790505b50905060005b8281101561115957611129308585848181106110dd576110dd6131cd565b90506020028101906110ef919061329c565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506120b692505050565b82828151811061113b5761113b6131cd565b602002602001018190525080806111519061326b565b9150506110bf565b5092915050565b61116d33600060016108d2565b6040516001815233906000805160206135d78339815191529060200160405180910390a2565b600d5460ff16156111b65760405162461bcd60e51b8152600401610812906132e2565b33600090815260026020818152604080842092845291905290205461121d5760405162461bcd60e51b815260206004820152601f60248201527f596f75206e6565642061206e696e6a612063617420746f2061747461636b21006044820152606401610812565b6001600160a01b03811660009081526002602090815260408083208380529091528120541561124e575060006112ee565b6001600160a01b03821660009081526002602090815260408083206001845290915290205415611280575060016112ee565b6001600160a01b0382166000908152600260208181526040808420928452919052902054156112b1575060026112ee565b60405162461bcd60e51b815260206004820152601260248201527156696374696d20686173206e6f206361742160701b6044820152606401610812565b6112fa828260016120e2565b6001600160a01b038216337f0eb774bb9698a73583fe07b6972cf2dcc08d1d97581a22861f45feb86b395820611331846001613284565b60405190815260200160405180910390a35050565b60006113506119a5565b61136c5760405162461bcd60e51b8152600401610812906131a5565b856000036113af5760405162461bcd60e51b815260206004820152601060248201526f4d696e74696e67203020746f6b656e7360801b6044820152606401610812565b6000600b5490506113f7818888888080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061220792505050565b600b919091559150807f2a0365091ef1a40953c670dce28177e37520648a6fdc91506bffac0ab045570d600161142d8a84613284565b611437919061330a565b8888888860405161144c95949392919061334a565b60405180910390a25095945050505050565b6006546001600160a01b031633146114b85760405162461bcd60e51b815260206004820152601d60248201527f4f6e6c79206f776e65722063616e207374617274207468652067616d650000006044820152606401610812565b600d805460ff19169055565b6005805461072c9061313c565b600d5460ff16156114f45760405162461bcd60e51b8152600401610812906132e2565b82156115425760405162461bcd60e51b815260206004820152601d60248201527f5468697320636174206973206e6f74207472616e7366657261626c65210000006044820152606401610812565b61154f8585858585612274565b836001600160a01b0316856001600160a01b03161415801561156f575082155b156109c3576115908560018060405180602001604052806000815250611a24565b836001600160a01b03166000805160206135d783398151915260016040516115ba91815260200190565b60405180910390a2846001600160a01b03166000805160206135d783398151915260026040516115ec91815260200190565b60405180910390a25050505050565b600d5460ff161561161e5760405162461bcd60e51b8152600401610812906132e2565b336001600160a01b038416148061164e575033600090815260026020818152604080842092845291905290205415155b61169a5760405162461bcd60e51b815260206004820152601c60248201527f4e4f545f544f4b454e5f4f574e4552206f72206e696e6a6120636174000000006044820152606401610812565b6116a58383836120e2565b81600103610936576116ca836002600160405180602001604052806000815250611a24565b826001600160a01b03166000805160206135d783398151915260036040516116f491815260200190565b60405180910390a2505050565b6060600061170e60095490565b90506000600980548060200260200160405190810160405280929190818152602001828054801561175e57602002820191906000526020600020905b81548152602001906001019080831161174a575b5050505050905060005b8281101561186257818181518110611782576117826131cd565b602002602001015185101561185057600a60008383815181106117a7576117a76131cd565b6020026020010151815260200190815260200160002080546117c89061313c565b80601f01602080910402602001604051908101604052809291908181526020018280546117f49061313c565b80156118415780601f1061181657610100808354040283529160200191611841565b820191906000526020600020905b81548152906001019060200180831161182457829003601f168201915b50505050509350505050919050565b61185b600182613284565b9050611768565b5060405162461bcd60e51b815260206004820152600f60248201526e125b9d985b1a59081d1bdad95b9259608a1b6044820152606401610812565b6060816000036118c45750506040805180820190915260018152600360fc1b602082015290565b8160005b81156118ee57806118d88161326b565b91506118e79050600a8361322e565b91506118c8565b6000816001600160401b0381111561190857611908612ace565b6040519080825280601f01601f191660200182016040528015611932576020820181803683370190505b5090505b841561199d5761194760018361330a565b9150611954600a86613383565b61195f906030613284565b60f81b818381518110611974576119746131cd565b60200101906001600160f81b031916908160001a905350611996600a8661322e565b9450611936565b949350505050565b60006119b96006546001600160a01b031690565b6001600160a01b0316336001600160a01b031614905090565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7690600090a35050565b6001600160a01b038416611a4a5760405162461bcd60e51b815260040161081290613397565b33611a6a81600087611a5b886122fc565b611a64886122fc565b87612347565b6001600160a01b038516600090815260026020908152604080832087845290915281208054859290611a9d908490613284565b909155505060408051858152602081018590526001600160a01b0380881692600092918516917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46109c38160008787878761245c565b8151835114611b1e5760405162461bcd60e51b815260040161081290613242565b6001600160a01b038416611b445760405162461bcd60e51b815260040161081290613397565b33611b53818787878787612347565b60005b8451811015611c4a576000858281518110611b7357611b736131cd565b602002602001015190506000858381518110611b9157611b916131cd565b6020908102919091018101516001600160a01b038b166000908152600283526040808220868352909352919091205490915081811015611be35760405162461bcd60e51b8152600401610812906133bd565b6001600160a01b03808b16600090815260026020818152604080842088855282528084208787039055938d16835290815282822086835290529081208054849290611c2f908490613284565b9250508190555050505080611c439061326b565b9050611b56565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051611c9a9291906133e7565b60405180910390a4611cb08187878787876125af565b505050505050565b612710811115611cfc5760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610812565b600780546001600160a01b0384166001600160b01b03199091168117600160a01b61ffff851602179091556040518281527f90d7ec04bcb8978719414f82e52e4cb651db41d0e6f8cea6118c2191e6183adb9060200160405180910390a25050565b6001600160a01b038316611da55760405162461bcd60e51b815260206004820152600e60248201526d232927a6afad22a927afa0a2222960911b6044820152606401610812565b8051825114611dc65760405162461bcd60e51b815260040161081290613242565b6000339050611de981856000868660405180602001604052806000815250612347565b60005b8351811015611eb4576000848281518110611e0957611e096131cd565b602002602001015190506000848381518110611e2757611e276131cd565b6020908102919091018101516001600160a01b0389166000908152600283526040808220868352909352919091205490915081811015611e795760405162461bcd60e51b8152600401610812906133bd565b6001600160a01b0388166000908152600260209081526040808320958352949052929092209103905580611eac8161326b565b915050611dec565b5060006001600160a01b0316846001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051611f059291906133e7565b60405180910390a450505050565b600060058054611f229061313c565b80601f0160208091040260200160405190810160405280929190818152602001828054611f4e9061313c565b8015611f9b5780601f10611f7057610100808354040283529160200191611f9b565b820191906000526020600020905b815481529060010190602001808311611f7e57829003601f168201915b50508551939450611fb7936005935060208701925090506128c8565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168183604051611fe9929190613415565b60405180910390a15050565b6127108111156120395760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610812565b6040805180820182526001600160a01b038481168083526020808401868152600089815260088352869020945185546001600160a01b031916941693909317845591516001909301929092559151838152909185917f7365cf4122f072a3365c20d54eff9b38d73c096c28e1892ec8f5b0e403a0f12d910161105f565b60606120db83836040518060600160405280602781526020016135b06027913961268c565b9392505050565b6001600160a01b0383166121295760405162461bcd60e51b815260206004820152600e60248201526d232927a6afad22a927afa0a2222960911b6044820152606401610812565b336121588185600061213a876122fc565b612143876122fc565b60405180602001604052806000815250612347565b6001600160a01b03841660009081526002602090815260408083208684529091529020548281101561219c5760405162461bcd60e51b8152600401610812906133bd565b6001600160a01b03858116600081815260026020908152604080832089845282528083208887039055805189815291820188905291938616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a45050505050565b6000806122148486613284565b60098054600181019091557f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af018190556000818152600a60209081526040909120855192945084935061226b9290918601906128c8565b50935093915050565b6001600160a01b0385163314806122ae57506001600160a01b038516600090815260036020908152604080832033845290915290205460ff165b6122ef5760405162461bcd60e51b81526020600482015260126024820152710853d5d3915497d3d497d054141493d5915160721b6044820152606401610812565b6109c38585858585612769565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110612336576123366131cd565b602090810291909101015292915050565b6001600160a01b0385166123ce5760005b83518110156123cc57828181518110612373576123736131cd565b6020026020010151600c6000868481518110612391576123916131cd565b6020026020010151815260200190815260200160002060008282546123b69190613284565b909155506123c590508161326b565b9050612358565b505b6001600160a01b038416611cb05760005b8351811015612453578281815181106123fa576123fa6131cd565b6020026020010151600c6000868481518110612418576124186131cd565b60200260200101518152602001908152602001600020600082825461243d919061330a565b9091555061244c90508161326b565b90506123df565b50505050505050565b6001600160a01b0384163b15611cb05760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906124a0908990899088908890889060040161343a565b6020604051808303816000875af19250505080156124db575060408051601f3d908101601f191682019092526124d89181019061347f565b60015b61255d576124e761349c565b806308c379a00361252057506124fb6134b8565b806125065750612522565b8060405162461bcd60e51b81526004016108129190612a32565b505b60405162461bcd60e51b815260206004820152601060248201526f10a2a92198989a9aa922a1a2a4ab22a960811b6044820152606401610812565b6001600160e01b0319811663f23a6e6160e01b146124535760405162461bcd60e51b815260206004820152600f60248201526e1513d2d15394d7d491529150d51151608a1b6044820152606401610812565b6001600160a01b0384163b15611cb05760405163bc197c8160e01b81526001600160a01b0385169063bc197c81906125f39089908990889088908890600401613541565b6020604051808303816000875af192505050801561262e575060408051601f3d908101601f1916820190925261262b9181019061347f565b60015b61263a576124e761349c565b6001600160e01b0319811663bc197c8160e01b146124535760405162461bcd60e51b815260206004820152600f60248201526e1513d2d15394d7d491529150d51151608a1b6044820152606401610812565b60606001600160a01b0384163b6126f45760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610812565b600080856001600160a01b03168560405161270f9190613593565b600060405180830381855af49150503d806000811461274a576040519150601f19603f3d011682016040523d82523d6000602084013e61274f565b606091505b509150915061275f82828661288f565b9695505050505050565b6001600160a01b03841661278f5760405162461bcd60e51b815260040161081290613397565b3361279f818787611a5b886122fc565b6001600160a01b0386166000908152600260209081526040808320878452909152902054838110156127e35760405162461bcd60e51b8152600401610812906133bd565b6001600160a01b0380881660009081526002602081815260408084208a855282528084208987039055938a1683529081528282208883529052908120805486929061282f908490613284565b909155505060408051868152602081018690526001600160a01b03808916928a821692918616917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461245382888888888861245c565b6060831561289e5750816120db565b8251156128ae5782518084602001fd5b8160405162461bcd60e51b81526004016108129190612a32565b8280546128d49061313c565b90600052602060002090601f0160209004810192826128f6576000855561293c565b82601f1061290f57805160ff191683800117855561293c565b8280016001018555821561293c579182015b8281111561293c578251825591602001919060010190612921565b5061294892915061294c565b5090565b5b80821115612948576000815560010161294d565b80356001600160a01b038116811461297857600080fd5b919050565b6000806040838503121561299057600080fd5b61299983612961565b946020939093013593505050565b6001600160e01b03198116811461082457600080fd5b6000602082840312156129cf57600080fd5b81356120db816129a7565b60005b838110156129f55781810151838201526020016129dd565b83811115610edc5750506000910152565b60008151808452612a1e8160208601602086016129da565b601f01601f19169290920160200192915050565b6020815260006120db6020830184612a06565b600060208284031215612a5757600080fd5b5035919050565b600060208284031215612a7057600080fd5b6120db82612961565b60008060408385031215612a8c57600080fd5b50508035926020909101359150565b600080600060608486031215612ab057600080fd5b612ab984612961565b95602085013595506040909401359392505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f191681016001600160401b0381118282101715612b0957612b09612ace565b6040525050565b60006001600160401b03821115612b2957612b29612ace565b5060051b60200190565b600082601f830112612b4457600080fd5b81356020612b5182612b10565b604051612b5e8282612ae4565b83815260059390931b8501820192828101915086841115612b7e57600080fd5b8286015b84811015612b995780358352918301918301612b82565b509695505050505050565b60006001600160401b03831115612bbd57612bbd612ace565b604051612bd4601f8501601f191660200182612ae4565b809150838152848484011115612be957600080fd5b83836020830137600060208583010152509392505050565b600082601f830112612c1257600080fd5b6120db83833560208501612ba4565b600080600080600060a08688031215612c3957600080fd5b612c4286612961565b9450612c5060208701612961565b935060408601356001600160401b0380821115612c6c57600080fd5b612c7889838a01612b33565b94506060880135915080821115612c8e57600080fd5b612c9a89838a01612b33565b93506080880135915080821115612cb057600080fd5b50612cbd88828901612c01565b9150509295509295909350565b60008060408385031215612cdd57600080fd5b82356001600160401b0380821115612cf457600080fd5b818501915085601f830112612d0857600080fd5b81356020612d1582612b10565b604051612d228282612ae4565b83815260059390931b8501820192828101915089841115612d4257600080fd5b948201945b83861015612d6757612d5886612961565b82529482019490820190612d47565b96505086013592505080821115612d7d57600080fd5b50612d8a85828601612b33565b9150509250929050565b600081518084526020808501945080840160005b83811015612dc457815187529582019590820190600101612da8565b509495945050505050565b6020815260006120db6020830184612d94565b600080600060608486031215612df757600080fd5b612e0084612961565b925060208401356001600160401b0380821115612e1c57600080fd5b612e2887838801612b33565b93506040860135915080821115612e3e57600080fd5b50612e4b86828701612b33565b9150509250925092565b600060208284031215612e6757600080fd5b81356001600160401b03811115612e7d57600080fd5b8201601f81018413612e8e57600080fd5b61199d84823560208401612ba4565b600080600060608486031215612eb257600080fd5b83359250612ec260208501612961565b9150604084013590509250925092565b60008060408385031215612ee557600080fd5b612eee83612961565b915060208301358015158114612f0357600080fd5b809150509250929050565b60008060208385031215612f2157600080fd5b82356001600160401b0380821115612f3857600080fd5b818501915085601f830112612f4c57600080fd5b813581811115612f5b57600080fd5b8660208260051b8501011115612f7057600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b82811015612fd757603f19888603018452612fc5858351612a06565b94509285019290850190600101612fa9565b5092979650505050505050565b60008083601f840112612ff657600080fd5b5081356001600160401b0381111561300d57600080fd5b60208301915083602082850101111561302557600080fd5b9250929050565b60008060008060006060868803121561304457600080fd5b8535945060208601356001600160401b038082111561306257600080fd5b61306e89838a01612fe4565b9096509450604088013591508082111561308757600080fd5b5061309488828901612fe4565b969995985093965092949392505050565b600080604083850312156130b857600080fd5b6130c183612961565b91506130cf60208401612961565b90509250929050565b600080600080600060a086880312156130f057600080fd5b6130f986612961565b945061310760208701612961565b9350604086013592506060860135915060808601356001600160401b0381111561313057600080fd5b612cbd88828901612c01565b600181811c9082168061315057607f821691505b60208210810361317057634e487b7160e01b600052602260045260246000fd5b50919050565b600083516131888184602088016129da565b83519083019061319c8183602088016129da565b01949350505050565b6020808252600e908201526d139bdd08185d5d1a1bdc9a5e995960921b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615613213576132136131e3565b500290565b634e487b7160e01b600052601260045260246000fd5b60008261323d5761323d613218565b500490565b6020808252600f908201526e0988a9c8ea890be9a92a69a82a8869608b1b604082015260600190565b60006001820161327d5761327d6131e3565b5060010190565b60008219821115613297576132976131e3565b500190565b6000808335601e198436030181126132b357600080fd5b8301803591506001600160401b038211156132cd57600080fd5b60200191503681900382131561302557600080fd5b6020808252600e908201526d11d85b59481a5cc81c185d5cd95960921b604082015260600190565b60008282101561331c5761331c6131e3565b500390565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b858152606060208201526000613364606083018688613321565b8281036040840152613377818587613321565b98975050505050505050565b60008261339257613392613218565b500690565b6020808252600c908201526b2a27afad22a927afa0a2222960a11b604082015260600190565b60208082526010908201526f125394d551919250d251539517d0905360821b604082015260600190565b6040815260006133fa6040830185612d94565b828103602084015261340c8185612d94565b95945050505050565b6040815260006134286040830185612a06565b828103602084015261340c8185612a06565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061347490830184612a06565b979650505050505050565b60006020828403121561349157600080fd5b81516120db816129a7565b600060033d11156134b55760046000803e5060005160e01c5b90565b600060443d10156134c65790565b6040516003193d81016004833e81513d6001600160401b0381602484011181841117156134f557505050505090565b828501915081518181111561350d5750505050505090565b843d87010160208285010111156135275750505050505090565b61353660208286010187612ae4565b509095945050505050565b6001600160a01b0386811682528516602082015260a06040820181905260009061356d90830186612d94565b828103606084015261357f8186612d94565b905082810360808401526133778185612a06565b600082516135a58184602087016129da565b919091019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c656491e51c29e7e87a74ad3b8ccba98538970f50a4309242735467f41e27c6b0fbaca26469706673582212203cbbf1a610f9a3c515feffef9d44ebe8fb8fa63862e257b39c14e483921a813264736f6c634300080d0033";
