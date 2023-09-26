/** @type {import('next').NextConfig['redirects']} */
function redirects() {
  return [
    {
      source: "/portal/:match*",
      destination: "https://portal.thirdweb.com/:match*",
      permanent: true,
    },
    {
      source: "/dashboard/publish/:path*",
      destination: "/contracts/publish/:path*",
      permanent: false,
    },
    {
      source: "/dashboard/mumbai/publish/:path*",
      destination: "/contracts/publish/:path*",
      permanent: false,
    },
    {
      source: "/privacy",
      destination: "/thirdweb_Privacy_Policy_May_2022.pdf",
      permanent: false,
    },
    {
      source: "/tos",
      destination: "/Thirdweb_Terms_of_Service.pdf",
      permanent: false,
    },
    {
      source: "/contracts/release",
      destination: "/contracts/publish",
      permanent: false,
    },
    {
      source: "/contracts/release/:path*",
      destination: "/contracts/publish/:path*",
      permanent: false,
    },
    {
      source: "/release",
      destination: "/publish",
      permanent: false,
    },
    {
      source: "/release/:path*",
      destination: "/publish/:path*",
      permanent: false,
    },
    {
      source: "/authentication",
      destination: "/auth",
      permanent: false,
    },
    {
      source: "/extensions",
      destination: "/build",
      permanent: false,
    },
    {
      source: "/contractkit",
      destination: "/build",
      permanent: true,
    },
    //  old (deprecated) routes
    {
      source:
        "/:network/(edition|nft-collection|token|nft-drop|signature-drop|edition-drop|token-drop|vote)/:address",
      destination: "/:network/:address",
      permanent: false,
    },
    // prebuilt contract deploys
    {
      source: "/contracts/new/:slug*",
      destination: "/explore",
      permanent: false,
    },
    // deployer to non-deployer url
    // handled directly in SSR as well
    {
      source: "/deployer.thirdweb.eth",
      destination: "/thirdweb.eth",
      permanent: true,
    },
    {
      source: "/deployer.thirdweb.eth/:path*",
      destination: "/thirdweb.eth/:path*",
      permanent: true,
    },
    {
      source: "/chains",
      destination: "/chainlist",
      permanent: true,
    },
    // polygon zkevm beta to non-beta
    {
      source: "/polygon-zkevm-beta",
      destination: "/polygon-zkevm",
      permanent: false,
    },
    {
      source: "/contracts",
      destination: "/explore",
      permanent: false,
    },
    // temp until we have settings overview
    {
      source: "/settings",
      destination: "/dashboard/settings",
      permanent: false,
    },
    {
      source: "/dashboard/settings",
      destination: "/dashboard/settings/api-keys",
      permanent: false,
    },
    // backwards compat: page moved to pages/settings/api-key
    {
      source: "/dashboard/api-keys",
      destination: "/dashboard/settings/api-keys",
      permanent: false,
    },
    // backwards compat: page moved to pages/settings/devices
    {
      source: "/dashboard/settings/account",
      destination: "/dashboard/settings/devices",
      permanent: false,
    },
    {
      source: "/template/nft-drop",
      destination: "/template/erc721",
      permanent: false,
    },
    {
      source: "/abuse",
      destination: "https://forms.gle/v9UJtHbVw8fXypcd7",
      permanent: false,
    },
    {
      source: "/create-api-key",
      destination: "/dashboard/settings/api-keys",
      permanent: false,
    },
    {
      source: "/dashboard/wallet",
      destination: "/dashboard/wallets",
      permanent: false,
    },
    {
      source: "/dashboard/rpc",
      destination: "/dashboard/infrastructure/rpc-edge",
      permanent: false,
    },
    {
      source: "/dashboard/storage",
      destination: "/dashboard/infrastructure/storage",
      permanent: false,
    },
    {
      source: "/smart-wallet",
      destination: "/account-abstraction",
      permanent: false,
    },
    {
      source: "/dashboard/published",
      destination: "/dashboard/publish",
      permanent: false,
    },
    {
      source: "/dashboard/wallets",
      destination: "/dashboard/wallets/connect",
      permanent: false,
    },
    {
      source: "/dashboard/infrastructure",
      destination: "/dashboard/infrastructure/storage",
      permanent: false,
    },
    {
      source: "/dashboard/contracts",
      destination: "/dashboard/contracts/deploy",
      permanent: false,
    },
    {
      source: "/solidity-sdk",
      destination: "/build",
      permanent: false,
    },
    {
      source: "/connect-wallet",
      destination: "/connect",
      permanent: false,
    },
    {
      source: "/wallet-sdk",
      destination: "https://portal.thirdweb.com/wallet",
      permanent: false,
    },
  ];
}

module.exports = redirects;
