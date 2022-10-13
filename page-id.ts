export enum PageId {
  // unknown page id (default)
  Unknown = "unknown",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------

  // thirdweb.com
  Homepage = "homepage-landing",

  // thirdweb.com
  About = "about-page",

  // thirdweb.com/auth
  AuthenticationLanding = "auth-landing",

  // thirdweb.com/release
  ReleaseLanding = "release-landing",

  // thirdweb.com/deploy
  DeployLanding = "deploy-landing",

  // thirdweb.com/contract-extensions
  ContractExtensionsLanding = "contract-extensions-landing",

  // thirdweb.com/web3-sdk
  Web3SDKLanding = "web3-sdk-landing",

  // thirdweb.com/pre-built-contracts
  PreBuiltContractsLanding = "pre-built-contracts-landing",

  // thirdweb.com/web3-dashboard
  DashboardLanding = "dashboard-landing",

  // thirdweb.com/web3-storage
  StorageLanding = "storage-landing",

  // thirdweb.com/ui-components
  UIComponentsLanding = "ui-components-landing",

  // thirdweb.com/gas
  GasEstimator = "gas-estimator",

  // thirdweb.com/hackathon/solanathon
  SolanaHackathonLanding = "solanathon",

  // thirdweb.com/404
  PageNotFound = "page-not-found",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/dashboard
  Dashboard = "dashboard",

  // thridweb.com/contracts
  Contracts = "contracts",

  // ---------------------------------------------------------------------------
  //  partner pages
  // ---------------------------------------------------------------------------

  PartnerShopify = "partner-shopify",

  // ---------------------------------------------------------------------------
  //  network pages
  // ---------------------------------------------------------------------------

  NetworkSolana = "network-solana",

  // ---------------------------------------------------------------------------
  //  faucets pages
  // ---------------------------------------------------------------------------

  FaucetSolana = "faucet-solana",

  // ---------------------------------------------------------------------------
  //  "release" product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/contracts/release
  ReleaseMultiple = "release-multiple-contracts",

  // thirdweb.com/contracts/release/:id
  ReleaseSingle = "release-single-contract",

  // thirdweb.com/:wallet
  // example: thirdweb.com/jns.eth
  Profile = "profile",

  // thirdweb.com/:wallet/:contractId
  // example: thirdweb.com/jns.eth/PermissionedERC721A
  ReleasedContract = "released-contract",

  // ---------------------------------------------------------------------------
  //  "deploy" product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/contracts/deploy
  DeployMultiple = "deploy-multiple-contracts",

  // thirdweb.com/contracts/deploy/:id
  DeploySingle = "deploy-single-contract",

  // thirdweb.com/contracts/new
  NewContract = "new-contract",

  // thirdweb.com/contracts/custom
  NewCustomContract = "new-custom-contract",

  // thirdweb.com/contracts/new/pre-built
  PreBuiltContract = "new-pre-built-contract",

  // thirdweb.com/contracts/new/pre-built/:contractCategory
  // example: thirdweb.com/contracts/new/pre-built/drop/
  PreBuiltContractCategory = "new-pre-built-contract-category",

  // thirdweb.com/contracts/new/pre-built/:contractCategory/:contractType
  // example: thirdweb.com/contracts/new/pre-built/drop/nft-drop
  PreBuiltContractType = "new-pre-built-contract-type",

  // thirdweb.com/:network/:contractAddress (evm)
  // example: thirdweb.com/goerli/0x2eaDAa60dBB74Ead3E20b23E4C5A0Dd789932846
  DeployedContract = "deployed-contract",

  // thirdweb.com/:network/:contractAddress (solana)
  // example: thirdweb.com/solana/5GYspMpsfw3Vrf7FQ37Jbhpg4PeVZHEPrfPcXY9sGQzy
  DeployedProgram = "deployed-program",
}
