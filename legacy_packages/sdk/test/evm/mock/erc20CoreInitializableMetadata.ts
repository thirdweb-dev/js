export const erc20CoreInitializableCompilerMetadata = {
  compiler: {
    version: "0.8.24+commit.e11b9ed9",
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
        name: "AllowanceOverflow",
        type: "error",
      },
      {
        inputs: [],
        name: "AllowanceUnderflow",
        type: "error",
      },
      {
        inputs: [],
        name: "AlreadyInitialized",
        type: "error",
      },
      {
        inputs: [],
        name: "CallbackFunctionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ERC20CoreCallbackFailed",
        type: "error",
      },
      {
        inputs: [],
        name: "ERC20CoreInitCallFailed",
        type: "error",
      },
      {
        inputs: [],
        name: "ERC20CoreMintDisabled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionFunctionAlreadyInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionInitializationFailed",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionNotInstalled",
        type: "error",
      },
      {
        inputs: [],
        name: "ExtensionUnsupportedCallbackFunction",
        type: "error",
      },
      {
        inputs: [],
        name: "InsufficientAllowance",
        type: "error",
      },
      {
        inputs: [],
        name: "InsufficientBalance",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidInitialization",
        type: "error",
      },
      {
        inputs: [],
        name: "InvalidPermit",
        type: "error",
      },
      {
        inputs: [],
        name: "NewOwnerIsZeroAddress",
        type: "error",
      },
      {
        inputs: [],
        name: "NoHandoverRequest",
        type: "error",
      },
      {
        inputs: [],
        name: "NotInitializing",
        type: "error",
      },
      {
        inputs: [],
        name: "PermitExpired",
        type: "error",
      },
      {
        inputs: [],
        name: "TotalSupplyOverflow",
        type: "error",
      },
      {
        inputs: [],
        name: "Unauthorized",
        type: "error",
      },
      {
        inputs: [],
        name: "UnauthorizedExtensionCall",
        type: "error",
      },
      {
        inputs: [],
        name: "UnauthorizedInstall",
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
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [],
        name: "ContractURIUpdated",
        type: "event",
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
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "oldOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
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
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        stateMutability: "payable",
        type: "fallback",
      },
      {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [
          {
            internalType: "bytes32",
            name: "result",
            type: "bytes32",
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
            name: "spender",
            type: "address",
          },
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
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
            name: "_spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
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
            name: "result",
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
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
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
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "_selector",
            type: "bytes4",
          },
        ],
        name: "getCallbackFunctionImplementation",
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
            internalType: "bytes4",
            name: "_selector",
            type: "bytes4",
          },
        ],
        name: "getExtensionFunctionData",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
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
                internalType: "struct IExtensionTypes.ExtensionFunction",
                name: "data",
                type: "tuple",
              },
            ],
            internalType: "struct CoreContract.InstalledExtensionFunction",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getInstalledExtensions",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
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
            internalType: "struct ICoreContract.InstalledExtension[]",
            name: "_installedExtensions",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getSupportedCallbackFunctions",
        outputs: [
          {
            internalType: "bytes4[]",
            name: "supportedCallbackFunctions",
            type: "bytes4[]",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
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
            internalType: "string",
            name: "_contractURI",
            type: "string",
          },
          {
            internalType: "address",
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address[]",
            name: "_extensionsToInstall",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "_initCallTarget",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "_initCalldata",
            type: "bytes",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_extensionContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "installExtension",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
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
        name: "mint",
        outputs: [],
        stateMutability: "payable",
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
            name: "",
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
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "nonces",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
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
            name: "result",
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
            name: "pendingOwner",
            type: "address",
          },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
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
            name: "_owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "_spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_deadline",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "_v",
            type: "uint8",
          },
          {
            internalType: "bytes32",
            name: "_r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "_s",
            type: "bytes32",
          },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_contractURI",
            type: "string",
          },
        ],
        name: "setContractURI",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "result",
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
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_from",
            type: "address",
          },
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
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_extensionContract",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "uninstallExtension",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    devdoc: {
      errors: {
        "AllowanceOverflow()": [
          {
            details: "The allowance has overflowed.",
          },
        ],
        "AllowanceUnderflow()": [
          {
            details: "The allowance has underflowed.",
          },
        ],
        "AlreadyInitialized()": [
          {
            details: "Cannot double-initialize.",
          },
        ],
        "InsufficientAllowance()": [
          {
            details: "Insufficient allowance.",
          },
        ],
        "InsufficientBalance()": [
          {
            details: "Insufficient balance.",
          },
        ],
        "InvalidInitialization()": [
          {
            details: "The contract is already initialized.",
          },
        ],
        "InvalidPermit()": [
          {
            details: "The permit is invalid.",
          },
        ],
        "NewOwnerIsZeroAddress()": [
          {
            details: "The `newOwner` cannot be the zero address.",
          },
        ],
        "NoHandoverRequest()": [
          {
            details:
              "The `pendingOwner` does not have a valid handover request.",
          },
        ],
        "NotInitializing()": [
          {
            details: "The contract is not initializing.",
          },
        ],
        "PermitExpired()": [
          {
            details: "The permit has expired.",
          },
        ],
        "TotalSupplyOverflow()": [
          {
            details: "The total supply has overflowed.",
          },
        ],
        "Unauthorized()": [
          {
            details: "The caller is not authorized to call the function.",
          },
        ],
      },
      events: {
        "Approval(address,address,uint256)": {
          details:
            "Emitted when `amount` tokens is approved by `owner` to be used by `spender`.",
        },
        "Initialized(uint64)": {
          details: "Triggered when the contract has been initialized.",
        },
        "OwnershipHandoverCanceled(address)": {
          details:
            "The ownership handover to `pendingOwner` has been canceled.",
        },
        "OwnershipHandoverRequested(address)": {
          details:
            "An ownership handover to `pendingOwner` has been requested.",
        },
        "OwnershipTransferred(address,address)": {
          details:
            "The ownership is transferred from `oldOwner` to `newOwner`. This event is intentionally kept the same as OpenZeppelin's Ownable to be compatible with indexers and [EIP-173](https://eips.ethereum.org/EIPS/eip-173), despite it not being as lightweight as a single argument event.",
        },
        "Transfer(address,address,uint256)": {
          details:
            "Emitted when `amount` tokens is transferred from `from` to `to`.",
        },
      },
      kind: "dev",
      methods: {
        "DOMAIN_SEPARATOR()": {
          details:
            "Returns the EIP-712 domain separator for the EIP-2612 permit.",
        },
        "allowance(address,address)": {
          details:
            "Returns the amount of tokens that `spender` can spend on behalf of `owner`.",
        },
        "approve(address,uint256)": {
          params: {
            _amount: "The quantity of tokens to approve.",
            _spender:
              "The address to approve spending on behalf of the token owner.",
          },
        },
        "balanceOf(address)": {
          details: "Returns the amount of tokens owned by `owner`.",
        },
        "burn(uint256,bytes)": {
          details:
            "Calls the beforeBurn hook. Skips calling the hook if it doesn't exist.",
          params: {
            _amount: "The amount of tokens to burn.",
            _data: "ABI encoded arguments to pass to the beforeBurnERC20 hook.",
          },
        },
        "cancelOwnershipHandover()": {
          details:
            "Cancels the two-step ownership handover to the caller, if any.",
        },
        "completeOwnershipHandover(address)": {
          details:
            "Allows the owner to complete the two-step ownership handover to `pendingOwner`. Reverts if there is no existing ownership handover requested by `pendingOwner`.",
        },
        "contractURI()": {
          returns: {
            _0: "uri The contract URI of the contract.",
          },
        },
        "decimals()": {
          details: "Returns the decimals places of the token.",
        },
        "mint(address,uint256,bytes)": {
          details: "Reverts if beforeMint hook is absent or unsuccessful.",
          params: {
            _amount: "The amount of tokens to mint.",
            _data: "ABI encoded data to pass to the beforeMintERC20 hook.",
            _to: "The address to mint the tokens to.",
          },
        },
        "multicall(bytes[])": {
          details:
            "Apply `DELEGATECALL` with the current contract to each calldata in `data`, and store the `abi.encode` formatted results of each `DELEGATECALL` into `results`. If any of the `DELEGATECALL`s reverts, the entire context is reverted, and the error is bubbled up. This function is deliberately made non-payable to guard against double-spending. (See: https://www.paradigm.xyz/2021/08/two-rights-might-make-a-wrong) For efficiency, this function will directly return the results, terminating the context. If called internally, it must be called at the end of a function that returns `(bytes[] memory)`.",
        },
        "nonces(address)": {
          details:
            "Returns the current nonce for `owner`. This value is used to compute the signature for EIP-2612 permit.",
        },
        "owner()": {
          details: "Returns the owner of the contract.",
        },
        "ownershipHandoverExpiresAt(address)": {
          details:
            "Returns the expiry timestamp for the two-step ownership handover to `pendingOwner`.",
        },
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)": {
          params: {
            _owner: "The account approving the tokens",
            _spender: "The address to approve",
            _value: "Amount of tokens to approve",
          },
        },
        "renounceOwnership()": {
          details: "Allows the owner to renounce their ownership.",
        },
        "requestOwnershipHandover()": {
          details:
            "Request a two-step ownership handover to the caller. The request will automatically expire in 48 hours (172800 seconds) by default.",
        },
        "setContractURI(string)": {
          details: "Only callable by contract admin.",
          params: {
            _contractURI: "The contract URI to set.",
          },
        },
        "totalSupply()": {
          details: "Returns the amount of tokens in existence.",
        },
        "transfer(address,uint256)": {
          details:
            "Transfer `amount` tokens from the caller to `to`. Requirements: - `from` must at least have `amount`. Emits a {Transfer} event.",
        },
        "transferFrom(address,address,uint256)": {
          params: {
            _amount: "The quantity of tokens to transfer.",
            _from: "The address to transfer tokens from.",
            _to: "The address to transfer tokens to.",
          },
        },
        "transferOwnership(address)": {
          details: "Allows the owner to transfer the ownership to `newOwner`.",
        },
      },
      version: 1,
    },
    userdoc: {
      errors: {
        "ERC20CoreCallbackFailed()": [
          {
            notice: "Emitted when a hook call fails.",
          },
        ],
        "ERC20CoreInitCallFailed()": [
          {
            notice: "Emitted when the on initialize call fails.",
          },
        ],
        "ERC20CoreMintDisabled()": [
          {
            notice:
              "Emitted on an attempt to mint tokens when no beforeMint hook is installed.",
          },
        ],
      },
      events: {
        "ContractURIUpdated()": {
          notice: "Emitted when the contract URI is updated.",
        },
      },
      kind: "user",
      methods: {
        "approve(address,uint256)": {
          notice: "Approves a spender to spend tokens on behalf of an owner.",
        },
        "burn(uint256,bytes)": {
          notice: "Burns tokens.",
        },
        "contractURI()": {
          notice: "Returns the contract URI of the contract.",
        },
        "mint(address,uint256,bytes)": {
          notice: "Mints tokens. Calls the beforeMint hook.",
        },
        "name()": {
          notice: "Returns the name of the token.",
        },
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)": {
          notice:
            "Sets allowance based on token owner's signed approval. See https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP section].",
        },
        "setContractURI(string)": {
          notice: "Sets the contract URI of the contract.",
        },
        "symbol()": {
          notice: "Returns the symbol of the token.",
        },
        "transferFrom(address,address,uint256)": {
          notice: "Transfers tokens from a sender to a recipient.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "src/core/token/ERC20CoreInitializable.sol": "ERC20Core",
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
    "lib/solady/src/tokens/ERC20.sol": {
      keccak256:
        "0xb4a3f9ba8a05107f7370de42cff57f3ad26dafd438712c11531a5892de2f59e0",
      license: "MIT",
      urls: [
        "bzz-raw://f0a9ca06e3cf6dea1f9a4c5599581573b7d81cd64dc3afb582f325ccf5fdd6dc",
        "dweb:/ipfs/Qmb9r5dDceNF4W8S5u6i85RsNTgE5XG9HbTXkyS25ad3C6",
      ],
    },
    "lib/solady/src/utils/Initializable.sol": {
      keccak256:
        "0x039ac865df50f874528619e58f2bfaa665b6cec82647c711e515cb252a45a2ec",
      license: "MIT",
      urls: [
        "bzz-raw://1886c0e71f4861a23113f9d3eb5f6f00397c1d1bf0191f92534c177a79ac8559",
        "dweb:/ipfs/QmPLWU427MN9KHFg6DFkrYNutCDLdtNSQLaqmPqKcoPRLy",
      ],
    },
    "lib/solady/src/utils/Multicallable.sol": {
      keccak256:
        "0x0f5895a87b561dcf8b4d4068e1a56ab28bbebde08ff88534bdc8fe0379516d1c",
      license: "MIT",
      urls: [
        "bzz-raw://bbf0a55f90662536abe978d26b44a76a3ead4e962db205e64850d6c8276129bf",
        "dweb:/ipfs/QmZXGTxig4Kk4uxeCJzMW5xRBqWSUEKTtdwRDd93121CyV",
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
    "src/callback/BeforeBurnCallbackERC20.sol": {
      keccak256:
        "0x5abb18d6361878bff52548ea047e5f2ada5781c2c25785741a749caf5eecbb91",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://2128bf7211020b900d682bf30c1dad7620ff7cf037b339117d7095b8c77283e8",
        "dweb:/ipfs/QmPyuy3vznBC2uQ4vC9yBQaNYS6BC6Cdraomtbs68Hmv5c",
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
    "src/callback/BeforeTransferCallbackERC20.sol": {
      keccak256:
        "0x7ec3caa8e2a0beccf1e1bc91332900cb9198b49eec940201835617a4fc894128",
      license: "Apache 2.0",
      urls: [
        "bzz-raw://170c25ad2b635e2d47d4615153ed47d2d805a352daf4d21a423a4081b5d9be47",
        "dweb:/ipfs/QmeyXcvEFyqkaJqcxFrSVnVcQ6fmRcWVuRaSCbHHSXsPiY",
      ],
    },
    "src/core/CoreContract.sol": {
      keccak256:
        "0x138076f5ea060e03d1d3675241c729a74cca5aa8a866d76888a025eb09b90dca",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://b0ac51c6a7131d315f4dc1937d9a462bc9f2c445ad5a81cf48615502e6bc1d5c",
        "dweb:/ipfs/QmTqKRzFh6hbJqFHrLDuEKy6LUr3dFyC368Y3mQP6KV2xE",
      ],
    },
    "src/core/token/ERC20CoreInitializable.sol": {
      keccak256:
        "0xf22f2ac35c4b7eedb8532ffba6be213335aec0e51943bf912e63fefee326f81e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://e8eeeb81ddc09ed87b781ca842e4c4083184cbbd2683e01bfd3d7c04cf1b3295",
        "dweb:/ipfs/QmSoVvJKWkmPdPpN59CJkujGyTEZe18VTPJGdhxsbKKFAa",
      ],
    },
    "src/interface/ICoreContract.sol": {
      keccak256:
        "0x214fef6ec007257467333d130904b9fd5d62d0fc140ac32af515168c6c26db0d",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://04e9e16fac117cbfcc19bc908954e2951a4bfd1d6f8734d8f2a391e0fee0d252",
        "dweb:/ipfs/QmVDHnmsp1x7NrjWScdfLAh6oZwrcQFACmVBiA2CyxKi1R",
      ],
    },
    "src/interface/IExtensionContract.sol": {
      keccak256:
        "0x67134d02e26ad697d49096ce60c71cc0ba9f78a9322c6531061da58e379cf4b4",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://1ac38ee54d55cfc85d88e4b045b7ba30011f284f688ce806e0c86af0072f8935",
        "dweb:/ipfs/QmaC5g941NnnuHthX9VvcPsbbxG2VdusnS23DYXPUTn9Wc",
      ],
    },
    "src/interface/IExtensionTypes.sol": {
      keccak256:
        "0x6a80154d584d58e1c0ac0fed2e49e7e4db6506a287fc21797e417bb2ce7d78f5",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://bc139a9d75453cb538dc9d8dc3f8e9b14ff9b16d93e84e38dcda26f4badacc3c",
        "dweb:/ipfs/QmWAkqyVfKyaqFRLDA2qraVrtqjpT45qXpNL3YVgnZPJHk",
      ],
    },
  },
  version: 1,
};
export const erc20CoreInitializableBytecode =
  "0x60806040523480156200001157600080fd5b506200001c62000022565b62000086565b63409feecd1980546001811615620000425763f92ee8a96000526004601cfd5b8160c01c808260011c1462000081578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b6134f080620000966000396000f3fe6080604052600436106101d85760003560e01c80638da5cb5b11610102578063dd53983e11610095578063f147db8a11610064578063f147db8a1461077b578063f2fde38b1461079d578063fe9d9303146107b0578063fee81cf4146107d0576101d8565b8063dd53983e146106fd578063dd62ed3e1461071d578063e8a3d48514610753578063f04e283e14610768576101d8565b8063a0ee4bfa116100d1578063a0ee4bfa1461067d578063a9059cbb14610690578063ac9650d8146106b0578063d505accf146106dd576101d8565b80638da5cb5b14610601578063938e3d7b1461063557806394d008ef1461065557806395d89b4114610668576101d8565b806337c43bc01161017a57806370a082311161014957806370a0823114610509578063715018a61461053c5780637ecebe00146105445780638001c58214610577576101d8565b806337c43bc0146104925780635357aa5e146104bf57806354d1f13d146104e15780636d9c2839146104e9576101d8565b806323b872dd116101b657806323b872dd146104395780632569296214610459578063313ce567146104615780633644e5151461047d576101d8565b806306fdde03146103b7578063095ea7b3146103e257806318160ddd14610412575b600080357fffffffff00000000000000000000000000000000000000000000000000000000908116825260036020908152604080842081518083018352815473ffffffffffffffffffffffffffffffffffffffff16815282516060810190935260018201805460e081901b909616845290949193858101939290830190640100000000900460ff16600281111561027157610271612725565b600281111561028257610282612725565b8152905465010000000000900460ff161515602090910152905250805190915073ffffffffffffffffffffffffffffffffffffffff166102ee576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8060200151604001518015610309575061030733610803565b155b15610340576040517f5312365200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6020808201510151600181600281111561035c5761035c612725565b0361036f57815161036d9034610862565b005b600281600281111561038357610383612725565b0361039357815161036d9061088d565b60008160028111156103a7576103a7612725565b0361036d57815161036d906108b1565b3480156103c357600080fd5b506103cc6108d0565b6040516103d991906127c2565b60405180910390f35b3480156103ee57600080fd5b506104026103fd3660046127fe565b610962565b60405190151581526020016103d9565b34801561041e57600080fd5b506805345cdf77eb68f44c545b6040519081526020016103d9565b34801561044557600080fd5b50610402610454366004612828565b610980565b61036d6109a0565b34801561046d57600080fd5b50604051601281526020016103d9565b34801561048957600080fd5b5061042b6109f0565b34801561049e57600080fd5b506104b26104ad366004612892565b610a6d565b6040516103d99190612923565b3480156104cb57600080fd5b506104d4610b41565b6040516103d991906129b9565b61036d610cce565b3480156104f557600080fd5b5061036d610504366004612b06565b610d0a565b34801561051557600080fd5b5061042b610524366004612b60565b6387a211a2600c908152600091909152602090205490565b61036d610e01565b34801561055057600080fd5b5061042b61055f366004612b60565b6338377508600c908152600091909152602090205490565b34801561058357600080fd5b506105dc610592366004612892565b7fffffffff000000000000000000000000000000000000000000000000000000001660009081526002602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016103d9565b34801561060d57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927546105dc565b34801561064157600080fd5b5061036d610650366004612cd3565b610e15565b61036d610663366004612b06565b610e29565b34801561067457600080fd5b506103cc610e3f565b61036d61068b366004612da2565b610e4e565b34801561069c57600080fd5b506104026106ab3660046127fe565b611010565b3480156106bc57600080fd5b506106d06106cb366004612e95565b61108b565b6040516103d99190612f0a565b3480156106e957600080fd5b5061036d6106f8366004612f8c565b61110c565b34801561070957600080fd5b5061036d610718366004612b06565b61112f565b34801561072957600080fd5b5061042b610738366004612fff565b602052637f5e9f20600c908152600091909152603490205490565b34801561075f57600080fd5b506103cc611177565b61036d610776366004612b60565b611186565b34801561078757600080fd5b506107906111c3565b6040516103d99190613032565b61036d6107ab366004612b60565b61136d565b3480156107bc57600080fd5b5061036d6107cb366004613045565b611394565b3480156107dc57600080fd5b5061042b6107eb366004612b60565b63389a75e1600c908152600091909152602090205490565b600061082d7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275490565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b366000803760008036600084865af13d6000803e808015610882573d6000f35b3d6000fd5b50505050565b3660008037600080366000845af43d6000803e808015610882573d6000f35b505050565b3660008037600080366000845afa3d6000803e808015610882573d6000f35b6060600480546108df90613091565b80601f016020809104026020016040519081016040528092919081815260200182805461090b90613091565b80156109585780601f1061092d57610100808354040283529160200191610958565b820191906000526020600020905b81548152906001019060200180831161093b57829003601f168201915b5050505050905090565b600061096f3384846113aa565b610979838361156d565b9392505050565b600061098d8484846115c0565b610998848484611688565b949350505050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b6000806109fb6108d0565b8051906020012090506040517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81528160208201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604082015246606082015230608082015260a081209250505090565b610a7561268e565b7fffffffff0000000000000000000000000000000000000000000000000000000082811660009081526003602090815260409182902082518084018452815473ffffffffffffffffffffffffffffffffffffffff16815283516060810190945260018201805460e081901b90961685529094919385840193909290830190640100000000900460ff166002811115610b0f57610b0f612725565b6002811115610b2057610b20612725565b8152905465010000000000900460ff16151560209091015290525092915050565b6000546060908067ffffffffffffffff811115610b6057610b60612b7b565b604051908082528060200260200182016040528015610b9957816020015b610b866126e0565b815260200190600190039081610b7e5790505b50915060005b81811015610cc9576000808281548110610bbb57610bbb6130e4565b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c5a573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610ca091908101906131cd565b815250848381518110610cb557610cb56130e4565b602090810291909101015250600101610b9f565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b610d1333610803565b610d49576040517f6751a6e000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610d5284611746565b8015610887576000808573ffffffffffffffffffffffffffffffffffffffff16858585604051610d839291906132bb565b60006040518083038185875af1925050503d8060008114610dc0576040519150601f19603f3d011682016040523d82523d6000602084013e610dc5565b606091505b509150915081610df957610df9817fdc5f8eee00000000000000000000000000000000000000000000000000000000611ce6565b505050505050565b610e09611d00565b610e136000611d36565b565b610e1d611d00565b610e2681611d9c565b50565b610e3584848484611dd5565b6108878484611fb5565b6060600580546108df90613091565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011328054600382558015610ea05760018160011c14303b10610e975763f92ee8a96000526004601cfd5b818160ff1b1b91505b506004610ead8982613313565b506005610eba8882613313565b50610ec486611d9c565b610ecd85611d36565b73ffffffffffffffffffffffffffffffffffffffff831615801590610ef3575060008251115b15610f9a576000808473ffffffffffffffffffffffffffffffffffffffff163485604051610f21919061342d565b60006040518083038185875af1925050503d8060008114610f5e576040519150601f19603f3d011682016040523d82523d6000602084013e610f63565b606091505b509150915081610f9757610f97817f2492666600000000000000000000000000000000000000000000000000000000611ce6565b50505b60005b8451811015610fd057610fc8858281518110610fbb57610fbb6130e4565b6020026020010151611746565b600101610f9d565b508015611006576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050505050505050565b60006387a211a2600c52336000526020600c2080548084111561103b5763f4d678b86000526004601cfd5b83810382555050826000526020600c208281540181555081602052600c5160601c337fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a350600192915050565b6060602060005281602052816110a15760406000f35b60408260051b8085604037818101905b82518601604082018135602083018237600038833583305af46110d8573d6000803e3d6000fd5b8285526020850194503d81523d6000602083013e50503d01603f0167ffffffffffffffe0168183106110b157604081016000f35b6111178787876113aa565b61112687878787878787612034565b50505050505050565b61113833610803565b61116e576040517f6751a6e000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610d52846121ce565b6060600680546108df90613091565b61118e611d00565b63389a75e1600c52806000526020600c2080544211156111b657636f5e88186000526004601cfd5b60009055610e2681611d36565b60408051600480825260a0820190925260609160208201608080368337019050509050637ce7cf0760e01b81600081518110611201576112016130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f98074eed000000000000000000000000000000000000000000000000000000009082906001908110611269576112696130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f7fda8dc10000000000000000000000000000000000000000000000000000000090829060029081106112d1576112d16130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f837406a6000000000000000000000000000000000000000000000000000000009082906003908110611339576113396130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015290565b611375611d00565b8060601b61138b57637448fbae6000526004601cfd5b610e2681611d36565b6113a03384848461246a565b6108ac338461260a565b7f837406a60000000000000000000000000000000000000000000000000000000060005260026020527f2b11953b5e49ec8d60501b4c9b21fd7029fb2e6232f0cd731909130e5dd4dbe75473ffffffffffffffffffffffffffffffffffffffff1680156108875760405173ffffffffffffffffffffffffffffffffffffffff858116602483015284811660448301526064820184905260009182918416907f837406a600000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009094169390931790925290516114f7919061342d565b6000604051808303816000865af19150503d8060008114611534576040519150601f19603f3d011682016040523d82523d6000602084013e611539565b606091505b509150915081610df957610df9817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b600082602052637f5e9f20600c5233600052816034600c205581600052602c5160601c337f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560206000a350600192915050565b7f98074eed0000000000000000000000000000000000000000000000000000000060005260026020527fd678900a6752972fb1145cf949b706e1a22b0979feb9533004e5a04668402e885473ffffffffffffffffffffffffffffffffffffffff1680156108875760405173ffffffffffffffffffffffffffffffffffffffff858116602483015284811660448301526064820184905260009182918416907f98074eed000000000000000000000000000000000000000000000000000000009060840161146e565b60008360601b33602052637f5e9f208117600c526034600c20805460018101156116c857808511156116c2576313be252b6000526004601cfd5b84810382555b50506387a211a28117600c526020600c208054808511156116f15763f4d678b86000526004601cfd5b84810382555050836000526020600c208381540181555082602052600c5160601c8160601c7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a3505060019392505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff16156117a6576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001683179055825491820183558280527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56390910180547fffffffffffffffffffffffff0000000000000000000000000000000000000000168417905580517f7c173ecc0000000000000000000000000000000000000000000000000000000081529051919291637c173ecc9160048082019286929091908290030181865afa1580156118a0573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526118e691908101906131cd565b80515190915060006118f66111c3565b905060005b82811015611ad55760008460000151828151811061191b5761191b6130e4565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000081166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156119aa576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b8451811015611a26578481815181106119c9576119c96130e4565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611a1e5760019150611a26565b6001016119ae565b5080611a5e576040517f30551c7900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b507fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff87161790556001016118fb565b5060208301515160005b81811015610df957600085602001518281518110611aff57611aff6130e4565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600390925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611b8f576040517f2e939f0600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60408051808201825273ffffffffffffffffffffffffffffffffffffffff8981168252602080830185815285517fffffffff000000000000000000000000000000000000000000000000000000001660009081526003835294909420835181547fffffffffffffffffffffffff0000000000000000000000000000000000000000169316929092178255925180516001830180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000811660e09390931c92831782559583015194959394929390929183917fffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000001617640100000000836002811115611c9b57611c9b612725565b021790555060409190910151815490151565010000000000027fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff909116179055505050600101611adf565b815115611cf65781518083602001fd5b806000526004601cfd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610e13576382b429006000526004601cfd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6006611da88282613313565b506040517fa5d4097edda6d87cb9329af83fb3712ef77eeb13738ffe43cc35a4ce305ad96290600090a150565b7f7ce7cf070000000000000000000000000000000000000000000000000000000060005260026020527f86c3f2f3437a8d3785ff86dd2d2da5a8b9e789da9bf6fee1ad24204396b057455473ffffffffffffffffffffffffffffffffffffffff168015611f7c576000808273ffffffffffffffffffffffffffffffffffffffff1634637ce7cf0760e01b89898989604051602401611e769493929190613449565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051611eff919061342d565b60006040518083038185875af1925050503d8060008114611f3c576040519150601f19603f3d011682016040523d82523d6000602084013e611f41565b606091505b509150915081611f7557611f75817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b5050611fae565b6040517f8da300ec00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050505050565b6805345cdf77eb68f44c5481810181811015611fd95763e5cfe9576000526004601cfd5b806805345cdf77eb68f44c5550506387a211a2600c52816000526020600c208181540181555080602052600c5160601c60007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a35050565b600061203e6108d0565b8051906020012090508442111561205d57631a15a3cc6000526004601cfd5b6040518860601b60601c98508760601b60601c975065383775081901600e52886000526020600c2080547f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f83528360208401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604084015246606084015230608084015260a08320602e527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c983528a60208401528960408401528860608401528060808401528760a084015260c08320604e526042602c206000528660ff1660205285604052846060526020806080600060015afa8b3d51146121695763ddafbaef6000526004601cfd5b019055777f5e9f20000000000000000000000000000000000000000088176040526034602c2087905587897f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925602060608501a360405250506000606052505050505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff1661222d576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff811660008181526001602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905580517f7c173ecc0000000000000000000000000000000000000000000000000000000081529051919291637c173ecc9160048082019286929091908290030181865afa1580156122cd573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820160405261231391908101906131cd565b60208101515190915060005b818110156123d85760008360200151828151811061233f5761233f6130e4565b602090810291909101810151517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260039091526040902080547fffffffffffffffffffffffff0000000000000000000000000000000000000000168155600190810180547fffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000016905591909101905061231f565b5081515160005b81811015611fae576000846000015182815181106123ff576123ff6130e4565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260029091526040902080547fffffffffffffffffffffffff0000000000000000000000000000000000000000169055506001016123df565b7f7fda8dc10000000000000000000000000000000000000000000000000000000060005260026020527f8be0e08c359ad0480ab14e46e942220c2cd9a12e62337d422c06e26cefca18b05473ffffffffffffffffffffffffffffffffffffffff168015611fae576000808273ffffffffffffffffffffffffffffffffffffffff1634637fda8dc160e01b8989898960405160240161250b9493929190613449565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051612594919061342d565b60006040518083038185875af1925050503d80600081146125d1576040519150601f19603f3d011682016040523d82523d6000602084013e6125d6565b606091505b50915091508161112657611126817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b6387a211a2600c52816000526020600c208054808311156126335763f4d678b86000526004601cfd5b82900390556805345cdf77eb68f44c80548290039055600081815273ffffffffffffffffffffffffffffffffffffffff83167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602083a35050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016126db6040805160608101909152600080825260208201908152600060209091015290565b905290565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016126db604051806040016040528060608152602001606081525090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60005b8381101561276f578181015183820152602001612757565b50506000910152565b60008151808452612790816020860160208601612754565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006109796020830184612778565b803573ffffffffffffffffffffffffffffffffffffffff811681146127f957600080fd5b919050565b6000806040838503121561281157600080fd5b61281a836127d5565b946020939093013593505050565b60008060006060848603121561283d57600080fd5b612846846127d5565b9250612854602085016127d5565b9150604084013590509250925092565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610e2657600080fd5b6000602082840312156128a457600080fd5b813561097981612864565b7fffffffff000000000000000000000000000000000000000000000000000000008151168252602081015160038110612911577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60208301526040908101511515910152565b815173ffffffffffffffffffffffffffffffffffffffff1681526020808301516080830191612954908401826128af565b5092915050565b60008151808452602080850194506020840160005b838110156129ae5781517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101612970565b509495945050505050565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b84811015612aae577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808b8603018752835173ffffffffffffffffffffffffffffffffffffffff8151168652898101519050888a8701528051898a880152612a4e608088018261295b565b918b01518783039093016060888101919091528351808452928c01938c01928692505b80831015612a9857612a848585516128af565b93810193928c019260019290920191612a71565b50505096890196509350918701916001016129e3565b50919998505050505050505050565b60008083601f840112612acf57600080fd5b50813567ffffffffffffffff811115612ae757600080fd5b602083019150836020828501011115612aff57600080fd5b9250929050565b60008060008060608587031215612b1c57600080fd5b612b25856127d5565b935060208501359250604085013567ffffffffffffffff811115612b4857600080fd5b612b5487828801612abd565b95989497509550505050565b600060208284031215612b7257600080fd5b610979826127d5565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715612bcd57612bcd612b7b565b60405290565b6040805190810167ffffffffffffffff81118282101715612bcd57612bcd612b7b565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715612c3d57612c3d612b7b565b604052919050565b600082601f830112612c5657600080fd5b813567ffffffffffffffff811115612c7057612c70612b7b565b612ca160207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601612bf6565b818152846020838601011115612cb657600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215612ce557600080fd5b813567ffffffffffffffff811115612cfc57600080fd5b61099884828501612c45565b600067ffffffffffffffff821115612d2257612d22612b7b565b5060051b60200190565b600082601f830112612d3d57600080fd5b81356020612d52612d4d83612d08565b612bf6565b8083825260208201915060208460051b870101935086841115612d7457600080fd5b602086015b84811015612d9757612d8a816127d5565b8352918301918301612d79565b509695505050505050565b600080600080600080600060e0888a031215612dbd57600080fd5b873567ffffffffffffffff80821115612dd557600080fd5b612de18b838c01612c45565b985060208a0135915080821115612df757600080fd5b612e038b838c01612c45565b975060408a0135915080821115612e1957600080fd5b612e258b838c01612c45565b9650612e3360608b016127d5565b955060808a0135915080821115612e4957600080fd5b612e558b838c01612d2c565b9450612e6360a08b016127d5565b935060c08a0135915080821115612e7957600080fd5b50612e868a828b01612c45565b91505092959891949750929550565b60008060208385031215612ea857600080fd5b823567ffffffffffffffff80821115612ec057600080fd5b818501915085601f830112612ed457600080fd5b813581811115612ee357600080fd5b8660208260051b8501011115612ef857600080fd5b60209290920196919550909350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b82811015612f7f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0888603018452612f6d858351612778565b94509285019290850190600101612f33565b5092979650505050505050565b600080600080600080600060e0888a031215612fa757600080fd5b612fb0886127d5565b9650612fbe602089016127d5565b95506040880135945060608801359350608088013560ff81168114612fe257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561301257600080fd5b61301b836127d5565b9150613029602084016127d5565b90509250929050565b602081526000610979602083018461295b565b60008060006040848603121561305a57600080fd5b83359250602084013567ffffffffffffffff81111561307857600080fd5b61308486828701612abd565b9497909650939450505050565b600181811c908216806130a557607f821691505b6020821081036130de577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082601f83011261312457600080fd5b81516020613134612d4d83612d08565b8281526060928302850182019282820191908785111561315357600080fd5b8387015b858110156131c05781818a03121561316f5760008081fd5b613177612baa565b815161318281612864565b815281860151600381106131965760008081fd5b8187015260408281015180151581146131af5760008081fd5b908201528452928401928101613157565b5090979650505050505050565b600060208083850312156131e057600080fd5b825167ffffffffffffffff808211156131f857600080fd5b908401906040828703121561320c57600080fd5b613214612bd3565b82518281111561322357600080fd5b8301601f8101881361323457600080fd5b8051613242612d4d82612d08565b81815260059190911b8201860190868101908a83111561326157600080fd5b928701925b8284101561328857835161327981612864565b82529287019290870190613266565b8452505050828401518281111561329e57600080fd5b6132aa88828601613113565b948201949094529695505050505050565b8183823760009101908152919050565b601f8211156108ac576000816000526020600020601f850160051c810160208610156132f45750805b601f850160051c820191505b81811015610df957828155600101613300565b815167ffffffffffffffff81111561332d5761332d612b7b565b6133418161333b8454613091565b846132cb565b602080601f831160018114613394576000841561335e5750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610df9565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156133e1578886015182559484019460019091019084016133c2565b508582101561341d57878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b6000825161343f818460208701612754565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff8516815283602082015260606040820152816060820152818360808301376000818301608090810191909152601f9092017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0160101939250505056fea2646970667358221220c6e118e381abedf030941b849c24561f5086b006b1b3e9e9a47f131d57df666d64736f6c63430008180033";

export const erc20CoreInitializableDeployedBytecode =
  "0x60806040523480156200001157600080fd5b506200001c62000022565b62000086565b63409feecd1980546001811615620000425763f92ee8a96000526004601cfd5b8160c01c808260011c1462000081578060011b8355806020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b505050565b6134f080620000966000396000f3fe6080604052600436106101d85760003560e01c80638da5cb5b11610102578063dd53983e11610095578063f147db8a11610064578063f147db8a1461077b578063f2fde38b1461079d578063fe9d9303146107b0578063fee81cf4146107d0576101d8565b8063dd53983e146106fd578063dd62ed3e1461071d578063e8a3d48514610753578063f04e283e14610768576101d8565b8063a0ee4bfa116100d1578063a0ee4bfa1461067d578063a9059cbb14610690578063ac9650d8146106b0578063d505accf146106dd576101d8565b80638da5cb5b14610601578063938e3d7b1461063557806394d008ef1461065557806395d89b4114610668576101d8565b806337c43bc01161017a57806370a082311161014957806370a0823114610509578063715018a61461053c5780637ecebe00146105445780638001c58214610577576101d8565b806337c43bc0146104925780635357aa5e146104bf57806354d1f13d146104e15780636d9c2839146104e9576101d8565b806323b872dd116101b657806323b872dd146104395780632569296214610459578063313ce567146104615780633644e5151461047d576101d8565b806306fdde03146103b7578063095ea7b3146103e257806318160ddd14610412575b600080357fffffffff00000000000000000000000000000000000000000000000000000000908116825260036020908152604080842081518083018352815473ffffffffffffffffffffffffffffffffffffffff16815282516060810190935260018201805460e081901b909616845290949193858101939290830190640100000000900460ff16600281111561027157610271612725565b600281111561028257610282612725565b8152905465010000000000900460ff161515602090910152905250805190915073ffffffffffffffffffffffffffffffffffffffff166102ee576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8060200151604001518015610309575061030733610803565b155b15610340576040517f5312365200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6020808201510151600181600281111561035c5761035c612725565b0361036f57815161036d9034610862565b005b600281600281111561038357610383612725565b0361039357815161036d9061088d565b60008160028111156103a7576103a7612725565b0361036d57815161036d906108b1565b3480156103c357600080fd5b506103cc6108d0565b6040516103d991906127c2565b60405180910390f35b3480156103ee57600080fd5b506104026103fd3660046127fe565b610962565b60405190151581526020016103d9565b34801561041e57600080fd5b506805345cdf77eb68f44c545b6040519081526020016103d9565b34801561044557600080fd5b50610402610454366004612828565b610980565b61036d6109a0565b34801561046d57600080fd5b50604051601281526020016103d9565b34801561048957600080fd5b5061042b6109f0565b34801561049e57600080fd5b506104b26104ad366004612892565b610a6d565b6040516103d99190612923565b3480156104cb57600080fd5b506104d4610b41565b6040516103d991906129b9565b61036d610cce565b3480156104f557600080fd5b5061036d610504366004612b06565b610d0a565b34801561051557600080fd5b5061042b610524366004612b60565b6387a211a2600c908152600091909152602090205490565b61036d610e01565b34801561055057600080fd5b5061042b61055f366004612b60565b6338377508600c908152600091909152602090205490565b34801561058357600080fd5b506105dc610592366004612892565b7fffffffff000000000000000000000000000000000000000000000000000000001660009081526002602052604090205473ffffffffffffffffffffffffffffffffffffffff1690565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016103d9565b34801561060d57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927546105dc565b34801561064157600080fd5b5061036d610650366004612cd3565b610e15565b61036d610663366004612b06565b610e29565b34801561067457600080fd5b506103cc610e3f565b61036d61068b366004612da2565b610e4e565b34801561069c57600080fd5b506104026106ab3660046127fe565b611010565b3480156106bc57600080fd5b506106d06106cb366004612e95565b61108b565b6040516103d99190612f0a565b3480156106e957600080fd5b5061036d6106f8366004612f8c565b61110c565b34801561070957600080fd5b5061036d610718366004612b06565b61112f565b34801561072957600080fd5b5061042b610738366004612fff565b602052637f5e9f20600c908152600091909152603490205490565b34801561075f57600080fd5b506103cc611177565b61036d610776366004612b60565b611186565b34801561078757600080fd5b506107906111c3565b6040516103d99190613032565b61036d6107ab366004612b60565b61136d565b3480156107bc57600080fd5b5061036d6107cb366004613045565b611394565b3480156107dc57600080fd5b5061042b6107eb366004612b60565b63389a75e1600c908152600091909152602090205490565b600061082d7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff748739275490565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b366000803760008036600084865af13d6000803e808015610882573d6000f35b3d6000fd5b50505050565b3660008037600080366000845af43d6000803e808015610882573d6000f35b505050565b3660008037600080366000845afa3d6000803e808015610882573d6000f35b6060600480546108df90613091565b80601f016020809104026020016040519081016040528092919081815260200182805461090b90613091565b80156109585780601f1061092d57610100808354040283529160200191610958565b820191906000526020600020905b81548152906001019060200180831161093b57829003601f168201915b5050505050905090565b600061096f3384846113aa565b610979838361156d565b9392505050565b600061098d8484846115c0565b610998848484611688565b949350505050565b60006202a30067ffffffffffffffff164201905063389a75e1600c5233600052806020600c2055337fdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d600080a250565b6000806109fb6108d0565b8051906020012090506040517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f81528160208201527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604082015246606082015230608082015260a081209250505090565b610a7561268e565b7fffffffff0000000000000000000000000000000000000000000000000000000082811660009081526003602090815260409182902082518084018452815473ffffffffffffffffffffffffffffffffffffffff16815283516060810190945260018201805460e081901b90961685529094919385840193909290830190640100000000900460ff166002811115610b0f57610b0f612725565b6002811115610b2057610b20612725565b8152905465010000000000900460ff16151560209091015290525092915050565b6000546060908067ffffffffffffffff811115610b6057610b60612b7b565b604051908082528060200260200182016040528015610b9957816020015b610b866126e0565b815260200190600190039081610b7e5790505b50915060005b81811015610cc9576000808281548110610bbb57610bbb6130e4565b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060405180604001604052808273ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16637c173ecc6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610c5a573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0168201604052610ca091908101906131cd565b815250848381518110610cb557610cb56130e4565b602090810291909101015250600101610b9f565b505090565b63389a75e1600c523360005260006020600c2055337ffa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92600080a2565b610d1333610803565b610d49576040517f6751a6e000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610d5284611746565b8015610887576000808573ffffffffffffffffffffffffffffffffffffffff16858585604051610d839291906132bb565b60006040518083038185875af1925050503d8060008114610dc0576040519150601f19603f3d011682016040523d82523d6000602084013e610dc5565b606091505b509150915081610df957610df9817fdc5f8eee00000000000000000000000000000000000000000000000000000000611ce6565b505050505050565b610e09611d00565b610e136000611d36565b565b610e1d611d00565b610e2681611d9c565b50565b610e3584848484611dd5565b6108878484611fb5565b6060600580546108df90613091565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf6011328054600382558015610ea05760018160011c14303b10610e975763f92ee8a96000526004601cfd5b818160ff1b1b91505b506004610ead8982613313565b506005610eba8882613313565b50610ec486611d9c565b610ecd85611d36565b73ffffffffffffffffffffffffffffffffffffffff831615801590610ef3575060008251115b15610f9a576000808473ffffffffffffffffffffffffffffffffffffffff163485604051610f21919061342d565b60006040518083038185875af1925050503d8060008114610f5e576040519150601f19603f3d011682016040523d82523d6000602084013e610f63565b606091505b509150915081610f9757610f97817f2492666600000000000000000000000000000000000000000000000000000000611ce6565b50505b60005b8451811015610fd057610fc8858281518110610fbb57610fbb6130e4565b6020026020010151611746565b600101610f9d565b508015611006576002815560016020527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2602080a15b5050505050505050565b60006387a211a2600c52336000526020600c2080548084111561103b5763f4d678b86000526004601cfd5b83810382555050826000526020600c208281540181555081602052600c5160601c337fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a350600192915050565b6060602060005281602052816110a15760406000f35b60408260051b8085604037818101905b82518601604082018135602083018237600038833583305af46110d8573d6000803e3d6000fd5b8285526020850194503d81523d6000602083013e50503d01603f0167ffffffffffffffe0168183106110b157604081016000f35b6111178787876113aa565b61112687878787878787612034565b50505050505050565b61113833610803565b61116e576040517f6751a6e000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610d52846121ce565b6060600680546108df90613091565b61118e611d00565b63389a75e1600c52806000526020600c2080544211156111b657636f5e88186000526004601cfd5b60009055610e2681611d36565b60408051600480825260a0820190925260609160208201608080368337019050509050637ce7cf0760e01b81600081518110611201576112016130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f98074eed000000000000000000000000000000000000000000000000000000009082906001908110611269576112696130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f7fda8dc10000000000000000000000000000000000000000000000000000000090829060029081106112d1576112d16130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015280517f837406a6000000000000000000000000000000000000000000000000000000009082906003908110611339576113396130e4565b7fffffffff000000000000000000000000000000000000000000000000000000009092166020928302919091019091015290565b611375611d00565b8060601b61138b57637448fbae6000526004601cfd5b610e2681611d36565b6113a03384848461246a565b6108ac338461260a565b7f837406a60000000000000000000000000000000000000000000000000000000060005260026020527f2b11953b5e49ec8d60501b4c9b21fd7029fb2e6232f0cd731909130e5dd4dbe75473ffffffffffffffffffffffffffffffffffffffff1680156108875760405173ffffffffffffffffffffffffffffffffffffffff858116602483015284811660448301526064820184905260009182918416907f837406a600000000000000000000000000000000000000000000000000000000906084015b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff000000000000000000000000000000000000000000000000000000009094169390931790925290516114f7919061342d565b6000604051808303816000865af19150503d8060008114611534576040519150601f19603f3d011682016040523d82523d6000602084013e611539565b606091505b509150915081610df957610df9817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b600082602052637f5e9f20600c5233600052816034600c205581600052602c5160601c337f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560206000a350600192915050565b7f98074eed0000000000000000000000000000000000000000000000000000000060005260026020527fd678900a6752972fb1145cf949b706e1a22b0979feb9533004e5a04668402e885473ffffffffffffffffffffffffffffffffffffffff1680156108875760405173ffffffffffffffffffffffffffffffffffffffff858116602483015284811660448301526064820184905260009182918416907f98074eed000000000000000000000000000000000000000000000000000000009060840161146e565b60008360601b33602052637f5e9f208117600c526034600c20805460018101156116c857808511156116c2576313be252b6000526004601cfd5b84810382555b50506387a211a28117600c526020600c208054808511156116f15763f4d678b86000526004601cfd5b84810382555050836000526020600c208381540181555082602052600c5160601c8160601c7fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a3505060019392505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff16156117a6576040517f4641970600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001683179055825491820183558280527f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56390910180547fffffffffffffffffffffffff0000000000000000000000000000000000000000168417905580517f7c173ecc0000000000000000000000000000000000000000000000000000000081529051919291637c173ecc9160048082019286929091908290030181865afa1580156118a0573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682016040526118e691908101906131cd565b80515190915060006118f66111c3565b905060005b82811015611ad55760008460000151828151811061191b5761191b6130e4565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000081166000908152600290925260409091205490915073ffffffffffffffffffffffffffffffffffffffff16156119aa576040517f4cc04b1700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000805b8451811015611a26578481815181106119c9576119c96130e4565b60200260200101517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191603611a1e5760019150611a26565b6001016119ae565b5080611a5e576040517f30551c7900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b507fffffffff0000000000000000000000000000000000000000000000000000000016600090815260026020526040902080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff87161790556001016118fb565b5060208301515160005b81811015610df957600085602001518281518110611aff57611aff6130e4565b60209081029190910181015180517fffffffff00000000000000000000000000000000000000000000000000000000166000908152600390925260409091205490915073ffffffffffffffffffffffffffffffffffffffff1615611b8f576040517f2e939f0600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60408051808201825273ffffffffffffffffffffffffffffffffffffffff8981168252602080830185815285517fffffffff000000000000000000000000000000000000000000000000000000001660009081526003835294909420835181547fffffffffffffffffffffffff0000000000000000000000000000000000000000169316929092178255925180516001830180547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000811660e09390931c92831782559583015194959394929390929183917fffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000001617640100000000836002811115611c9b57611c9b612725565b021790555060409190910151815490151565010000000000027fffffffffffffffffffffffffffffffffffffffffffffffffffff00ffffffffff909116179055505050600101611adf565b815115611cf65781518083602001fd5b806000526004601cfd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927543314610e13576382b429006000526004601cfd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927805473ffffffffffffffffffffffffffffffffffffffff9092169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a355565b6006611da88282613313565b506040517fa5d4097edda6d87cb9329af83fb3712ef77eeb13738ffe43cc35a4ce305ad96290600090a150565b7f7ce7cf070000000000000000000000000000000000000000000000000000000060005260026020527f86c3f2f3437a8d3785ff86dd2d2da5a8b9e789da9bf6fee1ad24204396b057455473ffffffffffffffffffffffffffffffffffffffff168015611f7c576000808273ffffffffffffffffffffffffffffffffffffffff1634637ce7cf0760e01b89898989604051602401611e769493929190613449565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051611eff919061342d565b60006040518083038185875af1925050503d8060008114611f3c576040519150601f19603f3d011682016040523d82523d6000602084013e611f41565b606091505b509150915081611f7557611f75817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b5050611fae565b6040517f8da300ec00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050505050565b6805345cdf77eb68f44c5481810181811015611fd95763e5cfe9576000526004601cfd5b806805345cdf77eb68f44c5550506387a211a2600c52816000526020600c208181540181555080602052600c5160601c60007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602080a35050565b600061203e6108d0565b8051906020012090508442111561205d57631a15a3cc6000526004601cfd5b6040518860601b60601c98508760601b60601c975065383775081901600e52886000526020600c2080547f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f83528360208401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6604084015246606084015230608084015260a08320602e527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c983528a60208401528960408401528860608401528060808401528760a084015260c08320604e526042602c206000528660ff1660205285604052846060526020806080600060015afa8b3d51146121695763ddafbaef6000526004601cfd5b019055777f5e9f20000000000000000000000000000000000000000088176040526034602c2087905587897f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925602060608501a360405250506000606052505050505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff1661222d576040517ffea8b2d000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff811660008181526001602052604080822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905580517f7c173ecc0000000000000000000000000000000000000000000000000000000081529051919291637c173ecc9160048082019286929091908290030181865afa1580156122cd573d6000803e3d6000fd5b505050506040513d6000823e601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820160405261231391908101906131cd565b60208101515190915060005b818110156123d85760008360200151828151811061233f5761233f6130e4565b602090810291909101810151517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260039091526040902080547fffffffffffffffffffffffff0000000000000000000000000000000000000000168155600190810180547fffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000016905591909101905061231f565b5081515160005b81811015611fae576000846000015182815181106123ff576123ff6130e4565b6020908102919091018101517fffffffff0000000000000000000000000000000000000000000000000000000016600090815260029091526040902080547fffffffffffffffffffffffff0000000000000000000000000000000000000000169055506001016123df565b7f7fda8dc10000000000000000000000000000000000000000000000000000000060005260026020527f8be0e08c359ad0480ab14e46e942220c2cd9a12e62337d422c06e26cefca18b05473ffffffffffffffffffffffffffffffffffffffff168015611fae576000808273ffffffffffffffffffffffffffffffffffffffff1634637fda8dc160e01b8989898960405160240161250b9493929190613449565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051612594919061342d565b60006040518083038185875af1925050503d80600081146125d1576040519150601f19603f3d011682016040523d82523d6000602084013e6125d6565b606091505b50915091508161112657611126817fc356a53400000000000000000000000000000000000000000000000000000000611ce6565b6387a211a2600c52816000526020600c208054808311156126335763f4d678b86000526004601cfd5b82900390556805345cdf77eb68f44c80548290039055600081815273ffffffffffffffffffffffffffffffffffffffff83167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef602083a35050565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016126db6040805160608101909152600080825260208201908152600060209091015290565b905290565b6040518060400160405280600073ffffffffffffffffffffffffffffffffffffffff1681526020016126db604051806040016040528060608152602001606081525090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60005b8381101561276f578181015183820152602001612757565b50506000910152565b60008151808452612790816020860160208601612754565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006109796020830184612778565b803573ffffffffffffffffffffffffffffffffffffffff811681146127f957600080fd5b919050565b6000806040838503121561281157600080fd5b61281a836127d5565b946020939093013593505050565b60008060006060848603121561283d57600080fd5b612846846127d5565b9250612854602085016127d5565b9150604084013590509250925092565b7fffffffff0000000000000000000000000000000000000000000000000000000081168114610e2657600080fd5b6000602082840312156128a457600080fd5b813561097981612864565b7fffffffff000000000000000000000000000000000000000000000000000000008151168252602081015160038110612911577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60208301526040908101511515910152565b815173ffffffffffffffffffffffffffffffffffffffff1681526020808301516080830191612954908401826128af565b5092915050565b60008151808452602080850194506020840160005b838110156129ae5781517fffffffff000000000000000000000000000000000000000000000000000000001687529582019590820190600101612970565b509495945050505050565b600060208083018184528085518083526040925060408601915060408160051b8701018488016000805b84811015612aae577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808b8603018752835173ffffffffffffffffffffffffffffffffffffffff8151168652898101519050888a8701528051898a880152612a4e608088018261295b565b918b01518783039093016060888101919091528351808452928c01938c01928692505b80831015612a9857612a848585516128af565b93810193928c019260019290920191612a71565b50505096890196509350918701916001016129e3565b50919998505050505050505050565b60008083601f840112612acf57600080fd5b50813567ffffffffffffffff811115612ae757600080fd5b602083019150836020828501011115612aff57600080fd5b9250929050565b60008060008060608587031215612b1c57600080fd5b612b25856127d5565b935060208501359250604085013567ffffffffffffffff811115612b4857600080fd5b612b5487828801612abd565b95989497509550505050565b600060208284031215612b7257600080fd5b610979826127d5565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715612bcd57612bcd612b7b565b60405290565b6040805190810167ffffffffffffffff81118282101715612bcd57612bcd612b7b565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715612c3d57612c3d612b7b565b604052919050565b600082601f830112612c5657600080fd5b813567ffffffffffffffff811115612c7057612c70612b7b565b612ca160207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601612bf6565b818152846020838601011115612cb657600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215612ce557600080fd5b813567ffffffffffffffff811115612cfc57600080fd5b61099884828501612c45565b600067ffffffffffffffff821115612d2257612d22612b7b565b5060051b60200190565b600082601f830112612d3d57600080fd5b81356020612d52612d4d83612d08565b612bf6565b8083825260208201915060208460051b870101935086841115612d7457600080fd5b602086015b84811015612d9757612d8a816127d5565b8352918301918301612d79565b509695505050505050565b600080600080600080600060e0888a031215612dbd57600080fd5b873567ffffffffffffffff80821115612dd557600080fd5b612de18b838c01612c45565b985060208a0135915080821115612df757600080fd5b612e038b838c01612c45565b975060408a0135915080821115612e1957600080fd5b612e258b838c01612c45565b9650612e3360608b016127d5565b955060808a0135915080821115612e4957600080fd5b612e558b838c01612d2c565b9450612e6360a08b016127d5565b935060c08a0135915080821115612e7957600080fd5b50612e868a828b01612c45565b91505092959891949750929550565b60008060208385031215612ea857600080fd5b823567ffffffffffffffff80821115612ec057600080fd5b818501915085601f830112612ed457600080fd5b813581811115612ee357600080fd5b8660208260051b8501011115612ef857600080fd5b60209290920196919550909350505050565b600060208083016020845280855180835260408601915060408160051b87010192506020870160005b82811015612f7f577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0888603018452612f6d858351612778565b94509285019290850190600101612f33565b5092979650505050505050565b600080600080600080600060e0888a031215612fa757600080fd5b612fb0886127d5565b9650612fbe602089016127d5565b95506040880135945060608801359350608088013560ff81168114612fe257600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561301257600080fd5b61301b836127d5565b9150613029602084016127d5565b90509250929050565b602081526000610979602083018461295b565b60008060006040848603121561305a57600080fd5b83359250602084013567ffffffffffffffff81111561307857600080fd5b61308486828701612abd565b9497909650939450505050565b600181811c908216806130a557607f821691505b6020821081036130de577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082601f83011261312457600080fd5b81516020613134612d4d83612d08565b8281526060928302850182019282820191908785111561315357600080fd5b8387015b858110156131c05781818a03121561316f5760008081fd5b613177612baa565b815161318281612864565b815281860151600381106131965760008081fd5b8187015260408281015180151581146131af5760008081fd5b908201528452928401928101613157565b5090979650505050505050565b600060208083850312156131e057600080fd5b825167ffffffffffffffff808211156131f857600080fd5b908401906040828703121561320c57600080fd5b613214612bd3565b82518281111561322357600080fd5b8301601f8101881361323457600080fd5b8051613242612d4d82612d08565b81815260059190911b8201860190868101908a83111561326157600080fd5b928701925b8284101561328857835161327981612864565b82529287019290870190613266565b8452505050828401518281111561329e57600080fd5b6132aa88828601613113565b948201949094529695505050505050565b8183823760009101908152919050565b601f8211156108ac576000816000526020600020601f850160051c810160208610156132f45750805b601f850160051c820191505b81811015610df957828155600101613300565b815167ffffffffffffffff81111561332d5761332d612b7b565b6133418161333b8454613091565b846132cb565b602080601f831160018114613394576000841561335e5750858301515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600386901b1c1916600185901b178555610df9565b6000858152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08616915b828110156133e1578886015182559484019460019091019084016133c2565b508582101561341d57878501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600388901b60f8161c191681555b5050505050600190811b01905550565b6000825161343f818460208701612754565b9190910192915050565b73ffffffffffffffffffffffffffffffffffffffff8516815283602082015260606040820152816060820152818360808301376000818301608090810191909152601f9092017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0160101939250505056fea2646970667358221220c6e118e381abedf030941b849c24561f5086b006b1b3e9e9a47f131d57df666d64736f6c63430008180033";
