// @ts-check

/**
 *
 */
async function fetchChainsFromApi() {
  const res = await fetch(`https://api.thirdweb.com/v1/chains`, {
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
  siteUrl: process.env.SITE_URL || "https://thirdweb.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        [process.env.VERCEL_ENV !== "preview" &&
        process.env.VERCEL_ENV !== "development"
          ? "allow"
          : "disallow"]: "/",
      },
    ],
  },
  exclude: ["/chain/validate"],
  transform: async (config, path) => {
    // ignore og image paths
    if (path.includes("_og")) {
      return null;
    }

    // rewrite paths that include deployer to use thirdweb.eth directly
    if (path.includes("deployer.thirdweb.eth")) {
      path = path.replace("deployer.thirdweb.eth", "thirdweb.eth");
    }
    return {
      // => this will be exported as http(s)://<config.siteUrl>/<path>
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    const allChains = await fetchChainsFromApi();
    const framerSitemap = await fetchSitemap(
      "https://landing.thirdweb.com/sitemap.xml",
    );
    return [
      ...framerSitemap.map((url) => ({
        loc: url.loc.replace(
          "https://landing.thirdweb.com",
          "https://thirdweb.com",
        ),
        priority: url.priority || config.priority,
        lastmod:
          url.lastmod ||
          (config.autoLastmod ? new Date().toISOString() : undefined),
        changefreq: url.changefreq || config.changefreq,
      })),
      ...allChains.map((chain) => {
        return {
          loc: `/${chain.slug}`,
          changefreq: config.changefreq,
          priority: config.priority,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
      }),
      ...(await createSearchRecordSitemaps(config)),
    ];
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
          loc: `/${parsedLineChain.slug}/${parsedLine.contract_address}`,
          changefreq: config.changefreq,
          priority: config.priority,
          lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        }))
        .catch(() => null);
    }),
  );
  // filter out any failed requests
  return chainsForLines.filter(Boolean);
}

// pull in sitemap from landing.thirdweb.com and re-expose it
/**
 * @typedef {Object} SitemapUrl
 * @property {string} loc - The location URL.
 * @property {string} [priority] - The priority of the URL.
 * @property {string} [lastmod] - The last modified date of the URL.
 * @property {string} [changefreq] - The change frequency of the URL.
 */

/**
 * Fetches a sitemap and parses it to return an array of URLs and their attributes.
 *
 * @param {string} sitemapUrl - The URL of the sitemap to fetch.
 * @returns {Promise<SitemapUrl[]>} A promise that resolves to an array of sitemap URLs.
 */
async function fetchSitemap(sitemapUrl) {
  try {
    // Fetch the sitemap.xml content
    const response = await fetch(sitemapUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
    }

    // Get the text content (XML) from the response
    const xml = await response.text();

    // Manually parse the XML using regular expressions
    const urls = [];
    const urlRegex = /<url>(.*?)<\/url>/gs;
    const locRegex = /<loc>(.*?)<\/loc>/;
    const priorityRegex = /<priority>(.*?)<\/priority>/;
    const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/;
    const changefreqRegex = /<changefreq>(.*?)<\/changefreq>/;

    let match;
    while (true) {
      match = urlRegex.exec(xml);
      if (match === null) break;
      const urlBlock = match[1];

      const loc = (locRegex.exec(urlBlock)?.[1] || "").trim();
      const priority = (priorityRegex.exec(urlBlock)?.[1] || "").trim();
      const lastmod = (lastmodRegex.exec(urlBlock)?.[1] || "").trim();
      const changefreq = (changefreqRegex.exec(urlBlock)?.[1] || "").trim();

      urls.push({
        loc,
        priority: priority || undefined,
        lastmod: lastmod || undefined,
        changefreq: changefreq || undefined,
      });
    }

    return urls;
  } catch (error) {
    console.error("Error fetching or parsing the sitemap:", error);
    throw error;
  }
}
