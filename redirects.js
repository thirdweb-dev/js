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
      destination: "/contractkit",
      permanent: false,
    },
    //  old (deprecated) routes
    {
      source:
        "/:network/(edition|nft-collection|token|pack|nft-drop|signature-drop|edition-drop|token-drop|marketplace|split|vote)/:address",
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
  ];
}

module.exports = redirects;
