export enum PageId {
  // unknown page id (default)
  Unknown = "unknown",
  // none case (for previous page id)
  None = "none",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------
  // thirdweb.com
  Homepage = "homepage-landing",

  // thirdweb.com/about
  About = "about-page",

  // thirdweb.com/contact-us
  ContactUs = "contact-us-page",

  // thirdweb.com/templates
  Templates = "templates-page",

  // thirdweb.com/template/[templateId]
  Template = "template-page",

  // thirdweb.com
  OSS = "oss-page",

  // thirdweb..com/pricing
  Pricing = "pricing-page",

  // thirdweb..com/privacy
  Privacy = "privacy-page",

  // thirdweb..com/tos
  ToS = "tos-page",

  // thirdweb.com/cli/login
  CliLoginPage = "cli-login-page",

  // thirdweb.com/contract-extensions
  ContractExtensionsLanding = "contract-extensions-landing",

  // thirdweb.com/web3-sdk
  Web3SDKLanding = "web3-sdk-landing",

  // thirdweb.com/account-abstraction
  SmartWalletLanding = "smart-wallet-landing",

  // thirdweb.com/build
  BuildLanding = "build-landing",

  // thirdweb.com/explore
  ExploreLanding = "explore-landing",

  // thirdweb.com/embedded-wallets
  EmbeddedWalletsLanding = "embedded-wallets-landing",

  // thirdweb.com/connec
  ConnectLanding = "connect-landing",

  // thirdweb.com/interact
  InteractLanding = "interact-landing",

  // thirdweb.com/checkout
  CheckoutLanding = "checkout-landing",

  // thirdweb.com/sponsored-transactions
  SponsoredTransactionsLanding = "sponsored-transactions-landing",

  // thirdweb.com/auth
  AuthLanding = "auth-landing",

  // thirdweb.com/publish
  PublishLanding = "publish-landing",

  // thirdweb.com/deploy
  DeployLanding = "deploy-landing",

  // thirdweb.com/rpc-edge
  RPCEdgeLanding = "rpc-edge-landing",

  // thirdweb.com/engine
  EngineLanding = "engine-landing",

  // thirdweb.com/pre-built-contracts
  PreBuiltContractsLanding = "pre-built-contracts-landing",

  // thirdweb.com/web3-dashboard
  DashboardLanding = "dashboard-landing",

  // thirdweb.com/web3-storage
  StorageLanding = "storage-landing",

  // thirdweb.com/ui-components
  UIComponentsLanding = "ui-components-landing",

  // thirdweb.com/build-base
  BuildBaseLanding = "build-base-landing",

  // thirdweb.com/bear-market-airdrop
  BearMarketAirdrop = "bear-market-airdrop",
  // drops
  DropsOptimism = "drops-optimism",
  // thirdweb.com/hackathon
  HackathonLanding = "base-thirdweb-hacakthon",
  ReadyPlayer3Landing = "readyplayer3",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------
  // thirdweb.com/dashboard
  Dashboard = "dashboard",

  // thirdweb.com/dashboard/infrastructure
  DashboardInfrastructure = "dashboard-infrastructure",
  // thirdweb.com/dashboard/infrastructure/storage
  DashboardSettingsStorage = "dashboard-storage",
  // thirdweb.com/dashboard/infastucture/rpc-edge
  DashboardRPC = "dashboard-rpc",

  // thirdweb.com/dashboard/connect
  DashboardWallets = "dashboard-wallets",
  // thirdweb.com/dashboard/connect/playground
  DashboardConnectPlayground = "dashboard-wallets-connect",
  // thirdweb.com/dashboard/connect/smart-wallet
  DashboardConnectAccountAbstraction = "dashboard-wallets-smart-wallet",
  // thirdweb.com/dashboard/connect/embedded
  DashboardConnectEmbeddedWallets = "dashboard-wallets-embedded",
  // thirdweb.com/dashboard/connect/analytics
  DashboardConnectAnalytics = "dashboard-wallets-analytics",

  // thirdweb.com/dashboard/contracts/build
  DashboardContractsBuild = "dashboard-contracts-build",

  // thirdweb.com/dashboard/contracts
  Contracts = "contracts",

  // thirdweb.com/explore
  Explore = "explore",

  // thirdweb.com/events
  Events = "events",

  // thirdweb..com/mission
  Mission = "mission",

  // thirdweb.com/explore/[category]
  ExploreCategory = "explore-category",

  // thirdweb.com/gas
  GasEstimator = "gas-estimator",

  // thirdweb.com/chainlist
  ChainsLanding = "chains-landing",

  // thirdweb.com/404
  PageNotFound = "page-not-found",

  // ---------------------------------------------------------------------------
  //  engine pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/dashboard/engine
  EngineManage = "engine-manage",

  // ---------------------------------------------------------------------------
  //  settings pages
  // ---------------------------------------------------------------------------
  // thirdweb.com/dashboard/settings
  Settings = "settings",

  // thirdweb.com/dashboard/settings/api-keys
  SettingsApiKeys = "settings-api-keys",

  // thirdweb.com/dashboard/settings/api-keys/:id
  SettingsApiKey = "settings-api-key",

  // thirdweb.com/dashboard/settings/devices
  SettingsDevices = "settings-devices",

  // thirdweb.com/dashboard/settings/billing
  SettingsBilling = "settings-billing",

  // thirdweb.com/dashboard/settings/usage
  SettingsUsage = "settings-usage",

  // thirdweb.com/dashboard/settings/notifications
  SettingsNotifications = "settings-notifications",

  // ---------------------------------------------------------------------------
  //  solutions pages
  // ---------------------------------------------------------------------------
  SolutionsCommerce = "solutions-commerce",
  SolutionsGaming = "solutions-gaming",
  SolutionsMinting = "solutions-minting",
  SolutionsLoyalty = "solutions-loyalty",
  SolutionsMarketplace = "solutions-marketplace",
  SolutionsChains = "solutions-chains",
  SolutionsAppChainApi = "solutions-appchain-api",
  SolutionsWeb2Onboarding = "solutions-web2-onboarding",

  // ---------------------------------------------------------------------------
  //  "publish" product pages
  // ---------------------------------------------------------------------------
  // thirdweb.com/contracts/publish
  PublishMultiple = "publish-multiple-contracts",

  // thirdweb.com/contracts/publish/:id
  PublishSingle = "publish-single-contract",

  // thirdweb.com/:wallet
  // example: thirdweb.com/jns.eth
  Profile = "profile",

  // thirdweb.com/:wallet/:contractId
  // example: thirdweb.com/jns.eth/PermissionedERC721A
  PublishedContract = "published-contract",

  // ---------------------------------------------------------------------------
  //  "deploy" product pages
  // ---------------------------------------------------------------------------
  // thirdweb.com/contracts/deploy
  DeployMultiple = "deploy-multiple-contracts",

  // thirdweb.com/contracts/deploy/:id
  DeploySingle = "deploy-single-contract",

  // thirdweb.com/:network/:contractAddress (evm)
  // example: thirdweb.com/goerli/0x2eaDAa60dBB74Ead3E20b23E4C5A0Dd789932846
  DeployedContract = "deployed-contract",

  // thirdweb.com/:network
  // example: thirdweb.com/ethereum
  ChainLanding = "chain-landing",

  // ---------------------------------------------------------------------------
  // "payments" product pages
  // ---------------------------------------------------------------------------

  PaymentsPurchases = "payments-purchases",
  PaymentsPurchasesDetail = "payments-purchases-detail",
  PaymentsContracts = "payments-contracts",
  PaymentsSettings = "payments-settings",

  // ---------------------------------------------------------------------------
  //  community pages
  // ---------------------------------------------------------------------------
  Learn = "learn",
  Ambassadors = "ambassadors",
  Community = "community",
  Support = "support",
}
