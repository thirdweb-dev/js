export const marketplaceV3CompilerMetadata = {
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
            name: "_pluginMap",
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
            name: "platformFeeRecipient",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "platformFeeBps",
            type: "uint256",
          },
        ],
        name: "PlatformFeeInfoUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            indexed: true,
            internalType: "address",
            name: "pluginAddress",
            type: "address",
          },
        ],
        name: "PluginAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            indexed: true,
            internalType: "address",
            name: "pluginAddress",
            type: "address",
          },
        ],
        name: "PluginRemoved",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            indexed: true,
            internalType: "string",
            name: "functionSignature",
            type: "string",
          },
          {
            indexed: true,
            internalType: "address",
            name: "pluginAddress",
            type: "address",
          },
        ],
        name: "PluginSet",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes4",
            name: "functionSelector",
            type: "bytes4",
          },
          {
            indexed: true,
            internalType: "address",
            name: "oldPluginAddress",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newPluginAddress",
            type: "address",
          },
        ],
        name: "PluginUpdated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
        type: "event",
      },
      {
        stateMutability: "payable",
        type: "fallback",
      },
      {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
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
        inputs: [
          {
            internalType: "bytes4",
            name: "_selector",
            type: "bytes4",
          },
        ],
        name: "_getPluginForFunction",
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
            components: [
              {
                internalType: "bytes4",
                name: "functionSelector",
                type: "bytes4",
              },
              {
                internalType: "string",
                name: "functionSignature",
                type: "string",
              },
              {
                internalType: "address",
                name: "pluginAddress",
                type: "address",
              },
            ],
            internalType: "struct IPluginMap.Plugin",
            name: "_plugin",
            type: "tuple",
          },
        ],
        name: "addPlugin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "contractType",
        outputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        stateMutability: "pure",
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
        name: "contractVersion",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_pluginAddress",
            type: "address",
          },
        ],
        name: "getAllFunctionsOfPlugin",
        outputs: [
          {
            internalType: "bytes4[]",
            name: "registered",
            type: "bytes4[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllPlugins",
        outputs: [
          {
            components: [
              {
                internalType: "bytes4",
                name: "functionSelector",
                type: "bytes4",
              },
              {
                internalType: "string",
                name: "functionSignature",
                type: "string",
              },
              {
                internalType: "address",
                name: "pluginAddress",
                type: "address",
              },
            ],
            internalType: "struct IPluginMap.Plugin[]",
            name: "registered",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getPlatformFeeInfo",
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
            internalType: "bytes4",
            name: "_selector",
            type: "bytes4",
          },
        ],
        name: "getPluginForFunction",
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
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleAdmin",
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
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "getRoleMember",
        outputs: [
          {
            internalType: "address",
            name: "member",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
        ],
        name: "getRoleMemberCount",
        outputs: [
          {
            internalType: "uint256",
            name: "count",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRole",
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
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "hasRoleWithSwitch",
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
            name: "_defaultAdmin",
            type: "address",
          },
          {
            internalType: "string",
            name: "_contractURI",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "_trustedForwarders",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "_platformFeeRecipient",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "_platformFeeBps",
            type: "uint16",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        name: "isTrustedForwarder",
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
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC1155BatchReceived",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
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
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC1155Received",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
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
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC721Received",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "pluginMap",
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
        name: "removePlugin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "revokeRole",
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
            name: "_platformFeeRecipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_platformFeeBps",
            type: "uint256",
          },
        ],
        name: "setPlatformFeeInfo",
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
        inputs: [
          {
            components: [
              {
                internalType: "bytes4",
                name: "functionSelector",
                type: "bytes4",
              },
              {
                internalType: "string",
                name: "functionSignature",
                type: "string",
              },
              {
                internalType: "address",
                name: "pluginAddress",
                type: "address",
              },
            ],
            internalType: "struct IPluginMap.Plugin",
            name: "_plugin",
            type: "tuple",
          },
        ],
        name: "updatePlugin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ],
    devdoc: {
      author: "thirdweb.com",
      kind: "dev",
      methods: {
        "_getPluginForFunction(bytes4)": {
          details:
            "View address of the plugged-in functionality contract for a given function signature.",
        },
        "addPlugin((bytes4,string,address))": {
          details: "Add functionality to the contract.",
        },
        "contractType()": {
          details: "Returns the type of the contract.",
        },
        "contractURI()": {
          details: "Returns the metadata URI of the contract.",
        },
        "contractVersion()": {
          details: "Returns the version of the contract.",
        },
        "getAllFunctionsOfPlugin(address)": {
          details: "View all funtionality as list of function signatures.",
        },
        "getAllPlugins()": {
          details: "View all funtionality existing on the contract.",
        },
        "getPlatformFeeInfo()": {
          details: "Returns the platform fee recipient and bps.",
        },
        "getPluginForFunction(bytes4)": {
          details:
            "View address of the plugged-in functionality contract for a given function signature.",
        },
        "getRoleAdmin(bytes32)": {
          details:
            "See {grantRole} and {revokeRole}.                  To change a role's admin, use {_setRoleAdmin}.",
          params: {
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "getRoleMember(bytes32,uint256)": {
          details:
            "Returns `member` who has `role`, at `index` of role-members list.                  See struct {RoleMembers}, and mapping {roleMembers}",
          params: {
            index: "Index in list of current members for the role.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
          returns: {
            member: " Address of account that has `role`",
          },
        },
        "getRoleMemberCount(bytes32)": {
          details:
            "Returns `count` of accounts that have `role`.                  See struct {RoleMembers}, and mapping {roleMembers}",
          params: {
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
          returns: {
            count: "  Total number of accounts that have `role`",
          },
        },
        "grantRole(bytes32,address)": {
          details:
            "Caller must have admin role for the `role`.                  Emits {RoleGranted Event}.",
          params: {
            account:
              "Address of the account to which the role is being granted.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "hasRole(bytes32,address)": {
          details: "Returns `true` if `account` has been granted `role`.",
          params: {
            account:
              "Address of the account for which the role is being checked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "hasRoleWithSwitch(bytes32,address)": {
          details:
            "Returns `true` if `account` has been granted `role`.                  Role restrictions can be swtiched on and off:                      - If address(0) has ROLE, then the ROLE restrictions                        don't apply.                      - If address(0) does not have ROLE, then the ROLE                        restrictions will apply.",
          params: {
            account:
              "Address of the account for which the role is being checked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "initialize(address,string,address[],address,uint16)": {
          details: "Initiliazes the contract, like a constructor.",
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
        "removePlugin(bytes4)": {
          details: "Remove existing functionality from the contract.",
        },
        "renounceRole(bytes32,address)": {
          details:
            "Caller must have the `role`, with caller being the same as `account`.                  Emits {RoleRevoked Event}.",
          params: {
            account:
              "Address of the account from which the role is being revoked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "revokeRole(bytes32,address)": {
          details:
            "Caller must have admin role for the `role`.                  Emits {RoleRevoked Event}.",
          params: {
            account:
              "Address of the account from which the role is being revoked.",
            role: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "setContractURI(string)": {
          details:
            "Caller should be authorized to setup contractURI, e.g. contract admin.                  See {_canSetContractURI}.                  Emits {ContractURIUpdated Event}.",
          params: {
            _uri: 'keccak256 hash of the role. e.g. keccak256("TRANSFER_ROLE")',
          },
        },
        "setPlatformFeeInfo(address,uint256)": {
          details:
            "Caller should be authorized to set platform fee info.                  See {_canSetPlatformFeeInfo}.                  Emits {PlatformFeeInfoUpdated Event}; See {_setupPlatformFeeInfo}.",
          params: {
            _platformFeeBps: "Updated platformFeeBps.",
            _platformFeeRecipient:
              "Address to be set as new platformFeeRecipient.",
          },
        },
        "updatePlugin((bytes4,string,address))": {
          details: "Update or override existing functionality.",
        },
      },
      version: 1,
    },
    userdoc: {
      kind: "user",
      methods: {
        "getRoleAdmin(bytes32)": {
          notice: "Returns the admin role that controls the specified role.",
        },
        "getRoleMember(bytes32,uint256)": {
          notice:
            "Returns the role-member from a list of members for a role,                  at a given index.",
        },
        "getRoleMemberCount(bytes32)": {
          notice: "Returns total number of accounts that have a role.",
        },
        "grantRole(bytes32,address)": {
          notice: "Grants a role to an account, if not previously granted.",
        },
        "hasRole(bytes32,address)": {
          notice: "Checks whether an account has a particular role.",
        },
        "hasRoleWithSwitch(bytes32,address)": {
          notice:
            "Checks whether an account has a particular role;                  role restrictions can be swtiched on and off.",
        },
        "multicall(bytes[])": {
          notice:
            "Receives and executes a batch of function calls on this contract.",
        },
        "renounceRole(bytes32,address)": {
          notice: "Revokes role from the account.",
        },
        "revokeRole(bytes32,address)": {
          notice: "Revokes role from an account.",
        },
        "setContractURI(string)": {
          notice:
            "Lets a contract admin set the URI for contract-level metadata.",
        },
        "setPlatformFeeInfo(address,uint256)": {
          notice: "Updates the platform fee recipient and bps.",
        },
      },
      version: 1,
    },
  },
  settings: {
    compilationTarget: {
      "contracts/marketplace/entrypoint/MarketplaceV3.sol": "MarketplaceV3",
    },
    evmVersion: "london",
    libraries: {},
    metadata: {
      bytecodeHash: "ipfs",
    },
    optimizer: {
      enabled: true,
      runs: 300,
    },
    remappings: [
      ":@chainlink/contracts/src/=node_modules/@chainlink/contracts/src/",
      ":@ds-test/=lib/ds-test/src/",
      ":@openzeppelin/=node_modules/@openzeppelin/",
      ":@std/=lib/forge-std/src/",
      ":contracts/=contracts/",
      ":ds-test/=lib/ds-test/src/",
      ":dynamic-contracts/=lib/dynamic-contracts/src/",
      ":erc721a-upgradeable/=node_modules/erc721a-upgradeable/",
      ":erc721a/=node_modules/erc721a/",
      ":forge-std/=lib/forge-std/src/",
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
        "0x821a81bf354f9ab048420d056ef0cbcb5a7bbffa49ce443f32bb9248532052d9",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://11ef266df18f4308b985d51ac884c009c40b550f918499780233c06193f3abc5",
        "dweb:/ipfs/QmdpFFZNQh6ihqXX8Q7cQ496JJMji9K7FtvPjCoRojyHTC",
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
        "0xa2e541fe3198de0c7aa04fcb1cf95ac877aebc8c08632b8b37e83648462dc52e",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://be437074526a4176dad48bab6df2d6b86f987b8579b33630ab08f4a2ed4d0505",
        "dweb:/ipfs/QmNgWzY2nx7ZACJ4wYgyWUvLHDsuCS34x7D3bozkKxC2XK",
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
    "contracts/extension/plugin/PlatformFeeLogic.sol": {
      keccak256:
        "0x8803851b0010c03e3ac02f39889e259c9631121aa9fd1f870ae3d912a417e728",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://f004c8565aaff2f72c42589236dedd8788c3e7d85f62e186bddfc659690f3520",
        "dweb:/ipfs/QmaxHefNB8diWWjXDkUEaPG7Ta5FChP7Y5W11su6udexmW",
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
        "0x4250ceac5251ffe52e19ed334d1fac0f03b3507ebb0643e2d86ed3df1f4640a9",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://0b5a8b5710a1f2ddd4e65969b3435deb6338f081370817f9bcf0318d31876443",
        "dweb:/ipfs/QmR1khXKPMbskR7ZwzLDjW3Z4D2WZHHJnKPwm2LQWSck2N",
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
    "contracts/marketplace/entrypoint/InitStorage.sol": {
      keccak256:
        "0x7ee124bf16f0b2120ace929bda8efd157e15b62141d4f93cb7a3f33063b6b360",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://6ebce4aef32509f479ca858be5eae56f74afed403dbed9c51a3e4a8aa9fab169",
        "dweb:/ipfs/QmRYSXuMLdZuyhG572RVLPyMCijC1XowTQKAgFRx99Kcjx",
      ],
    },
    "contracts/marketplace/entrypoint/MarketplaceV3.sol": {
      keccak256:
        "0xab477a09c7b4cf44f2b8de2b4e78b6d5edc270b6c226ab5373d24ef33c901e11",
      license: "Apache-2.0",
      urls: [
        "bzz-raw://72533e64db48e9991b9cbd4057e063f4baafa6083b5c97e0ce99caeed629e59b",
        "dweb:/ipfs/QmcKs9ucfqsoLuKzF9NhgPMYFCaqsQFdeN9KoeD7ocDU78",
      ],
    },
    "contracts/openzeppelin-presets/utils/EnumerableSet.sol": {
      keccak256:
        "0x5050943b32b6a8f282573d166b2e9d87ab7eb4dbba4ab6acf36ecb54fe6995e4",
      license: "MIT",
      urls: [
        "bzz-raw://d4831d777a29ebdf9f2caecd70e74b97bff1b70e53622fd0a02aed01e21c8271",
        "dweb:/ipfs/QmUqurVVnCc7XkMxb2k23TVQUtuhHZduJ3hTZarTJrqU24",
      ],
    },
    "node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol": {
      keccak256:
        "0xeb373f1fdc7b755c6a750123a9b9e3a8a02c1470042fd6505d875000a80bde0b",
      license: "MIT",
      urls: [
        "bzz-raw://0e28648f994abf1d6bc345644a361cc0b7efa544f8bc0c8ec26011fed85a91ec",
        "dweb:/ipfs/QmVVE7AiRjKaQYYji7TkjmTeVzGpNmms5eoxqTCfvvpj6D",
      ],
    },
    "node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol": {
      keccak256:
        "0xa82b58eca1ee256be466e536706850163d2ec7821945abd6b4778cfb3bee37da",
      license: "MIT",
      urls: [
        "bzz-raw://6e75cf83beb757b8855791088546b8337e9d4684e169400c20d44a515353b708",
        "dweb:/ipfs/QmYvPafLfoquiDMEj7CKHtvbgHu7TJNPSVPSCjrtjV8HjV",
      ],
    },
    "node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol": {
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

export const marketplaceV3Bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162002eb938038062002eb9833981016040819052620000349162000046565b6001600160a01b031660805262000078565b6000602082840312156200005957600080fd5b81516001600160a01b03811681146200007157600080fd5b9392505050565b608051612e09620000b0600039600081816102200152818161062201528181610ac501528181610d8d01526113640152612e096000f3fe6080604052600436106101d15760003560e01c8063a217fddf116100f7578063bc197c8111610095578063d45573f611610064578063d45573f6146106d3578063d547741f14610729578063e8a3d48514610749578063f23a6e611461076b576101d8565b8063bc197c8114610644578063c511f8fb14610670578063ca15c87314610690578063cb2ef6f7146106b0576101d8565b8063a5342fdf116100d1578063a5342fdf146105a8578063aaae5633146105c3578063ac9650d8146105e3578063b48912da14610610576101d8565b8063a217fddf14610553578063a32fa5b314610568578063a520a38a14610588576101d8565b80634cb5d8fd1161016f5780639010d07c1161013e5780639010d07c146104bf57806391d14854146104f7578063938e3d7b14610517578063a0a8e46014610537576101d8565b80634cb5d8fd146103f8578063572b6c05146104185780635c573f2e146104705780636b86400e1461049d576101d8565b80631e7ac488116101ab5780631e7ac4881461033e578063248a9ca31461035e5780632f2ff15d146103b857806336568abe146103d8576101d8565b806301ffc9a7146102a2578063150b7a02146102d75780631ab6b7051461031c576101d8565b366101d857005b60006101ef6000356001600160e01b031916610797565b90506001600160a01b0381166102965760405163529051c560e11b81526000356001600160e01b03191660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a520a38a90602401602060405180830381865afa15801561026f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102939190612179565b90505b61029f816107de565b50005b3480156102ae57600080fd5b506102c26102bd3660046121ac565b610807565b60405190151581526020015b60405180910390f35b3480156102e357600080fd5b506103036102f23660046121d4565b630a85bd0160e11b95945050505050565b6040516001600160e01b031990911681526020016102ce565b34801561032857600080fd5b5061033c610337366004612361565b61084d565b005b34801561034a57600080fd5b5061033c6103593660046123f8565b61089d565b34801561036a57600080fd5b506103aa610379366004612424565b60009081527fd0ebebe8e6445c62babf8fef767eb39f1002bb957bb5b83258275a4e46428ed6602052604090205490565b6040519081526020016102ce565b3480156103c457600080fd5b5061033c6103d336600461243d565b6108f0565b3480156103e457600080fd5b5061033c6103f336600461243d565b6109ba565b34801561040457600080fd5b5061033c610413366004612361565b610a2c565b34801561042457600080fd5b506102c261043336600461246d565b6001600160a01b031660009081527fa140e363058a6cf3ca062c5e378319d7ddd21cedfbdca620f1c65b05028f156c602052604090205460ff1690565b34801561047c57600080fd5b5061049061048b36600461246d565b610a6a565b6040516102ce919061248a565b3480156104a957600080fd5b506104b2610d5a565b6040516102ce9190612534565b3480156104cb57600080fd5b506104df6104da3660046125ca565b611133565b6040516001600160a01b0390911681526020016102ce565b34801561050357600080fd5b506102c261051236600461243d565b611241565b34801561052357600080fd5b5061033c6105323660046125ec565b611279565b34801561054357600080fd5b50604051600181526020016102ce565b34801561055f57600080fd5b506103aa600081565b34801561057457600080fd5b506102c261058336600461243d565b6112c7565b34801561059457600080fd5b506104df6105a33660046121ac565b611329565b3480156105b457600080fd5b5061033c6104133660046121ac565b3480156105cf57600080fd5b5061033c6105de36600461265f565b6113e5565b3480156105ef57600080fd5b506106036105fe366004612756565b6114f4565b6040516102ce91906127cb565b34801561061c57600080fd5b506104df7f000000000000000000000000000000000000000000000000000000000000000081565b34801561065057600080fd5b5061030361065f366004612893565b63bc197c8160e01b95945050505050565b34801561067c57600080fd5b506104df61068b3660046121ac565b610797565b34801561069c57600080fd5b506103aa6106ab366004612424565b6115e9565b3480156106bc57600080fd5b506c4d61726b6574706c616365563360981b6103aa565b3480156106df57600080fd5b507f4aeb3f25cc46659cf4e4966e5c48b11e9400e6e4bfafae7e3dc6cc3fbc858deb54604080516001600160a01b0383168152600160a01b90920461ffff166020830152016102ce565b34801561073557600080fd5b5061033c61074436600461243d565b611692565b34801561075557600080fd5b5061075e6116e6565b6040516102ce9190612941565b34801561077757600080fd5b50610303610786366004612954565b63f23a6e6160e01b95945050505050565b6001600160e01b03191660009081527f1a3e4131826bb378aa43abb34a33a366bc4a35b55ab18a884fa205b59285ec4860205260409020600201546001600160a01b031690565b3660008037600080366000845af43d6000803e8080156107fd573d6000f35b3d6000fd5b505050565b60006001600160e01b03198216630271189760e51b148061083857506001600160e01b03198216630a85bd0160e11b145b8061084757506108478261179c565b92915050565b60405162461bcd60e51b815260206004820152601660248201527f526f757465723a204e6f7420617574686f72697a65640000000000000000000060448201526064015b60405180910390fd5b50565b6108a56117d1565b6108e25760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610891565b6108ec82826117e4565b5050565b60008281527fd0ebebe8e6445c62babf8fef767eb39f1002bb957bb5b83258275a4e46428ed66020526040902054600080516020612d8d8339815191529061093f9061093a6118c1565b61190a565b6000838152602082815260408083206001600160a01b038616845290915290205460ff16156109b05760405162461bcd60e51b815260206004820152601d60248201527f43616e206f6e6c79206772616e7420746f206e6f6e20686f6c646572730000006044820152606401610891565b6108028383611998565b806001600160a01b03166109cc6118c1565b6001600160a01b031614610a225760405162461bcd60e51b815260206004820152601a60248201527f43616e206f6e6c792072656e6f756e636520666f722073656c660000000000006044820152606401610891565b6108ec82826119ac565b60405162461bcd60e51b815260206004820152601360248201527213585c0e88139bdd08185d5d1a1bdc9a5e9959606a1b6044820152606401610891565b606060007f1a3e4131826bb378aa43abb34a33a366bc4a35b55ab18a884fa205b59285ec456001600160a01b0384811660008181526002840160205260408082209051632e2b9f9760e11b81526004810193909352939450917f00000000000000000000000000000000000000000000000000000000000000001690635c573f2e90602401600060405180830381865afa158015610b0c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b3491908101906129bd565b8051909150600081610b4585611a22565b610b4f9190612a6d565b905060005b82811015610be757610b92848281518110610b7157610b71612a85565b60200260200101516001600160e01b03191686611a2c90919063ffffffff16565b15610bd557610ba2600183612a9b565b9150600060e01b848281518110610bbb57610bbb612a85565b6001600160e01b0319909216602092830291909101909101525b610be0600182612a6d565b9050610b54565b508067ffffffffffffffff811115610c0157610c01612273565b604051908082528060200260200182016040528015610c2a578160200160208202803683370190505b5095506000805b83811015610ccb578451600090869083908110610c5057610c50612a85565b60200260200101516001600160e01b03191614610cb957848181518110610c7957610c79612a85565b6020026020010151888380610c8d90612ab2565b945081518110610c9f57610c9f612a85565b6001600160e01b0319909216602092830291909101909101525b610cc4600182612a6d565b9050610c31565b50610cd585611a22565b925060005b83811015610d4e576001600160a01b03891660009081526002880160205260409020610d069082611a44565b8883610d1181612ab2565b945081518110610d2357610d23612a85565b6001600160e01b031990921660209283029190910190910152610d47600182612a6d565b9050610cda565b50505050505050919050565b606060007f1a3e4131826bb378aa43abb34a33a366bc4a35b55ab18a884fa205b59285ec459050600081600001905060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316636b86400e6040518163ffffffff1660e01b8152600401600060405180830381865afa158015610de9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610e119190810190612acd565b90506000610e1e83611a22565b82519091506000610e2f8284612a6d565b905060005b83811015610eec5760005b83811015610ed957858181518110610e5957610e59612a85565b6020908102919091010151516001600160e01b031916610e798884611a44565b6001600160e01b0319161415610ec757610e94600184612a9b565b9250600060e01b868281518110610ead57610ead612a85565b60209081029190910101516001600160e01b031990911690525b610ed2600182612a6d565b9050610e3f565b50610ee5600182612a6d565b9050610e34565b508067ffffffffffffffff811115610f0657610f06612273565b604051908082528060200260200182016040528015610f5657816020015b60408051606080820183526000808352602083019190915291810191909152815260200190600190039081610f245790505b5096506000805b83811015610fee578551600090879083908110610f7c57610f7c612a85565b6020026020010151600001516001600160e01b03191614610fdc57858181518110610fa957610fa9612a85565b6020026020010151898381518110610fc357610fc3612a85565b6020908102919091010152610fd9600183612a6d565b91505b610fe7600182612a6d565b9050610f5d565b5060005b848110156111285760038801600061100a8984611a44565b6001600160e01b031990811682526020808301939093526040918201600020825160608101909352805460e01b9091168252600181018054929391929184019161105390612c0e565b80601f016020809104026020016040519081016040528092919081815260200182805461107f90612c0e565b80156110cc5780601f106110a1576101008083540402835291602001916110cc565b820191906000526020600020905b8154815290600101906020018083116110af57829003601f168201915b5050509183525050600291909101546001600160a01b031660209091015289518a90849081106110fe576110fe612a85565b6020908102919091010152611114600183612a6d565b9150611121600182612a6d565b9050610ff2565b505050505050505090565b60008281527f0c4ba382c0009cf238e4c1ca1a52f51c61e6248a70bdfb34e5ed49d5578a5c0c6020819052604082205482805b82811015611237576000878152602085815260408083208484526001019091529020546001600160a01b0316156111e257858214156111d0576000878152602094855260408082209282526001909201909452909220546001600160a01b03169250610847915050565b6111db600183612a6d565b9150611225565b6111ed876000611241565b8015611212575060008781526020858152604080832083805260020190915290205481145b1561122557611222600183612a6d565b91505b611230600182612a6d565b9050611166565b5050505092915050565b6000918252600080516020612d8d833981519152602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6112816117d1565b6112be5760405162461bcd60e51b815260206004820152600e60248201526d139bdd08185d5d1a1bdc9a5e995960921b6044820152606401610891565b61089a81611a50565b6000828152600080516020612d8d8339815191526020818152604080842084805290915282205460ff1661131f576000848152602091825260408082206001600160a01b0386168352909252205460ff169050610847565b5060019392505050565b60008061133583610797565b90506001600160a01b0381166113dc5760405163529051c560e11b81526001600160e01b0319841660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063a520a38a90602401602060405180830381865afa1580156113b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113d79190612179565b6113de565b805b9392505050565b7f627d6cbb4eb558f37de3c2ec08b04710e54e06be936a302f087f7bfb80f39ae0805460ff16156114585760405162461bcd60e51b815260206004820152601460248201527f416c726561647920696e697469616c697a65642e0000000000000000000000006044820152606401610891565b805460ff1916600117815561146b611b54565b61147484611b7f565b61147d85611a50565b61148b838361ffff166117e4565b611496600087611998565b6114c17ff94103142c1baabe9ac2b5d1487bf783de9e69cfeea9a72f5c9c94afd7877b8c6000611998565b6114ec7f86d5cf0a6bdc8d859ba3bdc97043337c82a0e609035f378e419298b6a3e00ae66000611998565b505050505050565b60608167ffffffffffffffff81111561150f5761150f612273565b60405190808252806020026020018201604052801561154257816020015b606081526020019060019003908161152d5790505b50905060005b828110156115e2576115b23085858481811061156657611566612a85565b90506020028101906115789190612c49565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611b8892505050565b8282815181106115c4576115c4612a85565b602002602001018190525080806115da90612ab2565b915050611548565b5092915050565b60008181527f0c4ba382c0009cf238e4c1ca1a52f51c61e6248a70bdfb34e5ed49d5578a5c0c60208190526040822054825b8181101561166c576000858152602084815260408083208484526001019091529020546001600160a01b03161561165a57611657600185612a6d565b93505b611665600182612a6d565b905061161b565b50611678846000611241565b1561168b57611688600184612a6d565b92505b5050919050565b60008281527fd0ebebe8e6445c62babf8fef767eb39f1002bb957bb5b83258275a4e46428ed66020526040902054600080516020612d8d833981519152906116dc9061093a6118c1565b61080283836119ac565b7fa7d40346e44ca145e94a946aa34a7d4a67245577dc18699a626fe0ffc6ce3281805460609190819061171890612c0e565b80601f016020809104026020016040519081016040528092919081815260200182805461174490612c0e565b80156117915780601f1061176657610100808354040283529160200191611791565b820191906000526020600020905b81548152906001019060200180831161177457829003601f168201915b505050505091505090565b60006001600160e01b0319821663f337402760e01b148061084757506301ffc9a760e01b6001600160e01b0319831614610847565b60006117df816105126118c1565b905090565b7f4aeb3f25cc46659cf4e4966e5c48b11e9400e6e4bfafae7e3dc6cc3fbc858deb6127108211156118495760405162461bcd60e51b815260206004820152600f60248201526e45786365656473206d61782062707360881b6044820152606401610891565b805475ffffffffffffffffffffffffffffffffffffffffffff1916600160a01b61ffff8416026001600160a01b031916176001600160a01b03841690811782556040518381527fe2497bd806ec41a6e0dd992c29a72efc0ef8fec9092d1978fd4a1e00b2f183049060200160405180910390a2505050565b3360009081527fa140e363058a6cf3ca062c5e378319d7ddd21cedfbdca620f1c65b05028f156c602052604081205460ff1615611905575060131936013560601c90565b503390565b6000828152600080516020612d8d833981519152602081815260408084206001600160a01b03861685529091529091205460ff1661080257611956826001600160a01b03166014611bad565b611961846020611bad565b604051602001611972929190612cb3565b60408051601f198184030181529082905262461bcd60e51b825261089191600401612941565b6119a28282611d49565b6108ec8282611dd4565b6119b68282611e62565b60008281527f0c4ba382c0009cf238e4c1ca1a52f51c61e6248a70bdfb34e5ed49d5578a5c0c602090815260408083206001600160a01b03851680855260028201808552838620805487526001909301855292852080546001600160a01b031916905584529152555050565b6000610847825490565b600081815260018301602052604081205415156113de565b60006113de8383611ef0565b7fa7d40346e44ca145e94a946aa34a7d4a67245577dc18699a626fe0ffc6ce328180546000908290611a8190612c0e565b80601f0160208091040260200160405190810160405280929190818152602001828054611aad90612c0e565b8015611afa5780601f10611acf57610100808354040283529160200191611afa565b820191906000526020600020905b815481529060010190602001808311611add57829003601f168201915b50508651939450611b159386935060208801925090506120bb565b507fc9c7c3fe08b88b4df9d4d47ef47d2c43d55c025a0ba88ca442580ed9e7348a168184604051611b47929190612d28565b60405180910390a1505050565b611b7d60017fbbf78d3411d42a81effd97bb8c69faae4e77e75cec462245c1001191a0634c6f55565b565b61089a81611f1a565b60606113de8383604051806060016040528060278152602001612dad60279139611fa5565b60606000611bbc836002612d56565b611bc7906002612a6d565b67ffffffffffffffff811115611bdf57611bdf612273565b6040519080825280601f01601f191660200182016040528015611c09576020820181803683370190505b509050600360fc1b81600081518110611c2457611c24612a85565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611c5357611c53612a85565b60200101906001600160f81b031916908160001a9053506000611c77846002612d56565b611c82906001612a6d565b90505b6001811115611cfa576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611cb657611cb6612a85565b1a60f81b828281518110611ccc57611ccc612a85565b60200101906001600160f81b031916908160001a90535060049490941c93611cf381612d75565b9050611c85565b5083156113de5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610891565b6000600080516020612d8d8339815191526000848152602082815260408083206001600160a01b03871684529091529020805460ff191660011790559050611d8f6118c1565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4505050565b60008281527f0c4ba382c0009cf238e4c1ca1a52f51c61e6248a70bdfb34e5ed49d5578a5c0c6020819052604082208054919260019190611e158385612a6d565b909155505060009384526020918252604080852082865260018101845281862080546001600160a01b039096166001600160a01b0319909616861790559385526002909301909152912055565b600080516020612d8d833981519152611e7b838361190a565b6000838152602082815260408083206001600160a01b03861684529091529020805460ff19169055611eab6118c1565b6001600160a01b0316826001600160a01b0316847ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a4505050565b6000826000018281548110611f0757611f07612a85565b9060005260206000200154905092915050565b7fa140e363058a6cf3ca062c5e378319d7ddd21cedfbdca620f1c65b05028f156c60005b8251811015610802576001826000016000858481518110611f6157611f61612a85565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905580611f9d81612ab2565b915050611f3e565b60606001600160a01b0384163b61200d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610891565b600080856001600160a01b0316856040516120289190612c97565b600060405180830381855af49150503d8060008114612063576040519150601f19603f3d011682016040523d82523d6000602084013e612068565b606091505b5091509150612078828286612082565b9695505050505050565b606083156120915750816113de565b8251156120a15782518084602001fd5b8160405162461bcd60e51b81526004016108919190612941565b8280546120c790612c0e565b90600052602060002090601f0160209004810192826120e9576000855561212f565b82601f1061210257805160ff191683800117855561212f565b8280016001018555821561212f579182015b8281111561212f578251825591602001919060010190612114565b5061213b92915061213f565b5090565b5b8082111561213b5760008155600101612140565b6001600160a01b038116811461089a57600080fd5b805161217481612154565b919050565b60006020828403121561218b57600080fd5b81516113de81612154565b6001600160e01b03198116811461089a57600080fd5b6000602082840312156121be57600080fd5b81356113de81612196565b803561217481612154565b6000806000806000608086880312156121ec57600080fd5b85356121f781612154565b9450602086013561220781612154565b935060408601359250606086013567ffffffffffffffff8082111561222b57600080fd5b818801915088601f83011261223f57600080fd5b81358181111561224e57600080fd5b89602082850101111561226057600080fd5b9699959850939650602001949392505050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156122ac576122ac612273565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156122db576122db612273565b604052919050565b600067ffffffffffffffff8211156122fd576122fd612273565b50601f01601f191660200190565b600082601f83011261231c57600080fd5b813561232f61232a826122e3565b6122b2565b81815284602083860101111561234457600080fd5b816020850160208301376000918101602001919091529392505050565b60006020828403121561237357600080fd5b813567ffffffffffffffff8082111561238b57600080fd5b908301906060828603121561239f57600080fd5b6123a7612289565b82356123b281612196565b81526020830135828111156123c657600080fd5b6123d28782860161230b565b602083015250604083013592506123e883612154565b6040810192909252509392505050565b6000806040838503121561240b57600080fd5b823561241681612154565b946020939093013593505050565b60006020828403121561243657600080fd5b5035919050565b6000806040838503121561245057600080fd5b82359150602083013561246281612154565b809150509250929050565b60006020828403121561247f57600080fd5b81356113de81612154565b6020808252825182820181905260009190848201906040850190845b818110156124cc5783516001600160e01b031916835292840192918401916001016124a6565b50909695505050505050565b60005b838110156124f35781810151838201526020016124db565b83811115612502576000848401525b50505050565b600081518084526125208160208601602086016124d8565b601f01601f19169290920160200192915050565b60006020808301818452808551808352604092508286019150828160051b87010184880160005b838110156125bc57888303603f19018552815180516001600160e01b03191684528781015160608986018190529061259582870182612508565b928901516001600160a01b031695890195909552509487019492509086019060010161255b565b509098975050505050505050565b600080604083850312156125dd57600080fd5b50508035926020909101359150565b6000602082840312156125fe57600080fd5b813567ffffffffffffffff81111561261557600080fd5b6126218482850161230b565b949350505050565b600067ffffffffffffffff82111561264357612643612273565b5060051b60200190565b803561ffff8116811461217457600080fd5b600080600080600060a0868803121561267757600080fd5b853561268281612154565b945060208681013567ffffffffffffffff808211156126a057600080fd5b6126ac8a838b0161230b565b965060408901359150808211156126c257600080fd5b508701601f810189136126d457600080fd5b80356126e261232a82612629565b81815260059190911b8201830190838101908b83111561270157600080fd5b928401925b8284101561272857833561271981612154565b82529284019290840190612706565b809750505050505061273c606087016121c9565b915061274a6080870161264d565b90509295509295909350565b6000806020838503121561276957600080fd5b823567ffffffffffffffff8082111561278157600080fd5b818501915085601f83011261279557600080fd5b8135818111156127a457600080fd5b8660208260051b85010111156127b957600080fd5b60209290920196919550909350505050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561282057603f1988860301845261280e858351612508565b945092850192908501906001016127f2565b5092979650505050505050565b600082601f83011261283e57600080fd5b8135602061284e61232a83612629565b82815260059290921b8401810191818101908684111561286d57600080fd5b8286015b848110156128885780358352918301918301612871565b509695505050505050565b600080600080600060a086880312156128ab57600080fd5b85356128b681612154565b945060208601356128c681612154565b9350604086013567ffffffffffffffff808211156128e357600080fd5b6128ef89838a0161282d565b9450606088013591508082111561290557600080fd5b61291189838a0161282d565b9350608088013591508082111561292757600080fd5b506129348882890161230b565b9150509295509295909350565b6020815260006113de6020830184612508565b600080600080600060a0868803121561296c57600080fd5b853561297781612154565b9450602086013561298781612154565b93506040860135925060608601359150608086013567ffffffffffffffff8111156129b157600080fd5b6129348882890161230b565b600060208083850312156129d057600080fd5b825167ffffffffffffffff8111156129e757600080fd5b8301601f810185136129f857600080fd5b8051612a0661232a82612629565b81815260059190911b82018301908381019087831115612a2557600080fd5b928401925b82841015612a4c578351612a3d81612196565b82529284019290840190612a2a565b979650505050505050565b634e487b7160e01b600052601160045260246000fd5b60008219821115612a8057612a80612a57565b500190565b634e487b7160e01b600052603260045260246000fd5b600082821015612aad57612aad612a57565b500390565b6000600019821415612ac657612ac6612a57565b5060010190565b60006020808385031215612ae057600080fd5b825167ffffffffffffffff80821115612af857600080fd5b818501915085601f830112612b0c57600080fd5b8151612b1a61232a82612629565b81815260059190911b83018401908481019088831115612b3957600080fd5b8585015b83811015612c0157805185811115612b5457600080fd5b86016060818c03601f19011215612b6b5760008081fd5b612b73612289565b88820151612b8081612196565b815260408281015188811115612b965760008081fd5b8301603f81018e13612ba85760008081fd5b8a810151612bb861232a826122e3565b8181528f84838501011115612bcd5760008081fd5b612bdc828e83018686016124d8565b848d015250612bef905060608401612169565b90820152845250918601918601612b3d565b5098975050505050505050565b600181811c90821680612c2257607f821691505b60208210811415612c4357634e487b7160e01b600052602260045260246000fd5b50919050565b6000808335601e19843603018112612c6057600080fd5b83018035915067ffffffffffffffff821115612c7b57600080fd5b602001915036819003821315612c9057600080fd5b9250929050565b60008251612ca98184602087016124d8565b9190910192915050565b7f5065726d697373696f6e733a206163636f756e74200000000000000000000000815260008351612ceb8160158501602088016124d8565b7001034b99036b4b9b9b4b733903937b6329607d1b6015918401918201528351612d1c8160268401602088016124d8565b01602601949350505050565b604081526000612d3b6040830185612508565b8281036020840152612d4d8185612508565b95945050505050565b6000816000190483118215151615612d7057612d70612a57565b500290565b600081612d8457612d84612a57565b50600019019056fed0ebebe8e6445c62babf8fef767eb39f1002bb957bb5b83258275a4e46428ed5416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220cd27cecfe1b199c4905b4636edd776cccf600df4d52069156c9ded42258292df64736f6c634300080c0033";
