import type { Chain } from "../types";
export default {
  "chain": "pangolin",
  "chainId": 43,
  "explorers": [
    {
      "name": "subscan",
      "url": "https://pangolin.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://docs.darwinia.network/pangolin-testnet-1e9ac8b09e874e8abd6a7f18c096ca6a"
  ],
  "infoURL": "https://darwinia.network/",
  "name": "Darwinia Pangolin Testnet",
  "nativeCurrency": {
    "name": "Pangolin Network Native Token",
    "symbol": "PRING",
    "decimals": 18
  },
  "networkId": 43,
  "rpc": [
    "https://darwinia-pangolin-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://43.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pangolin-rpc.darwinia.network"
  ],
  "shortName": "pangolin",
  "slug": "darwinia-pangolin-testnet",
  "testnet": true
} as const satisfies Chain;