import type { Chain } from "../src/types";
export default {
  "chainId": 1287,
  "chain": "MOON",
  "name": "Moonbase Alpha",
  "rpc": [
    "https://moonbase-alpha.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network"
  ],
  "slug": "moonbase-alpha",
  "faucets": [],
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "infoURL": "https://docs.moonbeam.network/networks/testnet/",
  "shortName": "mbase",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "moonscan",
      "url": "https://moonbase.moonscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;