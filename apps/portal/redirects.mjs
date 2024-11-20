// @ts-check

import { unrealEngineRedirects } from "./src/app/unreal-engine/redirects.mjs";

const reactRedirects = {
  "/react": "/react/v4",
  "/react/connecting-wallets": "/react/v4/connecting-wallets",
  // providers
  "/react/react.thirdwebprovider": "/react/v4/ThirdwebProvider",
  "/react/react.thirdwebsdkprovider": "/react/v4/ThirdwebSDKProvider",
  // components
  "/react/react.connectwallet": "/react/v4/components/ConnectWallet",
  "/react/react.web3button": "/react/v4/components/Web3Button",
  "/react/react.thirdwebnftmedia": "/react/v4/components/ThirdwebNftMedia",
  "/react/react.mediarenderer": "/react/v4/components/MediaRenderer",
  // wallets
  "/react/react.metamaskwallet": "/references/react/v4/metamaskWallet",
  "/react/react.coinbasewallet": "/references/react/v4/coinbaseWallet",
  "/react/react.walletconnect": "/references/react/v4/walletconnect",
  "/react/react.smartwallet": "/references/react/v4/smartWallet",
  "/react/react.embeddedwallet": "/references/react/v4/embeddedWallet",
  "/react/react.paperwallet": "/references/react/v4/embeddedWallet",
  "/react/react.localwallet": "/references/react/v4/localWallet",
  "/react/react.trustWallet": "/references/react/v4/trustWallet",
  "/react/react.zerion": "/references/react/v4/zerionWallet",
  "/react/react.magiclink": "/references/react/v4/magicLink",
  "/react/react.safewallet": "/references/react/v4/safeWallet",
  "/react/react.blocto": "/references/react/v4/bloctoWallet",
  "/react/react.frame": "/references/react/v4/frameWallet",
  "/react/react.phantom": "/references/react/v4/phantomWallet",
  "/react/react.rainbowWallet": "/references/react/v4/rainbowWallet",
  "/react/react.coin98": "/references/react/v4/coin98Wallet",
  "/react/react.core": "/references/react/v4/coreWallet",
  "/react/react.defiwallet": "/references/react/v4/cryptoDefiWallet",
  "/react/react.okx": "/references/react/v4/okxWallet",
  "/react/react.onekey": "/references/react/v4/oneKeyWallet",
  "/react/react.rabby": "/references/react/v4/rabbyWallet",
  // hooks
  "/react/react.useaddress": "/references/react/v4/useAddress",
  "/react/react.usecontract": "/references/react/v4/useContract",
  "/react/react.usecontractread": "/references/react/v4/useContractRead",
  "/react/react.usecontractwrite": "/references/react/v4/useContractWrite",
  "/react/react.usecontractevents": "/references/react/v4/useContractEvents",
  "/react/react.usesdk": "/references/react/v4/useSDK",
  "/react/react.useactiveclaimcondition":
    "/references/react/v4/useActiveClaimCondition",
  "/react/react.useactiveclaimconditionforwallet":
    "/references/react/v4/useActiveClaimConditionForWallet",
  "/react/react.useclaimconditions": "/references/react/v4/useClaimConditions",
  "/react/react.useclaimerproofs": "/references/react/v4/useClaimerProofs",
  "/react/react.useclaimineligibilityreasons":
    "/references/react/v4/useClaimIneligibilityReasons",
  "/react/react.usesetclaimconditions":
    "/references/react/v4/useSetClaimConditions",
  "/react/react.usebatchestoreveal": "/references/react/v4/useBatchesToReveal",
  "/react/react.usedelayedreveallazymint":
    "/references/react/v4/useDelayedRevealLazyMint",
  "/react/react.usereveallazymint": "/references/react/v4/useRevealLazyMint",
  "/react/react.useacceptdirectlistingoffer":
    "/references/react/v4/useAcceptDirectListingOffer",
  "/react/react.useactivelistings": "/references/react/v4/useActiveListings",
  "/react/react.useauctionwinner": "/references/react/v4/useAuctionWinner",
  "/react/react.usebidbuffer": "/references/react/v4/useBidBuffer",
  "/react/react.usebuydirectlisting":
    "/references/react/v4/useBuyDirectListing",
  "/react/react.usebuynow": "/references/react/v4/useBuyNow",
  "/react/react.usecanceldirectlisting":
    "/references/react/v4/useCancelDirectListing",
  "/react/react.usecancelenglishauction":
    "/references/react/v4/useCancelEnglishAuction",
  "/react/react.usecancellisting": "/references/react/v4/useCancelListing",
  "/react/react.usecreateauctionlisting":
    "/references/react/v4/useCreateAuctionListing",
  "/react/react.usecreatedirectlisting":
    "/references/react/v4/useCreateDirectListing",
  "/react/react.usedirectlisting": "/references/react/v4/useDirectListing",
  "/react/react.usedirectlistings": "/references/react/v4/useDirectListings",
  "/react/react.usedirectlistingscount":
    "/references/react/v4/useDirectListingsCount",
  "/react/react.useenglishauction": "/references/react/v4/useEnglishAuction",
  "/react/react.useenglishauctions": "/references/react/v4/useEnglishAuctions",
  "/react/react.useenglishauctionscount":
    "/references/react/v4/useEnglishAuctionsCount",
  "/react/react.useenglishauctionwinningbid":
    "/references/react/v4/useEnglishAuctionWinningBid",
  "/react/react.useexecuteauctionsale":
    "/references/react/v4/useExecuteAuctionSale",
  "/react/react.uselisting": "/references/react/v4/useListing",
  "/react/react.uselistings": "/references/react/v4/useListings",
  "/react/react.uselistingscount": "/references/react/v4/useListingsCount",
  "/react/react.usemakebid": "/references/react/v4/useMakeBid",
  "/react/react.usemakeoffer": "/references/react/v4/useMakeOffer",
  "/react/react.useminimumnextbid": "/references/react/v4/useMinimumNextBid",
  "/react/react.useoffers": "/references/react/v4/useOffers",
  "/react/react.usevaliddirectlistings":
    "/references/react/v4/useValidDirectListings",
  "/react/react.usevalidenglishauctions":
    "/references/react/v4/useValidEnglishAuctions",
  "/react/react.usewinningbid": "/references/react/v4/useWinningBid",
  "/react/react.usecompilermetadata":
    "/references/react/v4/useCompilerMetadata",
  "/react/react.usecontracttype": "/references/react/v4/useContractType",
  "/react/react.usemetadata": "/references/react/v4/useMetadata",
  "/react/react.useresolvedmediatype":
    "/references/react/v4/useResolvedMediaType",
  "/react/react.useupdatemetadata": "/references/react/v4/useUpdateMetadata",
  "/react/react.usechain": "/references/react/v4/useChain",
  "/react/react.useSwitchChain": "/references/react/v4/useSwitchChain",
  "/react/react.usechainid": "/references/react/v4/useChainId",
  "/react/react.usenft": "/references/react/v4/useNFT",
  "/react/react.useairdropnft": "/references/react/v4/useAirdropNFT",
  "/react/react.useburnnft": "/references/react/v4/useBurnNFT",
  "/react/react.usemintnft": "/references/react/v4/useMintNFT",
  "/react/react.usemintnftsupply": "/references/react/v4/useMintNFTSupply",
  "/react/react.usenftbalance": "/references/react/v4/useNFTBalance",
  "/react/react.usenfts": "/references/react/v4/useNFTs",
  "/react/react.useownednfts": "/references/react/v4/useOwnedNFTs",
  "/react/react.usetotalcirculatingsupply":
    "/references/react/v4/useTotalCirculatingSupply",
  "/react/react.usetotalcount": "/references/react/v4/useTotalCount",
  "/react/react.usetransfernft": "/references/react/v4/useTransferNFT",
  "/react/react.useclaimednfts": "/references/react/v4/useClaimedNFTs",
  "/react/react.useclaimednftsupply":
    "/references/react/v4/useClaimedNFTSupply",
  "/react/react.useclaimnft": "/references/react/v4/useClaimNFT",
  "/react/react.uselazymint": "/references/react/v4/useLazyMint",
  "/react/react.useresetclaimconditions":
    "/references/react/v4/useResetClaimConditions",
  "/react/react.useunclaimednfts": "/references/react/v4/useUnclaimedNFTs",
  "/react/react.useunclaimednftsupply":
    "/references/react/v4/useUnclaimedNFTSupply",
  "/react/react.useallrolemembers": "/references/react/v4/useAllRoleMembers",
  "/react/react.usegrantrole": "/references/react/v4/useGrantRole",
  "/react/react.useisaddressrole": "/references/react/v4/useIsAddressRole",
  "/react/react.userevokerole": "/references/react/v4/useRevokeRole",
  "/react/react.userolemembers": "/references/react/v4/useRoleMembers",
  "/react/react.useplatformfees": "/references/react/v4/usePlatformFees",
  "/react/react.useprimarysalerecipient":
    "/references/react/v4/usePrimarySaleRecipient",
  "/react/react.useroyaltysettings": "/references/react/v4/useRoyaltySettings",
  "/react/react.useupdateplatformfees":
    "/references/react/v4/useUpdatePlatformFees",
  "/react/react.useupdateprimarysalerecipient":
    "/references/react/v4/useUpdatePrimarySaleRecipient",
  "/react/react.useupdateroyaltysettings":
    "/references/react/v4/useUpdateRoyaltySettings",
  "/react/react.usebalance": "/references/react/v4/useBalance",
  "/react/react.usebalanceforaddress":
    "/references/react/v4/useBalanceForAddress",
  "/react/react.useburntoken": "/references/react/v4/useBurnToken",
  "/react/react.useminttoken": "/references/react/v4/useMintToken",
  "/react/react.usetokenbalance": "/references/react/v4/useTokenBalance",
  "/react/react.usetokendecimals": "/references/react/v4/useTokenDecimals",
  "/react/react.usetokensupply": "/references/react/v4/useTokenSupply",
  "/react/react.usetransferbatchtoken":
    "/references/react/v4/useTransferBatchToken",
  "/react/react.usetransfertoken": "/references/react/v4/useTransferToken",
  "/react/react.useclaimtoken": "/references/react/v4/useClaimToken",
  "/react/react.useconnect": "/references/react/v4/useConnect",
  "/react/react.usedisconnect": "/references/react/v4/useDisconnect",
  "/react/react.usewallet": "/references/react/v4/useWallet",
  "/react/react.useconnectionstatus":
    "/references/react/v4/useConnectionStatus",
  "/react/react.usesigner": "/references/react/v4/useSigner",
  "/react/react.usemetamask": "/references/react/v4/useMetamask",
  "/react/react.usecoinbasewallet": "/references/react/v4/useCoinbaseWallet",
  "/react/react.usewalletconnect": "/references/react/v4/useWalletConnect",
  "/react/react.usesmartwallet": "/references/react/v4/useSmartWallet",
  "/react/react.useembeeddedwallet": "/references/react/v4/useEmbeddedWallet",
  "/react/react.usesafe": "/references/react/v4/useSafe",
  "/react/react.usemagic": "/references/react/v4/useMagic",
  "/react/react.userainbowwallet": "/references/react/v4/useRainbowWallet",
  "/react/react.usetrustwallet": "/references/react/v4/useTrustWallet",
  "/react/react.usebloctowallet": "/references/react/v4/useBloctoWallet",
  "/react/react.useframewallet": "/references/react/v4/useFrameWallet",
  "/react/react.usesetconnectedwallet":
    "/references/react/v4/useSetConnectedWallet",
  "/react/react.usesetconnectionstatus":
    "/references/react/v4/useSetConnectionStatus",
  "/react/react.usecreatewalletinstance":
    "/references/react/v4/useCreateWalletInstance",
  "/react/react.usewalletconfig": "/references/react/v4/useWalletConfig",
  "/react/react.useaccountadmins": "/references/react/v4/useAccountAdmins",
  "/react/react.useaccountadminsandsigners":
    "/references/react/v4/useAccountAdminsAndSigners",
  "/react/react.useaccountsigners": "/references/react/v4/useAccountSigners",
  "/react/react.useaddadmin": "/references/react/v4/useAddAdmin",
  "/react/react.usecreatesessionkey":
    "/references/react/v4/useCreateSessionKey",
  "/react/react.useremoveadmin": "/references/react/v4/useRemoveAdmin",
  "/react/react.userevokesessionkey":
    "/references/react/v4/useRevokeSessionKey",
  "/react/react.uselogin": "/references/react/v4/useLogin",
  "/react/react.uselogout": "/references/react/v4/useLogout",
  "/react/react.useuser": "/references/react/v4/useUser",
  "/react/react.usestorage": "/references/react/v4/useStorage",
  "/react/react.usestorageupload": "/references/react/v4/useStorageUpload",
  "/ui-components/web3button": "/react/v4/components/Web3Button",
  "/react/v5/in-app-wallet/how-to/get-in-app-wallet-details-on-server":
    "/react/v5/in-app-wallet/how-to/get-user-details",
};

const solidityRedirects = {
  "/solidity": "/contracts/build",
  "/solidity/extensions": "/contracts/build/extensions",
  "/solidity/extensions/erc721": "/contracts/build/extensions/erc-721/ERC721",
  "/solidity/extensions/erc1155":
    "/contracts/build/extensions/erc-1155/ERC1155",
  "/solidity/extensions/erc20mintable":
    "/contracts/build/extensions/erc-20/ERC20BatchMintable",
  "/solidity/base-contracts/erc721base":
    "/contracts/build/base-contracts/erc-721/base",
  "/solidity/base-contracts/erc20drop":
    "/contracts/build/base-contracts/erc-20/drop",
  "/solidity/base-contracts/erc721delayedreveal":
    "/contracts/build/base-contracts/erc-721/delayed-reveal",
  "/solidity/base-contracts/erc721drop":
    "/contracts/build/base-contracts/erc-721/drop",
  "/solidity/base-contracts/erc721lazymint":
    "/contracts/build/base-contracts/erc-721/lazy-mint",
  "/solidity/base-contracts/erc721signaturemint":
    "/contracts/build/base-contracts/erc-721/signature-mint",
  "/solidity/extensions/erc20claimconditions":
    "/contracts/build/extensions/erc-20/ERC20ClaimConditions",
  "/solidity/extensions/erc721mintable":
    "/contracts/build/extensions/erc-721/ERC721Mintable",
  "/solidity/extensions/erc721burnable":
    "/contracts/build/extensions/erc-721/ERC721Burnable",
  "/solidity/extensions/erc721batchmintable":
    "/contracts/build/extensions/erc-721/ERC721BatchMintable",
  "/solidity/extensions/erc721supply":
    "/contracts/build/extensions/erc-721/ERC721Supply",
  "/solidity/extensions/royalty": "/contracts/build/extensions/general/Royalty",
  "/solidity/extensions/erc721claimphases":
    "/contracts/build/extensions/erc-721/ERC721ClaimPhases",
  "/solidity/extensions/contractmetadata":
    "/contracts/build/extensions/general/ContractMetadata",
  "/solidity/extensions/ownable": "/contracts/build/extensions/general/Ownable",
  "/solidity/extensions/multicall":
    "/contracts/build/extensions/general/Multicall",
  "/solidity/extensions/dropsinglephase":
    "/contracts/build/extensions/general/DropSinglePhase",
  "/solidity/extensions/erc1155batchmintable":
    "/contracts/build/extensions/erc-1155/ERC1155BatchMintable",
  "/solidity/extensions/erc1155burnable":
    "/contracts/build/extensions/erc-1155/ERC1155Burnable",
  "/solidity/extensions/erc1155enumerable":
    "/contracts/build/extensions/erc-1155/ERC1155Enumerable",
  "/solidity/extensions/erc1155mintable":
    "/contracts/build/extensions/erc-1155/ERC1155Mintable",
  "/solidity/base-contracts/erc1155lazymint":
    "/contracts/build/base-contracts/erc-1155/lazy-mint",
  "/solidity/extensions/lazymint":
    "/contracts/build/extensions/general/LazyMint",
  "/solidity/extensions/erc1155claimcustom":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimCustom",
  "/solidity/extensions/delayedreveal":
    "/contracts/build/extensions/general/DelayedReveal",
  "/solidity/extensions/erc1155dropsinglephase":
    "/contracts/build/extensions/erc-1155/ERC1155DropSinglePhase",
  "/solidity/extensions/erc1155claimconditions":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimConditions",
  "/solidity/extensions/primarysale":
    "/contracts/build/extensions/general/PrimarySale",
  "/solidity/extensions/erc1155signaturemint":
    "/contracts/build/extensions/erc-1155/ERC1155SignatureMint",
  "/solidity/base-contracts/erc1155base":
    "/contracts/build/base-contracts/erc-1155/base",
  "/solidity/extensions/erc721revealable":
    "/contracts/build/extensions/erc-721/ERC721Revealable",
  "/solidity/extensions/erc1155revealable":
    "/contracts/build/extensions/erc-1155/ERC1155Revealable",
  "/solidity/extensions/erc20Permit":
    "/contracts/build/extensions/erc-20/ERC20Permit",
  "/solidity/extensions/erc20batchmintable":
    "/contracts/build/extensions/erc-20/ERC20BatchMintable",
  "/solidity/base-contracts/erc20base":
    "/contracts/build/base-contracts/erc-20/base",
  "/solidity/extensions/erc20": "/contracts/build/extensions/erc-20/ERC20",
  "/solidity/base-contracts/erc20vote":
    "/contracts/build/base-contracts/erc-20/vote",
  "/solidity/extensions/base-account":
    "/contracts/build/extensions/erc-4337/SmartWallet",
  "/solidity/extensions/base-account-factory":
    "/contracts/build/extensions/erc-4337/SmartWalletFactory",
  "/solidity/base-contracts": "/contracts/build/base-contracts",
  "/solidity/base-contracts/account-factory":
    "/contracts/build/base-contracts/erc-4337/account-factory",
  "/solidity/base-contracts/account":
    "/contracts/build/base-contracts/erc-4337/account",
  "/solidity/base-contracts/managed-account-factory":
    "/contracts/build/base-contracts/erc-4337/managed-account-factory",
  "/solidity/base-contracts/managed-account":
    "/contracts/build/base-contracts/erc-4337/managed-account",
  "/solidity/extensions/erc721claimcustom":
    "/contracts/build/extensions/erc-721/ERC721ClaimCustom",
  "/solidity/extensions/permissions":
    "/contracts/build/extensions/general/Permissions",
  "/solidity/base-contracts/erc1155drop":
    "/contracts/build/base-contracts/erc-1155/drop",
  "/solidity/base-contracts/erc1155signaturemint":
    "/contracts/build/base-contracts/erc-1155/signature-mint",
  "/solidity/base-contracts/erc20signaturemint":
    "/contracts/build/base-contracts/erc-20/signature-mint",
  "/solidity/extensions/erc1155supply":
    "/contracts/build/extensions/erc-1155/ERC1155Supply",
  "/solidity/extensions/erc1155claimable":
    "/contracts/build/extensions/erc-1155/ERC1155Claimable",
  "/solidity/extensions/platformfee":
    "/contracts/build/extensions/general/PlatformFee",
  "/solidity/base-contracts/erc1155delayedreveal":
    "/contracts/build/base-contracts/erc-1155/delayed-reveal",
  "/solidity/extensions/drop": "/contracts/build/extensions/general/Drop",
  "/solidity/extensions/erc721claimable":
    "/contracts/build/extensions/erc-721/ERC721Claimable",
  "/solidity/base-contract/erc1155delayedreveal":
    "/contracts/build/extensions/erc-1155/ERC1155Revealable",
  "/solidity/extensions/erc721claimconditions":
    "/contracts/build/extensions/erc-721/ERC721ClaimConditions",
  "/solidity/extensions/erc721signaturemint":
    "/contracts/build/extensions/erc-721/ERC721SignatureMint",
  "/solidity/extensions/contract-metadata":
    "/contracts/build/extensions/general/ContractMetadata",
  "/solidity/extensions/erc1155claimphases":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimPhases",
  "/solidity/base-contracts/staking/staking1155base":
    "/contracts/build/base-contracts/erc-1155/staking",
  "/solidity/base-contracts/staking/staking20base":
    "/contracts/build/base-contracts/erc-20/staking",
  "/solidity/base-contracts/staking/staking721base":
    "/contracts/build/base-contracts/erc-721/staking",
  "/solidity/base-contract/erc721delayedreveal":
    "/contracts/build/base-contracts/erc-721/delayed-reveal",
  "/solidity/base-contracts/smart-accounts":
    "/contracts/build/base-contracts/erc-4337",
  "/interact/overview": "/connect/blockchain-api",
};

const extensionsTable = "/typescript/v4/extensions#all-available-extensions";

const typescriptRedirects = {
  "/typescript": "/typescript/v4",
  "/typescript/getting-started": "/typescript/v4/getting-started",
  "/typescript/sdk.thirdwebsdk": "/typescript/v4/getting-started",
  "/typescript/sdk.thirdwebsdk.fromprivatekey":
    "/references/typescript/v4/ThirdwebSDK#fromPrivateKey",
  "/typescript/sdk.thirdwebsdk.fromwallet":
    "/references/typescript/v4/ThirdwebSDK#fromWallet",
  "/typescript/sdk.thirdwebsdk.fromsigner":
    "/references/typescript/v4/ThirdwebSDK#fromSigner",
  "/typescript/sdk.contractdeployer": "/typescript/v4/deploy",
  "/typescript/sdk.contractverifier":
    "/typescript/v4/utilities#contract-verification",
  "/typescript/extensions": "/typescript/v4/extensions",
  "/typescript/sdk.thirdwebsdk.smartcontract": "/typescript/v4/extensions",
  "/typescript/sdk.smartcontract.call": "/typescript/v4/extensions",
  "/typescript/sdk.smartcontract.prepare":
    "/typescript/v4/extensions#preparing-transactions",
  "/typescript/sdk.thirdwebsdk.detectextensions":
    "/v4/extensions#detecting-avilable-extensions",
  // extensions
  "/typescript/sdk.erc721": "/references/typescript/v4/Erc721",
  "/typescript/sdk.erc1155": "/references/typescript/v4/Erc1155",
  "/typescript/sdk.erc20": "/references/typescript/v4/Erc20",
  // extensions path*
  "/typescript/sdk:path*": extensionsTable,
};

const reactNativeRedirects = {
  "/react-native": "/typescript/v5/react-native",
  "/react-native/getting-started": "/typescript/v5/react-native",
  // wallets
  "/react-native/react-native.embeddedwallet":
    "/react-native/v0/wallets/embedded-wallet",
  "/react-native/react-native.smartwallet":
    "/react-native/v0/wallets/smartwallet",
  "/react-native/react-native.walletconnect":
    "/react-native/v0/wallets/walletconnect",
  "/react-native/react-native.metamask": "/react-native/v0/wallets/metamask",
  "/react-native/react-native.magic": "/react-native/v0/wallets/magiclink",
  "/react-native/react-native.rainbow": "/react-native/v0/wallets/rainbow",
  "/react-native/react-native.trust": "/react-native/v0/wallets/trust",
  "/react-native/react-native.coinbase": "/react-native/v0/wallets/coinbase",
  "/react-native/react-native.localwallet":
    "/react-native/v0/wallets/local-wallet",
  // components
  "/react-native/react-native.connectwallet":
    "/react-native/v0/components/ConnectWallet",
  "/react-native/react-native.web3button":
    "/react-native/v0/components/Web3Button",
  // others
  "/react-native/available-hooks": "/references/react-native/v0/hooks",
  "/react-native/react-native.uselogin": "/references/react-native/v0/useLogin",
  "/react-native/react-native.uselogout":
    "/references/react-native/v0/useLogout",
  "/react-native/react-native.useuser": "/references/react-native/v0/useUser",
  "/react-native/storage": "/references/react-native/v0/hooks#storage",
  "/react-native/faq/deeplinks": "/react-native/v0/faq",
  "/typescript/v5/react-native/installation":
    "/typescript/v5/react-native/getting-started",
};

const unityRedirects = {
  // top level
  "/unity": "/unity/v5",
  "/unity/getting-started": "/unity/v4/getting-started",
  // core
  "/unity/thirdwebmanager": "/unity/v4/thirdwebmanager",
  "/unity/storage": "/unity/v4/storage",
  // wallets
  "/unity/wallets/prefab": "/unity/v4/wallets/prefab",
  // wallet providers
  "/unity/wallets/providers/in-app-wallet":
    "/unity/v4/wallets/providers/in-app-wallet",
  "/unity/wallets/providers/account-abstraction":
    "/unity/v4/wallets/providers/account-abstraction",
  "/unity/wallets/providers/local-wallet":
    "/unity/v4/wallets/providers/local-wallet",
  "/unity/wallets/providers/metamask": "/unity/v4/wallets/providers/metamask",
  "/unity/wallets/providers/coinbase": "/unity/v4/wallets/providers/coinbase",
  "/unity/wallets/providers/walletconnect":
    "/unity/v4/wallets/providers/walletconnect",
  "/unity/wallets/providers/hyperplay": "/unity/v4/wallets/providers/hyperplay",
  "/unity/wallets/providers/rabby": "/unity/v4/wallets/providers/rabby",
  // wallet actions
  "/unity/wallets/actions/connect": "/unity/v4/wallets/actions/connect",
  "/unity/wallets/actions/disconnect": "/unity/v4/wallets/actions/disconnect",
  "/unity/wallets/actions/authenticate":
    "/unity/v4/wallets/actions/authenticate",
  "/unity/wallets/actions/getaddress": "/unity/v4/wallets/actions/getaddress",
  "/unity/wallets/actions/getbalance": "/unity/v4/wallets/actions/getbalance",
  "/unity/wallets/actions/getchainid": "/unity/v4/wallets/actions/getchainid",
  "/unity/wallets/actions/isconnected": "/unity/v4/wallets/actions/isconnected",
  "/unity/wallets/actions/recoveraddress":
    "/unity/v4/wallets/actions/recoveraddress",
  "/unity/wallets/actions/sendrawtransaction":
    "/unity/v4/wallets/actions/sendrawtransaction",
  "/unity/wallets/actions/executerawtransaction":
    "/unity/v4/wallets/actions/executerawtransaction",
  "/unity/wallets/actions/sign": "/unity/v4/wallets/actions/sign",
  "/unity/wallets/actions/switchnetwork":
    "/unity/v4/wallets/actions/switchnetwork",
  "/unity/wallets/actions/transfer": "/unity/v4/wallets/actions/transfer",
  "/unity/wallets/actions/addadmin": "/unity/v4/wallets/actions/addadmin",
  "/unity/wallets/actions/removeadmin": "/unity/v4/wallets/actions/removeadmin",
  "/unity/wallets/actions/createsessionkey":
    "/unity/v4/wallets/actions/createsessionkey",
  "/unity/wallets/actions/revokesessionkey":
    "/unity/v4/wallets/actions/revokesessionkey",
  "/unity/wallets/actions/getallactivesigners":
    "/unity/v4/wallets/actions/getallactivesigners",
  "/unity/wallets/actions/getemail": "/unity/v4/wallets/actions/getemail",
  "/unity/wallets/actions/getnonce": "/unity/v4/wallets/actions/getnonce",
  "/unity/wallets/actions/getsigneraddress":
    "/unity/v4/wallets/actions/getsigneraddress",
  "/unity/wallets/actions/signtypeddatav4":
    "/unity/v4/wallets/actions/signtypeddatav4",
  // submission
  "/unity/wallets/submission": "/unity/v4/wallets/submission",
  // pay
  "/unity/pay/getbuyhistory": "/unity/v4/pay/getbuyhistory",
  // buy with fiat
  "/unity/pay/getbuywithfiatquote": "/unity/v4/pay/getbuywithfiatquote",
  "/unity/pay/buywithfiat": "/unity/v4/pay/buywithfiat",
  "/unity/pay/getbuywithfiatstatus": "/unity/v4/pay/getbuywithfiatstatus",
  "/unity/pay/getbuywithfiatcurrencies":
    "/unity/v4/pay/getbuywithfiatcurrencies",
  // buy with crypto
  "/unity/pay/getbuywithcryptoquote": "/unity/v4/pay/getbuywithcryptoquote",
  "/unity/pay/buywithcrypto": "/unity/v4/pay/buywithcrypto",
  "/unity/pay/getbuywithcryptostatus": "/unity/v4/pay/getbuywithcryptostatus",
  // blockchain api
  "/unity/contracts": "/unity/v4/contracts",
  "/unity/contracts/get": "/unity/v4/contracts/get",
  "/unity/contracts/read": "/unity/v4/contracts/read",
  "/unity/contracts/write": "/unity/v4/contracts/write",
  "/unity/contracts/prepare": "/unity/v4/contracts/prepare",
  // erc20
  "/unity/contracts/erc20/erc20": "/unity/v4/contracts/erc20/erc20",
  "/unity/contracts/erc20/erc20burnable":
    "/unity/v4/contracts/erc20/erc20burnable",
  "/unity/contracts/erc20/erc20claimconditions":
    "/unity/v4/contracts/erc20/erc20claimconditions",
  "/unity/contracts/erc20/erc20mintable":
    "/unity/v4/contracts/erc20/erc20mintable",
  "/unity/contracts/erc20/erc20signaturemintable":
    "/unity/v4/contracts/erc20/erc20signaturemintable",
  // erc721
  "/unity/contracts/erc721/erc721": "/unity/v4/contracts/erc721/erc721",
  "/unity/contracts/erc721/erc721burnable":
    "/unity/v4/contracts/erc721/erc721burnable",
  "/unity/contracts/erc721/erc721claimconditions":
    "/unity/v4/contracts/erc721/erc721claimconditions",
  "/unity/contracts/erc721/erc721enumerable":
    "/unity/v4/contracts/erc721/erc721enumerable",
  "/unity/contracts/erc721/erc721mintable":
    "/unity/v4/contracts/erc721/erc721mintable",
  "/unity/contracts/erc721/erc721signaturemintable":
    "/unity/v4/contracts/erc721/erc721signaturemintable",
  "/unity/contracts/erc721/erc721supply":
    "/unity/v4/contracts/erc721/erc721supply",
  // erc1155
  "/unity/contracts/erc1155/erc1155": "/unity/v4/contracts/erc1155/erc1155",
  "/unity/contracts/erc1155/erc1155burnable":
    "/unity/v4/contracts/erc1155/erc1155burnable",
  "/unity/contracts/erc1155/erc1155claimconditions":
    "/unity/v4/contracts/erc1155/erc1155claimconditions",
  "/unity/contracts/erc1155/erc1155enumerable":
    "/unity/v4/contracts/erc1155/erc1155enumerable",
  "/unity/contracts/erc1155/erc1155mintable":
    "/unity/v4/contracts/erc1155/erc1155mintable",
  "/unity/contracts/erc1155/erc1155signaturemintable":
    "/unity/v4/contracts/erc1155/erc1155signaturemintable",
  // marketplace
  "/unity/contracts/marketplace": "/unity/v4/contracts/marketplace",
  // pack
  "/unity/contracts/pack": "/unity/v4/contracts/pack",
  // events
  "/unity/contracts/events/get": "/unity/v4/contracts/events/get",
  "/unity/contracts/events/getall": "/unity/v4/contracts/events/getall",
  "/unity/contracts/events/listentoall":
    "/unity/v4/contracts/events/listentoall",
  "/unity/contracts/events/removealllisteners":
    "/unity/v4/contracts/events/removealllisteners",
  // blocks
  "/unity/blocks/getblock": "/unity/v4/blocks/getblock",
  "/unity/blocks/getblockwithtransactions":
    "/unity/v4/blocks/getblockwithtransactions",
  "/unity/blocks/getlatestblocknumber": "/unity/v4/blocks/getlatestblocknumber",
  "/unity/blocks/getlatestblocktimestamp":
    "/unity/v4/blocks/getlatestblocktimestamp",
};

const walletRedirects = {
  //connect
  "/connect/architecture": "/connect",
  "/connect/sign-in": "/connect/sign-in/overview",
  "/connect/usage-with-react-sdk": "/connect/sign-in",
  "/connect/usage-with-react-native-sdk": "/connect/sign-in",
  "/connect/usage-with-typescript-sdk": "/connect/sign-in",
  "/connect/usage-with-unity-sdk": "/connect/sign-in",
  "/connect/connect-wallet": "/connect/connect",
  "/connect/supported-wallets": "/connect/connect",
  "/connect/connect-wallet/wallet-providers": "/connect/connect",
  "/connect/connect-wallet/theme": "/connect/sign-in",
  "/connect/connect-wallet/button-title": "/connect/sign-in",
  "/connect/connect-wallet/modal-title": "/connect/sign-in",
  "/connect/connect-wallet/modal-size": "/connect/sign-in",
  "/connect/connect-wallet/welcome-screen": "/connect/sign-in",
  "/connect/connect-wallet/custom-button": "/connect/sign-in",
  "/connect/connect-wallet/class-name": "/connect/sign-in",
  "/connect/connect-wallet/drop-down-positions": "/connect/sign-in",
  "/connect/connect-wallet/hide-testnet-faucet": "/connect/sign-in",
  "/connect/connect-wallet/auth": "/connect/sign-in",
  "/connect/connect-wallet/switch-chain": "/connect/sign-in",
  "/connect/connect-wallet/privacy-policy": "/connect/sign-in",
  "/connect/connect-wallet/terms-of-service": "/connect/sign-in",
  "/connect/connect-wallet/custom-ui": "/connect/sign-in/custom-ui",
  "/connect/faqs": "/connect/sign-in",

  "/connect/ecosystem/faq": "/connect/wallet/faq",
  "/connect/ecosystem/get-started": "/connect/wallet/get-started",
  "/connect/ecosystem/overview": "/connect/wallet/overview",
  "/connect/ecosystem/pregenerate-wallets":
    "/connect/wallet/pregenerate-wallets",
  "/connect/ecosystem/security": "/connect/wallet/security",
  "/connect/ecosystem/wallet-explorer": "/connect/wallet/ecosystem/portal",
  "/connect/ecosystem/ecosystem-premissions":
    "/connect/wallet/ecosystem/permissions",
  "/connect/ecosystem/integrating-partners":
    "/connect/wallet/ecosystem/integrating-partners",

  "/connect/in-app-wallet/overview": "/connect/wallet/overview",
  "/connect/in-app-wallet/security": "/connect/wallet/security",
  "/connect/in-app-wallet/get-started": "/connect/wallet/get-started",
  "/connect/in-app-wallet/faqs": "/connect/wallet/faq",
  "/connect/in-app-wallet/guides/link-multiple-profiles":
    "/connect/wallet/user-management/link-multiple-identity",
  "/connect/in-app-wallet/guides/retrieve-linked-profiles":
    "/connect/wallet/user-management/get-user-profiles",
  "/connect/in-app-wallet/guides/get-user-details":
    "/connect/wallet/user-management/get-user-profiles",
  "/connect/in-app-wallet/guides/export-private-key":
    "/connect/wallet/user-management/export-private-key",

  "/connect/sign-in/overview": "/connect/wallet/overview",
  "/connect/sign-in/ConnectButton": "/connect/wallet/get-started",
  "/connect/sign-in/ConnectEmbed": "/connect/wallet/get-started",
  "/connect/sign-in/Custom-UI": "/connect/wallet/get-started",
  "/connect/sign-in/methods/email-and-phone":
    "/connect/wallet/sign-in-methods/configure",
  "/connect/sign-in/methods/social-logins":
    "/connect/wallet/sign-in-methods/configure",
  "/connect/sign-in/methods/guest-mode":
    "/connect/wallet/sign-in-methods/guest",
  "/connect/sign-in/methods/external-wallets":
    "/connect/wallet/sign-in-methods/external-wallets",

  //embedded wallet
  "/embedded-wallet": "/wallets/embedded-wallet/overview",
  "/embedded-wallet/how-it-works": "/wallets/embedded-wallet/how-it-works",
  "/embedded-wallet/getting-started": "/wallets/embedded-wallet/get-started",
  "/embedded-wallet/connect": "/wallets/embedded-wallet/how-to/connect-users",
  "/embedded-wallet/custom":
    "/wallets/embedded-wallet/how-to/build-your-own-ui",
  "/embedded-wallet/use":
    "/wallets/embedded-wallet/how-to/interact-with-wallets",
  "/embedded-wallet/interact":
    "/wallets/embedded-wallet/how-to/interact-blockchain",
  "/embedded-wallet/smart-wallet-and-embedded-wallet":
    "/wallets/embedded-wallet/how-to/enable-gasless",
  "/embedded-wallet/export-private-key":
    "/wallets/embedded-wallet/how-to/export-private-key",
  "/embedded-wallet/custom-auth":
    "/wallets/embedded-wallet/custom-auth/configuration",
  "/embedded-wallet/custom-auth-server":
    "/wallets/embedded-wallet/custom-auth/custom-auth-server",
  "/embedded-wallet/integrate-firebase":
    "/wallets/embedded-wallet/custom-auth/firebase-auth",
  "/embedded-wallet/custom-jwt-auth-server":
    "/wallets/embedded-wallet/custom-auth/custom-jwt-auth-server",
  "/embedded-wallet/faqs": "/wallets/embedded-wallet/faqs",
  //smart wallet
  "/smart-wallet": "/wallets/smart-wallet",
  "/smart-wallet/how-it-works": "/wallets/smart-wallet/how-it-works",
  "/smart-wallet/getting-started": "/wallets/smart-wallet/get-started",
  "/smart-wallet/infrastructure": "wallets/smart-wallet/infrastructure",
  "/smart-wallet/permissions": "/wallets/smart-wallet/permissions",
  "/smart-wallet/guides/react": "/wallets/smart-wallet/guides/react",
  "/smart-wallet/guides/typescript": "/wallets/smart-wallet/guides/typescript",
  "/smart-wallet/faqs": "/wallets/smart-wallet/faq",
  //auth
  "/auth": "/connect/auth",
  "/auth/how-auth-works": "/connect/auth/how-it-works",
  "/auth/how-auth-works/sign-in-with-wallet": "/connect/auth/how-it-works/siwe",
  "/auth/how-auth-works/json-web-tokens": "/connect/auth/how-it-works/jwt",
  "/auth/how-auth-works/auth-api": "/connect/auth/how-it-works/api",
  "/auth/getting-started": "/connect/auth/get-started",
  "/auth/client-frameworks/react": "/connect/auth/client-frameworks/react",
  "/auth/client-frameworks/react-native":
    "/connect/auth/client-frameworks/react-native",
  "/auth/server-frameworks/next": "/connect/auth/server-frameworks/next",
  "/auth/server-frameworks/express": "/connect/auth/server-frameworks/express",
  "/auth/integrations/next-auth": "/connect/auth/integrations/next-auth",
  "/auth/integrations/supabase": "/connect/auth/integrations/supabase",
  "/auth/integrations/firebase": "/connect/auth/integrations/firebase",
  "/auth/wallet-configuration": "/connect/auth/wallet-configuration",
  "/auth/faqs": "/connect/auth/faq",
  "/connect/auth/how-it-works": "/connect/auth",
  "/connect/auth/how-it-works/siwe": "/connect/auth",
  "/connect/auth/how-it-works/jwt": "/connect/auth",
  "/connect/auth/how-it-works/api": "/connect/auth",
  "/connect/auth/get-started": "/connect/auth",
  "/connect/auth/client-frameworks/react": "/connect/auth",
  "/connect/auth/client-frameworks/react-native": "/connect/auth",
  "/connect/auth/server-frameworks/next": "/connect/auth",
  "/connect/auth/server-frameworks/express": "/connect/auth",
  "/connect/auth/integrations/next-auth": "/connect/auth",
  "/connect/auth/integrations/supabase": "/connect/auth",
  "/connect/auth/integrations/firebase": "/connect/auth",
  "/connect/auth/wallet-configuration": "/connect/auth",
  "/connect/auth/faqs": "/connect/auth",
  // Wallet SDK
  "/wallet": "/wallet-sdk/v2",
  "/wallet/architecture": "/wallet-sdk/v2",
  "/wallet/getting-started": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-typescript-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-react-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-react-native-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-unity-sdk": "/wallet-sdk/v2/usage",
  // build a wallet
  "/wallet/build-a-wallet": "/wallet-sdk/v2/build",
  "/wallet/interfaces/abstract-client-wallet":
    "/references/wallets/v2/AbstractClientWallet",
  "/wallet/interfaces/abstract-wallet": "/references/wallets/v2/AbstractWallet",
  "/wallet/interfaces/connector": "/references/wallets/v2/Connector",
  // wallets
  "/wallet/metamask": "/references/wallets/v2/MetaMaskWallet",
  "/wallet/coinbase-wallet": "/references/wallets/v2/CoinbaseWallet",
  "/wallet/wallet-connect-v2": "/references/wallets/v2/WalletConnect",
  "/wallet/smart-wallet": "/references/wallets/v2/SmartWallet",
  "/wallet/embedded-wallet": "/references/wallets/v2/EmbeddedWallet",
  "/wallet/paper": "/references/wallets/v2/EmbeddedWallet",
  "/wallet/local-wallet": "/references/wallets/v2/LocalWallet",
  "/wallet/local-wallet-node": "/references/wallets/v2/LocalWalletNode",
  "/wallet/trust-wallet": "/references/wallets/v2/TrustWallet",
  "/wallet/zerion-wallet": "/references/wallets/v2/ZerionWallet",
  "/wallet/magic": "/references/wallets/v2/MagicLink",
  "/wallet/rainbow": "/references/wallets/v2/RainbowWallet",
  "/wallet/safe": "/references/wallets/v2/SafeWallet",
  "/wallet/blocto": "/references/wallets/v2/BloctoWallet",
  "/wallet/frame": "/references/wallets/v2/FrameWallet",
  "/wallet/phantom": "/references/wallets/v2/PhantomWallet",
  "/wallet/aws-kms": "/references/wallets/v2/AwsKmsWallet",
  "/wallet/aws-secrets-manager":
    "/references/wallets/v2/AwsSecretsManagerWallet",
  "/wallet/coin98-wallet": "/references/wallets/v2/Coin98Wallet",
  "/wallet/core-wallet": "/references/wallets/v2/CoreWallet",
  "/wallet/defi-wallet": "/references/wallets/v2/CryptoDefiWallet",
  "/wallet/ethers": "/references/wallets/v2/EthersWallet",
  "/wallet/okx-wallet": "/references/wallets/v2/OKXWallet",
  "/wallet/onekey-wallet": "/references/wallets/v2/OneKeyWallet",
  "/wallet/private-key": "/references/wallets/v2/PrivateKeyWallet",
  "/wallet/rabby-wallet": "/references/wallets/v2/RabbyWallet",
};

const paymentRedirects = {
  "/checkouts": "/payments",
  "/checkouts/getting-started": "/payments/nft-checkout/getting-started",
  "/checkouts/enable-contract": "/payments/nft-checkout/enable-contract",
  "/checkouts/checkout-link": "/payments/nft-checkout/checkout-link",
  "/checkouts/go-live-checklist": "/payments/nft-checkout/go-live-checklist",
  "/checkouts/elements": "/payments/nft-checkout/elements",
  "/checkouts/checkout-with-card": "/payments/nft-checkout/checkout-with-card",
  "/checkouts/checkout-with-eth": "/payments/nft-checkout/checkout-with-eth",
  "/checkouts/webhooks": "/payments/nft-checkout/webhooks",
  "/checkouts/translations": "/payments/nft-checkout/translations",
  "/checkouts/marketplaces": "/payments/nft-checkout/marketplaces",
  "/checkouts/one-time-checkout-link":
    "/payments/nft-checkout/one-time-checkout-link",
  "/checkouts/custom-contracts": "/payments/nft-checkout/custom-contracts",
  "/checkouts/pre-built-contracts":
    "/payments/nft-checkout/pre-built-contracts",
  "/checkouts/erc20-pricing": "/payments/nft-checkout/erc20-pricing",
  "/checkouts/api-reference": "/payments/nft-checkout/api-reference",
  "/checkouts/faq": "/payments/nft-checkout/faq",
  "/payments/:match*": "/connect/pay/overview",
  "/connect/pay/buy-with-fiat": "/connect/pay/overview",
  "/connect/pay/buy-with-crypto": "/connect/pay/overview",
  "/connect/pay/buy-with-crypto/overview": "/connect/pay/overview",
  "/connect/pay/buy-with-crypto/fee-sharing": "/connect/pay/fee-sharing",
  "/connect/pay/build-a-custom-experience":
    "/connect/pay/guides/build-a-custom-experience",
  "/connect/pay/enable-test-mode": "/connect/pay/guides/enable-test-mode",
  "/connect/pay/guides/enable-test-mode": "/connect/pay/testing-pay",
  "/connect/in-app-wallet/how-it-works": "/connect/in-app-wallet/security",
  "/connect/in-app-wallet/guides/get-in-app-wallet-details-on-server":
    "/connect/in-app-wallet/guides/get-user-details",
};

const contractRedirects = {
  //pre-built contracts
  "/pre-built-contracts": "/contracts",
  "/pre-built-contracts/how-it-works": "/contracts",
  "/explore/faqs": "/contracts",
  "/pre-built-contracts/account-factory":
    "/contracts/explore/pre-built-contracts/account-factory",
  "/pre-built-contracts/airdrop-erc1155-claimable":
    "/explore/pre-built-contracts/airdrop-erc1155-claimable",
  "/pre-built-contracts/airdrop-erc1155":
    "/contracts/explore/pre-built-contracts/airdrop-erc1155",
  "/pre-built-contracts/airdrop-erc20-claimable":
    "/contracts/explore/pre-built-contracts/airdrop-erc20-claimable",
  "/pre-built-contracts/airdrop-erc20":
    "/contracts/explore/pre-built-contracts/airdrop-erc20",
  "/pre-built-contracts/airdrop-erc721-claimable":
    "/contracts/explore/pre-built-contracts/airdrop-erc721-claimable",
  "/pre-built-contracts/airdrop-erc721":
    "/contracts/explore/pre-built-contracts/airdrop-erc721",
  "/pre-built-contracts/edition-drop":
    "/contracts/explore/pre-built-contracts/edition-drop",
  "/pre-built-contracts/edition":
    "/contracts/explore/pre-built-contracts/edition",
  "/pre-built-contracts/loyalty-card":
    "/contracts/explore/pre-built-contracts/loyalty-card",
  "/pre-built-contracts/managed-account-factory":
    "/contracts/explore/pre-built-contracts/managed-account-factory",
  "/pre-built-contracts/marketplace":
    "/contracts/explore/pre-built-contracts/marketplace",
  "/pre-built-contracts/multiwrap":
    "/contracts/explore/pre-built-contracts/multiwrap",
  "/pre-built-contracts/nft-collection":
    "/contracts/explore/pre-built-contracts/nft-collection",
  "/pre-built-contracts/nft-drop":
    "/contracts/explore/pre-built-contracts/nft-drop",
  "/pre-built-contracts/open-edition-erc721":
    "/contracts/explore/pre-built-contracts/open-edition",
  "/pre-built-contracts/pack": "/contracts/explore/pre-built-contracts/pack",
  "/pre-built-contracts/signature-drop": "/contracts",
  "/pre-built-contracts/split": "/contracts/explore/pre-built-contracts/split",
  "/pre-built-contracts/stake-erc1155":
    "/contracts/explore/pre-built-contracts/stake-erc1155",
  "/pre-built-contracts/stake-erc20":
    "/contracts/explore/pre-built-contracts/stake-erc20",
  "/pre-built-contracts/stake-erc721":
    "/contracts/explore/pre-built-contracts/stake-erc721",
  "/pre-built-contracts/token-drop":
    "/contracts/explore/pre-built-contracts/token-drop",
  "/pre-built-contracts/token": "/contracts/explore/pre-built-contracts/token",
  "/pre-built-contracts/vote": "/contracts/explore/pre-built-contracts/vote",
  //deploy
  "/deploy": "contracts/deploy/overview",
  "/deploy/how-it-works": "/contracts/deploy/overview",
  "/deploy/getting-started": "/contracts/deploy/deploy-contract",
  "/deploy/faqs": "/contracts/deploy/overview",
  //publish
  "/publish": "/contracts/publish/overview",
  "/publish/getting-started": "/contracts/publish/publish-contract",
  "/publish/deployment-options": "/contracts/publish/publish-options",
  "/publish/get-featured-on-explore": "/contracts/publish/overview",
  "/sdk": "/contracts/interact/overview",
  "/sdk/how-it-works": "/contracts/interact/overview",
  "/sdk/getting-started": "/contracts/interact/overview",
  //design documentation
  "/contracts/design/Drop": "/contracts/design-docs/drop",
  "/contracts/design/Marketplace": "/contracts/design-docs/marketplace",
  "/contracts/design/SignatureMint": "/contracts/design-docs/signature-mint",
  "/contracts/design/Multiwrap": "/contracts/design-docs/multiwrap",
  "/contracts/design/Pack": "/contracts/design-docs/pack",
  "/contracts/design/SignatureDrop": "/contracts",
};

const infrastructureRedirects = {
  //engine top-level
  "/infrastructure/engine": "/engine",
  "/infrastructure/engine/get-started": "/engine/get-started",
  "/infrastructure/engine/production-checklist": "/engine/production-checklist",
  "/infrastructure/engine/self-host": "/engine/self-host",
  "/infrastructure/engine/features/backend-wallets":
    "/engine/features/backend-wallets",
  "/infrastructure/engine/features/contracts": "/engine/features/contracts",
  "/infrastructure/engine/features/permissions": "/engine/features/permissions",
  "/infrastructure/engine/features/webhooks": "/engine/features/webhooks",
  "/infrastructure/engine/features/smart-wallets":
    "/engine/features/smart-wallets",
  "/infrastructure/engine/features/relayers": "/engine/features/relayers",
  "/infrastructure/engine/features/gasless-transactions":
    "/engine/features/gasless-transactions",
  "/infrastructure/engine/guides/airdrop-nfts": "/engine/guides/airdrop-nfts",
  "/infrastructure/engine/guides/nft-checkout": "/engine/guides/nft-checkout",
  "/infrastructure/engine/guides/smart-wallets": "/engine/guides/smart-wallets",
  "/infrastructure/engine/references/api-reference":
    "/engine/references/api-reference",
  "/infrastructure/engine/references/typescript":
    "/engine/references/typescript",
  "/infrastucture/engine/security": "/engine/security",
  "/infrastructure/engine/faq": "/engine/faq",
  "/guides/engine/relayer": "/engine/features/relayer",
  "/infrastructure/engine/overview": "/engine",
  "/engine/features/permissions": "/engine/features/admins",

  //storage
  "/storage": "/infrastructure/storage/overview",
  "/storage/how-storage-works": "/infrastructure/storage/how-storage-works",
  "/storage/upload-to-ipfs":
    "/infrastructure/storage/how-to-use-storage/upload-files-to-ipfs",
  "/storage/host-web-app":
    "/infrastructure/storage/how-to-use-storage/host-web-app",
  //rpc-edge
  "/rpc-edge": "/infrastructure/rpc-edge/overview",
  "/rpc-edge/get-started": "/infrastructure/rpc-edge/get-started",
  "/rpc-edge/faqs": "/infrastructure/rpc-edge/overview",
};

const otherRedirects = {
  // wallets > connect redirects
  "/wallets": "/connect",
  "/wallets/connect/:path*": "/connect/connect/:path*",
  "/wallets/embedded-wallet/:path*": "/connect/embedded-wallet/:path*",
  "/wallets/auth/:path*": "/connect/auth/:path*",
  // guides
  "/solana/:match*": "https://blog.thirdweb.com/discontinuing-solana-support/",
  "/pre-built-contracts/solana/:match*":
    "https://blog.thirdweb.com/discontinuing-solana-support/",
  "/learn/recipes/:match*": "https://blog.thirdweb.com/",
  "/guides/tag/bundle-collection": "https://blog.thirdweb.com/tag/edition",
  "/guides/tag/bundle-drop": "https://blog.thirdweb.com/tag/bundle-drop",
  "/guides/bundle-drop": "https://blog.thirdweb.com/tag/edition-drop",
  "/guides/splits": "https://blog.thirdweb.com/tag/split",
  "/guides/bundle-collection": "https://blog.thirdweb.com/tag/edition",
  "/guides/connect-wallet":
    "https://blog.thirdweb.com/guides/add-connectwallet-to-your-website/",
  "/guides/create-a-drop-with-thirdweb-dashboard":
    "https://blog.thirdweb.com/guides/release-an-nft-drop-with-no-code",
  "/guides/minting-with-signature":
    "https://blog.thirdweb.com/guides/on-demand-minting",
  "/guides/nft-drop": "https://blog.thirdweb.com/tag/nft-drop",
  "/guides/nft-collection": "https://blog.thirdweb.com/tag/nft-collection",
  "/guides/edition-drop": "https://blog.thirdweb.com/tag/edition-drop",
  "/guides/edition": "https://blog.thirdweb.com/tag/edition",
  "/guides/token": "https://blog.thirdweb.com/tag/token",
  "/guides/vote": "https://blog.thirdweb.com/tag/vote",
  "/guides/split": "https://blog.thirdweb.com/tag/split",
  "/guides/marketplace": "https://blog.thirdweb.com/tag/marketplace",
  "/guides/pack": "https://blog.thirdweb.com/tag/pack",
  "/guides": "https://blog.thirdweb.com/guides",
  "/tag/:match*": "https://blog.thirdweb.com/tag/:match*",
  "/guides/on-demand-minting":
    "https://blog.thirdweb.com/guides/mint-nft-unique-code",
  "/guides/create-your-own-marketplace-with-thirdweb-typescript-sdk":
    "https://blog.thirdweb.com/guides/nft-marketplace-with-typescript-next",
  "/guides/create-a-pack-with-typescript-and-nextjs":
    "https://blog.thirdweb.com/guides/create-an-nft-lootbox",
  "/guides/randomized-nft-drop":
    "https://blog.thirdweb.com/guides/shuffle-nft-drop",
  // solidity sdk
  "/contracts/nft-drop": "/contracts/explore/pre-built-contracts/nft-drop",
  "/contracts/nft-collection":
    "contracts/explore/pre-built-contracts/nft-collection",
  "/contracts/edition-drop":
    "/contracts/explore/pre-built-contracts/edition-drop",
  "/contracts/edition": "/contracts/explore/pre-built-contracts/edition",
  "/contracts/token-drop": "/contracts/explore/pre-built-contracts/token-drop",
  "/contracts/token": "/contracts/explore/pre-built-contracts/token",
  "/contracts/vote": "/contracts/explore/pre-built-contracts/vote",
  "/contracts/split": "/contracts/explore/pre-built-contracts/split",
  "/contracts/marketplace":
    "/contracts/explore/pre-built-contracts/marketplace",
  "/contracts/pack": "/contracts/explore/pre-built-contracts/pack",
  "/contracts/nfts-and-tokens": "/contracts",
  "/contracts/drops": "/contracts",
  "/contracts/governance": "/contracts",
  // account abstraction rename
  "/wallets/smart-wallet/:path*": "/connect/account-abstraction/:path*",
  "/connect/smart-wallet/:path*": "/connect/account-abstraction/:path*",
  "/connect/account-abstraction": "/connect/account-abstraction/overview",
  "/unity/wallets/providers/smart-wallet":
    "/unity/wallets/providers/account-abstraction",
  "/engine/features/smart-wallets": "/engine/features/account-abstraction",
  // others
  "/pre-built-contracts/:path*": "/contracts",
  "/thirdweb-deploy/:path*": "/contracts/deploy/overview",
  "/thirdweb-cli": "/cli",
  "/smart-contracts": "/contracts",
  "/contracts-sdk/:path*": "/contracts/build",
  "/unity/connectwalletnative": "/unity/wallets/prefab",
  "/unity/prefabs/thirdwebmanager": "/unity/thirdwebmanager",
  "/gamingkit/:path*": "/unity",
  "/gaming-kit/:path*": "/unity",
  "/contractkit/:path*": "/contracts",
  "/extensions/:path*": "/contracts/build/extensions",
  "/release/:match*": "/contracts/publish/overview",
  "/sdk/:path*": "/typescript/v4",
  "/web3-api/:path*": "/infrastructure/engine/overview",
  "/api-keys": "/account/api-keys",
  "/python": "/engine/overview",
  "/go": "/engine/overview",
  "/ui-components/connectwalletbutton": "/react/v4/components/ConnectWallet",
  "/ui-components/nft-renderer": "/react/v4/components/ThirdwebNftMedia",
  "/ui-components/ipfs-media-renderer": "/react/v4/components/MediaRenderer",
  "/templates": "https://thirdweb.com/templates",
  "/gaming": "/",
  "/solutions": "/",
  "/solutions/gaming": "/",
  "/signature-minting": "/contracts/design-docs/signature-mint",
  // in-app wallet
  "/references/typescript/v5/embeddedWallet":
    "/references/typescript/v5/inAppWallet",
  "/connect/embedded-wallet/:path*": "/connect/in-app-wallet/:path*",
  "/connect/embedded-wallet/how-to/get-embedded-wallet-details-on-server":
    "/connect/in-app-wallet/how-to/get-in-app-wallet-details-on-server",
  "/react-native/v0/wallets/embedded-wallet":
    "/react-native/v0/wallets/in-app-wallet",
  "/unity/wallets/providers/embedded-wallet":
    "/unity/wallets/providers/in-app-wallet",
  // connect
  "/connect/connect": "/connect/sign-in",
  "/connect/in-app-wallet/how-to/get-in-app-wallet-details-on-server":
    "/connect/in-app-wallet/guides/get-in-app-wallet-details-on-server",
};

const v5RestructuredRedirects = {
  "/typescript/v5/react": "/react/v5",
  "/typescript/v5/react/:path*": "/react/v5/:path*",
  "/typescript/v5/react-native": "/react-native/v5",
  "/typescript/v5/react-native/:path*": "/react-native/v5/:path*",
};

/**
 * @type {import('next').NextConfig['redirects']}
 */
export const redirects = async () => {
  return [
    // old portal redirects
    ...createRedirects(reactRedirects),
    ...createRedirects(solidityRedirects),
    ...createRedirects(typescriptRedirects),
    ...createRedirects(reactNativeRedirects),
    ...createRedirects(unityRedirects),
    ...createRedirects(walletRedirects),
    ...createRedirects(paymentRedirects),
    ...createRedirects(infrastructureRedirects),
    ...createRedirects(contractRedirects),
    ...createRedirects(otherRedirects),
    ...createRedirects(v5RestructuredRedirects),
    ...createRedirects(unrealEngineRedirects),
    // references docs
    latestReference("react", "v4"),
    latestReference("react-native", "v0"),
    latestReference("typescript", "v5"),
    latestReference("wallets", "v2"),
    latestReference("storage", "v2"),
    // sdk docs
    latestSDK("react", "v4"),
    latestSDK("react-native", "v0"),
    latestSDK("typescript", "v5"),
    latestSDK("wallet-sdk", "v2"),
    latestSDK("storage-sdk", "v2"),
  ];
};

/**
 *
 * @param {Record<string, string>} linkMap
 * @returns
 */
function createRedirects(linkMap, permanent = true) {
  const redirects = [];
  for (const key in linkMap) {
    redirects.push({ source: key, destination: linkMap[key], permanent });
  }
  return redirects;
}

/**
 *
 * @param {string} pkg
 * @param {string} latestVersion
 * @returns
 */
function latestReference(pkg, latestVersion) {
  return {
    source: `/references/${pkg}/latest/:path*`,
    destination: `/references/${pkg}/${latestVersion}/:path*`,
    permanent: false,
  };
}

/**
 *
 * @param {string} pkg
 * @param {string} latestVersion
 * @returns
 */
function latestSDK(pkg, latestVersion) {
  return {
    source: `/${pkg}/latest/:path*`,
    destination: `/${pkg}/${latestVersion}/:path*`,
    permanent: false,
  };
}
