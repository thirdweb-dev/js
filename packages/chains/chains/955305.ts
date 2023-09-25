import type { Chain } from "../src/types";
export default {
  "chainId": 955305,
  "chain": "Eluvio",
  "name": "Eluvio Content Fabric",
  "rpc": [
    "https://eluvio-content-fabric.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://host-76-74-28-226.contentfabric.io/eth/",
    "https://host-76-74-28-232.contentfabric.io/eth/",
    "https://host-76-74-29-2.contentfabric.io/eth/",
    "https://host-76-74-29-8.contentfabric.io/eth/",
    "https://host-76-74-29-34.contentfabric.io/eth/",
    "https://host-76-74-29-35.contentfabric.io/eth/",
    "https://host-154-14-211-98.contentfabric.io/eth/",
    "https://host-154-14-192-66.contentfabric.io/eth/",
    "https://host-60-240-133-202.contentfabric.io/eth/",
    "https://host-64-235-250-98.contentfabric.io/eth/"
  ],
  "slug": "eluvio-content-fabric",
  "faucets": [],
  "nativeCurrency": {
    "name": "ELV",
    "symbol": "ELV",
    "decimals": 18
  },
  "infoURL": "https://eluv.io",
  "shortName": "elv",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.eluv.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;