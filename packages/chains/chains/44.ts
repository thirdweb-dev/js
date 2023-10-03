import type { Chain } from "../src/types";
export default {
  "chain": "crab",
  "chainId": 44,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://crab.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://crab.network/",
  "name": "Crab Network",
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://crab-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.darwiniacommunitydao.xyz",
    "https://crab.api.onfinality.io/public-ws",
    "https://darwiniacrab-rpc.dwellir.com"
  ],
  "shortName": "crab",
  "slug": "crab-network",
  "testnet": false
} as const satisfies Chain;