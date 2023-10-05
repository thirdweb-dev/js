import type { Chain } from "../src/types";
export default {
  "chain": "MOON",
  "chainId": 1287,
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbase.moonscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://docs.moonbeam.network/networks/testnet/",
  "name": "Moonbase Alpha",
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://moonbase-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network"
  ],
  "shortName": "mbase",
  "slug": "moonbase-alpha",
  "testnet": true
} as const satisfies Chain;