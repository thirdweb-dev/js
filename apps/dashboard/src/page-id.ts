// biome-ignore lint/nursery/noEnum: planned to be removed in the future
export enum PageId {
  // none case (for previous page id)
  None = "none",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------
  // thirdweb.com/contact-us
  ContactUs = "contact-us-page",

  // thirdweb.com/templates
  Templates = "templates-page",

  // thirdweb.com/template/[templateId]
  Template = "template-page",

  // thirdweb.com
  OSS = "oss-page",

  // thirdweb..com/privacy
  Privacy = "privacy-page",

  // thirdweb..com/tos
  ToS = "tos-page",

  // thirdweb.com/contract-extensions
  // ContractExtensionsLanding = "contract-extensions-landing",

  // thirdweb.com/web3-sdk
  Web3SDKLanding = "web3-sdk-landing",

  // thirdweb.com/account-abstraction
  SmartWalletLanding = "smart-wallet-landing",

  // thirdweb.com/embedded-wallets
  EmbeddedWalletsLanding = "embedded-wallets-landing",

  // thirdweb.com/connec
  ConnectLanding = "connect-landing",

  // thirdweb.com/interact
  InteractLanding = "interact-landing",

  // thirdweb.com/auth
  AuthLanding = "auth-landing",

  // thirdweb.com/rpc-edge
  RPCEdgeLanding = "rpc-edge-landing",

  // thirdweb.com/cointracts
  ContractsLanding = "contracts-landing",

  // thirdweb.com/grant/superchain
  GrantSuperChain = "grant-superchain",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/events
  Events = "events",

  // thirdweb..com/mission
  Mission = "mission",

  // thirdweb.com/404
  PageNotFound = "page-not-found",

  // ---------------------------------------------------------------------------
  //  solutions pages
  // ---------------------------------------------------------------------------
  SolutionsChains = "solutions-chains",

  // ---------------------------------------------------------------------------
  //  "publish" product pages
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  //  "deploy" product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/:network/:contractAddress (evm)
  // example: thirdweb.com/goerli/0x2eaDAa60dBB74Ead3E20b23E4C5A0Dd789932846

  // ---------------------------------------------------------------------------
  //  community pages
  // ---------------------------------------------------------------------------
  Ambassadors = "ambassadors",
  Community = "community",
  StartupProgram = "startup-program",
}
