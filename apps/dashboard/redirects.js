const legacyDashboardToTeamRedirects = [
  {
    source: "/dashboard",
    destination: "/team",
    permanent: false,
  },
  {
    source: "/dashboard/contracts/:path*",
    destination: "/team/~/~/contracts",
    permanent: false,
  },
  {
    source: "/dashboard/connect/ecosystem/:path*",
    destination: "/team/~/~/ecosystem/:path*",
    permanent: false,
  },
  {
    source: "/dashboard/engine/:path*",
    destination: "/team/~/~/engine/:path*",
    permanent: false,
  },
  {
    source: "/dashboard/settings/api-keys",
    destination: "/team",
    permanent: false,
  },
  {
    source: "/dashboard/settings/devices",
    destination: "/account/devices",
    permanent: false,
  },
  {
    source: "/dashboard/settings/billing",
    destination: "/team/~/~/settings/billing",
    permanent: false,
  },
  {
    source: "/dashboard/settings/gas-credits",
    destination: "/team/~/~/settings/credits",
    permanent: false,
  },
  {
    source: "/dashboard/settings/usage",
    destination: "/team/~/~/usage",
    permanent: false,
  },
  {
    source: "/dashboard/settings/storage",
    destination: "/team/~/~/usage/storage",
    permanent: false,
  },
  {
    source: "/dashboard/settings/notifications",
    destination: "/team/~/~/settings/notifications",
    permanent: false,
  },
  // rest of the /dashboard/* routes
  {
    source: "/dashboard/:path*",
    destination: "/team",
    permanent: false,
  },
];

const projectRoute = "/team/:team_slug/:project_slug";

const projectPageRedirects = [
  {
    source: `${projectRoute}/connect/pay/:path*`,
    destination: `${projectRoute}/universal-bridge/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/connect/universal-bridge/:path*`,
    destination: `${projectRoute}/universal-bridge/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/connect/account-abstraction/:path*`,
    destination: `${projectRoute}/account-abstraction/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/connect/in-app-wallets/:path*`,
    destination: `${projectRoute}/wallets/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/engine/cloud/vault/:path*`,
    destination: `${projectRoute}/vault/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/engine/cloud/:path*`,
    destination: `${projectRoute}/transactions/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/assets/:path*`,
    destination: `${projectRoute}/tokens/:path*`,
    permanent: false,
  },
  {
    source: `${projectRoute}/nebula/:path*`,
    destination: projectRoute,
    permanent: false,
  },
];

/** @type {import('next').NextConfig['redirects']} */
async function redirects() {
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
    // backwards compat: page moved to pages/settings/devices

    {
      source: "/template/nft-drop",
      destination: "/template/erc721",
      permanent: false,
    },
    {
      source: "/create-api-key",
      destination: "/team",
      permanent: false,
    },
    {
      source: "/dashboard/settings",
      destination: "/team",
      permanent: false,
    },
    {
      source: "/dashboard/connect/playground",
      destination: "https://playground.thirdweb.com/connect/sign-in/button",
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
    // Redirecting as ambassadors lives in community now
    {
      source: "/ambassadors",
      destination: "/community/ambassadors",
      permanent: false,
    },
    {
      source: "/embedded-wallets",
      destination: "/in-app-wallets",
      permanent: false,
    },
    // temporarily redirect cli login to support page
    {
      source: "/cli/login",
      destination:
        "https://portal.thirdweb.com/knowledge-base/onchain-common-errors/thirdweb-cli/device-link-error",
      permanent: false,
    },

    // temporary redirect gas -> explore page
    {
      source: "/gas",
      destination: "/explore",
      permanent: false,
    },
    {
      source: "/deploy",
      destination: "/contracts/deployment-tool",
      permanent: false,
    },
    {
      source: "/publish",
      destination: "/contracts/deployment-tool",
      permanent: false,
    },
    {
      source: "/smart-contracts",
      destination: "/contracts/explore",
      permanent: false,
    },
    {
      source: "/ui-components",
      destination: "/sdk",
      permanent: false,
    },
    {
      source: "/interact",
      destination: "/sdk",
      permanent: false,
    },
    {
      source: "/sponsored-transactions",
      destination: "/account-abstraction",
      permanent: false,
    },
    // redirect /solutions/chains to /solutions/ecosystem
    {
      source: "/solutions/chains",
      destination: "/solutions/ecosystem",
      permanent: false,
    },
    // redirect /rpc to portal
    {
      source: "/rpc-edge",
      destination:
        "https://portal.thirdweb.com/infrastructure/rpc-edge/overview",
      permanent: false,
    },
    // redirect /sdk to portal
    {
      source: "/sdk",
      destination: "https://portal.thirdweb.com/connect/blockchain-api",
      permanent: false,
    },
    // redirect `/events` to homepage
    {
      source: "/events",
      destination: "/",
      permanent: false,
    },
    // redirect /community to /community/ambassadors
    {
      source: "/community",
      destination: "/community/ambassadors",
      permanent: false,
    },
    // redirect `/tos` to `/terms`
    {
      source: "/tos",
      destination: "/terms",
      permanent: false,
    },
    // redirect `/privacy` to `/privacy-policy`
    {
      source: "/privacy",
      destination: "/privacy-policy",
      permanent: false,
    },
    // redirect `/mission` to `/home`
    {
      source: "/mission",
      destination: "/home",
      permanent: false,
    },
    // redirect "/open-source" to "/bounties"
    {
      source: "/open-source",
      destination: "/bounties",
      permanent: false,
    },
    // redirect /template/<slug> to /templates/<slug>
    {
      source: "/template/:slug",
      destination: "/templates/:slug",
      permanent: false,
    },
    // redirect /connect/pay to /universal-bridge
    {
      source: "/connect/pay",
      destination: "/universal-bridge",
      permanent: false,
    },
    // PREVIOUS CAMPAIGNS
    {
      source: "/unlimited-wallets",
      destination: "/",
      permanent: false,
    },
    // all /learn/tutorials (and sub-routes) -> /learn/guides
    {
      source: "/learn/tutorials/:path*",
      destination: "/learn/guides/:path*",
      permanent: false,
    },
    {
      source: "/learn/tutorials",
      destination: "/learn/guides",
      permanent: false,
    },
    // redirect to /grant/superchain to /superchain
    {
      source: "/grant/superchain",
      destination: "/superchain",
      permanent: false,
    },
    // connect -> build redirects
    {
      source: "/connect",
      destination: "/wallets",
      permanent: false,
    },
    {
      source: "/connect/account-abstraction",
      destination: "/account-abstraction",
      permanent: false,
    },
    {
      source: "/connect/universal-bridge",
      destination: "/universal-bridge",
      permanent: false,
    },
    {
      source: "/connect/auth",
      destination: "/auth",
      permanent: false,
    },
    {
      source: "/connect/in-app-wallets",
      destination: "/in-app-wallets",
      permanent: false,
    },
    {
      source: "/engine",
      destination: "/transactions",
      permanent: false,
    },
    ...legacyDashboardToTeamRedirects,
    ...projectPageRedirects,
  ];
}

module.exports = redirects;
