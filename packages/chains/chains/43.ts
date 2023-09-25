import type { Chain } from "../src/types";
export default {
  "chainId": 43,
  "chain": "pangolin",
  "name": "Darwinia Pangolin Testnet",
  "rpc": [
    "https://darwinia-pangolin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangolin-rpc.darwinia.network"
  ],
  "slug": "darwinia-pangolin-testnet",
  "faucets": [
    "https://docs.darwinia.network/pangolin-testnet-1e9ac8b09e874e8abd6a7f18c096ca6a"
  ],
  "nativeCurrency": {
    "name": "Pangolin Network Native Token",
    "symbol": "PRING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "pangolin",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangolin.subscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;