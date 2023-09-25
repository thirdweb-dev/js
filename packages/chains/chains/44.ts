import type { Chain } from "../src/types";
export default {
  "chainId": 44,
  "chain": "crab",
  "name": "Crab Network",
  "rpc": [
    "https://crab-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://crab-rpc.darwinia.network",
    "https://crab-rpc.darwiniacommunitydao.xyz",
    "https://crab.api.onfinality.io/public-ws",
    "https://darwiniacrab-rpc.dwellir.com"
  ],
  "slug": "crab-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Crab Network Native Token",
    "symbol": "CRAB",
    "decimals": 18
  },
  "infoURL": "https://crab.network/",
  "shortName": "crab",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://crab.subscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;