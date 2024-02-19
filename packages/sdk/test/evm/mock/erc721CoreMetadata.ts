export const erc721CoreCompilerMetadata = {
  compiler: { version: "0.8.17+commit.8df45f5f" },
  language: "Solidity",
  output: {
    abi: [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        type: "error",
        name: "ERC721AlreadyMinted",
      },
      { inputs: [], type: "error", name: "ERC721CoreInitializationFailed" },
      { inputs: [], type: "error", name: "ERC721CoreMintingDisabled" },
      { inputs: [], type: "error", name: "ERC721InvalidRecipient" },
      {
        inputs: [
          { internalType: "address", name: "operator", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        type: "error",
        name: "ERC721NotApproved",
      },
      {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        type: "error",
        name: "ERC721NotMinted",
      },
      {
        inputs: [
          { internalType: "address", name: "caller", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        type: "error",
        name: "ERC721NotOwner",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
        ],
        type: "error",
        name: "ERC721UnsafeRecipient",
      },
      { inputs: [], type: "error", name: "ERC721ZeroAddress" },
      { inputs: [], type: "error", name: "HookAlreadyInstalled" },
      { inputs: [], type: "error", name: "HookInstallerCallFailed" },
      { inputs: [], type: "error", name: "HookInstallerHookNotInstalled" },
      { inputs: [], type: "error", name: "HookInstallerInvalidHook" },
      { inputs: [], type: "error", name: "HookInstallerInvalidValue" },
      { inputs: [], type: "error", name: "HookInstallerUnauthorizedWrite" },
      { inputs: [], type: "error", name: "HookNotAuthorized" },
      { inputs: [], type: "error", name: "HookNotInstalled" },
      { inputs: [], type: "error", name: "InvalidInitialization" },
      { inputs: [], type: "error", name: "NotInitializing" },
      {
        inputs: [
          { internalType: "address", name: "caller", type: "address" },
          { internalType: "uint256", name: "permissionBits", type: "uint256" },
        ],
        type: "error",
        name: "PermissionUnauthorized",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
            indexed: true,
          },
          {
            internalType: "address",
            name: "spender",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
            indexed: true,
          },
        ],
        type: "event",
        name: "Approval",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
            indexed: true,
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
            indexed: true,
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
            indexed: false,
          },
        ],
        type: "event",
        name: "ApprovalForAll",
        anonymous: false,
      },
      {
        inputs: [],
        type: "event",
        name: "ContractURIUpdated",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "implementation",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "hooks",
            type: "uint256",
            indexed: false,
          },
        ],
        type: "event",
        name: "HooksInstalled",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "implementation",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "hooks",
            type: "uint256",
            indexed: false,
          },
        ],
        type: "event",
        name: "HooksUninstalled",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "uint64",
            name: "version",
            type: "uint64",
            indexed: false,
          },
        ],
        type: "event",
        name: "Initialized",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "permissionBits",
            type: "uint256",
            indexed: false,
          },
        ],
        type: "event",
        name: "PermissionUpdated",
        anonymous: false,
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
            indexed: true,
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
            indexed: true,
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
            indexed: true,
          },
        ],
        type: "event",
        name: "Transfer",
        anonymous: false,
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "ADMIN_ROLE_BITS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "BEFORE_APPROVE_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "BEFORE_BURN_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "BEFORE_MINT_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "BEFORE_TRANSFER_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "ROYALTY_INFO_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "TOKEN_URI_FLAG",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_id", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "approve",
      },
      {
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        stateMutability: "view",
        type: "function",
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
          {
            internalType: "bytes",
            name: "_encodedBeforeBurnArgs",
            type: "bytes",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "burn",
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "contractURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "getAllHooks",
        outputs: [
          {
            internalType: "struct IERC721HookInstaller.ERC721Hooks",
            name: "hooks",
            type: "tuple",
            components: [
              { internalType: "address", name: "beforeMint", type: "address" },
              {
                internalType: "address",
                name: "beforeTransfer",
                type: "address",
              },
              { internalType: "address", name: "beforeBurn", type: "address" },
              {
                internalType: "address",
                name: "beforeApprove",
                type: "address",
              },
              { internalType: "address", name: "tokenURI", type: "address" },
              { internalType: "address", name: "royaltyInfo", type: "address" },
            ],
          },
        ],
      },
      {
        inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        name: "getApproved",
        outputs: [{ internalType: "address", name: "", type: "address" }],
      },
      {
        inputs: [{ internalType: "uint256", name: "_flag", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        name: "getHookImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "grantRole",
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
      {
        inputs: [
          { internalType: "uint256", name: "_hookFlag", type: "uint256" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        stateMutability: "view",
        type: "function",
        name: "hookFunctionRead",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      },
      {
        inputs: [
          { internalType: "uint256", name: "_hookFlag", type: "uint256" },
          { internalType: "uint256", name: "_value", type: "uint256" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        stateMutability: "payable",
        type: "function",
        name: "hookFunctionWrite",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
      },
      {
        inputs: [
          {
            internalType: "struct IInitCall.InitCall",
            name: "_initCall",
            type: "tuple",
            components: [
              { internalType: "address", name: "target", type: "address" },
              { internalType: "uint256", name: "value", type: "uint256" },
              { internalType: "bytes", name: "data", type: "bytes" },
            ],
          },
          { internalType: "address[]", name: "_hooks", type: "address[]" },
          { internalType: "address", name: "_defaultAdmin", type: "address" },
          { internalType: "string", name: "_name", type: "string" },
          { internalType: "string", name: "_symbol", type: "string" },
          { internalType: "string", name: "_contractURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "initialize",
      },
      {
        inputs: [
          { internalType: "contract IHook", name: "_hook", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "installHook",
      },
      {
        inputs: [
          { internalType: "address", name: "_owner", type: "address" },
          { internalType: "address", name: "_operator", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_quantity", type: "uint256" },
          {
            internalType: "bytes",
            name: "_encodedBeforeMintArgs",
            type: "bytes",
          },
        ],
        stateMutability: "payable",
        type: "function",
        name: "mint",
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
      },
      {
        inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "owner", type: "address" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_account", type: "address" },
          { internalType: "uint256", name: "_roleBits", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "revokeRole",
      },
      {
        inputs: [
          { internalType: "uint256", name: "_tokenId", type: "uint256" },
          { internalType: "uint256", name: "_salePrice", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
        name: "royaltyInfo",
        outputs: [
          { internalType: "address", name: "", type: "address" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_id", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "safeTransferFrom",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_id", type: "uint256" },
          { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "safeTransferFrom",
      },
      {
        inputs: [
          { internalType: "address", name: "_operator", type: "address" },
          { internalType: "bool", name: "_approved", type: "bool" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "setApprovalForAll",
      },
      {
        inputs: [{ internalType: "string", name: "_uri", type: "string" }],
        stateMutability: "nonpayable",
        type: "function",
        name: "setContractURI",
      },
      {
        inputs: [
          { internalType: "bytes4", name: "_interfaceId", type: "bytes4" },
        ],
        stateMutability: "view",
        type: "function",
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
      },
      {
        inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
        stateMutability: "view",
        type: "function",
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
      },
      {
        inputs: [],
        stateMutability: "view",
        type: "function",
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_id", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "transferFrom",
      },
      {
        inputs: [
          { internalType: "contract IHook", name: "_hook", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
        name: "uninstallHook",
      },
    ],
    devdoc: {
      kind: "dev",
      methods: {
        "approve(address,uint256)": {
          details:
            "Overriden to call the beforeApprove hook. Skips calling the hook if it doesn't exist.",
          params: {
            _id: "The token ID of the NFT",
            _spender: "The address to approve",
          },
        },
        "balanceOf(address)": {
          params: { _owner: "The address to query the balance of" },
          returns: {
            _0: "balance The number of NFTs owned by the queried address",
          },
        },
        "burn(uint256,bytes)": {
          details:
            "Calls the beforeBurn hook. Skips calling the hook if it doesn't exist.",
          params: {
            _encodedBeforeBurnArgs:
              "ABI encoded arguments to pass to the beforeBurn hook.",
            _tokenId: "The token ID of the NFT to burn.",
          },
        },
        "contractURI()": {
          returns: { _0: "uri The contract URI of the contract." },
        },
        "getHookImplementation(uint256)": {
          params: { _flag: "The bits representing the hook." },
          returns: { _0: "impl The implementation of the hook." },
        },
        "grantRole(address,uint256)": {
          params: {
            _account: "The account to grant permissions to.",
            _roleBits: "The bits representing the permissions to grant.",
          },
        },
        "hasRole(address,uint256)": {
          params: {
            _account: "The account to check.",
            _roleBits: "The bits representing the permissions to check.",
          },
          returns: {
            _0: "hasPermissions Whether the account has the given permissions.",
          },
        },
        "hookFunctionRead(uint256,bytes)": {
          params: {
            _data: "The data to pass to the hook staticcall.",
            _hookFlag: "The bits representing the hook.",
          },
          returns: {
            _0: "returndata The return data from the hook view function call.",
          },
        },
        "initialize((address,uint256,bytes),address[],address,string,string,string)":
          {
            params: {
              _defaultAdmin: "The default admin for the contract.",
              _hooks: "The hooks to install.",
              _name: "The name of the token collection.",
              _symbol: "The symbol of the token collection.",
            },
          },
        "installHook(address)": {
          details:
            "Maps all hook functions implemented by the hook to the hook's address.",
          params: { _hook: "The hook to install." },
        },
        "mint(address,uint256,bytes)": {
          details: "Reverts if beforeMint hook is absent or unsuccessful.",
          params: {
            _encodedBeforeMintArgs:
              "ABI encoded arguments to pass to the beforeMint hook.",
            _quantity: "The quantity of tokens to mint.",
            _to: "The address to mint the token to.",
          },
        },
        "ownerOf(uint256)": {
          details: "Throws if the NFT does not exist.",
          params: { _id: "The token ID of the NFT." },
          returns: { owner: "The address of the owner of the NFT." },
        },
        "revokeRole(address,uint256)": {
          params: {
            _account: "The account to revoke permissions from.",
            _roleBits: "The bits representing the permissions to revoke.",
          },
        },
        "royaltyInfo(uint256,uint256)": {
          params: {
            _salePrice: "The sale price of the NFT",
            _tokenId: "The token ID of the NFT",
          },
          returns: {
            _0: "recipient The royalty recipient address",
            _1: "royaltyAmount The royalty amount to send to the recipient as part of a sale",
          },
        },
        "safeTransferFrom(address,address,uint256)": {
          params: {
            _from: "The address to transfer from",
            _id: "The token ID of the NFT",
            _to: "The address to transfer to",
          },
        },
        "safeTransferFrom(address,address,uint256,bytes)": {
          params: {
            _data:
              "Additional data passed onto the `onERC721Received` call to the recipient",
            _from: "The address to transfer from",
            _id: "The token ID of the NFT",
            _to: "The address to transfer to",
          },
        },
        "setApprovalForAll(address,bool)": {
          params: {
            _approved: "Whether the operator is approved",
            _operator: "The address to approve or revoke approval from",
          },
        },
        "setContractURI(string)": {
          details: "Only callable by contract admin.",
          params: { _uri: "The contract URI to set." },
        },
        "supportsInterface(bytes4)": {
          params: {
            _interfaceId: "The interface ID of the interface to check for",
          },
        },
        "tokenURI(uint256)": {
          details: "Always returns metadata queried from the metadata source.",
          params: { _id: "The token ID of the NFT." },
          returns: { _0: "metadata The URI to fetch metadata from." },
        },
        "totalSupply()": {
          returns: { _0: "supply The total circulating supply of NFTs" },
        },
        "transferFrom(address,address,uint256)": {
          details:
            "Overriden to call the beforeTransfer hook. Skips calling the hook if it doesn't exist.",
          params: {
            _from: "The address to transfer from",
            _id: "The token ID of the NFT",
            _to: "The address to transfer to",
          },
        },
        "uninstallHook(address)": {
          details: "Reverts if the hook is not installed already.",
          params: { _hook: "The hook to uninstall." },
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "ADMIN_ROLE_BITS()": {
          notice: "The bits that represent the admin role.",
        },
        "BEFORE_APPROVE_FLAG()": {
          notice: "Bits representing the before approve hook.",
        },
        "BEFORE_BURN_FLAG()": {
          notice: "Bits representing the before burn hook.",
        },
        "BEFORE_MINT_FLAG()": {
          notice: "Bits representing the before mint hook.",
        },
        "BEFORE_TRANSFER_FLAG()": {
          notice: "Bits representing the before transfer hook.",
        },
        "ROYALTY_INFO_FLAG()": {
          notice: "Bits representing the royalty hook.",
        },
        "TOKEN_URI_FLAG()": { notice: "Bits representing the token URI hook." },
        "approve(address,uint256)": {
          notice:
            "Approves an address to transfer a specific NFT. Reverts if caller is not owner or approved operator.",
        },
        "balanceOf(address)": {
          notice: "Returns the total quantity of NFTs owned by an address.",
        },
        "burn(uint256,bytes)": { notice: "Burns an NFT." },
        "contractURI()": {
          notice: "Returns the contract URI of the contract.",
        },
        "getAllHooks()": {
          notice:
            "Returns all of the contract's hooks and their implementations.",
        },
        "getApproved(uint256)": {
          notice: "Returns the address of the approved spender of a token.",
        },
        "getHookImplementation(uint256)": {
          notice: "Retusn the implementation of a given hook, if any.",
        },
        "grantRole(address,uint256)": {
          notice: "Grants the given permissions to an account.",
        },
        "hasRole(address,uint256)": {
          notice: "Returns whether an account has the given permissions.",
        },
        "hookFunctionRead(uint256,bytes)": {
          notice:
            "A generic entrypoint to read state of any of the installed hooks.",
        },
        "hookFunctionWrite(uint256,uint256,bytes)": {
          notice:
            "A generic entrypoint to write state of any of the installed hooks.",
        },
        "initialize((address,uint256,bytes),address[],address,string,string,string)":
          {
            notice: "Initializes the ERC-721 Core contract.",
          },
        "installHook(address)": { notice: "Installs a hook in the contract." },
        "isApprovedForAll(address,address)": {
          notice:
            "Returns whether the caller is approved to transfer any of the owner's NFTs.",
        },
        "mint(address,uint256,bytes)": {
          notice: "Mints a token. Calls the beforeMint hook.",
        },
        "name()": { notice: "The name of the token." },
        "ownerOf(uint256)": { notice: "Returns the owner of an NFT." },
        "revokeRole(address,uint256)": {
          notice: "Revokes the given permissions from an account.",
        },
        "royaltyInfo(uint256,uint256)": {
          notice: "Returns the royalty amount for a given NFT and sale price.",
        },
        "safeTransferFrom(address,address,uint256)": {
          notice:
            "Transfers ownership of an NFT from one address to another. If transfer is recipient is a smart contract,          checks if recipient implements ERC721Receiver interface and calls the `onERC721Received` function.",
        },
        "safeTransferFrom(address,address,uint256,bytes)": {
          notice:
            "Transfers ownership of an NFT from one address to another. If transfer is recipient is a smart contract,          checks if recipient implements ERC721Receiver interface and calls the `onERC721Received` function.",
        },
        "setApprovalForAll(address,bool)": {
          notice:
            "Approves or revokes approval from an operator to transfer or issue approval for all of the caller's NFTs.",
        },
        "setContractURI(string)": {
          notice: "Sets the contract URI of the contract.",
        },
        "supportsInterface(bytes4)": {
          notice:
            "Returns whether the contract implements an interface with the given interface ID.",
        },
        "symbol()": { notice: "The symbol of the token." },
        "tokenURI(uint256)": {
          notice: "Returns the token metadata of an NFT.",
        },
        "totalSupply()": {
          notice: "Returns the total circulating supply of NFTs.",
        },
        "transferFrom(address,address,uint256)": {
          notice: "Transfers ownership of an NFT from one address to another.",
        },
        "uninstallHook(address)": {
          notice: "Uninstalls a hook in the contract.",
        },
      },
      version: 1,
    },
  },
  settings: {
    remappings: [
      "@manifoldxyz/creator-core-solidity/=node_modules/@manifoldxyz/creator-core-solidity/",
      "@manifoldxyz/libraries-solidity/=node_modules/@manifoldxyz/libraries-solidity/",
      "@openzeppelin/contracts-upgradeable/=node_modules/@openzeppelin/contracts-upgradeable/",
      "@openzeppelin/contracts/=node_modules/@openzeppelin/contracts/",
      "@thirdweb-dev/dynamic-contracts/=node_modules/@thirdweb-dev/dynamic-contracts/src/",
      "@zoralabs/protocol-rewards/src/=node_modules/@zoralabs/protocol-rewards/dist/contracts/",
      "ds-test/=lib/forge-std/lib/ds-test/src/",
      "erc721a-upgradeable/=node_modules/erc721a-upgradeable/contracts/",
      "forge-std/=lib/forge-std/src/",
    ],
    optimizer: { enabled: true, runs: 200 },
    metadata: { bytecodeHash: "ipfs" },
    compilationTarget: { "src/core/token/ERC721Core.sol": "ERC721Core" },
    evmVersion: "london",
    libraries: {},
  },
  sources: {
    "src/common/Initializable.sol": {
      keccak256:
        "0x373c414945f95792f99db41c67bc40dc2aa63d9e3770ef27e398aef73e9c7b3f",
      urls: [
        "bzz-raw://73c9d8c7d928269db7d988c163227d38f374d827a34e4050ca19621fb13ba3d0",
        "dweb:/ipfs/QmVJBYEgzhocAL2ozkWxTk9qun1Zh8kPLH4PStDw53w5D3",
      ],
      license: "MIT",
    },
    "src/common/Permission.sol": {
      keccak256:
        "0xec4a7104910f8acccebe5f8d87bac11b8de47e582bcf64cef89dd09042da65c0",
      urls: [
        "bzz-raw://447278b939a86b508adef2bb1d055a2db1c7141feffcaa8d685594d9184af5d2",
        "dweb:/ipfs/QmPVYzGPwZfHPSWgZVewnroJ5Wu5fQvVzEAC15YXWv98JX",
      ],
      license: "Apache-2.0",
    },
    "src/core/token/ERC721Core.sol": {
      keccak256:
        "0xc5a04abacb942341fe0d2b7db592383ecc41fc5df66c752bc70f0267f0a10753",
      urls: [
        "bzz-raw://236c5735e40b3e1fad9cf172f8dadd5fa56b0f8bcb3bd4787fc97dc887128726",
        "dweb:/ipfs/QmZgkTPsDcZPKWD9AWqV6wMjprEWiSoKtEnxdaP7wobBG5",
      ],
      license: "Apache-2.0",
    },
    "src/core/token/ERC721Initializable.sol": {
      keccak256:
        "0xbf7bb872c33d1dee572a915f2c986f05615a53be44e4a52459787b7be4893937",
      urls: [
        "bzz-raw://8cd49f079b132ddcccb3106ccfc06bf049ecce44ef8d14fec631a40499ad8f4f",
        "dweb:/ipfs/QmUL2fYbGRutQbn1Dc8RuR5qsxaK41miSiEVY63NtdFFpF",
      ],
      license: "Apache-2.0",
    },
    "src/hook/HookInstaller.sol": {
      keccak256:
        "0xd73bdaad54b6d848f643cd8393d9c908dd1dff6f77837f27ee1e1e006369bb68",
      urls: [
        "bzz-raw://e11a479dd005cae01e984764ad3307a13eed039c388ba42be1d58c02cecae478",
        "dweb:/ipfs/Qmf2f1EkiT7thu6poq23Kua4CUS3uaGLQ7bayDEzFFC4fo",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IInitCall.sol": {
      keccak256:
        "0x9a04b9d6ca1fe392e9b95f9d70e253447e2ece288a8ca02828dc533a09773729",
      urls: [
        "bzz-raw://451a091a1d61a3c6e93ed7386c33010a24a954a5e2a9ac72f6e0db367d01d022",
        "dweb:/ipfs/QmWAUkiS63N2Z83VYwQvUQJpL4MQaARcUf7F2ijtq5fLrT",
      ],
      license: "Apache-2.0",
    },
    "src/interface/common/IPermission.sol": {
      keccak256:
        "0x389e9a570881eb488c2ae61dab8c11718d6b263975f259f3798f6fde3eebf4b3",
      urls: [
        "bzz-raw://226d2f2d3aa81e78a7af6eb7b38274736f31345472289e2197f75b702d9c0f15",
        "dweb:/ipfs/QmYkCNpe9wvFKyepauGBopWKyUZXAeVkZqzQsjK28Nynm5",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC165.sol": {
      keccak256:
        "0xbfd9a728506763743f268cee73040a06a65b71447c3cd72cd39fe03f4e7931e9",
      urls: [
        "bzz-raw://823f993ce8faf08f30fa821be7386006b7d965e58ec378023bdcd7a357079013",
        "dweb:/ipfs/QmaEHG9WxtPjByEA2LrG4T5Xy9vsroq3iAVDFyD9rAYCPf",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC2981.sol": {
      keccak256:
        "0xe01984a051f38dcbf60f704e6e0078d6becd764e4e0f73d6676a9597cfe33657",
      urls: [
        "bzz-raw://6b19c49c713cd8d933ea375b12da0d79b8748f6e146008983668bc0da90fcbbb",
        "dweb:/ipfs/QmcAWYbSz9Msboa8Fkvafpj4KbUm1w23uo1vcf1WeJ2W3h",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC721.sol": {
      keccak256:
        "0xa4db18b6c36d1d3d759d4609e61366c3b9732433cb585241cf7ec07c03884e89",
      urls: [
        "bzz-raw://103bb0689847417f906d3031b74eda5050b3c96c400ce4844e10fda2edc2a5bb",
        "dweb:/ipfs/QmQg6jJSfn3HrB5r9P4XvooNjCiMHfVHZyoZ77jJySuboH",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC721Metadata.sol": {
      keccak256:
        "0x913d49c0021ef11ad148c3b5b35d32163fb9d8b97e95f333f90b963800acb5e8",
      urls: [
        "bzz-raw://47778640f4899060660f511aa36843d5fa80aeeba5f5f87a31914781096c8a62",
        "dweb:/ipfs/QmeDoEBPHB5LqCte4kmkkYx2Qkw37kRkzJsBLFuRAQF7DS",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC721Receiver.sol": {
      keccak256:
        "0xb728d098d6803fda0f5f2ee475d08bbc01a95bf40c3bdcc777692f7941e70376",
      urls: [
        "bzz-raw://9ef7196d462b2ed17bf83df8ae734966d81dec971f046a2614862f04be4ef76f",
        "dweb:/ipfs/QmUp8p1pGJVuc59e1rAqqZyLkAuWedQvy8bxisjpBNVcvU",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC721Supply.sol": {
      keccak256:
        "0x3be54253a32dd414482813705dc4c6024ddabb6e512e9f4293a1921f561500b0",
      urls: [
        "bzz-raw://7998dbb1252e2086604c6693d6d8f18628722f3893b759f444e8c5df4a1afd68",
        "dweb:/ipfs/QmR4GUjEh6fU5XjKVJwpeq17E4x27WniziNN9gjHAonaBK",
      ],
      license: "Apache-2.0",
    },
    "src/interface/eip/IERC7572.sol": {
      keccak256:
        "0xc804e0cfd78b9d5702f923672c70d867b2ad62c94003e01a10392097d5f44466",
      urls: [
        "bzz-raw://ea05c153db781ec99d23debfb8b6e8e51ed4e54067809cb300924d25f0db366e",
        "dweb:/ipfs/QmcpCamqvLo6TwsYQngWh2Uf5pNd1cjVUUDqQZY1AGpr3V",
      ],
      license: "Apache-2.0",
    },
    "src/interface/errors/IERC721CoreCustomErrors.sol": {
      keccak256:
        "0x55929bd4c6dd48117b444306cee35ccc335393f2c1c26ac97b74b29c57aeecb8",
      urls: [
        "bzz-raw://41b0057ef64300718a47a57479520a2de8c95aa7726878a523735bfd11eefd15",
        "dweb:/ipfs/QmYxofAYqSAYnJWTuR3WMwRrNEtLD4Janfrn5gCSA7wZhf",
      ],
      license: "Apache-2.0",
    },
    "src/interface/errors/IERC721CustomErrors.sol": {
      keccak256:
        "0xa2aa3479ca815804822843ea1fb48643bb05a8312fba19193b49b442dbdd24ae",
      urls: [
        "bzz-raw://4a43659c507eee3cb2b3f7d40443cc628c7f6f42d9e1fb5e8a6b009b952f643a",
        "dweb:/ipfs/Qmd45N8isVJAaCS5Nj7vUgGrsBxrKgoqc23EeoR8oKkUrm",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IERC721Hook.sol": {
      keccak256:
        "0x979c3f2190d04188aa06382f6022b36793b311e11ff74f637f7e1ec29962bba0",
      urls: [
        "bzz-raw://d9b70fbe2b14c8502a6a3f3093f5aad057dabe1e346a041e8d14d3f920fc815b",
        "dweb:/ipfs/QmW189KsKDJU1jCpdr1h3svh8rZYNPCvGB4d9kj1vxHiaQ",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IERC721HookInstaller.sol": {
      keccak256:
        "0x3969265af63412283c5d3d0de18dca6fb5e3a74fd69cdd2721a3f657490bd49a",
      urls: [
        "bzz-raw://7677f7d2060476b2a2e08d00b201f085295ef6e3944d86c2f693883c74ac968d",
        "dweb:/ipfs/QmWWxgZub5Y4EYUiuSAF3jBWtVACh74GTPSndtne78PDMa",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IHook.sol": {
      keccak256:
        "0xbfd99a27d2a9b48ac23931d53c51a7da8f299be51147dea32b07e3b6cf9383d9",
      urls: [
        "bzz-raw://4c5289c146ea2104eb70273f6ebd08647a125366d2dc87707df97c906b328a2d",
        "dweb:/ipfs/QmYgbccLAUJsfKhS6CXgsJi7BY16WuUY1X7LLwhSEYkhMQ",
      ],
      license: "Apache-2.0",
    },
    "src/interface/hook/IHookInstaller.sol": {
      keccak256:
        "0xe150630b5c421aaf61c1e6940313c695ab2765ee73b6f1cb8397923f2d0b9011",
      urls: [
        "bzz-raw://b548f9ed08b87154af3831a79095a8c7d714f4c99f67a0c2453d5332dbe1e8dc",
        "dweb:/ipfs/QmRqz65eTXbVWudzwcKXn4eKLxXteNWVWfzTLjZHxxiiki",
      ],
      license: "Apache-2.0",
    },
    "src/lib/LibBitmap.sol": {
      keccak256:
        "0xf64175d6a01b898df3480e2211947e265a125c3fd52dbff2bb63d4bed031bb00",
      urls: [
        "bzz-raw://a5c3e54e0495451fe5b20bba7d85de2f1a401bf4b1e2bd88aa701f5b75972c14",
        "dweb:/ipfs/QmUqLxEy9mR234dgvoKM78S8FJmiJCkPbxdsxhNvMbfgTu",
      ],
      license: "MIT",
    },
    "src/storage/common/PermissionStorage.sol": {
      keccak256:
        "0x75c22499878913ccb31356d72e89abec1648a6a059dc7b7228afae47d5391a02",
      urls: [
        "bzz-raw://e173f2eab0d69c2d4ff87174a01f5ab404025f27350c60c6df3b0f444ab82099",
        "dweb:/ipfs/QmWj9HftTyizdWy7k5JHxYoAGFBat2j77cinMpQFbCpVeW",
      ],
      license: "Apache-2.0",
    },
    "src/storage/core/ERC721CoreStorage.sol": {
      keccak256:
        "0x47822a0fce9841368f805c2d2aeda0f0e4240e56332413c36ca3be8acfd95f62",
      urls: [
        "bzz-raw://2b6d99a849c0a276a34068eb6e53adda28ff7d0dbaac1fc01606d84e262f6e9e",
        "dweb:/ipfs/QmZ5YBJ1LC1nz5p4YufrJ1c1dUdxsxbKTLpujKMm6AFoEu",
      ],
      license: "Apache-2.0",
    },
    "src/storage/core/ERC721InitializableStorage.sol": {
      keccak256:
        "0xba16941d2a8072920906bcb7a3f14435e9151a0cd596e36c48aeff58c1dc83ce",
      urls: [
        "bzz-raw://626236f5fd95bc4dac0c10ca826e9cc500357e26a38a01a27ccbcd2b5b8d1a3c",
        "dweb:/ipfs/QmTxSCGUzmxo6ZHpDUbFaUeK89AxKp5bmiL5tc2iiXzN4D",
      ],
      license: "Apache-2.0",
    },
    "src/storage/hook/HookInstallerStorage.sol": {
      keccak256:
        "0xdd86ee42a9be8a1f66aa40dfd34d4c87c0a61ef90edd9eb4215ccc8f5f33ea03",
      urls: [
        "bzz-raw://d8a222092d34f37b31ee09d9031a96ec5a67060ecacd22ed177d19fbbc4cc3bf",
        "dweb:/ipfs/QmUrJ8hkGMZkJfzaeaLd16iFDLTcJXxtVCZ2fMb6aLLc5q",
      ],
      license: "Apache-2.0",
    },
  },
  version: 1,
};
export const erc721CoreBytecode =
  "0x60806040523480156200001157600080fd5b506200001c6200002c565b620000266200002c565b62000090565b63409feecd19805460018116156200004c5763f92ee8a96000526004601cfd5b8160c01c808260011c146200008b578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b612ac980620000a06000396000f3fe60806040526004361061020f5760003560e01c806370a0823111610118578063b88d4fde116100a0578063e824bc781161006f578063e824bc7814610600578063e8a3d48514610615578063e985e9c51461062a578063fbea28c014610692578063fe9d93031461070257600080fd5b8063b88d4fde1461058b578063c87b56dd146105ab578063cb856b98146105cb578063cea1489f146105eb57600080fd5b806394d008ef116100e757806394d008ef1461052e57806395d89b41146105415780639b364a0314610556578063a22cb4651461056b578063a89e4dec146104d957600080fd5b806370a08231146104b9578063751d4753146104d9578063757732ad146104ee578063938e3d7b1461050e57600080fd5b8063240779531161019b57806342842e0e1161016a57806342842e0e1461042457806355625be8146104445780635c97f4a2146104645780636352211e146104845780636a87fb03146104a457600080fd5b8063240779531461039057806326d8c4ab146103b05780632a55205a146103c55780633c09e2fd1461040457600080fd5b80630912ed77116101e25780630912ed77146102fa578063095ea7b31461031a57806315b48fe61461033a57806318160ddd1461034d57806323b872dd1461037057600080fd5b806301ffc9a71461021457806302007c491461024957806306fdde031461026b578063081812fc1461028d575b600080fd5b34801561022057600080fd5b5061023461022f366004611ff3565b610722565b60405190151581526020015b60405180910390f35b34801561025557600080fd5b50610269610264366004612150565b61078f565b005b34801561027757600080fd5b5061028061093e565b604051610240919061228a565b34801561029957600080fd5b506102e26102a836600461229d565b60009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da0560205260409020546001600160a01b031690565b6040516001600160a01b039091168152602001610240565b34801561030657600080fd5b506102696103153660046122b6565b6109de565b34801561032657600080fd5b506102696103353660046122b6565b610a24565b610280610348366004612323565b610a3f565b34801561035957600080fd5b50610362610b65565b604051908152602001610240565b34801561037c57600080fd5b5061026961038b366004612375565b610b9b565b34801561039c57600080fd5b506102e26103ab36600461229d565b610bb1565b3480156103bc57600080fd5b50610362604081565b3480156103d157600080fd5b506103e56103e03660046123b6565b610beb565b604080516001600160a01b039093168352602083019190915201610240565b34801561041057600080fd5b5061026961041f3660046122b6565b610c04565b34801561043057600080fd5b5061026961043f366004612375565b610c40565b34801561045057600080fd5b5061026961045f3660046123d8565b610d20565b34801561047057600080fd5b5061023461047f3660046122b6565b610d52565b34801561049057600080fd5b506102e261049f36600461229d565b610d92565b3480156104b057600080fd5b50610362601081565b3480156104c557600080fd5b506103626104d43660046123d8565b610ddd565b3480156104e557600080fd5b50610362600281565b3480156104fa57600080fd5b506102806105093660046123f5565b610e41565b34801561051a57600080fd5b50610269610529366004612440565b610f1d565b61026961053c36600461247c565b610f58565b34801561054d57600080fd5b50610280610f7c565b34801561056257600080fd5b50610362600881565b34801561057757600080fd5b506102696105863660046124d4565b610f9b565b34801561059757600080fd5b506102696105a6366004612512565b610fb3565b3480156105b757600080fd5b506102806105c636600461229d565b611081565b3480156105d757600080fd5b506102696105e63660046123d8565b61108c565b3480156105f757600080fd5b50610362602081565b34801561060c57600080fd5b50610362600481565b34801561062157600080fd5b506102806110bb565b34801561063657600080fd5b50610234610645366004612584565b6001600160a01b0391821660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da066020908152604080832093909416825291909152205460ff1690565b34801561069e57600080fd5b506106a76110e3565b604051610240919081516001600160a01b03908116825260208084015182169083015260408084015182169083015260608084015182169083015260808084015182169083015260a092830151169181019190915260c00190565b34801561070e57600080fd5b5061026961071d3660046125b2565b6111b2565b60006301ffc9a760e01b6001600160e01b03198316148061075357506380ac58cd60e01b6001600160e01b03198316145b8061076e5750635b5e139f60e01b6001600160e01b03198316145b80610789575063152a902d60e11b6001600160e01b03198316145b92915050565b63409feecd1980549081156107ba5760018260011c14303b106107ba5763f92ee8a96000526004601cfd5b600390556107c782611205565b6107d1848461125d565b6107dc85600261129b565b8560005b81811015610829576108178989838181106107fd576107fd6125f8565b905060200201602081019061081291906123d8565b611318565b8061082181612624565b9150506107e0565b50600061083960208b018b6123d8565b6001600160a01b0316146108f75760008061085760208c018c6123d8565b6001600160a01b031660208c013561087260408e018e61263d565b604051610880929190612683565b60006040518083038185875af1925050503d80600081146108bd576040519150601f19603f3d011682016040523d82523d6000602084013e6108c2565b606091505b5091509150816108f4578051156108db57805160208201fd5b60405163018b41fb60e01b815260040160405180910390fd5b50505b506001811661093457600263409feecd195560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050505050505050565b6060600080516020612a748339815191525b805461095b90612693565b80601f016020809104026020016040519081016040528092919081815260200182805461098790612693565b80156109d45780601f106109a9576101008083540402835291602001916109d4565b820191906000526020600020905b8154815290600101906020018083116109b757829003601f168201915b5050505050905090565b60026109ea3382610d52565b610a15576040516369d3b0cd60e11b8152336004820152602481018290526044015b60405180910390fd5b610a1f8383611419565b505050565b610a31338383600161148d565b610a3b8282611523565b5050565b6060610a4a33611614565b610a6757604051635e7307c360e01b815260040160405180910390fd5b610a73604060026127a3565b851115610a9357604051636ce4dc9960e11b815260040160405180910390fd5b833414610ab357604051630100cdbf60e71b815260040160405180910390fd5b6000610abe86610bb1565b90506001600160a01b038116610ae757604051631c6040eb60e11b815260040160405180910390fd5b600080826001600160a01b0316878787604051610b05929190612683565b60006040518083038185875af1925050503d8060008114610b42576040519150601f19603f3d011682016040523d82523d6000602084013e610b47565b606091505b509150915081610b5a57610b5a81611621565b979650505050505050565b7fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da0254600090610b96906001906127af565b905090565b610ba683838361164a565b610a1f8383836116d4565b60009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960260205260409020546001600160a01b031690565b600080610bf88484611885565b915091505b9250929050565b6002610c103382610d52565b610c36576040516369d3b0cd60e11b815233600482015260248101829052604401610a0c565b610a1f838361129b565b610c4b838383610b9b565b6001600160a01b0382163b15801590610cf75750604051630a85bd0160e11b8082523360048301526001600160a01b03858116602484015260448301849052608060648401526000608484015290919084169063150b7a029060a4016020604051808303816000875af1158015610cc6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cea91906127c2565b6001600160e01b03191614155b15610a1f57604051631cb6b58760e01b81526001600160a01b0383166004820152602401610a0c565b610d2933611614565b610d4657604051630457ef4d60e21b815260040160405180910390fd5b610d4f81611922565b50565b6001600160a01b039190911660009081527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d00602052604090205416151590565b6000818152600080516020612a5483398151915260205260409020546001600160a01b031680610dd857604051630c4414d160e01b815260048101839052602401610a0c565b919050565b60006001600160a01b038216610e0657604051630bb6521b60e41b815260040160405180910390fd5b506001600160a01b031660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da04602052604090205490565b6060610e4f604060026127a3565b841115610e6f57604051636ce4dc9960e11b815260040160405180910390fd5b6000610e7a85610bb1565b90506001600160a01b038116610ea357604051631c6040eb60e11b815260040160405180910390fd5b600080826001600160a01b03168686604051610ec0929190612683565b600060405180830381855afa9150503d8060008114610efb576040519150601f19603f3d011682016040523d82523d6000602084013e610f00565b606091505b509150915081610f1357610f1381611621565b9695505050505050565b6002610f293382610d52565b610f4f576040516369d3b0cd60e11b815233600482015260248101829052604401610a0c565b610a3b82611205565b600080610f66858585611a91565b91509150610f75858383611b51565b5050505050565b6060600080516020612a74833981519152600101805461095b90612693565b610fa933836000198461148d565b610a3b8282611caf565b610fbe858585610b9b565b6001600160a01b0384163b158015906110585750604051630a85bd0160e11b808252906001600160a01b0386169063150b7a02906110089033908a908990899089906004016127df565b6020604051808303816000875af1158015611027573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104b91906127c2565b6001600160e01b03191614155b15610f7557604051631cb6b58760e01b81526001600160a01b0385166004820152602401610a0c565b606061078982611d3a565b61109533611614565b6110b257604051630457ef4d60e21b815260040160405180910390fd5b610d4f81611318565b60607fa6a5e5e300f9d3ac9405142360702196b4ea62114d51fa073601cc0874436a00610950565b6040805160c081018252600080825260208201819052918101829052606081018290526080810182905260a08101919091526040518060c0016040528061112a6002610bb1565b6001600160a01b031681526020016111426004610bb1565b6001600160a01b0316815260200161115a6008610bb1565b6001600160a01b031681526020016111726010610bb1565b6001600160a01b0316815260200161118a6020610bb1565b6001600160a01b031681526020016111a26040610bb1565b6001600160a01b03169052919050565b60006111bd83610d92565b90506001600160a01b03811633146111f157604051631e54210960e11b815233600482015260248101849052604401610a0c565b6111fc818484611dcf565b610a1f83611e1c565b7fa6a5e5e300f9d3ac9405142360702196b4ea62114d51fa073601cc0874436a006112308282612879565b506040517fa5d4097edda6d87cb9329af83fb3712ef77eeb13738ffe43cc35a4ce305ad96290600090a150565b611265611f02565b600080516020612a748339815191528061127f8482612879565b506001810161128e8382612879565b5060016002909101555050565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d006020818152604092839020805486179081905592518581529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b91015b60405180910390a250505050565b6000816001600160a01b0316635cd2525e6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611358573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061137c9190612938565b905061138b8183611f20611f48565b6001600160981b03600883901c1660009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d9601602052604090208054600160ff85161b179055816001600160a01b03167f03c84f92f5ec4b758937aeeb66e7fda2d2be4eaf0358eab1af55bc7c0fb913d48260405161140d91815260200190565b60405180910390a25050565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d00602081815260409283902080548619169081905592518381529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b910161130a565b60006114996010610bb1565b90506001600160a01b03811615610f7557604051636ba0946560e11b81526001600160a01b038681166004830152858116602483015260448201859052831515606483015282169063d74128ca90608401600060405180830381600087803b15801561150457600080fd5b505af1158015611518573d6000803e3d6000fd5b505050505050505050565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b031633811480159061158e57506001600160a01b0381166000908152600683016020908152604080832033845290915290205460ff16155b156115b5576040516306b55d7b60e41b815233600482015260248101849052604401610a0c565b600083815260058301602052604080822080546001600160a01b0319166001600160a01b0388811691821790925591518693918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a450505050565b6000610789826002610d52565b8051156116315780518082602001fd5b60405163f7a3cadb60e01b815260040160405180910390fd5b60006116566004610bb1565b90506001600160a01b038116156116ce57604051631ffb811f60e01b81526001600160a01b038581166004830152848116602483015260448201849052821690631ffb811f906064015b600060405180830381600087803b1580156116ba57600080fd5b505af1158015610934573d6000803e3d6000fd5b50505050565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b0385811691161461173d57604051631e54210960e11b81526001600160a01b038516600482015260248101839052604401610a0c565b6001600160a01b03831661176457604051638870804160e01b815260040160405180910390fd5b336001600160a01b038516148015906117a357506001600160a01b0384166000908152600682016020908152604080832033845290915290205460ff16155b80156117c8575060008281526005820160205260409020546001600160a01b03163314155b156117ef576040516306b55d7b60e41b815233600482015260248101839052604401610a0c565b6001600160a01b038085166000818152600484016020908152604080832080546000190190559387168083528483208054600101905586835260038601825284832080546001600160a01b031990811683179091556005870190925284832080549092169091559251859392917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a450505050565b60008060006118946040610bb1565b90506001600160a01b0381161561191a5760405163152a902d60e11b815260048101869052602481018590526001600160a01b03821690632a55205a906044016040805180830381865afa1580156118f0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119149190612951565b90935091505b509250929050565b600881901c6001600160981b031660009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960160205260409020547f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d96009060ff83161c6001166119a557604051630e10316560e11b815260040160405180910390fd5b6000826001600160a01b0316635cd2525e6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156119e5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a099190612938565b9050611a19816000611fd7611f48565b6001600160981b03600884901c16600090815260018381016020526040909120805460ff86169290921b199091169055826001600160a01b03167fd9bb1c586b78bf32a634a5af7de6efa3b89b145fb0ed65a58263603a12fd338a82604051611a8491815260200190565b60405180910390a2505050565b6000806000611aa06002610bb1565b90506001600160a01b03811615611b2f5760405163b6fb084160e01b81526001600160a01b0382169063b6fb0841903490611ae3908a908a908a9060040161297f565b604080518083038185885af1158015611b00573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190611b2591906129af565b9093509150611b48565b604051635b71085560e01b815260040160405180910390fd5b50935093915050565b6001600160a01b038316611b7857604051638870804160e01b815260040160405180910390fd5b6000611b8482846129d3565b6001600160a01b03851660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da04602052604090208054840190557fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da028054840190559050600080516020612a74833981519152835b82811015611ca75760008181526003830160205260409020546001600160a01b031615611c3e5760405163013e9e9160e01b815260048101829052602401610a0c565b600081815260038301602052604080822080546001600160a01b0319166001600160a01b038a1690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480611c9f81612624565b915050611bfb565b505050505050565b3360008181527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da06602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b60606000611d486020610bb1565b90506001600160a01b03811615611dc95760405163c87b56dd60e01b8152600481018490526001600160a01b0382169063c87b56dd90602401600060405180830381865afa158015611d9e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611dc691908101906129e6565b91505b50919050565b6000611ddb6008610bb1565b90506001600160a01b038116156116ce576040516376f103eb60e11b81526001600160a01b0382169063ede207d6906116a09087908790879060040161297f565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b031680611e7257604051630c4414d160e01b815260048101849052602401610a0c565b6001600160a01b038116600081815260048401602090815260408083208054600019908101909155600287018054909101905586835260038601825280832080546001600160a01b0319908116909155600587019092528083208054909216909155518592907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a4505050565b63409feecd1954600116611f1e5763d7e6bcf86000526004601cfd5b565b600081831615611f43576040516375df761f60e11b815260040160405180910390fd5b501790565b7f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960080546000611f79604060026127a3565b90505b6001811115611fcf5785811615611fc757611f9b81838663ffffffff16565b6000828152600285016020526040902080546001600160a01b0319166001600160a01b03881617905591505b60011c611f7c565b509055505050565b90191690565b6001600160e01b031981168114610d4f57600080fd5b60006020828403121561200557600080fd5b813561201081611fdd565b9392505050565b600060608284031215611dc957600080fd5b60008083601f84011261203b57600080fd5b5081356001600160401b0381111561205257600080fd5b6020830191508360208260051b8501011115610bfd57600080fd5b6001600160a01b0381168114610d4f57600080fd5b8035610dd88161206d565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156120cb576120cb61208d565b604052919050565b60006001600160401b038211156120ec576120ec61208d565b50601f01601f191660200190565b600082601f83011261210b57600080fd5b813561211e612119826120d3565b6120a3565b81815284602083860101111561213357600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600080600060c0888a03121561216b57600080fd5b87356001600160401b038082111561218257600080fd5b61218e8b838c01612017565b985060208a01359150808211156121a457600080fd5b6121b08b838c01612029565b90985096508691506121c460408b01612082565b955060608a01359150808211156121da57600080fd5b6121e68b838c016120fa565b945060808a01359150808211156121fc57600080fd5b6122088b838c016120fa565b935060a08a013591508082111561221e57600080fd5b5061222b8a828b016120fa565b91505092959891949750929550565b60005b8381101561225557818101518382015260200161223d565b50506000910152565b6000815180845261227681602086016020860161223a565b601f01601f19169290920160200192915050565b602081526000612010602083018461225e565b6000602082840312156122af57600080fd5b5035919050565b600080604083850312156122c957600080fd5b82356122d48161206d565b946020939093013593505050565b60008083601f8401126122f457600080fd5b5081356001600160401b0381111561230b57600080fd5b602083019150836020828501011115610bfd57600080fd5b6000806000806060858703121561233957600080fd5b843593506020850135925060408501356001600160401b0381111561235d57600080fd5b612369878288016122e2565b95989497509550505050565b60008060006060848603121561238a57600080fd5b83356123958161206d565b925060208401356123a58161206d565b929592945050506040919091013590565b600080604083850312156123c957600080fd5b50508035926020909101359150565b6000602082840312156123ea57600080fd5b81356120108161206d565b60008060006040848603121561240a57600080fd5b8335925060208401356001600160401b0381111561242757600080fd5b612433868287016122e2565b9497909650939450505050565b60006020828403121561245257600080fd5b81356001600160401b0381111561246857600080fd5b612474848285016120fa565b949350505050565b60008060006060848603121561249157600080fd5b833561249c8161206d565b92506020840135915060408401356001600160401b038111156124be57600080fd5b6124ca868287016120fa565b9150509250925092565b600080604083850312156124e757600080fd5b82356124f28161206d565b91506020830135801515811461250757600080fd5b809150509250929050565b60008060008060006080868803121561252a57600080fd5b85356125358161206d565b945060208601356125458161206d565b93506040860135925060608601356001600160401b0381111561256757600080fd5b612573888289016122e2565b969995985093965092949392505050565b6000806040838503121561259757600080fd5b82356125a28161206d565b915060208301356125078161206d565b600080604083850312156125c557600080fd5b8235915060208301356001600160401b038111156125e257600080fd5b6125ee858286016120fa565b9150509250929050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016126365761263661260e565b5060010190565b6000808335601e1984360301811261265457600080fd5b8301803591506001600160401b0382111561266e57600080fd5b602001915036819003821315610bfd57600080fd5b8183823760009101908152919050565b600181811c908216806126a757607f821691505b602082108103611dc957634e487b7160e01b600052602260045260246000fd5b600181815b8085111561191a5781600019048211156126e8576126e861260e565b808516156126f557918102915b93841c93908002906126cc565b60008261271157506001610789565b8161271e57506000610789565b8160018114612734576002811461273e5761275a565b6001915050610789565b60ff84111561274f5761274f61260e565b50506001821b610789565b5060208310610133831016604e8410600b841016171561277d575081810a610789565b61278783836126c7565b806000190482111561279b5761279b61260e565b029392505050565b60006120108383612702565b818103818111156107895761078961260e565b6000602082840312156127d457600080fd5b815161201081611fdd565b6001600160a01b038681168252851660208201526040810184905260806060820181905281018290526000828460a0840137600060a0848401015260a0601f19601f85011683010190509695505050505050565b601f821115610a1f57600081815260208120601f850160051c8101602086101561285a5750805b601f850160051c820191505b81811015611ca757828155600101612866565b81516001600160401b038111156128925761289261208d565b6128a6816128a08454612693565b84612833565b602080601f8311600181146128db57600084156128c35750858301515b600019600386901b1c1916600185901b178555611ca7565b600085815260208120601f198616915b8281101561290a578886015182559484019460019091019084016128eb565b50858210156129285787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020828403121561294a57600080fd5b5051919050565b6000806040838503121561296457600080fd5b825161296f8161206d565b6020939093015192949293505050565b60018060a01b03841681528260208201526060604082015260006129a6606083018461225e565b95945050505050565b600080604083850312156129c257600080fd5b505080516020909101519092909150565b808201808211156107895761078961260e565b6000602082840312156129f857600080fd5b81516001600160401b03811115612a0e57600080fd5b8201601f81018413612a1f57600080fd5b8051612a2d612119826120d3565b818152856020838501011115612a4257600080fd5b6129a682602083016020860161223a56fede736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da03de736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da00a26469706673582212202507aa6d5d63718fb1f3d4366b532ae27e502b09f1d594020df11ebc9933c62f64736f6c63430008110033";

export const erc721CoreDeployedBytecode =
  "0x60806040526004361061020f5760003560e01c806370a0823111610118578063b88d4fde116100a0578063e824bc781161006f578063e824bc7814610600578063e8a3d48514610615578063e985e9c51461062a578063fbea28c014610692578063fe9d93031461070257600080fd5b8063b88d4fde1461058b578063c87b56dd146105ab578063cb856b98146105cb578063cea1489f146105eb57600080fd5b806394d008ef116100e757806394d008ef1461052e57806395d89b41146105415780639b364a0314610556578063a22cb4651461056b578063a89e4dec146104d957600080fd5b806370a08231146104b9578063751d4753146104d9578063757732ad146104ee578063938e3d7b1461050e57600080fd5b8063240779531161019b57806342842e0e1161016a57806342842e0e1461042457806355625be8146104445780635c97f4a2146104645780636352211e146104845780636a87fb03146104a457600080fd5b8063240779531461039057806326d8c4ab146103b05780632a55205a146103c55780633c09e2fd1461040457600080fd5b80630912ed77116101e25780630912ed77146102fa578063095ea7b31461031a57806315b48fe61461033a57806318160ddd1461034d57806323b872dd1461037057600080fd5b806301ffc9a71461021457806302007c491461024957806306fdde031461026b578063081812fc1461028d575b600080fd5b34801561022057600080fd5b5061023461022f366004611ff3565b610722565b60405190151581526020015b60405180910390f35b34801561025557600080fd5b50610269610264366004612150565b61078f565b005b34801561027757600080fd5b5061028061093e565b604051610240919061228a565b34801561029957600080fd5b506102e26102a836600461229d565b60009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da0560205260409020546001600160a01b031690565b6040516001600160a01b039091168152602001610240565b34801561030657600080fd5b506102696103153660046122b6565b6109de565b34801561032657600080fd5b506102696103353660046122b6565b610a24565b610280610348366004612323565b610a3f565b34801561035957600080fd5b50610362610b65565b604051908152602001610240565b34801561037c57600080fd5b5061026961038b366004612375565b610b9b565b34801561039c57600080fd5b506102e26103ab36600461229d565b610bb1565b3480156103bc57600080fd5b50610362604081565b3480156103d157600080fd5b506103e56103e03660046123b6565b610beb565b604080516001600160a01b039093168352602083019190915201610240565b34801561041057600080fd5b5061026961041f3660046122b6565b610c04565b34801561043057600080fd5b5061026961043f366004612375565b610c40565b34801561045057600080fd5b5061026961045f3660046123d8565b610d20565b34801561047057600080fd5b5061023461047f3660046122b6565b610d52565b34801561049057600080fd5b506102e261049f36600461229d565b610d92565b3480156104b057600080fd5b50610362601081565b3480156104c557600080fd5b506103626104d43660046123d8565b610ddd565b3480156104e557600080fd5b50610362600281565b3480156104fa57600080fd5b506102806105093660046123f5565b610e41565b34801561051a57600080fd5b50610269610529366004612440565b610f1d565b61026961053c36600461247c565b610f58565b34801561054d57600080fd5b50610280610f7c565b34801561056257600080fd5b50610362600881565b34801561057757600080fd5b506102696105863660046124d4565b610f9b565b34801561059757600080fd5b506102696105a6366004612512565b610fb3565b3480156105b757600080fd5b506102806105c636600461229d565b611081565b3480156105d757600080fd5b506102696105e63660046123d8565b61108c565b3480156105f757600080fd5b50610362602081565b34801561060c57600080fd5b50610362600481565b34801561062157600080fd5b506102806110bb565b34801561063657600080fd5b50610234610645366004612584565b6001600160a01b0391821660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da066020908152604080832093909416825291909152205460ff1690565b34801561069e57600080fd5b506106a76110e3565b604051610240919081516001600160a01b03908116825260208084015182169083015260408084015182169083015260608084015182169083015260808084015182169083015260a092830151169181019190915260c00190565b34801561070e57600080fd5b5061026961071d3660046125b2565b6111b2565b60006301ffc9a760e01b6001600160e01b03198316148061075357506380ac58cd60e01b6001600160e01b03198316145b8061076e5750635b5e139f60e01b6001600160e01b03198316145b80610789575063152a902d60e11b6001600160e01b03198316145b92915050565b63409feecd1980549081156107ba5760018260011c14303b106107ba5763f92ee8a96000526004601cfd5b600390556107c782611205565b6107d1848461125d565b6107dc85600261129b565b8560005b81811015610829576108178989838181106107fd576107fd6125f8565b905060200201602081019061081291906123d8565b611318565b8061082181612624565b9150506107e0565b50600061083960208b018b6123d8565b6001600160a01b0316146108f75760008061085760208c018c6123d8565b6001600160a01b031660208c013561087260408e018e61263d565b604051610880929190612683565b60006040518083038185875af1925050503d80600081146108bd576040519150601f19603f3d011682016040523d82523d6000602084013e6108c2565b606091505b5091509150816108f4578051156108db57805160208201fd5b60405163018b41fb60e01b815260040160405180910390fd5b50505b506001811661093457600263409feecd195560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050505050505050565b6060600080516020612a748339815191525b805461095b90612693565b80601f016020809104026020016040519081016040528092919081815260200182805461098790612693565b80156109d45780601f106109a9576101008083540402835291602001916109d4565b820191906000526020600020905b8154815290600101906020018083116109b757829003601f168201915b5050505050905090565b60026109ea3382610d52565b610a15576040516369d3b0cd60e11b8152336004820152602481018290526044015b60405180910390fd5b610a1f8383611419565b505050565b610a31338383600161148d565b610a3b8282611523565b5050565b6060610a4a33611614565b610a6757604051635e7307c360e01b815260040160405180910390fd5b610a73604060026127a3565b851115610a9357604051636ce4dc9960e11b815260040160405180910390fd5b833414610ab357604051630100cdbf60e71b815260040160405180910390fd5b6000610abe86610bb1565b90506001600160a01b038116610ae757604051631c6040eb60e11b815260040160405180910390fd5b600080826001600160a01b0316878787604051610b05929190612683565b60006040518083038185875af1925050503d8060008114610b42576040519150601f19603f3d011682016040523d82523d6000602084013e610b47565b606091505b509150915081610b5a57610b5a81611621565b979650505050505050565b7fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da0254600090610b96906001906127af565b905090565b610ba683838361164a565b610a1f8383836116d4565b60009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960260205260409020546001600160a01b031690565b600080610bf88484611885565b915091505b9250929050565b6002610c103382610d52565b610c36576040516369d3b0cd60e11b815233600482015260248101829052604401610a0c565b610a1f838361129b565b610c4b838383610b9b565b6001600160a01b0382163b15801590610cf75750604051630a85bd0160e11b8082523360048301526001600160a01b03858116602484015260448301849052608060648401526000608484015290919084169063150b7a029060a4016020604051808303816000875af1158015610cc6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cea91906127c2565b6001600160e01b03191614155b15610a1f57604051631cb6b58760e01b81526001600160a01b0383166004820152602401610a0c565b610d2933611614565b610d4657604051630457ef4d60e21b815260040160405180910390fd5b610d4f81611922565b50565b6001600160a01b039190911660009081527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d00602052604090205416151590565b6000818152600080516020612a5483398151915260205260409020546001600160a01b031680610dd857604051630c4414d160e01b815260048101839052602401610a0c565b919050565b60006001600160a01b038216610e0657604051630bb6521b60e41b815260040160405180910390fd5b506001600160a01b031660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da04602052604090205490565b6060610e4f604060026127a3565b841115610e6f57604051636ce4dc9960e11b815260040160405180910390fd5b6000610e7a85610bb1565b90506001600160a01b038116610ea357604051631c6040eb60e11b815260040160405180910390fd5b600080826001600160a01b03168686604051610ec0929190612683565b600060405180830381855afa9150503d8060008114610efb576040519150601f19603f3d011682016040523d82523d6000602084013e610f00565b606091505b509150915081610f1357610f1381611621565b9695505050505050565b6002610f293382610d52565b610f4f576040516369d3b0cd60e11b815233600482015260248101829052604401610a0c565b610a3b82611205565b600080610f66858585611a91565b91509150610f75858383611b51565b5050505050565b6060600080516020612a74833981519152600101805461095b90612693565b610fa933836000198461148d565b610a3b8282611caf565b610fbe858585610b9b565b6001600160a01b0384163b158015906110585750604051630a85bd0160e11b808252906001600160a01b0386169063150b7a02906110089033908a908990899089906004016127df565b6020604051808303816000875af1158015611027573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104b91906127c2565b6001600160e01b03191614155b15610f7557604051631cb6b58760e01b81526001600160a01b0385166004820152602401610a0c565b606061078982611d3a565b61109533611614565b6110b257604051630457ef4d60e21b815260040160405180910390fd5b610d4f81611318565b60607fa6a5e5e300f9d3ac9405142360702196b4ea62114d51fa073601cc0874436a00610950565b6040805160c081018252600080825260208201819052918101829052606081018290526080810182905260a08101919091526040518060c0016040528061112a6002610bb1565b6001600160a01b031681526020016111426004610bb1565b6001600160a01b0316815260200161115a6008610bb1565b6001600160a01b031681526020016111726010610bb1565b6001600160a01b0316815260200161118a6020610bb1565b6001600160a01b031681526020016111a26040610bb1565b6001600160a01b03169052919050565b60006111bd83610d92565b90506001600160a01b03811633146111f157604051631e54210960e11b815233600482015260248101849052604401610a0c565b6111fc818484611dcf565b610a1f83611e1c565b7fa6a5e5e300f9d3ac9405142360702196b4ea62114d51fa073601cc0874436a006112308282612879565b506040517fa5d4097edda6d87cb9329af83fb3712ef77eeb13738ffe43cc35a4ce305ad96290600090a150565b611265611f02565b600080516020612a748339815191528061127f8482612879565b506001810161128e8382612879565b5060016002909101555050565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d006020818152604092839020805486179081905592518581529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b91015b60405180910390a250505050565b6000816001600160a01b0316635cd2525e6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611358573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061137c9190612938565b905061138b8183611f20611f48565b6001600160981b03600883901c1660009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d9601602052604090208054600160ff85161b179055816001600160a01b03167f03c84f92f5ec4b758937aeeb66e7fda2d2be4eaf0358eab1af55bc7c0fb913d48260405161140d91815260200190565b60405180910390a25050565b6001600160a01b03821660008181527fb5e06cba4353bc00640002b636c12f4263d4ef5b2e919091e763949f55cd0d00602081815260409283902080548619169081905592518381529193917fd49bc1531187aed13c28272a98a97b8c51421c952682f05712907888c0dd936b910161130a565b60006114996010610bb1565b90506001600160a01b03811615610f7557604051636ba0946560e11b81526001600160a01b038681166004830152858116602483015260448201859052831515606483015282169063d74128ca90608401600060405180830381600087803b15801561150457600080fd5b505af1158015611518573d6000803e3d6000fd5b505050505050505050565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b031633811480159061158e57506001600160a01b0381166000908152600683016020908152604080832033845290915290205460ff16155b156115b5576040516306b55d7b60e41b815233600482015260248101849052604401610a0c565b600083815260058301602052604080822080546001600160a01b0319166001600160a01b0388811691821790925591518693918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a450505050565b6000610789826002610d52565b8051156116315780518082602001fd5b60405163f7a3cadb60e01b815260040160405180910390fd5b60006116566004610bb1565b90506001600160a01b038116156116ce57604051631ffb811f60e01b81526001600160a01b038581166004830152848116602483015260448201849052821690631ffb811f906064015b600060405180830381600087803b1580156116ba57600080fd5b505af1158015610934573d6000803e3d6000fd5b50505050565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b0385811691161461173d57604051631e54210960e11b81526001600160a01b038516600482015260248101839052604401610a0c565b6001600160a01b03831661176457604051638870804160e01b815260040160405180910390fd5b336001600160a01b038516148015906117a357506001600160a01b0384166000908152600682016020908152604080832033845290915290205460ff16155b80156117c8575060008281526005820160205260409020546001600160a01b03163314155b156117ef576040516306b55d7b60e41b815233600482015260248101839052604401610a0c565b6001600160a01b038085166000818152600484016020908152604080832080546000190190559387168083528483208054600101905586835260038601825284832080546001600160a01b031990811683179091556005870190925284832080549092169091559251859392917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a450505050565b60008060006118946040610bb1565b90506001600160a01b0381161561191a5760405163152a902d60e11b815260048101869052602481018590526001600160a01b03821690632a55205a906044016040805180830381865afa1580156118f0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119149190612951565b90935091505b509250929050565b600881901c6001600160981b031660009081527f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960160205260409020547f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d96009060ff83161c6001166119a557604051630e10316560e11b815260040160405180910390fd5b6000826001600160a01b0316635cd2525e6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156119e5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a099190612938565b9050611a19816000611fd7611f48565b6001600160981b03600884901c16600090815260018381016020526040909120805460ff86169290921b199091169055826001600160a01b03167fd9bb1c586b78bf32a634a5af7de6efa3b89b145fb0ed65a58263603a12fd338a82604051611a8491815260200190565b60405180910390a2505050565b6000806000611aa06002610bb1565b90506001600160a01b03811615611b2f5760405163b6fb084160e01b81526001600160a01b0382169063b6fb0841903490611ae3908a908a908a9060040161297f565b604080518083038185885af1158015611b00573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190611b2591906129af565b9093509150611b48565b604051635b71085560e01b815260040160405180910390fd5b50935093915050565b6001600160a01b038316611b7857604051638870804160e01b815260040160405180910390fd5b6000611b8482846129d3565b6001600160a01b03851660009081527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da04602052604090208054840190557fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da028054840190559050600080516020612a74833981519152835b82811015611ca75760008181526003830160205260409020546001600160a01b031615611c3e5760405163013e9e9160e01b815260048101829052602401610a0c565b600081815260038301602052604080822080546001600160a01b0319166001600160a01b038a1690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480611c9f81612624565b915050611bfb565b505050505050565b3360008181527fde736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da06602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b60606000611d486020610bb1565b90506001600160a01b03811615611dc95760405163c87b56dd60e01b8152600481018490526001600160a01b0382169063c87b56dd90602401600060405180830381865afa158015611d9e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052611dc691908101906129e6565b91505b50919050565b6000611ddb6008610bb1565b90506001600160a01b038116156116ce576040516376f103eb60e11b81526001600160a01b0382169063ede207d6906116a09087908790879060040161297f565b6000818152600080516020612a548339815191526020526040902054600080516020612a74833981519152906001600160a01b031680611e7257604051630c4414d160e01b815260048101849052602401610a0c565b6001600160a01b038116600081815260048401602090815260408083208054600019908101909155600287018054909101905586835260038601825280832080546001600160a01b0319908116909155600587019092528083208054909216909155518592907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a4505050565b63409feecd1954600116611f1e5763d7e6bcf86000526004601cfd5b565b600081831615611f43576040516375df761f60e11b815260040160405180910390fd5b501790565b7f1f92fde37cbc580c6ce7e24a47f7ccbddcf380202caa25a340ea884cf71d960080546000611f79604060026127a3565b90505b6001811115611fcf5785811615611fc757611f9b81838663ffffffff16565b6000828152600285016020526040902080546001600160a01b0319166001600160a01b03881617905591505b60011c611f7c565b509055505050565b90191690565b6001600160e01b031981168114610d4f57600080fd5b60006020828403121561200557600080fd5b813561201081611fdd565b9392505050565b600060608284031215611dc957600080fd5b60008083601f84011261203b57600080fd5b5081356001600160401b0381111561205257600080fd5b6020830191508360208260051b8501011115610bfd57600080fd5b6001600160a01b0381168114610d4f57600080fd5b8035610dd88161206d565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156120cb576120cb61208d565b604052919050565b60006001600160401b038211156120ec576120ec61208d565b50601f01601f191660200190565b600082601f83011261210b57600080fd5b813561211e612119826120d3565b6120a3565b81815284602083860101111561213357600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600080600060c0888a03121561216b57600080fd5b87356001600160401b038082111561218257600080fd5b61218e8b838c01612017565b985060208a01359150808211156121a457600080fd5b6121b08b838c01612029565b90985096508691506121c460408b01612082565b955060608a01359150808211156121da57600080fd5b6121e68b838c016120fa565b945060808a01359150808211156121fc57600080fd5b6122088b838c016120fa565b935060a08a013591508082111561221e57600080fd5b5061222b8a828b016120fa565b91505092959891949750929550565b60005b8381101561225557818101518382015260200161223d565b50506000910152565b6000815180845261227681602086016020860161223a565b601f01601f19169290920160200192915050565b602081526000612010602083018461225e565b6000602082840312156122af57600080fd5b5035919050565b600080604083850312156122c957600080fd5b82356122d48161206d565b946020939093013593505050565b60008083601f8401126122f457600080fd5b5081356001600160401b0381111561230b57600080fd5b602083019150836020828501011115610bfd57600080fd5b6000806000806060858703121561233957600080fd5b843593506020850135925060408501356001600160401b0381111561235d57600080fd5b612369878288016122e2565b95989497509550505050565b60008060006060848603121561238a57600080fd5b83356123958161206d565b925060208401356123a58161206d565b929592945050506040919091013590565b600080604083850312156123c957600080fd5b50508035926020909101359150565b6000602082840312156123ea57600080fd5b81356120108161206d565b60008060006040848603121561240a57600080fd5b8335925060208401356001600160401b0381111561242757600080fd5b612433868287016122e2565b9497909650939450505050565b60006020828403121561245257600080fd5b81356001600160401b0381111561246857600080fd5b612474848285016120fa565b949350505050565b60008060006060848603121561249157600080fd5b833561249c8161206d565b92506020840135915060408401356001600160401b038111156124be57600080fd5b6124ca868287016120fa565b9150509250925092565b600080604083850312156124e757600080fd5b82356124f28161206d565b91506020830135801515811461250757600080fd5b809150509250929050565b60008060008060006080868803121561252a57600080fd5b85356125358161206d565b945060208601356125458161206d565b93506040860135925060608601356001600160401b0381111561256757600080fd5b612573888289016122e2565b969995985093965092949392505050565b6000806040838503121561259757600080fd5b82356125a28161206d565b915060208301356125078161206d565b600080604083850312156125c557600080fd5b8235915060208301356001600160401b038111156125e257600080fd5b6125ee858286016120fa565b9150509250929050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016126365761263661260e565b5060010190565b6000808335601e1984360301811261265457600080fd5b8301803591506001600160401b0382111561266e57600080fd5b602001915036819003821315610bfd57600080fd5b8183823760009101908152919050565b600181811c908216806126a757607f821691505b602082108103611dc957634e487b7160e01b600052602260045260246000fd5b600181815b8085111561191a5781600019048211156126e8576126e861260e565b808516156126f557918102915b93841c93908002906126cc565b60008261271157506001610789565b8161271e57506000610789565b8160018114612734576002811461273e5761275a565b6001915050610789565b60ff84111561274f5761274f61260e565b50506001821b610789565b5060208310610133831016604e8410600b841016171561277d575081810a610789565b61278783836126c7565b806000190482111561279b5761279b61260e565b029392505050565b60006120108383612702565b818103818111156107895761078961260e565b6000602082840312156127d457600080fd5b815161201081611fdd565b6001600160a01b038681168252851660208201526040810184905260806060820181905281018290526000828460a0840137600060a0848401015260a0601f19601f85011683010190509695505050505050565b601f821115610a1f57600081815260208120601f850160051c8101602086101561285a5750805b601f850160051c820191505b81811015611ca757828155600101612866565b81516001600160401b038111156128925761289261208d565b6128a6816128a08454612693565b84612833565b602080601f8311600181146128db57600084156128c35750858301515b600019600386901b1c1916600185901b178555611ca7565b600085815260208120601f198616915b8281101561290a578886015182559484019460019091019084016128eb565b50858210156129285787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60006020828403121561294a57600080fd5b5051919050565b6000806040838503121561296457600080fd5b825161296f8161206d565b6020939093015192949293505050565b60018060a01b03841681528260208201526060604082015260006129a6606083018461225e565b95945050505050565b600080604083850312156129c257600080fd5b505080516020909101519092909150565b808201808211156107895761078961260e565b6000602082840312156129f857600080fd5b81516001600160401b03811115612a0e57600080fd5b8201601f81018413612a1f57600080fd5b8051612a2d612119826120d3565b818152856020838501011115612a4257600080fd5b6129a682602083016020860161223a56fede736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da03de736681c699ea309d8553f1fc33529507091d9d996e3146dc561047fd42da00a26469706673582212202507aa6d5d63718fb1f3d4366b532ae27e502b09f1d594020df11ebc9933c62f64736f6c63430008110033";
