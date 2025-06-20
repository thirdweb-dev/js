// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { XMLParser } = require("fast-xml-parser");

/**
 * @returns {Promise<Array<{chainId: number, name: string, slug: string}>>}
 */
async function fetchChainsFromApi() {
  const res = await fetch("https://api.thirdweb.com/v1/chains", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  if (json.error) {
    throw new Error(json.message);
  }

  return json.data;
}

/**
 *
 * @param {number|string} chainIdOrSlug
 */
async function getSingleChain(chainIdOrSlug) {
  const res = await fetch(
    `https://api.thirdweb.com/v1/chains/${chainIdOrSlug}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const json = await res.json();

  if (json.error) {
    throw new Error(json.message);
  }

  return json.data;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  additionalPaths: async (config) => {
    const [framerUrls, allChains] = await Promise.all([
      getFramerXML(),
      fetchChainsFromApi(),
    ]);

    return [
      ...framerUrls.map((url) => {
        return {
          changefreq: config.changefreq,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
          loc: url.loc,
          priority: config.priority,
        };
      }),
      ...allChains.map((chain) => {
        return {
          changefreq: config.changefreq,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
          loc: `/${chain.slug}`,
          priority: config.priority,
        };
      }),
      ...(await createSearchRecordSitemaps(config)),
    ];
  },
  exclude: ["/chain/validate"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        // allow all if production
        allow: process.env.VERCEL_ENV === "production" ? ["/"] : [],
        // disallow all if not production
        disallow:
          process.env.VERCEL_ENV !== "production"
            ? ["/"]
            : // disallow `/team` and `/team/*` if production
              ["/team", "/team/*"],
        userAgent: "*",
      },
    ],
  },
  siteUrl: process.env.SITE_URL || "https://thirdweb.com",
  transform: async (config, _path) => {
    let path = _path;

    // ignore og image paths
    if (path.includes("_og")) {
      return null;
    }

    // rewrite paths that include deployer to use thirdweb.eth directly
    if (path.includes("deployer.thirdweb.eth")) {
      path = path.replace("deployer.thirdweb.eth", "thirdweb.eth");
    }
    return {
      alternateRefs: config.alternateRefs ?? [],
      changefreq: config.changefreq,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      // => this will be exported as http(s)://<config.siteUrl>/<path>
      loc: path,
      priority: config.priority,
    };
  },
};
/**
 * @param {{ changefreq?: any; priority?: any; autoLastmod?: any; }} config
 */
async function createSearchRecordSitemaps(config) {
  if (!process.env.TYPESENSE_CONTRACT_EXPORT_API_KEY) {
    return [];
  }
  const response = await fetch(
    "https://search.thirdweb.com/collections/contracts/documents/export?filter_by=testnet:false",
    {
      headers: {
        "x-typesense-api-key": process.env.TYPESENSE_CONTRACT_EXPORT_API_KEY,
      },
    },
  );
  const data = await response.text();
  const parsedLines = data.split("\n").map((l) => JSON.parse(l));
  const chainsForLines = await Promise.all(
    parsedLines.map((parsedLine) => {
      return getSingleChain(parsedLine.chain_id)
        .then((parsedLineChain) => ({
          changefreq: config.changefreq,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
          loc: `/${parsedLineChain.slug}/${parsedLine.contract_address}`,
          priority: config.priority,
        }))
        .catch(() => null);
    }),
  );
  // filter out any failed requests
  return chainsForLines.filter(Boolean);
}

async function getFramerXML() {
  const framerSiteMapText = await fetch(
    "https://landing.thirdweb.com/sitemap.xml",
  ).then((res) => res.text());

  const parser = new XMLParser();
  const xmlObject = parser.parse(framerSiteMapText);

  /**
   * @type {Array<{loc: string}>}
   */
  const urls = xmlObject.urlset.url;

  return urls;
}
