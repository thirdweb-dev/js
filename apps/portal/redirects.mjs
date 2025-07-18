// @ts-check

const unrealEngineRedirects = {
  "/unreal-engine/blueprints/private-key-wallet":
    "unreal-engine/blueprints/in-app-wallet",
  "/unreal-engine/cpp/wallet-handle": "/unreal-engine/cpp/wallet-handles",
  "/unreal/:path*": "/unreal-engine/:path*",
};

const reactRedirects = {
  "/react": "/react/v4",
  "/react/connecting-wallets": "/react/v4/connecting-wallets",
  "/react/react.blocto": "/references/react/v4/bloctoWallet",
  "/react/react.coin98": "/references/react/v4/coin98Wallet",
  "/react/react.coinbasewallet": "/references/react/v4/coinbaseWallet",
  // components
  "/react/react.connectwallet": "/react/v4/components/ConnectWallet",
  "/react/react.core": "/references/react/v4/coreWallet",
  "/react/react.defiwallet": "/references/react/v4/cryptoDefiWallet",
  "/react/react.embeddedwallet": "/references/react/v4/embeddedWallet",
  "/react/react.frame": "/references/react/v4/frameWallet",
  "/react/react.localwallet": "/references/react/v4/localWallet",
  "/react/react.magiclink": "/references/react/v4/magicLink",
  "/react/react.mediarenderer": "/react/v4/components/MediaRenderer",
  // wallets
  "/react/react.metamaskwallet": "/references/react/v4/metamaskWallet",
  "/react/react.okx": "/references/react/v4/okxWallet",
  "/react/react.onekey": "/references/react/v4/oneKeyWallet",
  "/react/react.paperwallet": "/references/react/v4/embeddedWallet",
  "/react/react.phantom": "/references/react/v4/phantomWallet",
  "/react/react.rabby": "/references/react/v4/rabbyWallet",
  "/react/react.rainbowWallet": "/references/react/v4/rainbowWallet",
  "/react/react.safewallet": "/references/react/v4/safeWallet",
  "/react/react.smartwallet": "/references/react/v4/smartWallet",
  "/react/react.thirdwebnftmedia": "/react/v4/components/ThirdwebNftMedia",
  // providers
  "/react/react.thirdwebprovider": "/react/v4/ThirdwebProvider",
  "/react/react.thirdwebsdkprovider": "/react/v4/ThirdwebSDKProvider",
  "/react/react.trustWallet": "/references/react/v4/trustWallet",
  "/react/react.useacceptdirectlistingoffer":
    "/references/react/v4/useAcceptDirectListingOffer",
  "/react/react.useaccountadmins": "/references/react/v4/useAccountAdmins",
  "/react/react.useaccountadminsandsigners":
    "/references/react/v4/useAccountAdminsAndSigners",
  "/react/react.useaccountsigners": "/references/react/v4/useAccountSigners",
  "/react/react.useactiveclaimcondition":
    "/references/react/v4/useActiveClaimCondition",
  "/react/react.useactiveclaimconditionforwallet":
    "/references/react/v4/useActiveClaimConditionForWallet",
  "/react/react.useactivelistings": "/references/react/v4/useActiveListings",
  "/react/react.useaddadmin": "/references/react/v4/useAddAdmin",
  // hooks
  "/react/react.useaddress": "/references/react/v4/useAddress",
  "/react/react.useairdropnft": "/references/react/v4/useAirdropNFT",
  "/react/react.useallrolemembers": "/references/react/v4/useAllRoleMembers",
  "/react/react.useauctionwinner": "/references/react/v4/useAuctionWinner",
  "/react/react.usebalance": "/references/react/v4/useBalance",
  "/react/react.usebalanceforaddress":
    "/references/react/v4/useBalanceForAddress",
  "/react/react.usebatchestoreveal": "/references/react/v4/useBatchesToReveal",
  "/react/react.usebidbuffer": "/references/react/v4/useBidBuffer",
  "/react/react.usebloctowallet": "/references/react/v4/useBloctoWallet",
  "/react/react.useburnnft": "/references/react/v4/useBurnNFT",
  "/react/react.useburntoken": "/references/react/v4/useBurnToken",
  "/react/react.usebuydirectlisting":
    "/references/react/v4/useBuyDirectListing",
  "/react/react.usebuynow": "/references/react/v4/useBuyNow",
  "/react/react.usecanceldirectlisting":
    "/references/react/v4/useCancelDirectListing",
  "/react/react.usecancelenglishauction":
    "/references/react/v4/useCancelEnglishAuction",
  "/react/react.usecancellisting": "/references/react/v4/useCancelListing",
  "/react/react.usechain": "/references/react/v4/useChain",
  "/react/react.usechainid": "/references/react/v4/useChainId",
  "/react/react.useclaimconditions": "/references/react/v4/useClaimConditions",
  "/react/react.useclaimednfts": "/references/react/v4/useClaimedNFTs",
  "/react/react.useclaimednftsupply":
    "/references/react/v4/useClaimedNFTSupply",
  "/react/react.useclaimerproofs": "/references/react/v4/useClaimerProofs",
  "/react/react.useclaimineligibilityreasons":
    "/references/react/v4/useClaimIneligibilityReasons",
  "/react/react.useclaimnft": "/references/react/v4/useClaimNFT",
  "/react/react.useclaimtoken": "/references/react/v4/useClaimToken",
  "/react/react.usecoinbasewallet": "/references/react/v4/useCoinbaseWallet",
  "/react/react.usecompilermetadata":
    "/references/react/v4/useCompilerMetadata",
  "/react/react.useconnect": "/references/react/v4/useConnect",
  "/react/react.useconnectionstatus":
    "/references/react/v4/useConnectionStatus",
  "/react/react.usecontract": "/references/react/v4/useContract",
  "/react/react.usecontractevents": "/references/react/v4/useContractEvents",
  "/react/react.usecontractread": "/references/react/v4/useContractRead",
  "/react/react.usecontracttype": "/references/react/v4/useContractType",
  "/react/react.usecontractwrite": "/references/react/v4/useContractWrite",
  "/react/react.usecreateauctionlisting":
    "/references/react/v4/useCreateAuctionListing",
  "/react/react.usecreatedirectlisting":
    "/references/react/v4/useCreateDirectListing",
  "/react/react.usecreatesessionkey":
    "/references/react/v4/useCreateSessionKey",
  "/react/react.usecreatewalletinstance":
    "/references/react/v4/useCreateWalletInstance",
  "/react/react.usedelayedreveallazymint":
    "/references/react/v4/useDelayedRevealLazyMint",
  "/react/react.usedirectlisting": "/references/react/v4/useDirectListing",
  "/react/react.usedirectlistings": "/references/react/v4/useDirectListings",
  "/react/react.usedirectlistingscount":
    "/references/react/v4/useDirectListingsCount",
  "/react/react.usedisconnect": "/references/react/v4/useDisconnect",
  "/react/react.useembeeddedwallet": "/references/react/v4/useEmbeddedWallet",
  "/react/react.useenglishauction": "/references/react/v4/useEnglishAuction",
  "/react/react.useenglishauctions": "/references/react/v4/useEnglishAuctions",
  "/react/react.useenglishauctionscount":
    "/references/react/v4/useEnglishAuctionsCount",
  "/react/react.useenglishauctionwinningbid":
    "/references/react/v4/useEnglishAuctionWinningBid",
  "/react/react.useexecuteauctionsale":
    "/references/react/v4/useExecuteAuctionSale",
  "/react/react.useframewallet": "/references/react/v4/useFrameWallet",
  "/react/react.usegrantrole": "/references/react/v4/useGrantRole",
  "/react/react.useisaddressrole": "/references/react/v4/useIsAddressRole",
  "/react/react.uselazymint": "/references/react/v4/useLazyMint",
  "/react/react.uselisting": "/references/react/v4/useListing",
  "/react/react.uselistings": "/references/react/v4/useListings",
  "/react/react.uselistingscount": "/references/react/v4/useListingsCount",
  "/react/react.uselogin": "/references/react/v4/useLogin",
  "/react/react.uselogout": "/references/react/v4/useLogout",
  "/react/react.usemagic": "/references/react/v4/useMagic",
  "/react/react.usemakebid": "/references/react/v4/useMakeBid",
  "/react/react.usemakeoffer": "/references/react/v4/useMakeOffer",
  "/react/react.usemetadata": "/references/react/v4/useMetadata",
  "/react/react.usemetamask": "/references/react/v4/useMetamask",
  "/react/react.useminimumnextbid": "/references/react/v4/useMinimumNextBid",
  "/react/react.usemintnft": "/references/react/v4/useMintNFT",
  "/react/react.usemintnftsupply": "/references/react/v4/useMintNFTSupply",
  "/react/react.useminttoken": "/references/react/v4/useMintToken",
  "/react/react.usenft": "/references/react/v4/useNFT",
  "/react/react.usenftbalance": "/references/react/v4/useNFTBalance",
  "/react/react.usenfts": "/references/react/v4/useNFTs",
  "/react/react.useoffers": "/references/react/v4/useOffers",
  "/react/react.useownednfts": "/references/react/v4/useOwnedNFTs",
  "/react/react.useplatformfees": "/references/react/v4/usePlatformFees",
  "/react/react.useprimarysalerecipient":
    "/references/react/v4/usePrimarySaleRecipient",
  "/react/react.userainbowwallet": "/references/react/v4/useRainbowWallet",
  "/react/react.useremoveadmin": "/references/react/v4/useRemoveAdmin",
  "/react/react.useresetclaimconditions":
    "/references/react/v4/useResetClaimConditions",
  "/react/react.useresolvedmediatype":
    "/references/react/v4/useResolvedMediaType",
  "/react/react.usereveallazymint": "/references/react/v4/useRevealLazyMint",
  "/react/react.userevokerole": "/references/react/v4/useRevokeRole",
  "/react/react.userevokesessionkey":
    "/references/react/v4/useRevokeSessionKey",
  "/react/react.userolemembers": "/references/react/v4/useRoleMembers",
  "/react/react.useroyaltysettings": "/references/react/v4/useRoyaltySettings",
  "/react/react.useSwitchChain": "/references/react/v4/useSwitchChain",
  "/react/react.usesafe": "/references/react/v4/useSafe",
  "/react/react.usesdk": "/references/react/v4/useSDK",
  "/react/react.usesetclaimconditions":
    "/references/react/v4/useSetClaimConditions",
  "/react/react.usesetconnectedwallet":
    "/references/react/v4/useSetConnectedWallet",
  "/react/react.usesetconnectionstatus":
    "/references/react/v4/useSetConnectionStatus",
  "/react/react.usesigner": "/references/react/v4/useSigner",
  "/react/react.usesmartwallet": "/references/react/v4/useSmartWallet",
  "/react/react.usestorage": "/references/react/v4/useStorage",
  "/react/react.usestorageupload": "/references/react/v4/useStorageUpload",
  "/react/react.usetokenbalance": "/references/react/v4/useTokenBalance",
  "/react/react.usetokendecimals": "/references/react/v4/useTokenDecimals",
  "/react/react.usetokensupply": "/references/react/v4/useTokenSupply",
  "/react/react.usetotalcirculatingsupply":
    "/references/react/v4/useTotalCirculatingSupply",
  "/react/react.usetotalcount": "/references/react/v4/useTotalCount",
  "/react/react.usetransferbatchtoken":
    "/references/react/v4/useTransferBatchToken",
  "/react/react.usetransfernft": "/references/react/v4/useTransferNFT",
  "/react/react.usetransfertoken": "/references/react/v4/useTransferToken",
  "/react/react.usetrustwallet": "/references/react/v4/useTrustWallet",
  "/react/react.useunclaimednfts": "/references/react/v4/useUnclaimedNFTs",
  "/react/react.useunclaimednftsupply":
    "/references/react/v4/useUnclaimedNFTSupply",
  "/react/react.useupdatemetadata": "/references/react/v4/useUpdateMetadata",
  "/react/react.useupdateplatformfees":
    "/references/react/v4/useUpdatePlatformFees",
  "/react/react.useupdateprimarysalerecipient":
    "/references/react/v4/useUpdatePrimarySaleRecipient",
  "/react/react.useupdateroyaltysettings":
    "/references/react/v4/useUpdateRoyaltySettings",
  "/react/react.useuser": "/references/react/v4/useUser",
  "/react/react.usevaliddirectlistings":
    "/references/react/v4/useValidDirectListings",
  "/react/react.usevalidenglishauctions":
    "/references/react/v4/useValidEnglishAuctions",
  "/react/react.usewallet": "/references/react/v4/useWallet",
  "/react/react.usewalletconfig": "/references/react/v4/useWalletConfig",
  "/react/react.usewalletconnect": "/references/react/v4/useWalletConnect",
  "/react/react.usewinningbid": "/references/react/v4/useWinningBid",
  "/react/react.walletconnect": "/references/react/v4/walletconnect",
  "/react/react.web3button": "/react/v4/components/Web3Button",
  "/react/react.zerion": "/references/react/v4/zerionWallet",
  "/react/v5/in-app-wallet/how-to/get-in-app-wallet-details-on-server":
    "/react/v5/in-app-wallet/how-to/get-user-details",
  "/ui-components/web3button": "/react/v4/components/Web3Button",
};

const solidityRedirects = {
  "/interact/overview": "/connect/blockchain-api",
  "/solidity": "/contracts/build",
  "/solidity/base-contract/erc721delayedreveal":
    "/contracts/build/base-contracts/erc-721/delayed-reveal",
  "/solidity/base-contract/erc1155delayedreveal":
    "/contracts/build/extensions/erc-1155/ERC1155Revealable",
  "/solidity/base-contracts": "/contracts/build/base-contracts",
  "/solidity/base-contracts/account":
    "/contracts/build/base-contracts/erc-4337/account",
  "/solidity/base-contracts/account-factory":
    "/contracts/build/base-contracts/erc-4337/account-factory",
  "/solidity/base-contracts/erc20base":
    "/contracts/build/base-contracts/erc-20/base",
  "/solidity/base-contracts/erc20drop":
    "/contracts/build/base-contracts/erc-20/drop",
  "/solidity/base-contracts/erc20signaturemint":
    "/contracts/build/base-contracts/erc-20/signature-mint",
  "/solidity/base-contracts/erc20vote":
    "/contracts/build/base-contracts/erc-20/vote",
  "/solidity/base-contracts/erc721base":
    "/contracts/build/base-contracts/erc-721/base",
  "/solidity/base-contracts/erc721delayedreveal":
    "/contracts/build/base-contracts/erc-721/delayed-reveal",
  "/solidity/base-contracts/erc721drop":
    "/contracts/build/base-contracts/erc-721/drop",
  "/solidity/base-contracts/erc721lazymint":
    "/contracts/build/base-contracts/erc-721/lazy-mint",
  "/solidity/base-contracts/erc721signaturemint":
    "/contracts/build/base-contracts/erc-721/signature-mint",
  "/solidity/base-contracts/erc1155base":
    "/contracts/build/base-contracts/erc-1155/base",
  "/solidity/base-contracts/erc1155delayedreveal":
    "/contracts/build/base-contracts/erc-1155/delayed-reveal",
  "/solidity/base-contracts/erc1155drop":
    "/contracts/build/base-contracts/erc-1155/drop",
  "/solidity/base-contracts/erc1155lazymint":
    "/contracts/build/base-contracts/erc-1155/lazy-mint",
  "/solidity/base-contracts/erc1155signaturemint":
    "/contracts/build/base-contracts/erc-1155/signature-mint",
  "/solidity/base-contracts/managed-account":
    "/contracts/build/base-contracts/erc-4337/managed-account",
  "/solidity/base-contracts/managed-account-factory":
    "/contracts/build/base-contracts/erc-4337/managed-account-factory",
  "/solidity/base-contracts/smart-accounts":
    "/contracts/build/base-contracts/erc-4337",
  "/solidity/base-contracts/staking/staking20base":
    "/contracts/build/base-contracts/erc-20/staking",
  "/solidity/base-contracts/staking/staking721base":
    "/contracts/build/base-contracts/erc-721/staking",
  "/solidity/base-contracts/staking/staking1155base":
    "/contracts/build/base-contracts/erc-1155/staking",
  "/solidity/extensions": "/contracts/build/extensions",
  "/solidity/extensions/base-account":
    "/contracts/build/extensions/erc-4337/SmartWallet",
  "/solidity/extensions/base-account-factory":
    "/contracts/build/extensions/erc-4337/SmartWalletFactory",
  "/solidity/extensions/contract-metadata":
    "/contracts/build/extensions/general/ContractMetadata",
  "/solidity/extensions/contractmetadata":
    "/contracts/build/extensions/general/ContractMetadata",
  "/solidity/extensions/delayedreveal":
    "/contracts/build/extensions/general/DelayedReveal",
  "/solidity/extensions/drop": "/contracts/build/extensions/general/Drop",
  "/solidity/extensions/dropsinglephase":
    "/contracts/build/extensions/general/DropSinglePhase",
  "/solidity/extensions/erc20": "/contracts/build/extensions/erc-20/ERC20",
  "/solidity/extensions/erc20batchmintable":
    "/contracts/build/extensions/erc-20/ERC20BatchMintable",
  "/solidity/extensions/erc20claimconditions":
    "/contracts/build/extensions/erc-20/ERC20ClaimConditions",
  "/solidity/extensions/erc20mintable":
    "/contracts/build/extensions/erc-20/ERC20BatchMintable",
  "/solidity/extensions/erc20Permit":
    "/contracts/build/extensions/erc-20/ERC20Permit",
  "/solidity/extensions/erc721": "/contracts/build/extensions/erc-721/ERC721",
  "/solidity/extensions/erc721batchmintable":
    "/contracts/build/extensions/erc-721/ERC721BatchMintable",
  "/solidity/extensions/erc721burnable":
    "/contracts/build/extensions/erc-721/ERC721Burnable",
  "/solidity/extensions/erc721claimable":
    "/contracts/build/extensions/erc-721/ERC721Claimable",
  "/solidity/extensions/erc721claimconditions":
    "/contracts/build/extensions/erc-721/ERC721ClaimConditions",
  "/solidity/extensions/erc721claimcustom":
    "/contracts/build/extensions/erc-721/ERC721ClaimCustom",
  "/solidity/extensions/erc721claimphases":
    "/contracts/build/extensions/erc-721/ERC721ClaimPhases",
  "/solidity/extensions/erc721mintable":
    "/contracts/build/extensions/erc-721/ERC721Mintable",
  "/solidity/extensions/erc721revealable":
    "/contracts/build/extensions/erc-721/ERC721Revealable",
  "/solidity/extensions/erc721signaturemint":
    "/contracts/build/extensions/erc-721/ERC721SignatureMint",
  "/solidity/extensions/erc721supply":
    "/contracts/build/extensions/erc-721/ERC721Supply",
  "/solidity/extensions/erc1155":
    "/contracts/build/extensions/erc-1155/ERC1155",
  "/solidity/extensions/erc1155batchmintable":
    "/contracts/build/extensions/erc-1155/ERC1155BatchMintable",
  "/solidity/extensions/erc1155burnable":
    "/contracts/build/extensions/erc-1155/ERC1155Burnable",
  "/solidity/extensions/erc1155claimable":
    "/contracts/build/extensions/erc-1155/ERC1155Claimable",
  "/solidity/extensions/erc1155claimconditions":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimConditions",
  "/solidity/extensions/erc1155claimcustom":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimCustom",
  "/solidity/extensions/erc1155claimphases":
    "/contracts/build/extensions/erc-1155/ERC1155ClaimPhases",
  "/solidity/extensions/erc1155dropsinglephase":
    "/contracts/build/extensions/erc-1155/ERC1155DropSinglePhase",
  "/solidity/extensions/erc1155enumerable":
    "/contracts/build/extensions/erc-1155/ERC1155Enumerable",
  "/solidity/extensions/erc1155mintable":
    "/contracts/build/extensions/erc-1155/ERC1155Mintable",
  "/solidity/extensions/erc1155revealable":
    "/contracts/build/extensions/erc-1155/ERC1155Revealable",
  "/solidity/extensions/erc1155signaturemint":
    "/contracts/build/extensions/erc-1155/ERC1155SignatureMint",
  "/solidity/extensions/erc1155supply":
    "/contracts/build/extensions/erc-1155/ERC1155Supply",
  "/solidity/extensions/lazymint":
    "/contracts/build/extensions/general/LazyMint",
  "/solidity/extensions/multicall":
    "/contracts/build/extensions/general/Multicall",
  "/solidity/extensions/ownable": "/contracts/build/extensions/general/Ownable",
  "/solidity/extensions/permissions":
    "/contracts/build/extensions/general/Permissions",
  "/solidity/extensions/platformfee":
    "/contracts/build/extensions/general/PlatformFee",
  "/solidity/extensions/primarysale":
    "/contracts/build/extensions/general/PrimarySale",
  "/solidity/extensions/royalty": "/contracts/build/extensions/general/Royalty",
};

const extensionsTable = "/typescript/v4/extensions#all-available-extensions";

const typescriptRedirects = {
  "/typescript": "/typescript/v4",
  "/typescript/extensions": "/typescript/v4/extensions",
  "/typescript/getting-started": "/typescript/v4/getting-started",
  // extensions path*
  "/typescript/sdk:path*": extensionsTable,
  "/typescript/sdk.contractdeployer": "/typescript/v4/deploy",
  "/typescript/sdk.contractverifier":
    "/typescript/v4/utilities#contract-verification",
  "/typescript/sdk.erc20": "/references/typescript/v4/Erc20",
  // extensions
  "/typescript/sdk.erc721": "/references/typescript/v4/Erc721",
  "/typescript/sdk.erc1155": "/references/typescript/v4/Erc1155",
  "/typescript/sdk.smartcontract.call": "/typescript/v4/extensions",
  "/typescript/sdk.smartcontract.prepare":
    "/typescript/v4/extensions#preparing-transactions",
  "/typescript/sdk.thirdwebsdk": "/typescript/v4/getting-started",
  "/typescript/sdk.thirdwebsdk.detectextensions":
    "/v4/extensions#detecting-avilable-extensions",
  "/typescript/sdk.thirdwebsdk.fromprivatekey":
    "/references/typescript/v4/ThirdwebSDK#fromPrivateKey",
  "/typescript/sdk.thirdwebsdk.fromsigner":
    "/references/typescript/v4/ThirdwebSDK#fromSigner",
  "/typescript/sdk.thirdwebsdk.fromwallet":
    "/references/typescript/v4/ThirdwebSDK#fromWallet",
  "/typescript/sdk.thirdwebsdk.smartcontract": "/typescript/v4/extensions",
  // v5 deploy redirects
  "/references/typescript/v5/deploy/deployPackContract": "/contracts",
};

const reactNativeRedirects = {
  "/react-native": "/typescript/v5/react-native",
  // others
  "/react-native/available-hooks": "/references/react-native/v0/hooks",
  "/react-native/faq/deeplinks": "/react-native/v0/faq",
  "/react-native/getting-started": "/typescript/v5/react-native",
  "/react-native/react-native.coinbase": "/react-native/v0/wallets/coinbase",
  // components
  "/react-native/react-native.connectwallet":
    "/react-native/v0/components/ConnectWallet",
  // wallets
  "/react-native/react-native.embeddedwallet":
    "/react-native/v0/wallets/embedded-wallet",
  "/react-native/react-native.localwallet":
    "/react-native/v0/wallets/local-wallet",
  "/react-native/react-native.magic": "/react-native/v0/wallets/magiclink",
  "/react-native/react-native.metamask": "/react-native/v0/wallets/metamask",
  "/react-native/react-native.rainbow": "/react-native/v0/wallets/rainbow",
  "/react-native/react-native.smartwallet":
    "/react-native/v0/wallets/smartwallet",
  "/react-native/react-native.trust": "/react-native/v0/wallets/trust",
  "/react-native/react-native.uselogin": "/references/react-native/v0/useLogin",
  "/react-native/react-native.uselogout":
    "/references/react-native/v0/useLogout",
  "/react-native/react-native.useuser": "/references/react-native/v0/useUser",
  "/react-native/react-native.walletconnect":
    "/react-native/v0/wallets/walletconnect",
  "/react-native/react-native.web3button":
    "/react-native/v0/components/Web3Button",
  "/react-native/storage": "/references/react-native/v0/hooks#storage",
  "/typescript/v5/react-native/installation":
    "/typescript/v5/react-native/getting-started",
};

const unityRedirects = {
  // top level
  "/unity": "/unity/v5",
  // blocks
  "/unity/blocks/getblock": "/unity/v4/blocks/getblock",
  "/unity/blocks/getblockwithtransactions":
    "/unity/v4/blocks/getblockwithtransactions",
  "/unity/blocks/getlatestblocknumber": "/unity/v4/blocks/getlatestblocknumber",
  "/unity/blocks/getlatestblocktimestamp":
    "/unity/v4/blocks/getlatestblocktimestamp",
  // blockchain api
  "/unity/contracts": "/unity/v4/contracts",
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
  // events
  "/unity/contracts/events/get": "/unity/v4/contracts/events/get",
  "/unity/contracts/events/getall": "/unity/v4/contracts/events/getall",
  "/unity/contracts/events/listentoall":
    "/unity/v4/contracts/events/listentoall",
  "/unity/contracts/events/removealllisteners":
    "/unity/v4/contracts/events/removealllisteners",
  "/unity/contracts/get": "/unity/v4/contracts/get",
  // marketplace
  "/unity/contracts/marketplace": "/unity/v4/contracts/marketplace",
  // pack
  "/unity/contracts/pack": "/unity/v4/contracts/pack",
  "/unity/contracts/prepare": "/unity/v4/contracts/prepare",
  "/unity/contracts/read": "/unity/v4/contracts/read",
  "/unity/contracts/write": "/unity/v4/contracts/write",
  "/unity/getting-started": "/unity/v4/getting-started",
  "/unity/pay/buywithcrypto": "/unity/v4/pay/buywithcrypto",
  "/unity/pay/buywithfiat": "/unity/v4/pay/buywithfiat",
  // pay
  "/unity/pay/getbuyhistory": "/unity/v4/pay/getbuyhistory",
  // buy with crypto
  "/unity/pay/getbuywithcryptoquote": "/unity/v4/pay/getbuywithcryptoquote",
  "/unity/pay/getbuywithcryptostatus": "/unity/v4/pay/getbuywithcryptostatus",
  "/unity/pay/getbuywithfiatcurrencies":
    "/unity/v4/pay/getbuywithfiatcurrencies",
  // buy with fiat
  "/unity/pay/getbuywithfiatquote": "/unity/v4/pay/getbuywithfiatquote",
  "/unity/pay/getbuywithfiatstatus": "/unity/v4/pay/getbuywithfiatstatus",
  "/unity/storage": "/unity/v4/storage",
  // core
  "/unity/thirdwebmanager": "/unity/v4/thirdwebmanager",
  "/unity/wallets/actions/addadmin": "/unity/v4/wallets/actions/addadmin",
  "/unity/wallets/actions/authenticate":
    "/unity/v4/wallets/actions/authenticate",
  // wallet actions
  "/unity/wallets/actions/connect": "/unity/v4/wallets/actions/connect",
  "/unity/wallets/actions/createsessionkey":
    "/unity/v4/wallets/actions/createsessionkey",
  "/unity/wallets/actions/disconnect": "/unity/v4/wallets/actions/disconnect",
  "/unity/wallets/actions/executerawtransaction":
    "/unity/v4/wallets/actions/executerawtransaction",
  "/unity/wallets/actions/getaddress": "/unity/v4/wallets/actions/getaddress",
  "/unity/wallets/actions/getallactivesigners":
    "/unity/v4/wallets/actions/getallactivesigners",
  "/unity/wallets/actions/getbalance": "/unity/v4/wallets/actions/getbalance",
  "/unity/wallets/actions/getchainid": "/unity/v4/wallets/actions/getchainid",
  "/unity/wallets/actions/getemail": "/unity/v4/wallets/actions/getemail",
  "/unity/wallets/actions/getnonce": "/unity/v4/wallets/actions/getnonce",
  "/unity/wallets/actions/getsigneraddress":
    "/unity/v4/wallets/actions/getsigneraddress",
  "/unity/wallets/actions/isconnected": "/unity/v4/wallets/actions/isconnected",
  "/unity/wallets/actions/recoveraddress":
    "/unity/v4/wallets/actions/recoveraddress",
  "/unity/wallets/actions/removeadmin": "/unity/v4/wallets/actions/removeadmin",
  "/unity/wallets/actions/revokesessionkey":
    "/unity/v4/wallets/actions/revokesessionkey",
  "/unity/wallets/actions/sendrawtransaction":
    "/unity/v4/wallets/actions/sendrawtransaction",
  "/unity/wallets/actions/sign": "/unity/v4/wallets/actions/sign",
  "/unity/wallets/actions/signtypeddatav4":
    "/unity/v4/wallets/actions/signtypeddatav4",
  "/unity/wallets/actions/switchnetwork":
    "/unity/v4/wallets/actions/switchnetwork",
  "/unity/wallets/actions/transfer": "/unity/v4/wallets/actions/transfer",
  // wallets
  "/unity/wallets/prefab": "/unity/v4/wallets/prefab",
  "/unity/wallets/providers/account-abstraction":
    "/unity/v4/wallets/providers/account-abstraction",
  "/unity/wallets/providers/coinbase": "/unity/v4/wallets/providers/coinbase",
  "/unity/wallets/providers/hyperplay": "/unity/v4/wallets/providers/hyperplay",
  // wallet providers
  "/unity/wallets/providers/in-app-wallet":
    "/unity/v4/wallets/providers/in-app-wallet",
  "/unity/wallets/providers/local-wallet":
    "/unity/v4/wallets/providers/local-wallet",
  "/unity/wallets/providers/metamask": "/unity/v4/wallets/providers/metamask",
  "/unity/wallets/providers/rabby": "/unity/v4/wallets/providers/rabby",
  "/unity/wallets/providers/walletconnect":
    "/unity/v4/wallets/providers/walletconnect",
  // submission
  "/unity/wallets/submission": "/unity/v4/wallets/submission",
};

const walletRedirects = {
  //auth
  "/auth": "/connect/auth",
  "/auth/client-frameworks/react": "/connect/auth/client-frameworks/react",
  "/auth/client-frameworks/react-native":
    "/connect/auth/client-frameworks/react-native",
  "/auth/faqs": "/connect/auth/faq",
  "/auth/getting-started": "/connect/auth/get-started",
  "/auth/how-auth-works": "/connect/auth/how-it-works",
  "/auth/how-auth-works/auth-api": "/connect/auth/how-it-works/api",
  "/auth/how-auth-works/json-web-tokens": "/connect/auth/how-it-works/jwt",
  "/auth/how-auth-works/sign-in-with-wallet": "/connect/auth/how-it-works/siwe",
  "/auth/integrations/firebase": "/connect/auth/integrations/firebase",
  "/auth/integrations/next-auth": "/connect/auth/integrations/next-auth",
  "/auth/integrations/supabase": "/connect/auth/integrations/supabase",
  "/auth/server-frameworks/express": "/connect/auth/server-frameworks/express",
  "/auth/server-frameworks/next": "/connect/auth/server-frameworks/next",
  "/auth/wallet-configuration": "/connect/auth/wallet-configuration",
  //connect
  "/connect/architecture": "/connect",
  "/connect/auth/client-frameworks/react": "/connect/auth",
  "/connect/auth/client-frameworks/react-native": "/connect/auth",
  "/connect/auth/faqs": "/connect/auth",
  "/connect/auth/get-started": "/connect/auth",
  "/connect/auth/how-it-works": "/connect/auth",
  "/connect/auth/how-it-works/api": "/connect/auth",
  "/connect/auth/how-it-works/jwt": "/connect/auth",
  "/connect/auth/how-it-works/siwe": "/connect/auth",
  "/connect/auth/integrations/firebase": "/connect/auth",
  "/connect/auth/integrations/next-auth": "/connect/auth",
  "/connect/auth/integrations/supabase": "/connect/auth",
  "/connect/auth/server-frameworks/express": "/connect/auth",
  "/connect/auth/server-frameworks/next": "/connect/auth",
  "/connect/auth/wallet-configuration": "/connect/auth",
  "/connect/connect-wallet": "/connect/connect",
  "/connect/connect-wallet/auth": "/connect/sign-in",
  "/connect/connect-wallet/button-title": "/connect/sign-in",
  "/connect/connect-wallet/class-name": "/connect/sign-in",
  "/connect/connect-wallet/custom-button": "/connect/sign-in",
  "/connect/connect-wallet/custom-ui": "/connect/sign-in/custom-ui",
  "/connect/connect-wallet/drop-down-positions": "/connect/sign-in",
  "/connect/connect-wallet/hide-testnet-faucet": "/connect/sign-in",
  "/connect/connect-wallet/modal-size": "/connect/sign-in",
  "/connect/connect-wallet/modal-title": "/connect/sign-in",
  "/connect/connect-wallet/privacy-policy": "/connect/sign-in",
  "/connect/connect-wallet/switch-chain": "/connect/sign-in",
  "/connect/connect-wallet/terms-of-service": "/connect/sign-in",
  "/connect/connect-wallet/theme": "/connect/sign-in",
  "/connect/connect-wallet/wallet-providers": "/connect/connect",
  "/connect/connect-wallet/welcome-screen": "/connect/sign-in",
  "/connect/ecosystem/ecosystem-premissions":
    "/connect/wallet/ecosystem/permissions",

  "/connect/ecosystem/faq": "/connect/wallet/faq",
  "/connect/ecosystem/get-started": "/connect/wallet/get-started",
  "/connect/ecosystem/integrating-partners":
    "/connect/wallet/ecosystem/integrating-partners",
  "/connect/ecosystem/overview": "/connect/wallet/overview",
  "/connect/ecosystem/pregenerate-wallets":
    "/connect/wallet/pregenerate-wallets",
  "/connect/ecosystem/security": "/connect/wallet/security",
  "/connect/ecosystem/wallet-explorer": "/connect/wallet/ecosystem/portal",
  "/connect/faqs": "/connect/sign-in",
  "/connect/in-app-wallet/faqs": "/connect/wallet/faq",
  "/connect/in-app-wallet/get-started": "/connect/wallet/get-started",
  "/connect/in-app-wallet/guides/export-private-key":
    "/connect/wallet/user-management/export-private-key",
  "/connect/in-app-wallet/guides/get-user-details":
    "/connect/wallet/user-management/get-user-profiles",
  "/connect/in-app-wallet/guides/link-multiple-profiles":
    "/connect/wallet/user-management/link-multiple-identity",
  "/connect/in-app-wallet/guides/retrieve-linked-profiles":
    "/connect/wallet/user-management/get-user-profiles",

  "/connect/in-app-wallet/overview": "/connect/wallet/overview",
  "/connect/in-app-wallet/security": "/connect/wallet/security",
  "/connect/sign-in": "/connect/sign-in/overview",
  "/connect/sign-in/ConnectButton": "/connect/wallet/get-started",
  "/connect/sign-in/ConnectEmbed": "/connect/wallet/get-started",
  "/connect/sign-in/Custom-UI": "/connect/wallet/get-started",
  "/connect/sign-in/methods/email-and-phone":
    "/connect/wallet/sign-in-methods/configure",
  "/connect/sign-in/methods/external-wallets":
    "/connect/wallet/sign-in-methods/external-wallets",
  "/connect/sign-in/methods/guest-mode":
    "/connect/wallet/sign-in-methods/guest",
  "/connect/sign-in/methods/social-logins":
    "/connect/wallet/sign-in-methods/configure",

  "/connect/sign-in/overview": "/connect/wallet/overview",
  "/connect/usage-with-react-native-sdk": "/connect/sign-in",
  "/connect/usage-with-react-sdk": "/connect/sign-in",
  "/connect/usage-with-typescript-sdk": "/connect/sign-in",
  "/connect/usage-with-unity-sdk": "/connect/sign-in",

  //embedded wallet
  "/embedded-wallet": "/wallets/embedded-wallet/overview",
  "/embedded-wallet/connect": "/wallets/embedded-wallet/how-to/connect-users",
  "/embedded-wallet/custom":
    "/wallets/embedded-wallet/how-to/build-your-own-ui",
  "/embedded-wallet/custom-auth":
    "/wallets/embedded-wallet/custom-auth/configuration",
  "/embedded-wallet/custom-auth-server":
    "/wallets/embedded-wallet/custom-auth/custom-auth-server",
  "/embedded-wallet/custom-jwt-auth-server":
    "/wallets/embedded-wallet/custom-auth/custom-jwt-auth-server",
  "/embedded-wallet/export-private-key":
    "/wallets/embedded-wallet/how-to/export-private-key",
  "/embedded-wallet/faqs": "/wallets/embedded-wallet/faqs",
  "/embedded-wallet/getting-started": "/wallets/embedded-wallet/get-started",
  "/embedded-wallet/how-it-works": "/wallets/embedded-wallet/how-it-works",
  "/embedded-wallet/integrate-firebase":
    "/wallets/embedded-wallet/custom-auth/firebase-auth",
  "/embedded-wallet/interact":
    "/wallets/embedded-wallet/how-to/interact-blockchain",
  "/embedded-wallet/smart-wallet-and-embedded-wallet":
    "/wallets/embedded-wallet/how-to/enable-gasless",
  "/embedded-wallet/use":
    "/wallets/embedded-wallet/how-to/interact-with-wallets",
  //smart wallet
  "/smart-wallet": "/wallets/smart-wallet",
  "/smart-wallet/faqs": "/wallets/smart-wallet/faq",
  "/smart-wallet/getting-started": "/wallets/smart-wallet/get-started",
  "/smart-wallet/guides/react": "/wallets/smart-wallet/guides/react",
  "/smart-wallet/guides/typescript": "/wallets/smart-wallet/guides/typescript",
  "/smart-wallet/how-it-works": "/wallets/smart-wallet/how-it-works",
  "/smart-wallet/infrastructure": "wallets/smart-wallet/infrastructure",
  "/smart-wallet/permissions": "/wallets/smart-wallet/permissions",
  // Wallet SDK
  "/wallet": "/wallet-sdk/v2",
  "/wallet/architecture": "/wallet-sdk/v2",
  "/wallet/aws-kms": "/references/wallets/v2/AwsKmsWallet",
  "/wallet/aws-secrets-manager":
    "/references/wallets/v2/AwsSecretsManagerWallet",
  "/wallet/blocto": "/references/wallets/v2/BloctoWallet",
  // build a wallet
  "/wallet/build-a-wallet": "/wallet-sdk/v2/build",
  "/wallet/coin98-wallet": "/references/wallets/v2/Coin98Wallet",
  "/wallet/coinbase-wallet": "/references/wallets/v2/CoinbaseWallet",
  "/wallet/core-wallet": "/references/wallets/v2/CoreWallet",
  "/wallet/defi-wallet": "/references/wallets/v2/CryptoDefiWallet",
  "/wallet/embedded-wallet": "/references/wallets/v2/EmbeddedWallet",
  "/wallet/ethers": "/references/wallets/v2/EthersWallet",
  "/wallet/frame": "/references/wallets/v2/FrameWallet",
  "/wallet/getting-started": "/wallet-sdk/v2/usage",
  "/wallet/interfaces/abstract-client-wallet":
    "/references/wallets/v2/AbstractClientWallet",
  "/wallet/interfaces/abstract-wallet": "/references/wallets/v2/AbstractWallet",
  "/wallet/interfaces/connector": "/references/wallets/v2/Connector",
  "/wallet/local-wallet": "/references/wallets/v2/LocalWallet",
  "/wallet/local-wallet-node": "/references/wallets/v2/LocalWalletNode",
  "/wallet/magic": "/references/wallets/v2/MagicLink",
  // wallets
  "/wallet/metamask": "/references/wallets/v2/MetaMaskWallet",
  "/wallet/okx-wallet": "/references/wallets/v2/OKXWallet",
  "/wallet/onekey-wallet": "/references/wallets/v2/OneKeyWallet",
  "/wallet/paper": "/references/wallets/v2/EmbeddedWallet",
  "/wallet/phantom": "/references/wallets/v2/PhantomWallet",
  "/wallet/private-key": "/references/wallets/v2/PrivateKeyWallet",
  "/wallet/rabby-wallet": "/references/wallets/v2/RabbyWallet",
  "/wallet/rainbow": "/references/wallets/v2/RainbowWallet",
  "/wallet/safe": "/references/wallets/v2/SafeWallet",
  "/wallet/smart-wallet": "/references/wallets/v2/SmartWallet",
  "/wallet/trust-wallet": "/references/wallets/v2/TrustWallet",
  "/wallet/usage-with-react-native-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-react-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-typescript-sdk": "/wallet-sdk/v2/usage",
  "/wallet/usage-with-unity-sdk": "/wallet-sdk/v2/usage",
  "/wallet/wallet-connect-v2": "/references/wallets/v2/WalletConnect",
  "/wallet/zerion-wallet": "/references/wallets/v2/ZerionWallet",
};

const paymentRedirects = {
  "/pay": "/payments",
  "/checkouts": "/payments",
  "/checkouts/api-reference": "/payments/nft-checkout/api-reference",
  "/checkouts/checkout-link": "/payments/nft-checkout/checkout-link",
  "/checkouts/checkout-with-card": "/payments/nft-checkout/checkout-with-card",
  "/checkouts/checkout-with-eth": "/payments/nft-checkout/checkout-with-eth",
  "/checkouts/custom-contracts": "/payments/nft-checkout/custom-contracts",
  "/checkouts/elements": "/payments/nft-checkout/elements",
  "/checkouts/enable-contract": "/payments/nft-checkout/enable-contract",
  "/checkouts/erc20-pricing": "/payments/nft-checkout/erc20-pricing",
  "/checkouts/faq": "/payments/nft-checkout/faq",
  "/checkouts/getting-started": "/payments/nft-checkout/getting-started",
  "/checkouts/go-live-checklist": "/payments/nft-checkout/go-live-checklist",
  "/checkouts/marketplaces": "/payments/nft-checkout/marketplaces",
  "/checkouts/one-time-checkout-link":
    "/payments/nft-checkout/one-time-checkout-link",
  "/checkouts/pre-built-contracts":
    "/payments/nft-checkout/pre-built-contracts",
  "/checkouts/translations": "/payments/nft-checkout/translations",
  "/checkouts/webhooks": "/payments/nft-checkout/webhooks",
  "/connect/in-app-wallet/guides/get-in-app-wallet-details-on-server":
    "/connect/in-app-wallet/guides/get-user-details",
  "/connect/in-app-wallet/how-it-works": "/connect/in-app-wallet/security",
  "/connect/pay/build-a-custom-experience":
    "/connect/pay/guides/build-a-custom-experience",
  "/connect/pay/buy-with-crypto": "/connect/pay/overview",
  "/connect/pay/buy-with-crypto/fee-sharing": "/connect/pay/fee-sharing",
  "/connect/pay/buy-with-crypto/overview": "/connect/pay/overview",
  "/connect/pay/buy-with-fiat": "/connect/pay/overview",
  "/connect/pay/enable-test-mode": "/connect/pay/guides/enable-test-mode",
  "/connect/pay/guides/enable-test-mode": "/connect/pay/testing-pay",
};

const contractRedirects = {
  "/contracts/DropERC721": "/contracts/explore/pre-built-contracts/nft-drop",
  "/contracts/DropERC1155":
    "/contracts/explore/pre-built-contracts/edition-drop",
  //design documentation
  "/contracts/design/Drop": "/contracts/design-docs/drop",
  "/contracts/design/Marketplace": "/contracts/design-docs/marketplace",
  "/contracts/design/Multiwrap": "/contracts/design-docs/multiwrap",
  "/contracts/design/Pack": "/contracts/design-docs/pack",
  "/contracts/design/SignatureDrop": "/contracts",
  "/contracts/design/SignatureMint": "/contracts/design-docs/signature-mint",
  "/contracts/Multiwrap": "/contracts/design-docs/multiwrap",
  // contract references
  "/contracts/TokenERC20": "/contracts/explore/pre-built-contracts/token",
  "/contracts/TokenERC721":
    "/contracts/explore/pre-built-contracts/nft-collection",
  "/contracts/TokenERC1155": "/contracts/explore/pre-built-contracts/edition",
  "/contracts/VoteERC20": "/contracts/build/base-contracts/erc-20/vote",
  //deploy
  "/deploy": "contracts/deploy/overview",
  "/deploy/faqs": "/contracts/deploy/overview",
  "/deploy/getting-started": "/contracts/deploy/deploy-contract",
  "/deploy/how-it-works": "/contracts/deploy/overview",
  "/explore/faqs": "/contracts",
  "/interact": "/contracts",
  //pre-built contracts
  "/pre-built-contracts": "/contracts",
  "/pre-built-contracts/account-factory":
    "/contracts/explore/pre-built-contracts/account-factory",
  "/pre-built-contracts/airdrop-erc20":
    "/contracts/explore/pre-built-contracts/airdrop-erc20",
  "/pre-built-contracts/airdrop-erc20-claimable":
    "/contracts/explore/pre-built-contracts/airdrop-erc20-claimable",
  "/pre-built-contracts/airdrop-erc721":
    "/contracts/explore/pre-built-contracts/airdrop-erc721",
  "/pre-built-contracts/airdrop-erc721-claimable":
    "/contracts/explore/pre-built-contracts/airdrop-erc721-claimable",
  "/pre-built-contracts/airdrop-erc1155":
    "/contracts/explore/pre-built-contracts/airdrop-erc1155",
  "/pre-built-contracts/airdrop-erc1155-claimable":
    "/explore/pre-built-contracts/airdrop-erc1155-claimable",
  "/pre-built-contracts/edition":
    "/contracts/explore/pre-built-contracts/edition",
  "/pre-built-contracts/edition-drop":
    "/contracts/explore/pre-built-contracts/edition-drop",
  "/pre-built-contracts/how-it-works": "/contracts",
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
  "/pre-built-contracts/pack": "/contracts",
  "/pre-built-contracts/signature-drop": "/contracts",
  "/pre-built-contracts/split": "/contracts/explore/pre-built-contracts/split",
  "/pre-built-contracts/stake-erc20":
    "/contracts/explore/pre-built-contracts/stake-erc20",
  "/pre-built-contracts/stake-erc721":
    "/contracts/explore/pre-built-contracts/stake-erc721",
  "/pre-built-contracts/stake-erc1155":
    "/contracts/explore/pre-built-contracts/stake-erc1155",
  "/pre-built-contracts/token": "/contracts/explore/pre-built-contracts/token",
  "/pre-built-contracts/token-drop":
    "/contracts/explore/pre-built-contracts/token-drop",
  "/pre-built-contracts/vote": "/contracts/explore/pre-built-contracts/vote",
  // pack contract deprecation redirect
  "/contracts/explore/pre-built-contracts/pack": "/contracts",
  //publish
  "/publish": "/contracts/publish/overview",
  "/publish/deployment-options": "/contracts/publish/publish-options",
  "/publish/get-featured-on-explore": "/contracts/publish/overview",
  "/publish/getting-started": "/contracts/publish/publish-contract",
  "/sdk": "/contracts",
  "/sdk/getting-started": "/contracts",
  "/sdk/how-it-works": "/contracts",
};

const infrastructureRedirects = {
  "/engine": "/engine/v3",
  "/engine/features/permissions": "/engine/features/admins",
  "/guides/engine/relayer": "/engine/features/relayer",
  //engine top-level
  "/infrastructure/engine": "/engine",
  "/infrastructure/engine/faq": "/engine/faq",
  "/infrastructure/engine/features/backend-wallets":
    "/engine/features/backend-wallets",
  "/infrastructure/engine/features/contracts": "/engine/features/contracts",
  "/infrastructure/engine/features/gasless-transactions":
    "/engine/features/gasless-transactions",
  "/infrastructure/engine/features/permissions": "/engine/features/permissions",
  "/infrastructure/engine/features/relayers": "/engine/features/relayers",
  "/infrastructure/engine/features/smart-wallets":
    "/engine/features/smart-wallets",
  "/infrastructure/engine/features/webhooks": "/engine/features/webhooks",
  "/infrastructure/engine/get-started": "/engine/get-started",
  "/infrastructure/engine/guides/airdrop-nfts": "/engine/guides/airdrop-nfts",
  "/infrastructure/engine/guides/nft-checkout": "/engine/guides/nft-checkout",
  "/infrastructure/engine/guides/smart-wallets": "/engine/guides/smart-wallets",
  "/infrastructure/engine/overview": "/engine",
  "/infrastructure/engine/production-checklist": "/engine/production-checklist",
  "/infrastructure/engine/references/api-reference":
    "/engine/references/api-reference",
  "/infrastructure/engine/references/typescript":
    "/engine/references/typescript",
  "/infrastructure/engine/self-host": "/engine/self-host",
  "/infrastucture/engine/security": "/engine/security",
  //rpc-edge
  "/rpc-edge": "/infrastructure/rpc-edge/overview",
  "/rpc-edge/faqs": "/infrastructure/rpc-edge/overview",
  "/rpc-edge/get-started": "/infrastructure/rpc-edge/get-started",
  "/storage/host-web-app":
    "/infrastructure/storage/how-to-use-storage/host-web-app",

  //storage
  "/storage/how-storage-works": "/infrastructure/storage/how-storage-works",
  "/storage/upload-to-ipfs":
    "/infrastructure/storage/how-to-use-storage/upload-files-to-ipfs",
};

const glossaryRedirects = {
  "/claim-phases": "https://thirdweb.com/learn/glossary/claim-phases",
  "/glossary": "https://thirdweb.com/learn/glossary",
  "/glossary/bundler": "https://thirdweb.com/learn/glossary/bundler",
  "/glossary/claiming": "https://thirdweb.com/learn/glossary/claim-phases",
  "/glossary/composability":
    "https://thirdweb.com/learn/glossary/composability",
  "/glossary/delayed-reveal":
    "https://thirdweb.com/learn/glossary/delayed-reveal",
  "/glossary/drop": "https://thirdweb.com/learn/glossary/drop",
  "/glossary/externally-owned-account":
    "https://thirdweb.com/learn/glossary/externally-owned-account",
  "/glossary/factory-contract":
    "https://thirdweb.com/learn/glossary/factory-contract",
  "/glossary/gas": "https://thirdweb.com/learn/glossary/gas-fee",
  "/glossary/gasless-transactions":
    "https://thirdweb.com/learn/glossary/gasless-transactions",
  "/glossary/interoperability":
    "https://thirdweb.com/learn/glossary/interoperability",
  "/glossary/ipfs":
    "https://thirdweb.com/learn/glossary/interplanetary-file-system-ipfs",
  "/glossary/lazy-minting": "https://thirdweb.com/learn/glossary/lazy-minting",
  "/glossary/local-wallet": "https://thirdweb.com/learn/glossary/local-wallet",
  "/glossary/minting": "https://thirdweb.com/learn/glossary/minting",
  "/glossary/nft": "https://thirdweb.com/learn/glossary/nft",
  "/glossary/non-custodial-wallet":
    "https://thirdweb.com/learn/glossary/non-custodial-wallet",
  "/glossary/permissionless":
    "https://thirdweb.com/learn/glossary/permissionless",
  "/glossary/proxy-contracts":
    "https://thirdweb.com/learn/glossary/proxy-contracts",
  "/glossary/rpc": "https://thirdweb.com/learn/glossary/rpc-url",
  "/glossary/signature-based-minting":
    "https://thirdweb.com/learn/glossary/signature-based-minting",
  "/glossary/smart-account":
    "https://thirdweb.com/learn/glossary/smart-account",
  "/glossary/smart-contract":
    "https://thirdweb.com/learn/glossary/smart-contract",
  "/glossary/soulbound": "https://thirdweb.com/learn/glossary/soulbound-tokens",
  "/glossary/staking": "https://thirdweb.com/learn/glossary/staking",
  "/glossary/token": "https://thirdweb.com/learn/glossary/token",
  "/glossary/wallet": "https://thirdweb.com/learn/glossary/",
};

const otherRedirects = {
  "/api-keys": "/account/api-keys",
  "/connect/account-abstraction": "/connect/account-abstraction/overview",
  // connect
  "/connect/connect": "/connect/sign-in",
  "/connect/ecosystems/:path*": "/connect/wallet/overview",
  "/connect/embedded-wallet/how-to/get-embedded-wallet-details-on-server":
    "/connect/in-app-wallet/how-to/get-in-app-wallet-details-on-server",
  "/connect/in-app-wallet/how-to/get-in-app-wallet-details-on-server":
    "/connect/in-app-wallet/guides/get-in-app-wallet-details-on-server",
  "/connect/smart-wallet/:path*": "/connect/account-abstraction/:path*",
  "/connect/wallet/sign-in-methods/overview":
    "/connect/wallet/sign-in-methods/configure",
  "/contractkit/:path*": "/contracts",
  "/contracts-sdk/:path*": "/contracts/build",
  "/contracts/drops": "/contracts",
  "/contracts/edition": "/contracts/explore/pre-built-contracts/edition",
  "/contracts/edition-drop":
    "/contracts/explore/pre-built-contracts/edition-drop",
  "/contracts/governance": "/contracts",
  "/contracts/marketplace":
    "/contracts/explore/pre-built-contracts/marketplace",
  "/contracts/nft-collection":
    "contracts/explore/pre-built-contracts/nft-collection",
  // solidity sdk
  "/contracts/nft-drop": "/contracts/explore/pre-built-contracts/nft-drop",
  "/contracts/nfts-and-tokens": "/contracts",
  "/contracts/pack": "/contracts",
  "/contracts/split": "/contracts/explore/pre-built-contracts/split",
  "/contracts/token": "/contracts/explore/pre-built-contracts/token",
  "/contracts/token-drop": "/contracts/explore/pre-built-contracts/token-drop",
  "/contracts/vote": "/contracts/explore/pre-built-contracts/vote",
  "/engine/features/smart-wallets": "/engine/features/account-abstraction",
  "/extensions/:path*": "/contracts/build/extensions",
  "/gaming": "/",
  "/gaming-kit/:path*": "/unity",
  "/gamingkit/:path*": "/unity",
  "/go": "/engine/overview",
  "/guides": "https://blog.thirdweb.com/guides",
  "/guides/bundle-collection": "https://blog.thirdweb.com/tag/edition",
  "/guides/bundle-drop": "https://blog.thirdweb.com/tag/edition-drop",
  "/guides/connect-wallet":
    "https://blog.thirdweb.com/guides/add-connectwallet-to-your-website/",
  "/guides/create-a-drop-with-thirdweb-dashboard":
    "https://blog.thirdweb.com/guides/release-an-nft-drop-with-no-code",
  "/guides/create-a-pack-with-typescript-and-nextjs":
    "https://blog.thirdweb.com/guides/create-an-nft-lootbox",
  "/guides/create-your-own-marketplace-with-thirdweb-typescript-sdk":
    "https://blog.thirdweb.com/guides/nft-marketplace-with-typescript-next",
  "/guides/edition": "https://blog.thirdweb.com/tag/edition",
  "/guides/edition-drop": "https://blog.thirdweb.com/tag/edition-drop",
  "/guides/marketplace": "https://blog.thirdweb.com/tag/marketplace",
  "/guides/minting-with-signature":
    "https://blog.thirdweb.com/guides/on-demand-minting",
  "/guides/nft-collection": "https://blog.thirdweb.com/tag/nft-collection",
  "/guides/nft-drop": "https://blog.thirdweb.com/tag/nft-drop",
  "/guides/on-demand-minting":
    "https://blog.thirdweb.com/guides/mint-nft-unique-code",
  "/guides/pack": "https://blog.thirdweb.com/tag/pack",
  "/guides/randomized-nft-drop":
    "https://blog.thirdweb.com/guides/shuffle-nft-drop",
  "/guides/split": "https://blog.thirdweb.com/tag/split",
  "/guides/splits": "https://blog.thirdweb.com/tag/split",
  "/guides/tag/bundle-collection": "https://blog.thirdweb.com/tag/edition",
  "/guides/tag/bundle-drop": "https://blog.thirdweb.com/tag/bundle-drop",
  "/guides/token": "https://blog.thirdweb.com/tag/token",
  "/guides/vote": "https://blog.thirdweb.com/tag/vote",
  "/learn/recipes/:match*": "https://blog.thirdweb.com/",
  // others
  "/pre-built-contracts/:path*": "/contracts",
  "/pre-built-contracts/solana/:match*":
    "https://blog.thirdweb.com/discontinuing-solana-support/",
  "/python": "/engine/overview",
  "/react-native/v0/wallets/embedded-wallet":
    "/react-native/v0/wallets/in-app-wallet",
  // in-app wallet
  "/references/typescript/v5/embeddedWallet":
    "/references/typescript/v5/inAppWallet",
  "/release/:match*": "/contracts/publish/overview",
  "/sdk/:path*": "/typescript/v4",
  "/signature-minting": "/contracts/design-docs/signature-mint",
  "/smart-contracts": "/contracts",
  // guides
  "/solana/:match*": "https://blog.thirdweb.com/discontinuing-solana-support/",
  "/solutions": "/",
  "/solutions/gaming": "/",
  "/tag/:match*": "https://blog.thirdweb.com/tag/:match*",
  "/templates": "https://thirdweb.com/templates",
  "/thirdweb-cli": "/cli",
  "/thirdweb-deploy/:path*": "/contracts/deploy/overview",
  "/ui-components/connectwalletbutton": "/react/v4/components/ConnectWallet",
  "/ui-components/ipfs-media-renderer": "/react/v4/components/MediaRenderer",
  "/ui-components/nft-renderer": "/react/v4/components/ThirdwebNftMedia",
  "/unity/connectwalletnative": "/unity/wallets/prefab",
  "/unity/prefabs/thirdwebmanager": "/unity/thirdwebmanager",
  "/unity/wallets/providers/embedded-wallet":
    "/unity/wallets/providers/in-app-wallet",
  "/unity/wallets/providers/smart-wallet":
    "/unity/wallets/providers/account-abstraction",
  "/wallet/get-started/overview": "/connect/wallet/overview",
  // connect > wallets
  "/connect/:path*": "/wallets/:path*",
  "/connect/auth/:path*": "/wallets/auth/:path*",
  "/connect/connect/:path*": "/wallets/connect/:path*",
  "/connect/embedded-wallet/:path*": "/wallets/embedded-wallet/:path*",
  // account abstraction rename
  "/wallets/smart-wallet/:path*": "/connect/account-abstraction/:path*",
  "/web3-api/:path*": "/infrastructure/engine/overview",
};

const v5RestructuredRedirects = {
  "/typescript/v5/react": "/react/v5",
  "/typescript/v5/react-native": "/react-native/v5",
  "/typescript/v5/react-native/:path*": "/react-native/v5/:path*",
  "/typescript/v5/react/:path*": "/react/v5/:path*",
};

const v4ToV5Redirects = {
  "/react-native/v0": "/react-native/v5",
  "/react-native/v0/:path*": "/react-native/v5",
  "/react/v4": "/react/v5",
  "/react/v4/:path*": "/react/v5",
  "/references/wallets": "/connect/external-wallets",
  "/references/wallets/:path*": "/connect/external-wallets",
  "/storage-sdk/v2": "/typescript/v5/storage",
  "/storage-sdk/v2/:path*": "/typescript/v5/storage",
  "/typescript/v4": "/typescript/v5",
  "/typescript/v4/:path*": "/typescript/v5",
  "/unity/v4": "/unity/v5",
  "/unity/v4/:path*": "/unity/v5",
  "/wallet-sdk/:path*": "/connect",
};

const payRedirects = {
  "/connect/pay/customization/connectbutton":
    "/pay/customization/connectbutton",
  "/connect/pay/customization/payembed": "/pay/customization/payembed",
  "/connect/pay/customization/send-transaction":
    "/pay/customization/send-transaction",
  "/connect/pay/faqs": "/pay/faqs",
  "/connect/pay/fees": "/pay/fees",
  "/connect/pay/get-started": "/pay/get-started",
  "/connect/pay/guides/accept-direct-payments":
    "/pay/guides/accept-direct-payments",
  "/connect/pay/guides/build-a-custom-experience":
    "/pay/guides/build-a-custom-experience",
  "/connect/pay/guides/cross-chain-swapping":
    "/pay/guides/cross-chain-swapping",
  "/connect/pay/onramp-providers": "/pay/onramp-providers",
  "/connect/pay/overview": "/pay",
  "/connect/pay/testing-pay": "/pay/testing-pay",
  "/connect/pay/webhooks": "/pay/webhooks",
};

const walletRefactorRedirects = {
  "/typescript/v5/supported-wallets": "/connect/external-wallets",
  "/typescript/v5/supported-wallets/:path*": "/connect/external-wallets/:path*",
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
    ...createRedirects(v4ToV5Redirects),
    ...createRedirects(glossaryRedirects),
    ...createRedirects(payRedirects),
    ...createRedirects(walletRefactorRedirects),
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
    redirects.push({ destination: linkMap[key], permanent, source: key });
  }
  return redirects;
}
