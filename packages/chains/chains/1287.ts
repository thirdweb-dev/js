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
  "infoURL": "https://docs.moonbeam.network/networks/testnet/",
  "name": "Moonbase Alpha",
  "nativeCurrency": {
    "name": "Dev",
    "symbol": "DEV",
    "decimals": 18
  },
  "networkId": 1287,
  "rpc": [
    "https://1287.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.moonbase.moonbeam.network",
    "wss://wss.api.moonbase.moonbeam.network"
  ],
  "shortName": "mbase",
  "slip44": 1,
  "slug": "moonbase-alpha",
  "testnet": true
} as const satisfies Chain;