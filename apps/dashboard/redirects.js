const legacyDashboardToTeamRedirects = [
  {
    destination: "/team",
    permanent: false,
    source: "/dashboard",
  },
  {
    destination: "/team/~/~/contracts",
    permanent: false,
    source: "/dashboard/contracts/:path*",
  },
  {
    destination: "/team/~/~/ecosystem/:path*",
    permanent: false,
    source: "/dashboard/connect/ecosystem/:path*",
  },
  {
    destination: "/team/~/~/engine/:path*",
    permanent: false,
    source: "/dashboard/engine/:path*",
  },
  {
    destination: "/team",
    permanent: false,
    source: "/dashboard/settings/api-keys",
  },
  {
    destination: "/account/devices",
    permanent: false,
    source: "/dashboard/settings/devices",
  },
  {
    destination: "/team/~/~/settings/billing",
    permanent: false,
    source: "/dashboard/settings/billing",
  },
  {
    destination: "/team/~/~/settings/credits",
    permanent: false,
    source: "/dashboard/settings/gas-credits",
  },
  {
    destination: "/team/~/~/usage",
    permanent: false,
    source: "/dashboard/settings/usage",
  },
  {
    destination: "/team/~/~/usage/storage",
    permanent: false,
    source: "/dashboard/settings/storage",
  },
  {
    destination: "/team/~/~/settings/notifications",
    permanent: false,
    source: "/dashboard/settings/notifications",
  },
  // rest of the /dashboard/* routes
  {
    destination: "/team",
    permanent: false,
    source: "/dashboard/:path*",
  },
];

const projectRoute = "/team/:team_slug/:project_slug";

const projectPageRedirects = [
  {
    destination: `${projectRoute}/universal-bridge/:path*`,
    permanent: false,
    source: `${projectRoute}/connect/pay/:path*`,
  },
  {
    destination: `${projectRoute}/universal-bridge/:path*`,
    permanent: false,
    source: `${projectRoute}/connect/universal-bridge/:path*`,
  },
  {
    destination: `${projectRoute}/account-abstraction/:path*`,
    permanent: false,
    source: `${projectRoute}/connect/account-abstraction/:path*`,
  },
  {
    destination: `${projectRoute}/wallets/:path*`,
    permanent: false,
    source: `${projectRoute}/connect/in-app-wallets/:path*`,
  },
  {
    destination: `${projectRoute}/vault/:path*`,
    permanent: false,
    source: `${projectRoute}/engine/cloud/vault/:path*`,
  },
  {
    destination: `${projectRoute}/transactions/:path*`,
    permanent: false,
    source: `${projectRoute}/engine/cloud/:path*`,
  },
  {
    destination: `${projectRoute}/tokens/:path*`,
    permanent: false,
    source: `${projectRoute}/assets/:path*`,
  },
  {
    destination: projectRoute,
    permanent: false,
    source: `${projectRoute}/nebula/:path*`,
  },
  {
    destination: `${projectRoute}`,
    permanent: false,
    source: `${projectRoute}/connect/analytics`,
  },
];

const teamPageRedirects = [
  {
    destination: "/team/:team_slug/~/billing/:path*",
    permanent: false,
    source: "/team/:team_slug/~/settings/billing/:path*",
  },
  {
    destination: "/team/:team_slug/~/billing/invoices/:path*",
    permanent: false,
    source: "/team/:team_slug/~/settings/invoices/:path*",
  },
  {
    destination: "/team/:team_slug/~/billing",
    permanent: false,
    source: "/team/:team_slug/~/settings/credits",
  },
];

/** @type {import('next').NextConfig['redirects']} */
async function redirects() {
  return [
    {
      destination: "https://portal.thirdweb.com/:match*",
      permanent: true,
      source: "/portal/:match*",
    },
    {
      destination: "/solutions/chains",
      permanent: true,
      source: "/solutions/appchain-api",
    },
    {
      destination: "/contracts/publish",
      permanent: false,
      source: "/contracts/release",
    },
    {
      destination: "/contracts/publish/:path*",
      permanent: false,
      source: "/contracts/release/:path*",
    },
    {
      destination: "/publish",
      permanent: false,
      source: "/release",
    },
    {
      destination: "/publish/:path*",
      permanent: false,
      source: "/release/:path*",
    },
    {
      destination: "/auth",
      permanent: false,
      source: "/authentication",
    },
    {
      destination: "/build",
      permanent: false,
      source: "/extensions",
    },
    {
      destination: "/build",
      permanent: true,
      source: "/contractkit",
    },
    //  old (deprecated) routes
    {
      destination: "/:network/:address",
      permanent: false,
      source:
        "/:network/(edition|nft-collection|token|nft-drop|signature-drop|edition-drop|token-drop|vote)/:address",
    },
    // prebuilt contract deploys
    {
      destination: "/explore",
      permanent: false,
      source: "/contracts/new/:slug*",
    },
    // deployer to non-deployer url
    // handled directly in SSR as well
    {
      destination: "/thirdweb.eth",
      permanent: true,
      source: "/deployer.thirdweb.eth",
    },
    {
      destination: "/thirdweb.eth/:path*",
      permanent: true,
      source: "/deployer.thirdweb.eth/:path*",
    },
    {
      destination: "/chainlist",
      permanent: true,
      source: "/chains",
    },
    // polygon zkevm beta to non-beta
    {
      destination: "/polygon-zkevm",
      permanent: false,
      source: "/polygon-zkevm-beta",
    },
    // backwards compat: page moved to pages/settings/devices

    {
      destination: "/template/erc721",
      permanent: false,
      source: "/template/nft-drop",
    },
    {
      destination: "/team",
      permanent: false,
      source: "/create-api-key",
    },
    {
      destination: "/team",
      permanent: false,
      source: "/dashboard/settings",
    },
    {
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
      permanent: false,
      source: "/dashboard/connect/playground",
    },
    {
      destination: "/dashboard/settings/storage",
      permanent: false,
      source: "/dashboard/infrastructure/storage",
    },
    {
      destination: "/chainlist",
      permanent: false,
      source: "/dashboard/infrastructure/rpc-edge",
    },
    {
      destination: "/solutions/loyalty",
      permanent: false,
      source: "/solutions/commerce",
    },
    {
      destination: "/hackathon/consumer-crypto",
      permanent: false,
      source: "/hackathon/base-consumer-crypto",
    },
    {
      destination: "/",
      permanent: false,
      source: "/bear-market-airdrop",
    },
    {
      destination: "/optimism",
      permanent: false,
      source: "/drops/optimism",
    },
    // Redirecting as ambassadors lives in community now
    {
      destination: "/community/ambassadors",
      permanent: false,
      source: "/ambassadors",
    },
    {
      destination: "/in-app-wallets",
      permanent: false,
      source: "/embedded-wallets",
    },
    // temporarily redirect cli login to support page
    {
      destination:
        "https://portal.thirdweb.com/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
      permanent: false,
      source: "/cli/login",
    },

    // temporary redirect gas -> explore page
    {
      destination: "/explore",
      permanent: false,
      source: "/gas",
    },
    {
      destination: "/contracts/deployment-tool",
      permanent: false,
      source: "/deploy",
    },
    {
      destination: "/contracts/deployment-tool",
      permanent: false,
      source: "/publish",
    },
    {
      destination: "/contracts/explore",
      permanent: false,
      source: "/smart-contracts",
    },
    {
      destination: "/sdk",
      permanent: false,
      source: "/ui-components",
    },
    {
      destination: "/sdk",
      permanent: false,
      source: "/interact",
    },
    {
      destination: "/account-abstraction",
      permanent: false,
      source: "/sponsored-transactions",
    },
    // redirect /solutions/chains to /solutions/ecosystem
    {
      destination: "/solutions/ecosystem",
      permanent: false,
      source: "/solutions/chains",
    },
    // redirect /sdk to portal
    {
      destination: "https://portal.thirdweb.com/connect/blockchain-api",
      permanent: false,
      source: "/sdk",
    },
    // redirect `/events` to homepage
    {
      destination: "/",
      permanent: false,
      source: "/events",
    },
    // redirect /community to /community/ambassadors
    {
      destination: "/community/ambassadors",
      permanent: false,
      source: "/community",
    },
    // redirect `/tos` to `/terms`
    {
      destination: "/terms",
      permanent: false,
      source: "/tos",
    },
    // redirect `/privacy` to `/privacy-policy`
    {
      destination: "/privacy-policy",
      permanent: false,
      source: "/privacy",
    },
    // redirect `/mission` to `/home`
    {
      destination: "/home",
      permanent: false,
      source: "/mission",
    },
    // redirect "/open-source" to "/bounties"
    {
      destination: "/bounties",
      permanent: false,
      source: "/open-source",
    },
    // redirect /template/<slug> to /templates/<slug>
    {
      destination: "/templates/:slug",
      permanent: false,
      source: "/template/:slug",
    },
    // redirect /connect/pay to /universal-bridge
    {
      destination: "/universal-bridge",
      permanent: false,
      source: "/connect/pay",
    },
    // PREVIOUS CAMPAIGNS
    {
      destination: "/",
      permanent: false,
      source: "/unlimited-wallets",
    },
    // all /learn/tutorials (and sub-routes) -> /learn/guides
    {
      destination: "/learn/guides/:path*",
      permanent: false,
      source: "/learn/tutorials/:path*",
    },
    {
      destination: "/learn/guides",
      permanent: false,
      source: "/learn/tutorials",
    },
    // redirect to /grant/superchain to /superchain
    {
      destination: "/superchain",
      permanent: false,
      source: "/grant/superchain",
    },
    // connect -> build redirects
    {
      destination: "/wallets",
      permanent: false,
      source: "/connect",
    },
    {
      destination: "/account-abstraction",
      permanent: false,
      source: "/connect/account-abstraction",
    },
    {
      destination: "/universal-bridge",
      permanent: false,
      source: "/connect/universal-bridge",
    },
    {
      destination: "/auth",
      permanent: false,
      source: "/connect/auth",
    },
    {
      destination: "/in-app-wallets",
      permanent: false,
      source: "/connect/in-app-wallets",
    },
    {
      destination: "/transactions",
      permanent: false,
      source: "/engine",
    },
    {
      destination: "/rpc",
      permanent: false,
      source: "/rpc-edge",
    },
    ...legacyDashboardToTeamRedirects,
    ...projectPageRedirects,
    ...teamPageRedirects,
  ];
}

module.exports = redirects;
