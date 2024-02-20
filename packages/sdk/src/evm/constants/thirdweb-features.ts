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

export const hookInstallerAbi = [
  {
    type: "function",
    name: "getHookImplementation",
    inputs: [{ name: "_flag", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hookFunctionRead",
    inputs: [
      { name: "_hookFlag", type: "uint256", internalType: "uint256" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hookFunctionWrite",
    inputs: [
      { name: "_hookFlag", type: "uint256", internalType: "uint256" },
      { name: "_value", type: "uint256", internalType: "uint256" },
      { name: "_data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "installHook",
    inputs: [
      { name: "_hook", type: "address", internalType: "contract IHook" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "uninstallHook",
    inputs: [
      { name: "_hook", type: "address", internalType: "contract IHook" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "HooksInstalled",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "hooks",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "HooksUninstalled",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "hooks",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "HookAlreadyInstalled", inputs: [] },
  { type: "error", name: "HookInstallerCallFailed", inputs: [] },
  { type: "error", name: "HookInstallerHookNotInstalled", inputs: [] },
  { type: "error", name: "HookInstallerInvalidHook", inputs: [] },
  { type: "error", name: "HookInstallerInvalidValue", inputs: [] },
  { type: "error", name: "HookInstallerUnauthorizedWrite", inputs: [] },
  { type: "error", name: "HookNotAuthorized", inputs: [] },
  { type: "error", name: "HookNotInstalled", inputs: [] },
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

export const FEATURE_HOOK_INSTALLER = {
  name: "HookInstaller",
  namespace: "hook.installer",
  docLinks: {
    sdk: "",
    //TODO
    contracts: "",
  },
  abis: [hookInstallerAbi],
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
