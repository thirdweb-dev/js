// @ts-expect-error
import IERC2771ContextAbi from "@thirdweb-dev/contracts-js/dist/abis/ERC2771Context";
// @ts-expect-error
import IAppURI from "@thirdweb-dev/contracts-js/dist/abis/IAppURI";
// @ts-expect-error
import IContractMetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IContractMetadata";
// @ts-expect-error
import IDirectListingsAbi from "@thirdweb-dev/contracts-js/dist/abis/IDirectListings";
// @ts-expect-error
import IEnglishAuctionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IEnglishAuctions";
// @ts-expect-error
import IOffersAbi from "@thirdweb-dev/contracts-js/dist/abis/IOffers";
// @ts-expect-error
import IPackVRFAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect";
// @ts-expect-error
import IPermissionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissions";
// @ts-expect-error
import IPermissionsEnumerableAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissionsEnumerable";
// @ts-expect-error
import IThirdwebPlatformFeeAbi from "@thirdweb-dev/contracts-js/dist/abis/IPlatformFee";
// @ts-expect-error
import IThirdwebPrimarySaleAbi from "@thirdweb-dev/contracts-js/dist/abis/IPrimarySale";
// @ts-expect-error
import IThirdwebRoyaltyAbi from "@thirdweb-dev/contracts-js/dist/abis/IRoyalty";
// @ts-expect-error
import IOwnableAbi from "@thirdweb-dev/contracts-js/dist/abis/Ownable";
// @ts-expect-error
import IAccountFactory from "@thirdweb-dev/contracts-js/dist/abis/IAccountFactory";
// @ts-expect-error
import IAccount from "@thirdweb-dev/contracts-js/dist/abis/IAccount";

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
  namespace: "platformFee",
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

export const FEATURE_PERMISSIONS = {
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
    contracts: "",
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
    contracts: "",
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
    contracts: "",
  },
  abis: [getAllPluginsAbi],
  features: {},
} as const;

export const FEATURE_EXTENSION_ROUTER = {
  name: "ExtensionRouter",
  namespace: "extension.router",
  docLinks: {
    sdk: "",
    //TODO
    contracts: "",
  },
  abis: [getAllExtensionsAbi],
  features: {},
} as const;

export const FEATURE_DIRECT_LISTINGS = {
  name: "DirectListings",
  namespace: "direct.listings",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "",
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
    contracts: "",
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
    contracts: "",
  },
  abis: [IOffersAbi],
  features: {},
} as const;

export const FEATURE_SMART_WALLET_FACTORY = {
  name: "SmartWalletFactory",
  namespace: "smartwallet.factory",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "",
  },
  abis: [IAccountFactory],
  features: {},
} as const;

export const FEATURE_SMART_WALLET = {
  name: "SmartWallet",
  namespace: "smartwallet",
  docLinks: {
    // TODO
    sdk: "",
    contracts: "",
  },
  abis: [IAccount],
  features: {},
} as const;
