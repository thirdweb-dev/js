import type { Chain } from "../src/types";
export default {
  "name": "Eluvio Content Fabric",
  "chain": "Eluvio",
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
  "faucets": [],
  "nativeCurrency": {
    "name": "ELV",
    "symbol": "ELV",
    "decimals": 18
  },
  "infoURL": "https://eluv.io",
  "shortName": "elv",
  "chainId": 955305,
  "networkId": 955305,
  "slip44": 1011,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.eluv.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "eluvio-content-fabric"
} as const satisfies Chain;