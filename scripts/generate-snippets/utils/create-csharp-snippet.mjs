const mapping = {
  ThirdwebSDK: {
    fromPrivateKey:
      "Unity does not support instantiating the SDK from a private key. Instantiate the SDK in read-only mode and then connect the user's Wallet.",
    fromSigner:
      "Unity does not support instantiating the SDK from a signer. Instantiate the SDK in read-only mode and then connect the user's Wallet.",
    fromWallet:
      "Unity does not support instantiating the SDK from a Wallet. Instantiate the SDK in read-only mode and then connect the user's Wallet.",
    getBalance: "CurrencyValue balance = await sdk.Wallet.GetBalance();",
    getContract: `// Ensure your sdk is initialized to the same network as the contract
Contract contract = sdk.GetContract("<your-smart-contract-address>");
    
// For marketplaces and packs:
Marketplace marketplace = contract.marketplace;
Pack pack = contract.pack;`,
    getContractFromAbi: `Contract contract = sdk.GetContract("<your-smart-contract-address>", "<your-contract-abi>");`,
  },
  NFTCollection: {
    burn: 'var tokenId = "0";\nvar result = await contract.ERC721.Burn(tokenId);',
    mintBatchTo: undefined,
    mintTo:
      '// Address of the wallet you want to mint the NFT to\nvar walletAddress = "{{wallet_address}}";\n\n// Custom metadata of the NFT, note that you can fully customize this metadata with other properties.\nvar metadata = new NFTMetadata() {\n  name =  "Cool NFT",\n  description = "This is a cool NFT",\n  image = "<image-url-here>" \n};\n\nvar tx = await contract.ERC721.MintTo(walletAddress, metadata);',
    balanceOf:
      'var walletAddress = "{{wallet_address}}";\nvar balance = await contract.ERC721.BalanceOf(walletAddress);\nDebug.Log(balance);',
    get: 'var tokenId = "0";\nvar nft = await contract.ERC721.Get(tokenId);',
    getAll: "var nfts = await contract.ERC721.GetAll();\nDebug.Log(nfts);",
    getOwned:
      '// Address of the Wallet to get the NFTs of\nvar address = "{{wallet_address}}";\nvar nfts = await contract.ERC721.GetOwned(address);\nDebug.Log(nfts);',
    transfer:
      'var walletAddress = "{{wallet_address}}";\nvar tokenId = "0";\nawait contract.ERC721.Transfer(walletAddress, tokenId);',
  },
  Edition: {
    burn: 'var tokenId = "0";\nint amount = 1;\nvar result = await contract.ERC1155.Burn(tokenId, amount);',
    getAll: "var nfts = await contract.ERC1155.GetAll();",
    getOwned:
      '// Address of the Wallet to get the NFTs of\nvar address = "{{wallet_address}}";\nvar nfts = await contract.ERC1155.GetOwned(address);',
    mintBatchTo: undefined,
    mintTo:
      '// Address of the wallet you want to mint the NFT to\r\nvar toAddress = "{{wallet_address}}";\r\n// Custom metadata of the NFT, note that you can fully customize this metadata with other properties.\r\nvar metadata =\r\n    new NFTMetadata()\r\n    {\r\n        name = "Cool NFT",\r\n        description = "This is a cool NFT",\r\n        image = "<your-image-url>"\r\n    };\r\nvar metadataWithSupply =\r\n    new NFTMetadataWithSupply() { metadata = metadata, supply = 1 };\r\nvar tx = await contract.ERC1155.MintTo(toAddress, metadataWithSupply);',
    airdrop: undefined,
    balanceOf:
      '// Address of the Wallet to check NFT balance\nvar walletAddress = "{{wallet_address}}";\nvar tokenId = "0"; // Id of the NFT to check\nvar balance = await contract.ERC1155.BalanceOf(walletAddress, tokenId);',
    get: 'var nft = await contract.ERC1155.Get("0");',
    transfer:
      '// Address of the Wallet you want to send the NFT to\nvar toAddress = "{{wallet_address}}";\nvar tokenId = "0"; // The token ID of the NFT you want to send\nvar amount = 3; // How many copies of the NFTs to transfer\nawait contract.ERC1155.Transfer(toAddress, tokenId, amount);',
  },
  TokenDrop: {
    burnFrom: undefined,
    burnTokens:
      '// The amount of this token you want to burn\nvar amount = "1.2";\n\nawait contract.ERC20.Burn(amount);',
    claimTo:
      'var address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs\nvar quantity = 1; // how many tokens you want to claim\n\nvar tx = await contract.ERC20.ClaimTo(address, quantity);\nvar receipt = tx.receipt; // the transaction receipt',
    allowance:
      '// Address of the Wallet to check token allowance\nvar spenderAddress = "0x...";\nvar allowance = await contract.ERC20.Allowance(spenderAddress);',
    allowanceOf:
      '// Address of the Wallet who owns the funds\nvar owner = "{{wallet_address}}";\n// Address of the Wallet to check token allowance\nvar spender = "0x...";\nvar allowance = await contract.ERC20.AllowanceOf(owner, spender);',
    balance: "var balance = await contract.ERC20.Balance();",
    balanceOf:
      '// Address of the Wallet to check token balance\nvar walletAddress = "{{wallet_address}}";\nvar balance = await contract.ERC20.BalanceOf(walletAddress);',
    get: "var token = await contract.ERC20.Get();",
    setAllowance:
      '// Address of the Wallet to allow transfers from\nvar spenderAddress = "0x...";\n// The number of tokens to give as allowance\nvar amount = "100";\nawait contract.ERC20.SetAllowance(spenderAddress, amount);',
    totalSupply: "var balance = await contract.ERC20.TotalSupply();",
    transfer:
      '// Address of the Wallet you want to send the tokens to\nvar toAddress = "0x...";\n// The amount of tokens you want to send\nvar amount = "0.1";\nawait contract.ERC20.Transfer(toAddress, amount);',
    transferBatch: undefined,
    transferFrom: undefined,
  },
  Token: {
    burn: '// The amount of this token you want to burn\nvar amount = "1.2";\n\nawait contract.ERC20.Burn(amount);',
    burnFrom: undefined,
    mintBatchTo: undefined,
    mintTo:
      'var toAddress = "{{wallet_address}}"; // Address of the Wallet you want to mint the tokens to\nvar amount = "1.5"; // The amount of this token you want to mint\n\nawait contract.ERC20.MintTo(toAddress, amount);',
    allowance:
      '// Address of the Wallet to check token allowance\nvar spenderAddress = "0x...";\nvar allowance = await contract.ERC20.Allowance(spenderAddress);',
    allowanceOf:
      '// Address of the Wallet who owns the funds\nvar owner = "{{wallet_address}}";\n// Address of the Wallet to check token allowance\nvar spender = "0x...";\nvar allowance = await contract.ERC20.AllowanceOf(owner, spender);',
    balance: "var balance = await contract.ERC20.Balance();",
    balanceOf:
      '// Address of the Wallet to check token balance\nvar walletAddress = "{{wallet_address}}";\nvar balance = await contract.ERC20.BalanceOf(walletAddress);',
    get: "var token = await contract.ERC20.Get();",
    setAllowance:
      '// Address of the Wallet to allow transfers from\nvar spenderAddress = "0x...";\n// The number of tokens to give as allowance\nvar amount = "100";\nawait contract.ERC20.SetAllowance(spenderAddress, amount);',
    totalSupply: "var balance = await contract.ERC20.TotalSupply();",
    transfer:
      '// Address of the Wallet you want to send the tokens to\nvar toAddress = "0x...";\n// The amount of tokens you want to send\nvar amount = "0.1";\nawait contract.ERC20.Transfer(toAddress, amount);',
    transferBatch: undefined,
    transferFrom: undefined,
  },
  NFTDrop: {
    balanceOf:
      'var walletAddress = "{{wallet_address}}";\nvar balance = await contract.ERC721.BalanceOf(walletAddress);\nDebug.Log(balance);',
    burn: 'var tokenId = "0";\nvar result = await contract.ERC721.Burn(tokenId);',
    claimTo:
      'var address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs\nvar quantity = 1; // how many unique NFTs you want to claim\n\nvar tx = await contract.ERC721.ClaimTo(address, quantity);',
    createBatch: undefined,
    get: 'var tokenId = "0";\nvar nft = await contract.ERC721.Get(tokenId);',
    getAllClaimed: undefined,
    getAllUnclaimed: undefined,
    totalClaimedSupply:
      "var claimedNFTCount = await contract.ERC721.TotalClaimedSupply();",
    totalUnclaimedSupply:
      "var unclaimedNFTCount = await contract.ERC721.TotalUnclaimedSupply();",
    transfer:
      'var walletAddress = "{{wallet_address}}";\nvar tokenId = "0";\nawait contract.ERC721.Transfer(walletAddress, tokenId);',
    getAll: "var nfts = await contract.ERC721.GetAll();\nDebug.Log(nfts);",
    getOwned:
      '// Address of the Wallet to get the NFTs of\nvar address = "{{wallet_address}}";\nvar nfts = await contract.ERC721.GetOwned(address);\nDebug.Log(nfts);',
  },
  EditionDrop: {
    burnTokens:
      'var tokenId = "0";\nint amount = 1;\nvar result = await contract.ERC1155.Burn(tokenId, amount);',
    claimTo:
      'var address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs\nvar quantity = 1; // how many unique NFTs you want to claim\n\nvar tx = await contract.ERC1155.ClaimTo(address, quantity);',
    createBatch: undefined,
    getAll: "var nfts = await contract.ERC1155.GetAll();",
    getOwned:
      '// Address of the Wallet to get the NFTs of\nvar address = "{{wallet_address}}";\nvar nfts = await contract.ERC1155.GetOwned(address);',
    airdrop: undefined,
    balanceOf:
      '// Address of the Wallet to check NFT balance\nvar walletAddress = "{{wallet_address}}";\nvar tokenId = "0"; // Id of the NFT to check\nvar balance = await contract.ERC1155.BalanceOf(walletAddress, tokenId);',
    get: 'var nft = await contract.ERC1155.Get("0");',
    transfer:
      '// Address of the Wallet you want to send the NFT to\nvar toAddress = "{{wallet_address}}";\nvar tokenId = "0"; // The token ID of the NFT you want to send\nvar amount = 3; // How many copies of the NFTs to transfer\nawait contract.ERC1155.Transfer(toAddress, tokenId, amount);',
  },
  Marketplace: {
    buyoutListing:
      '// The listing ID of the asset you want to buy\nvar listingId = "0";\n// Quantity of the asset you want to buy\nvar quantityDesired = 1;\n\nawait contract.BuyoutListing(listingId, quantityDesired);',
    getActiveListings: "var listings = await contract.GetActiveListings();",
    getAllListings: "var listings = await contract.GetAllListings();",
    getListing:
      'var listingId = "0";\nvar listing = await contract.GetListing(listingId);',
    getOffers:
      'string listingId = "0";\r\nawait contract.GetOffers(listingId);',
    makeOffer:
      '// The listing ID of the asset you want to offer on\nvar listingId = "0";\n// The price you are willing to offer per token\nvar pricePerToken = 0.5;\n// The quantity of tokens you want to receive for this offer\nvar quantity = 1;\n\nawait contract.MakeOffer(\n  listingId,\n  pricePerToken,\n  quantity,\n);',
    setBidBufferBps: undefined,
    setTimeBufferInSeconds: undefined,
  },
  MarketplaceDirect: {
    acceptOffer: undefined,
    buyoutListing:
      '// The listing ID of the asset you want to buy\r\nvar listingId = "0";\r\n// Quantity of the asset you want to buy\r\nvar quantityDesired = 1;\r\nawait contract.BuyListing(listingId, quantityDesired);',
    cancelListing:
      'string listingId = "0";\r\nawait contract.direct.CancelListing(listingId);',
    createListing:
      'await contract\r\n    .direct\r\n    .CreateListing(new NewDirectListing()\r\n    {\r\n        assetContractAddress = "0x...",\r\n        buyoutPricePerToken = "1",\r\n        currencyContractAddress = "0x...",\r\n        listingDurationInSeconds = 3600,\r\n        quantity = 1,\r\n        reservePricePerToken = "0",\r\n        startTimestamp = 0,\r\n        tokenId = "1",\r\n        type = "direct"\r\n    });',
    makeOffer:
      'string listingId = "0";\r\nstring price = "0.1";\r\nint quantity = 1;\r\nawait contract.MakeOffer(listingId, price, quantity);',
  },
  MarketplaceAuction: {
    buyoutListing:
      '// The listing ID of the asset you want to buy\r\nvar listingId = "0";\r\n// Quantity of the asset you want to buy\r\nvar quantityDesired = 1;\r\nawait contract.BuyListing(listingId, quantityDesired);',
    cancelListing:
      'string listingId = "0";\r\nawait contract.auction.CancelListing(listingId);',
    closeListing:
      'string listingId = "0";\r\nawait contract.auction.ExecuteSale(listingId);',
    createListing:
      'await contract\r\n    .direct\r\n    .CreateListing(new NewDirectListing()\r\n    {\r\n        assetContractAddress = "0x...",\r\n        buyoutPricePerToken = "1",\r\n        currencyContractAddress = "0x...",\r\n        listingDurationInSeconds = 3600,\r\n        quantity = 1,\r\n        reservePricePerToken = "0",\r\n        startTimestamp = 0,\r\n        tokenId = "1",\r\n        type = "auction"\r\n    });',
    executeSale:
      'string listingId = "0";\r\nawait contract.auction.ExecuteSale(listingId);',
    getWinner:
      'string listingId = "0";\r\nawait contract.auction.GetWinner(listingId);',
    getWinningBid:
      'string listingId = "0";\r\nawait contract.auction.GetWinningBid(listingId);',
    makeBid:
      'string listingId = "0";\r\nstring price = "0.1";\r\nint quantity = 1;\r\nawait contract.MakeOffer(listingId, price, quantity);',
  },
  Split: {
    balanceOf:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    balanceOfToken:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    distribute:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    distributeToken:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    getAllRecipients:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    withdraw:
      "// Split is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
  },
  Pack: {
    addPackContents:
      '// Pack token ID\r\nstring packId = "0";\r\n\r\nawait contract\r\n    .AddPackContents(packId,\r\n    new PackRewards()\r\n    {\r\n        erc1155Rewards =\r\n            new List<ERC1155Reward> {\r\n                new ERC1155Reward()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    tokenId = "0",\r\n                    quantityPerReward = "1"\r\n                }\r\n            },\r\n        erc721Rewards =\r\n            new List<ERC721Reward> {\r\n                new ERC721Reward()\r\n                { contractAddress = "0x...", tokenId = "0" }\r\n            },\r\n        erc20Rewards =\r\n            new List<ERC20Reward> {\r\n                new ERC20Reward()\r\n                { contractAddress = "0x...", quantityPerReward = "1" }\r\n            }\r\n    });',
    create:
      'await contract\r\n    .Create(new NewPackInput()\r\n    {\r\n        packMetadata =\r\n            new NFTMetadata()\r\n            {\r\n                name = "My Pack",\r\n                description = "My Pack Description",\r\n                image = "https://myimage.com",\r\n                external_url = "https://myimage.com"\r\n            },\r\n        erc1155Rewards =\r\n            new List<ERC1155Contents> {\r\n                new ERC1155Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    tokenId = "0",\r\n                    quantityPerReward = "1"\r\n                }\r\n            },\r\n        erc721Rewards =\r\n            new List<ERC721Contents> {\r\n                new ERC721Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    tokenId = "0"\r\n                }\r\n            },\r\n        erc20Rewards =\r\n            new List<ERC20Contents> {\r\n                new ERC20Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    quantityPerReward = "1",\r\n                    totalRewards = "1"\r\n                }\r\n            }\r\n    });',
    createTo:
      '// The address to check the funds of\r\nvar address = "{{wallet_address}}";\r\nawait contract\r\n    .CreateTo(address,\r\n    new NewPackInput()\r\n    {\r\n        packMetadata =\r\n            new NFTMetadata()\r\n            {\r\n                name = "My Pack",\r\n                description = "My Pack Description",\r\n                image = "https://myimage.com",\r\n                external_url = "https://myimage.com"\r\n            },\r\n        erc1155Rewards =\r\n            new List<ERC1155Contents> {\r\n                new ERC1155Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    tokenId = "0",\r\n                    quantityPerReward = "1"\r\n                }\r\n            },\r\n        erc721Rewards =\r\n            new List<ERC721Contents> {\r\n                new ERC721Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    tokenId = "0"\r\n                }\r\n            },\r\n        erc20Rewards =\r\n            new List<ERC20Contents> {\r\n                new ERC20Contents()\r\n                {\r\n                    contractAddress = "0x...",\r\n                    quantityPerReward = "1",\r\n                    totalRewards = "1"\r\n                }\r\n            }\r\n    });',
    get: 'var tokenId = "0";\nvar pack = await contract.Get(tokenId);',
    getAll: "var packs = await contract.GetAll();",
    getOwned:
      '// Address of the Wallet to get the packs of\nvar address = "{{wallet_address}}";\nvar packs = await contract.GetOwned(address);',
    getPackContents:
      'var packId = "0";\nvar contents = await contract.GetPackContents(packId);\nDebug.Log(contents.erc20Rewards);\nDebug.Log(contents.erc721Rewards);\nDebug.Log(contents.erc1155Rewards);',
    open: 'var tokenId = "0";\nvar amount = "1";\nvar tx = await contract.Open(tokenId, amount);',
    airdrop: undefined,
    balanceOf:
      '// Address of the Wallet to check NFT balance\nvar walletAddress = "{{wallet_address}}";\nvar tokenId = "0"; // Id of the NFT to check\nvar balance = await contract.BalanceOf(walletAddress, tokenId);',
    transfer:
      '// Address of the Wallet you want to send the NFT to\nvar toAddress = "{{wallet_address}}";\nvar tokenId = "0"; // The token ID of the NFT you want to send\nvar amount = 3; // How many copies of the NFTs to transfer\nawait contract.Transfer(toAddress, tokenId, amount);',
  },
  Vote: {
    canExecute:
      "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    execute:
      "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    getAll:
      "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    hasVoted:
      "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    propose:
      "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    vote: "// Vote is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
  },
  Multiwrap: {
    getWrappedContents:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    unwrap:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    wrap: "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    balanceOf:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    get: "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    getAll:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    getOwned:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
    transfer:
      "// Multiwrap is not yet supported in Unity. You can still use the contract.Read and contract.Write functions to call functions directly.",
  },
  ContractDeployer: {
    deployEdition:
      'await sdk\r\n    .deployer\r\n    .DeployEdition(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployEditionDrop:
      'await sdk\r\n    .deployer\r\n    .DeployEditionDrop(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployMarketplace:
      'await sdk\r\n    .deployer\r\n    .DeployMarketplace(new MarketplaceContractDeployMetadata()\r\n    { name = "My Collection" });',
    deployMultiwrap: undefined,
    deployNFTCollection:
      'await sdk\r\n    .deployer\r\n    .DeployNFTCollection(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployNFTDrop:
      'await sdk\r\n    .deployer\r\n    .DeployNFTDrop(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployPack:
      'await sdk\r\n    .deployer\r\n    .DeployPack(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deploySignatureDrop:
      'await sdk\r\n    .deployer\r\n    .DeploySignatureDrop(new NFTContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deploySplit: undefined,
    deployToken:
      'await sdk\r\n    .deployer\r\n    .DeployToken(new 	TokenContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployTokenDrop:
      'await sdk\r\n    .deployer\r\n    .DeployTokenDrop(new 	TokenContractDeployMetadata()\r\n    { name = "My Collection", primary_sale_recipient = "0x..." });',
    deployVote: undefined,
  },
  ContractEvents: {
    addEventListener: undefined,
    addTransactionListener: undefined,
    getAllEvents: undefined,
    getEvents: undefined,
    listenToAllEvents: undefined,
    removeAllListeners: undefined,

    removeEventListener: undefined,
    removeTransactionListener: undefined,
  },
  DelayedReveal: {
    createDelayedRevealBatch: undefined,
    getBatchesToReveal: undefined,
    reveal: undefined,
  },
  GasCostEstimator: {
    currentGasPriceInGwei: undefined,
    gasCostOf: undefined,
    gasLimitOf: undefined,
  },
  ContractInterceptor: {
    overrideNextTransaction: undefined,
  },
  ContractMetadata: {
    get: undefined,
    set: undefined,
    update: undefined,
  },
  ContractRoles: {
    get: undefined,
    getAll: undefined,
    grant: undefined,
    revoke: undefined,
    setAll: undefined,
  },
  SignatureDrop: {
    burn: 'var tokenId = "0";\nvar result = await contract.ERC721.Burn(tokenId);',
    claimTo:
      'var address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs\nvar quantity = 1; // how many unique NFTs you want to claim\n\nvar tx = await contract.ERC721.ClaimTo(address, quantity);',
    createBatch: undefined,
    getAllClaimed: undefined,
    getAllUnclaimed: undefined,
    totalClaimedSupply:
      "var claimedNFTCount = await contract.ERC721.TotalClaimedSupply();",
    totalUnclaimedSupply:
      "var unclaimedNFTCount = await contract.ERC721.TotalUnclaimedSupply();",
    balanceOf:
      'var walletAddress = "{{wallet_address}}";\nvar balance = await contract.ERC721.BalanceOf(walletAddress);\nDebug.Log(balance);',
    get: 'var tokenId = "0";\nvar nft = await contract.ERC721.Get(tokenId);',
    getAll: "var nfts = await contract.ERC721.GetAll();\nDebug.Log(nfts);",
    getOwned:
      '// Address of the Wallet to get the NFTs of\nvar address = "{{wallet_address}}";\nvar nfts = await contract.ERC721.GetOwned(address);\nDebug.Log(nfts);',
    transfer:
      'var walletAddress = "{{wallet_address}}";\nvar tokenId = "0";\nawait contract.ERC721.Transfer(walletAddress, tokenId);',
    signature:
      'var meta = new NFTMetadata()\n{\n    name = "Unity NFT",\n    description = "Minted From Unity (signature)",\n    image = "ipfs://QmbpciV7R5SSPb6aT9kEBAxoYoXBUsStJkMpxzymV4ZcVc"\n};\nstring connectedAddress = await sdk.wallet.GetAddress();\nvar payload = new ERC721MintPayload(connectedAddress, meta);\nvar signature = await contract.ERC721.signature.Generate(payload); // typically generated on the backend \n// Provide the signature you generated above to the Mint function:\nvar result = await contract.ERC721.signature.Mint(signature);',
  },
  SmartContract: {
    call: '// Write operations\nawait contract.Write("functionName", "arg1", "arg2", "arg3");\n\n// Read operations (place expected return type between <>)\nvar result = await contract.Read<string>("functionName", "arg1", "arg2", "arg3");',
  },
  WalletAuthenticator: {
    Authenticate: 'await sdk.wallet.Authenticate("example.org")',
    GenerateAuthToken:
      "// Generating an authentication token is a server-side admin operation.\n For this reason, it is not available in the Unity SDK.",
    login: "// Login is not available in the Unity SDK.",
    verify:
      "// Generating an authentication token is a server-side admin operation.\n For this reason, it is not available in the Unity SDK.",
  },
  UserWallet: {
    balance: "await sdk.wallet.GetBalance();",
    getAddress: "await sdk.wallet.GetAddress();",
    recoverAddress: 'await sdk.wallet.RecoverAddress("message", "signature");',
    sign: 'await sdk.wallet.Sign("message");',
    transfer: 'await sdk.wallet.Transfer("to", "amount", "currencyAddress");',
  },
  ContractMetadata: {
    get: undefined,
    set: undefined,
    update: undefined,
  },
  PlatformFee: {
    get: undefined,
  },
  PrimarySale: {
    getRecipient: undefined,
    setRecipient: undefined,
  },
  Permissions: {
    get: undefined,
    getAll: undefined,
    grant: undefined,
    revoke: undefined,
    setAll: undefined,
  },
  Royalty: {
    getDefaultRoyaltyInfo: undefined,
    getTokenRoyaltyInfo: undefined,
    setDefaultRoyaltyInfo: undefined,
    setTokenRoyaltyInfo: undefined,
  },
};

/**
 * Take in a TypeScript SDK class name and method name and return a C# snippet
 * @param {string} className
 * @param {string} methodName
 */
export default function createCSharpSnippet(className, methodName) {
  return mapping?.[className]?.[methodName];
}
