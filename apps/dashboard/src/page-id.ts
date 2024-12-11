// biome-ignore lint/nursery/noEnum: planned to be removed in the future
export enum PageId {
  // none case (for previous page id)
  None = "none",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/templates
  Templates = "templates-page",

  // thirdweb.com/template/[templateId]
  Template = "template-page",

  // thirdweb.com/account-abstraction
  SmartWalletLanding = "smart-wallet-landing",

  // thirdweb.com/embedded-wallets
  EmbeddedWalletsLanding = "embedded-wallets-landing",

  // thirdweb.com/auth
  AuthLanding = "auth-landing",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------

  // thirdweb.com/404
  PageNotFound = "page-not-found",
}
