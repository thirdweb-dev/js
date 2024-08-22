/** @type {import('next').NextConfig['redirects']} */
function redirects() {
  return [
    {
      source: "/portal/:match*",
      destination: "https://portal.thirdweb.com/:match*",
      permanent: true,
    },
    {
      source: "/solutions/appchain-api",
      destination: "/solutions/chains",
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
      source: "/checkout",
      destination: "/connect",
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
      source: "/settings",
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
      source: "/create-api-key",
      destination: "/dashboard/settings/api-keys",
      permanent: false,
    },
    {
      source: "/dashboard/settings",
      destination: "/dashboard/settings/api-keys",
      permanent: false,
    },
    {
      source: "/dashboard/connect",
      destination: "/dashboard/connect/in-app-wallets",
      permanent: false,
    },
    {
      source: "/dashboard/connect/playground",
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
      permanent: false,
    },
    {
      source: "/dashboard/wallet",
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
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
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
      permanent: false,
    },
    {
      source: "/dashboard/wallets/analytics",
      destination: "/dashboard/connect/analytics",
      permanent: false,
    },
    {
      source: "/dashboard/wallets/embedded",
      destination: "/dashboard/connect/embedded-wallets",
      permanent: false,
    },
    {
      source: "/dashboard/wallets/smart-wallet",
      destination: "/dashboard/connect/account-abstraction",
      permanent: false,
    },
    {
      source: "/dashboard/wallets/connect",
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
      permanent: false,
    },
    {
      source: "/dashboard/infrastructure",
      destination: "/dashboard/settings/storage",
      permanent: false,
    },
    {
      source: "/dashboard/infrastructure/storage",
      destination: "/dashboard/settings/storage",
      permanent: false,
    },
    {
      source: "/dashboard/infrastructure/rpc-edge",
      destination: "/chainlist",
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
      destination: "https://portal.thirdweb.com/wallet-sdk/latest",
      permanent: false,
    },
    {
      source: "/solutions/commerce",
      destination: "/solutions/loyalty",
      permanent: false,
    },
    {
      source: "/hackathon/base-consumer-crypto",
      destination: "/hackathon/consumer-crypto",
      permanent: false,
    },
    {
      source: "/bear-market-airdrop",
      destination: "/",
      permanent: false,
    },
    {
      source: "/drops/optimism",
      destination: "/optimism",
      permanent: false,
    },
    {
      source: "/dashboard/payments/settings",
      destination: "/dashboard/connect/pay",
      permanent: false,
    },
    {
      source: "/dashboard/payments/contracts",
      destination: "/dashboard/connect/pay",
      permanent: false,
    },
    // Redirecting as ambassadors lives in community now
    {
      source: "/ambassadors",
      destination: "/community/ambassadors",
      permanent: false,
    },
    {
      source: "/dashboard/connect/embedded-wallets",
      destination: "/dashboard/connect/in-app-wallets",
      permanent: false,
    },
    {
      source: "/embedded-wallets",
      destination: "/in-app-wallets",
      permanent: false,
    },
    {
      source: "/dashboard/connect/ecosystem/:slug((?!create$)[^/]+)",
      destination: "/dashboard/connect/ecosystem/:slug/permissions",
      permanent: false,
    },
    // temporarily redirect cli login to support page
    {
      source: "/cli/login",
      destination:
        "https://support.thirdweb.com/troubleshooting-errors/7Y1BqKNvtLdBv5fZkRZZB3/issue-linking-device-on-the-authorization-page-via-thirdweb-cli/cn9LRA3ax7XCP6uxwRYdvx",
      permanent: false,
    },

    // temporary redirect gas -> explore page
    {
      source: "/gas",
      destination: "/explore",
      permanent: false,
    },
  ];
}

module.exports = redirects;
