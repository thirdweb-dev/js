import IERC2771ContextAbi from "@thirdweb-dev/contracts-js/dist/abis/ERC2771Context.json";
import IAppURI from "@thirdweb-dev/contracts-js/dist/abis/IAppURI.json";
import IContractMetadataAbi from "@thirdweb-dev/contracts-js/dist/abis/IContractMetadata.json";
import IDefaultPluginSetAbi from "@thirdweb-dev/contracts-js/dist/abis/IDefaultPluginSet.json";
import IDirectListingsAbi from "@thirdweb-dev/contracts-js/dist/abis/IDirectListings.json";
import IEnglishAuctionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IEnglishAuctions.json";
import IOffersAbi from "@thirdweb-dev/contracts-js/dist/abis/IOffers.json";
import IPackVRFAbi from "@thirdweb-dev/contracts-js/dist/abis/IPackVRFDirect.json";
import IPermissionsAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissions.json";
import IPermissionsEnumerableAbi from "@thirdweb-dev/contracts-js/dist/abis/IPermissionsEnumerable.json";
import IThirdwebPlatformFeeAbi from "@thirdweb-dev/contracts-js/dist/abis/IPlatformFee.json";
import IThirdwebPrimarySaleAbi from "@thirdweb-dev/contracts-js/dist/abis/IPrimarySale.json";
import IThirdwebRoyaltyAbi from "@thirdweb-dev/contracts-js/dist/abis/IRoyalty.json";
import ITWRouterAbi from "@thirdweb-dev/contracts-js/dist/abis/ITWRouter.json";
import IOwnableAbi from "@thirdweb-dev/contracts-js/dist/abis/Ownable.json";

export const FEATURE_ROYALTY = {
  name: "Royalty",
  namespace: "royalty",
  docLinks: {
    sdk: "sdk.contractroyalty",
    contracts: "Royalty",
  },
  abis: [IThirdwebRoyaltyAbi],
  features: {},
} as const;

export const FEATURE_PRIMARY_SALE = {
  name: "PrimarySale",
  namespace: "sales",
  docLinks: {
    sdk: "sdk.contractprimarysale",
    contracts: "PrimarySale",
  },
  abis: [IThirdwebPrimarySaleAbi],
  features: {},
} as const;

export const FEATURE_PLATFORM_FEE = {
  name: "PlatformFee",
  namespace: "platformFee",
  docLinks: {
    sdk: "sdk.platformfee",
    contracts: "PlatformFee",
  },
  abis: [IThirdwebPlatformFeeAbi],
  features: {},
} as const;

export const FEATURE_PERMISSIONS_ENUMERABLE = {
  name: "PermissionsEnumerable",
  namespace: "roles",
  docLinks: {
    sdk: "sdk.contractroles",
    contracts: "PermissionsEnumerable",
  },
  abis: [IPermissionsEnumerableAbi],
  features: {},
} as const;

export const FEATURE_PERMISSIONS = {
  name: "Permissions",
  namespace: "roles",
  docLinks: {
    sdk: "sdk.contractroles",
    contracts: "Permissions",
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
    contracts: "ContractMetadata",
  },
  abis: [IContractMetadataAbi],
  features: {},
} as const;

export const FEATURE_APPURI = {
  name: "AppURI",
  namespace: "appURI",
  docLinks: {
    sdk: "sdk.appURI",
    contracts: "AppURI",
  },
  abis: [IAppURI],
  features: {},
} as const;

export const FEATURE_OWNER = {
  name: "Ownable",
  namespace: "owner",
  docLinks: {
    sdk: "sdk.owner",
    contracts: "Ownable",
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
    contracts: "IPackVRFDirect",
  },
  abis: [IPackVRFAbi],
  features: {},
} as const;

export const FEATURE_PLUGIN_ROUTER = {
  name: "PluginRouter",
  namespace: "plugin.router",
  docLinks: {
    sdk: "sdk.pluginrouter",
    contracts: "IRouter",
  },
  abis: [IDefaultPluginSetAbi],
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
