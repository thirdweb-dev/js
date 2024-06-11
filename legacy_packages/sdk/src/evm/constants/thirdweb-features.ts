import IERC2771ContextAbi from "@thirdweb-dev/contracts-js/dist/abis/IERC2771Context.json";
import IAppURI from "@thirdweb-dev/contracts-js/dist/abis/IAppURI.json";
import IContractMetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IContractMetadata.json";
import IDirectListingsAbi from "@thirdweb-dev/contracts-js/dist/abis/IDirectListings.json";
import IEnglishAuctionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IEnglishAuctions.json";
import IOffersAbi from "@thirdweb-dev/contracts-js/dist/abis/IOffers.json";
import IPackVRFAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect.json";
import IPermissionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissions.json";
import IPermissionsEnumerableAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissionsEnumerable.json";
import IThirdwebPlatformFeeAbi from "@thirdweb-dev/contracts-js/dist/abis/IPlatformFee.json";
import IThirdwebPrimarySaleAbi from "@thirdweb-dev/contracts-js/dist/abis/IPrimarySale.json";
import IThirdwebRoyaltyAbi from "@thirdweb-dev/contracts-js/dist/abis/IRoyalty.json";
import IOwnableAbi from "@thirdweb-dev/contracts-js/dist/abis/Ownable.json";
import IAirdropERC20 from "@thirdweb-dev/contracts-js/dist/abis/IAirdropERC20.json";
import IAirdropERC721 from "@thirdweb-dev/contracts-js/dist/abis/IAirdropERC721.json";
import IAirdropERC1155 from "@thirdweb-dev/contracts-js/dist/abis/IAirdropERC1155.json";
import IAccountFactoryCore from "@thirdweb-dev/contracts-js/dist/abis/IAccountFactoryCore.json";
import IAccountPermissions from "@thirdweb-dev/contracts-js/dist/abis/IAccountPermissions.json";
import IAccountPermissionsV1 from "@thirdweb-dev/contracts-js/dist/abis/IAccountPermissions_V1.json";
import IAccount from "@thirdweb-dev/contracts-js/dist/abis/IAccount.json";

export const fallbackAbi = [
  {
    stateMutability: "payable",
    type: "fallback",
  },
];

export const getAllPluginsAbi = [
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
];

export const getAllExtensionsAbi = [
  {
    inputs: [],
    name: "getAllExtensions",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "metadataURI",
                type: "string",
              },
              {
                internalType: "address",
                name: "implementation",
                type: "address",
              },
            ],
            internalType: "struct IExtension.ExtensionMetadata",
            name: "metadata",
            type: "tuple",
          },
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
            ],
            internalType: "struct IExtension.ExtensionFunction[]",
            name: "functions",
            type: "tuple[]",
          },
        ],
        internalType: "struct IExtension.Extension[]",
        name: "allExtensions",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const coreContractAbi = [
  { type: "fallback", stateMutability: "payable" },
  {
    type: "function",
    name: "cancelOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "completeOwnershipHandover",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getInstalledExtensions",
    inputs: [],
    outputs: [
      {
        name: "_installedExtensions",
        type: "tuple[]",
        internalType: "struct IModularCore.InstalledExtension[]",
        components: [
          {
            name: "implementation",
            type: "address",
            internalType: "address",
          },
          {
            name: "config",
            type: "tuple",
            internalType: "struct IExtensionConfig.ExtensionConfig",
            components: [
              {
                name: "registerInstallationCallback",
                type: "bool",
                internalType: "bool",
              },
              {
                name: "requiredInterfaces",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
              {
                name: "supportedInterfaces",
                type: "bytes4[]",
                internalType: "bytes4[]",
              },
              {
                name: "callbackFunctions",
                type: "tuple[]",
                internalType: "struct IExtensionConfig.CallbackFunction[]",
                components: [
                  {
                    name: "selector",
                    type: "bytes4",
                    internalType: "bytes4",
                  },
                ],
              },
              {
                name: "fallbackFunctions",
                type: "tuple[]",
                internalType: "struct IExtensionConfig.FallbackFunction[]",
                components: [
                  {
                    name: "selector",
                    type: "bytes4",
                    internalType: "bytes4",
                  },
                  {
                    name: "permissionBits",
                    type: "uint256",
                    internalType: "uint256",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSupportedCallbackFunctions",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IModularCore.SupportedCallbackFunction[]",
        components: [
          { name: "selector", type: "bytes4", internalType: "bytes4" },
          {
            name: "mode",
            type: "uint8",
            internalType: "enum IModularCore.CallbackMode",
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "grantRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "hasAllRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasAnyRole",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "installExtension",
    inputs: [
      { name: "_extension", type: "address", internalType: "address" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "result", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ownershipHandoverExpiresAt",
    inputs: [
      { name: "pendingOwner", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "result", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "renounceRoles",
    inputs: [{ name: "roles", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "requestOwnershipHandover",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "revokeRoles",
    inputs: [
      { name: "user", type: "address", internalType: "address" },
      { name: "roles", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "rolesOf",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [{ name: "roles", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "uninstallExtension",
    inputs: [
      { name: "_extension", type: "address", internalType: "address" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "ExtensionInstalled",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "implementation",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "installedExtension",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExtensionUninstalled",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "implementation",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "installedExtension",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverCanceled",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipHandoverRequested",
    inputs: [
      {
        name: "pendingOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "oldOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RolesUpdated",
    inputs: [
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "roles",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AlreadyInitialized", inputs: [] },
  { type: "error", name: "CallbackExecutionReverted", inputs: [] },
  {
    type: "error",
    name: "CallbackFunctionAlreadyInstalled",
    inputs: [],
  },
  { type: "error", name: "CallbackFunctionNotSupported", inputs: [] },
  { type: "error", name: "CallbackFunctionRequired", inputs: [] },
  {
    type: "error",
    name: "CallbackFunctionUnauthorizedCall",
    inputs: [],
  },
  { type: "error", name: "ExtensionAlreadyInstalled", inputs: [] },
  {
    type: "error",
    name: "ExtensionInterfaceNotCompatible",
    inputs: [
      {
        name: "requiredInterfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
  },
  { type: "error", name: "ExtensionNotInstalled", inputs: [] },
  { type: "error", name: "ExtensionOutOfSync", inputs: [] },
  {
    type: "error",
    name: "FallbackFunctionAlreadyInstalled",
    inputs: [],
  },
  { type: "error", name: "FallbackFunctionNotInstalled", inputs: [] },
  { type: "error", name: "IndexOutOfBounds", inputs: [] },
  { type: "error", name: "NewOwnerIsZeroAddress", inputs: [] },
  { type: "error", name: "NoHandoverRequest", inputs: [] },
  { type: "error", name: "Unauthorized", inputs: [] },
];

export const extensionContractAbi = [
  {
    type: "function",
    name: "getExtensionConfig",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IExtensionConfig.ExtensionConfig",
        components: [
          {
            name: "registerInstallationCallback",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "requiredInterfaces",
            type: "bytes4[]",
            internalType: "bytes4[]",
          },
          {
            name: "supportedInterfaces",
            type: "bytes4[]",
            internalType: "bytes4[]",
          },
          {
            name: "callbackFunctions",
            type: "tuple[]",
            internalType: "struct IExtensionConfig.CallbackFunction[]",
            components: [
              {
                name: "selector",
                type: "bytes4",
                internalType: "bytes4",
              },
            ],
          },
          {
            name: "fallbackFunctions",
            type: "tuple[]",
            internalType: "struct IExtensionConfig.FallbackFunction[]",
            components: [
              {
                name: "selector",
                type: "bytes4",
                internalType: "bytes4",
              },
              {
                name: "permissionBits",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
];

export const FEATURE_ROYALTY = {
  name: "Royalty",
  namespace: "royalty",
  docLinks: {
    sdk: "sdk.contractroyalty",
    contracts: "royalty",
  },
  abis: [IThirdwebRoyaltyAbi],
  features: {},
} as const;

export const FEATURE_PRIMARY_SALE = {
  name: "PrimarySale",
  namespace: "sales",
  docLinks: {
    sdk: "sdk.contractprimarysale",
    contracts: "primarysale",
  },
  abis: [IThirdwebPrimarySaleAbi],
  features: {},
} as const;

export const FEATURE_PLATFORM_FEE = {
  name: "PlatformFee",
  namespace: "platformFees",
  docLinks: {
    sdk: "sdk.platformfee",
    contracts: "platformfee",
  },
  abis: [IThirdwebPlatformFeeAbi],
  features: {},
} as const;

export const FEATURE_PERMISSIONS_ENUMERABLE = {
  name: "PermissionsEnumerable",
  namespace: "roles",
  docLinks: {
    sdk: "sdk.contractroles",
    contracts: "permissionsenumerable",
  },
  abis: [IPermissionsEnumerableAbi],
  features: {},
} as const;

export const FEATURE_PERMISSIONS = /* @__PURE__ */ {
  name: "Permissions",
  namespace: "roles",
  docLinks: {
    sdk: "sdk.contractroles",
    contracts: "permissions",
  },
  abis: [IPermissionsAbi],
  features: {
    [FEATURE_PERMISSIONS_ENUMERABLE.name]: FEATURE_PERMISSIONS_ENUMERABLE,
  },
} as const;

export const FEATURE_METADATA = {
  name: "ContractMetadata",
  namespace: "metadata",
  docLinks: {
    sdk: "sdk.contractmetadata",
    contracts: "contractmetadata",
  },
  abis: [IContractMetadataAbi],
  features: {},
} as const;

export const FEATURE_APPURI = {
  name: "AppURI",
  namespace: "appURI",
  docLinks: {
    sdk: "sdk.appURI",
    //TODO
    contracts: "",
  },
  abis: [IAppURI],
  features: {},
} as const;

export const FEATURE_OWNER = {
  name: "Ownable",
  namespace: "owner",
  docLinks: {
    sdk: "sdk.owner",
    contracts: "ownable",
  },
  abis: [IOwnableAbi],
  features: {},
} as const;

export const FEATURE_GASLESS = {
  name: "Gasless",
  namespace: "gasless",
  docLinks: {
    sdk: "sdk.gaslesstransaction",
    // TODO add the correct name for this once it's added to portal
    contracts: "IERC2771Context",
  },
  abis: [IERC2771ContextAbi],
  features: {},
} as const;

export const FEATURE_PACK_VRF = {
  name: "PackVRF",
  namespace: "pack.vrf",
  docLinks: {
    sdk: "sdk.packvrf",
    //TODO
    contracts: "IPackVRF",
  },
  abis: [IPackVRFAbi],
  features: {},
} as const;

export const FEATURE_PLUGIN_ROUTER = {
  name: "PluginRouter",
  namespace: "plugin.router",
  docLinks: {
    sdk: "sdk.pluginrouter",
    //TODO
    contracts: "PluginRouter",
  },
  abis: [getAllPluginsAbi],
  features: {},
} as const;

export const FEATURE_DYNAMIC_CONTRACT = {
  name: "DynamicContract",
  namespace: "dynamic.contract",
  docLinks: {
    sdk: "",
    //TODO
    contracts: "IExtensionsManager",
  },
  abis: [getAllExtensionsAbi],
  features: {},
} as const;

export const FEATURE_MODULAR_CORE = {
  name: "ModularCore",
  namespace: "modular.core",
  docLinks: {
    sdk: "",
    //TODO
    contracts: "",
  },
  abis: [coreContractAbi],
  features: {},
} as const;

export const FEATURE_MODULAR_EXTENSION = {
  name: "ModularExtension",
  namespace: "modular.extension",
  docLinks: {
    sdk: "",
    //TODO
    contracts: "",
  },
  abis: [extensionContractAbi],
  features: {},
} as const;

export const FEATURE_DIRECT_LISTINGS = {
  name: "DirectListings",
  namespace: "direct.listings",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IDirectListings",
  },
  abis: [IDirectListingsAbi],
  features: {},
} as const;

export const FEATURE_ENGLISH_AUCTIONS = {
  name: "EnglishAuctions",
  namespace: "english.auctions",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IEnglishAuctions",
  },
  abis: [IEnglishAuctionsAbi],
  features: {},
} as const;

export const FEATURE_OFFERS = {
  name: "Offers",
  namespace: "offers",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IOffers",
  },
  abis: [IOffersAbi],
  features: {},
} as const;

export const FEATURE_ACCOUNT_FACTORY = {
  name: "AccountFactory",
  namespace: "accountFactory",
  docLinks: {
    // TODO
    sdk: "sdk.accountFactory",
    contracts: "IAccountFactory",
  },
  abis: [IAccountFactoryCore],
  features: {},
} as const;

export const FEATURE_ACCOUNT_PERMISSIONS_V1 = {
  name: "AccountPermissionsV1",
  namespace: "accountPermissions",
  docLinks: {
    // TODO
    sdk: "sdk.account",
    contracts: "IAccountPermissions",
  },
  abis: [IAccountPermissionsV1],
  features: {},
} as const;

export const FEATURE_ACCOUNT_PERMISSIONS = {
  name: "AccountPermissions",
  namespace: "accountPermissions",
  docLinks: {
    // TODO
    sdk: "sdk.account",
    contracts: "IAccountPermissions",
  },
  abis: [IAccountPermissions],
  features: {},
} as const;

export const FEATURE_ACCOUNT = {
  name: "Account",
  namespace: "account",
  docLinks: {
    // TODO
    sdk: "sdk.account",
    contracts: "IAccount",
  },
  abis: [IAccount],
  features: {
    [FEATURE_ACCOUNT_PERMISSIONS.name]: FEATURE_ACCOUNT_PERMISSIONS,
    [FEATURE_ACCOUNT_PERMISSIONS_V1.name]: FEATURE_ACCOUNT_PERMISSIONS_V1,
  },
} as const;

export const FEATURE_AIRDROP_ERC20 = {
  name: "AirdropERC20",
  namespace: "airdrop20",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IAirdropERC20",
  },
  abis: [IAirdropERC20],
  features: {},
} as const;

export const FEATURE_AIRDROP_ERC721 = {
  name: "AirdropERC721",
  namespace: "airdrop721",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IAirdropERC721",
  },
  abis: [IAirdropERC721],
  features: {},
} as const;

export const FEATURE_AIRDROP_ERC1155 = {
  name: "AirdropERC1155",
  namespace: "airdrop1155",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "IAirdropERC1155",
  },
  abis: [IAirdropERC1155],
  features: {},
} as const;

export const FEATURE_FALLBACK = {
  name: "Fallback",
  namespace: "fallback",
  docLinks: {
    sdk: "",
    contracts: "",
  },
  abis: [fallbackAbi],
  features: {},
} as const;
